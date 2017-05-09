/* global define */
define([
  'jquery', // Todo: Don't think that this is needed anymore
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

], function ($, qlik, props, initProps, cssContent, ngTemplate, generalUtils, FileSaver, Xlsx) { // eslint-disable-line max-params
  'use strict';

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
              $scope.ext.model.exportData(exportOpts.format + 'xx', '/qHyperCubeDef', exportOpts.filename, exportOpts.download).then(function (result) {

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
      }
    ]
  };
});
