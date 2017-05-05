/*!

* sense-export - Just a simple button to export data in your Qlik Sense application without displaying them in a table first.
*
* @version v1.0.4
* @link 
* @author [object Object]
* @license MIT
*/


/* global define */
define([
  'jquery',
  'qlik',
  './properties',
  './initialproperties',
  'text!./lib/css/main.min.css',
  'text!./template.ng.html',
  './lib/external/sense-extension-utils/general-utils',

		// Components
  './lib/components/eui-button/eui-button',
  './lib/components/eui-overlay/eui-overlay',
  './lib/components/eui-simple-table/eui-simple-table'
],
	function ($, qlik, props, initProps, cssContent, ngTemplate, generalUtils) { // eslint-disable-line max-params
  'use strict';

  generalUtils.addStyleToHeader(cssContent);
  var faUrl = '/extensions/swr-sense-export/lib/external/fontawesome/css/font-awesome.min.css';
  generalUtils.addStyleLinkToHeader(faUrl, 'swr_sense_export__fontawesome');

  return {
    definition: props,
    initialProperties: initProps,
    snapshot: {canTakeSnapshot: false},
    template: ngTemplate,
    controller: ['$scope', function ($scope) {

      $scope.$watchCollection('layout.props', function (newVals, oldVals) {
        Object.keys(newVals).forEach(function (key) {
          if (newVals[key] !== oldVals[key]) {
            console.log(key, newVals[key]);
            $scope[key] = newVals[key];
          }
        });
      });

      $scope.showUnsupportedOverlay = function () {
        return qlik.table === undefined;
      };
      $scope.debug = function () {
        return (($scope.layout.props.isDebug === true) && (qlik.navigation && qlik.navigation.getMode() === 'edit'));
      };

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

    }]
  };
});
