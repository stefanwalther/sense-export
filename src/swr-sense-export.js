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

  // Components
  './lib/components/eui-button/eui-button',
  './lib/components/eui-overlay/eui-overlay',
  './lib/components/eui-simple-table/eui-simple-table'
], function ($, qlik, props, initProps, cssContent, ngTemplate, generalUtils) { // eslint-disable-line max-params
  'use strict';

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

          var exportOpts = {
            format: $scope.layout.props.exportFormat,
            state: $scope.layout.props.exportState,
            filename: $scope.layout.props.exportFileName,
            download: true
          };

          if (qlik.table) {
            var qTable = qlik.table(this);
            qTable.exportData(exportOpts, function (result) {
              console.log(result);
            }); // Todo: this will open the link using window.open, so popup-blockers might catch that
          } else {
            // Console.log('this', this.$parent.$parent.$parent.model);
            // this.$parent.$parent.$parent.model.session("ExportData",null, exportOpts.format, null, exportOpts.fileName, exportOpts.state);
          }

        };

      }
    ]
  };
});
