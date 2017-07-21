/* global define, saveAs */
define([
  'angular',
  'qlik',
  './properties',
  './initialproperties',
  'text!./lib/css/main.min.css',
  'text!./template.ng.html',
  './lib/external/sense-extension-utils/general-utils',

  // External libs
  './lib/external/file-saver/FileSaver.min',
  // './lib/external/xlsx/xlsx.full.min',

  // Components
  './lib/components/eui-button/eui-button',
  './lib/components/eui-overlay/eui-overlay',
  './lib/components/eui-simple-table/eui-simple-table'

], function (angular, qlik, props, initProps, cssContent, ngTemplate, generalUtils) { // eslint-disable-line max-params
  'use strict';

  var $injector = angular.injector(['ng']);
  var $q = $injector.get('$q');

  // Todo: Take care of the prefix:
  // var prefix = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/sense") + 1);
  generalUtils.addStyleToHeader(cssContent);
  var faUrl = '/extensions/swr-sense-export/lib/external/fontawesome/css/font-awesome.min.css';
  generalUtils.addStyleLinkToHeader(faUrl, 'swr_sense_export__fontawesome');

  return {
    definition: props,
    initialProperties: initProps,
    snapshot: {canTakeSnapshot: false},
    template: ngTemplate,
    controller: [
      '$scope', function ($scope) {

        $scope.DEBUG = $scope.layout.props.isDebugOutput || true;
        $scope.exporting = false;

        // Watch the properties
        $scope.$watchCollection('layout.props', function (newVals, oldVals) {
          Object.keys(newVals).forEach(function (key) {
            if (newVals[key] !== oldVals[key]) {
              $scope[key] = newVals[key];
            }
          });
        });

        // Returns whether the "unsupported" overlay should be shown or not
        $scope.showUnsupportedOverlay = function () {
          return qlik.table === undefined;
        };

        // Returns whether we are in debug mode or not
        $scope.debug = function () {
          return (($scope.layout.props.isDebug === true) && (qlik.navigation && qlik.navigation.getMode() === 'edit'));
        };

        // Main export method
        $scope.export = function () {

          $scope.exporting = true;

          switch ($scope.layout.props.exportFormat) {
            case 'OOXML':
            case 'CSV_C':
            case 'CSV_T':
              var exportOpts = {
                format: $scope.layout.props.exportFormat,
                state: $scope.layout.props.exportState,
                filename: $scope.layout.props.exportFileName,
                download: true
              };
              $scope.ext.model.exportData(exportOpts.format, '/qHyperCubeDef', exportOpts.filename, exportOpts.download)
                .then(function (retVal) {

                  if (exportOpts.download) {

                    // Again, unfortunately handling of different Qlik Sense versions.
                    // >= Qlik Sense 3.2 SR3: retVal.qUrl
                    // < Qlik Sense 3.2 SR3: retVal.result.qUrl
                    var qUrl = retVal.result ? retVal.result.qUrl : retVal.qUrl;
                    var link = $scope.getBasePath() + qUrl;
                    window.open(link);
                  }
                })
                .catch(function (err) {
                  window.console.error('An error occurred in extension sense-export: ', err);
                })
                .finally(function () {
                  $scope.exporting = false;
                });
              break;

            case 'CSV_C__CLIENT':
              $scope.getAllData()
                .then(function (data) {
                  var dataArray = $scope.dataToArray($scope.layout.qHyperCube.qDimensionInfo, $scope.layout.qHyperCube.qMeasureInfo, data);
                  $scope.arrayToCSVDownload(dataArray, $scope.layout.props.exportFileName || 'export.csv');
                })
                .catch(function (err) {
                  window.console.error('Error in getAllData', err);
                })
                .finally(function () {
                  $scope.exporting = false;
                });
              break;
            default:
              $scope.exporting = false;
              return false;
          }
        };

        // Todo: should be moved to extension-utils
        $scope.getBasePath = function () {
          var prefix = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf('/sense') + 1);
          var url = window.location.href;
          url = url.split('/');
          return url[0] + '//' + url[2] + ((prefix[prefix.length - 1] === '/') ? prefix.substr(0, prefix.length - 1) : prefix);
        };

        // Shamelessly borrowed and modified from: https://gist.github.com/yianni-ververis/bf749fe306c88198de2b6ceb043712e3
        $scope.getAllData = function () {
          var qTotalData = [];
          var model = $scope.ext.model;
          var deferred = $q.defer();

          model.getHyperCubeData('/qHyperCubeDef', [{qTop: 0, qWidth: 20, qLeft: 0, qHeight: 500}])
            .then(function (data) {
              var columns = model.layout.qHyperCube.qSize.qcx;
              var totalHeight = model.layout.qHyperCube.qSize.qcy;
              var pageHeight = 500;
              var numberOfPages = Math.ceil(totalHeight / pageHeight);
              $scope.log('Number of recs/page', 500);
              $scope.log('Recs', totalHeight);
              $scope.log('Number of pages: ', numberOfPages);

              if (numberOfPages === 1) {
                if (data.qDataPages) {
                  // Qlik Sense 3.2 SR3
                  deferred.resolve(data.qDataPages[0].qMatrix);
                } else {
                  deferred.resolve(data[0].qMatrix);
                }
              } else {
                $scope.log('Started to export data on ', new Date());
                var Promise = $q;
                var promises = Array.apply(null, new Array(numberOfPages)).map(function (data, index) {
                  var page = {
                    qTop: (pageHeight * index) + index,
                    qLeft: 0,
                    qWidth: columns,
                    qHeight: pageHeight,
                    index: index
                  };
                  $scope.log('page ', (index + 1) + '/' + numberOfPages);
                  return model.getHyperCubeData('/qHyperCubeDef', [page]);
                }, this);

                Promise.all(promises).then(function (data) {
                  for (var j = 0; j < data.length; j++) {

                    if (data[j].qDataPages) {
                      // < Qlik Sense 3.2 SR3
                      for (var k1 = 0; k1 < data[j].qDataPages[0].qMatrix.length; k1++) {
                        qTotalData.push(data[j].qDataPages[0].qMatrix[k1]);
                      }
                    } else {
                      // >= Qlik Sense 3.2 SR3
                      for (var k2 = 0; k2 < data[j][0].qMatrix.length; k2++) {
                        qTotalData.push(data[j][0].qMatrix[k2]);
                      }
                    }
                  }
                  $scope.log('Finished exporting data on ', new Date());
                  deferred.resolve(qTotalData);
                });
              }
            });
          return deferred.promise;
        };

        $scope.dataToArray = function (dimensionInfo, measureInfo, data) {

          var headers = [];
          var table = [];
          dimensionInfo.forEach(function (dimension) {
            headers.push(dimension.qFallbackTitle);
          });
          measureInfo.forEach(function (measure) {
            headers.push(measure.qFallbackTitle);
          });

          table.push(headers);

          data.forEach(function (item) {
            var row = [];
            item.forEach(function (itemElem) {
              row.push(itemElem.qText);
            });
            table.push(row);
          });

          return table;
        };

        $scope.arrayToCSVDownload = function (arr, fileName) {
          var dataString = '';

          arr.forEach(function (infoArray /* , index */) {
            dataString += infoArray.join(',') + '\n';
          });

          var BOM = '\uFEFF';
          var data = BOM + dataString;
          var blob = new Blob([data], {type: 'text/csv;charset=utf-8'});
          saveAs(blob, fileName);
        };

        $scope.log = function (msg, arg) {
          if ($scope.DEBUG) {
            window.console.log('[sense-export]', msg, arg);
          }
        };
      }
    ]
  };
});
