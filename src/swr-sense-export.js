/* global define */
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
  './lib/external/xlsx/xlsx.full.min',

  // Components
  './lib/components/eui-button/eui-button',
  './lib/components/eui-overlay/eui-overlay',
  './lib/components/eui-simple-table/eui-simple-table'

], function (angular, qlik, props, initProps, cssContent, ngTemplate, generalUtils, FileSaver, Xlsx) { // eslint-disable-line max-params
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
              $scope.ext.model.exportData(exportOpts.format, '/qHyperCubeDef', exportOpts.filename, exportOpts.download).then(function (result) {

                if (exportOpts.download && result.qUrl) {
                  var link = $scope.getBasePath() + result.qUrl;
                  window.open(link);
                } else {
                  window.console.error(result);
                }
              });
              break;

            case 'OOXML__CLIENT':
            case 'CSV_C__CLIENT':
            case 'CSV_T__CLIENT':
              console.log('Export using the client');
              $scope.getAllData()
                .then(function (data) {
                  var dataArray = $scope.dataToArray($scope.layout.qHyperCube.qDimensionInfo, $scope.layout.qHyperCube.qMeasureInfo, data);
                  console.log('result', dataArray);
                  console.table(dataArray);
                });
              break;
            default:
              return false;
          }
        };

        $scope.getBasePath = function () {
          var prefix = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf('/sense') + 1);
          var url = window.location.href;
          url = url.split('/');
          return url[0] + '//' + url[2] + (( prefix[prefix.length - 1] === '/' ) ? prefix.substr(0, prefix.length - 1) : prefix );
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
              var pageHeight = Math.floor(10000 / columns);
              var numberOfPages = Math.ceil(totalHeight / pageHeight);
              if (numberOfPages === 1) {
                deferred.resolve(data[0].qMatrix);
              } else {
                console.log('Download Started on', new Date());
                var Promise = $q;
                var promises = Array.apply(null, new Array(numberOfPages)).map(function (data, index) {
                  var page = {
                    qTop: (pageHeight * index) + index,
                    qLeft: 0,
                    qWidth: columns,
                    qHeight: pageHeight,
                    index: index
                  };
                  return model.getHyperCubeData('/qHyperCubeDef', [page]);
                }, this);
                Promise.all(promises).then(function (data) {
                  for (var j = 0; j < data.length; j++) {
                    for (var k = 0; k < data[j][0].qMatrix.length; k++) {
                      qTotalData.push(data[j][0].qMatrix[k]);
                    }
                  }
                  console.log('Download Ended on', new Date());
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
      }
    ]
  };
});
