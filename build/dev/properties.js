/*!

* sense-export - Just a simple button to export data in your Qlik Sense application without displaying them in a table first.
*
* @version v1.1.0
* @link 
* @author [object Object]
* @license MIT
*/


/* global define */
define([
  'underscore',
  'ng!$q',
  'ng!$http',
  './lib/external/sense-extension-utils/general-utils'

], function (_, $q, $http, generalUtils) {
  'use strict';

  var getIcons = function () {
    var defer = $q.defer();

    $http.get(generalUtils.getExtensionPath('swr-sense-export') + '/lib/data/icons-fa.json')
			.then(function (res) {

  var sortedIcons = _.sortBy(res.data.icons, function (o) {
    return o.name;
  });

  var propDef = [];
  propDef.push({
    value: '',
    label: '>> No icon <<'
  });

  sortedIcons.forEach(function (icon) {
    propDef.push(
      {
        value: icon.id,
        label: icon.name
      }
					);
  });
  defer.resolve(propDef);

});

    return defer.promise;
  };

	// ****************************************************************************************
	// Dimensions & Measures
	// ****************************************************************************************
  var dimensions = {
    uses: 'dimensions',
    min: 0,
    max: 10
  };

  var measures = {
    uses: 'measures',
    min: 0,
    max: 10
  };

  var sorting = {
    uses: 'sorting'
  };

	// ****************************************************************************************
	// Appearance Panel
	// ****************************************************************************************

  var buttonLabel = {
    ref: 'props.buttonLabel',
    label: 'Button label',
    type: 'string',
    expression: 'optional',
    defaultValue: 'Export'
  };

  var buttonTheme = {
    type: 'string',
    component: 'dropdown',
    ref: 'props.buttonTheme',
    label: 'Style',
    defaultValue: 'primary',
    options: [
      {
        value: 'default',
        label: 'Default'
      },
      {
        value: 'primary',
        label: 'Primary'
      },
      {
        value: 'success',
        label: 'Success'
      },
      {
        value: 'info',
        label: 'Info'
      },
      {
        value: 'warning',
        label: 'Warning'
      },
      {
        value: 'danger',
        label: 'Danger'
      },
      {
        value: 'link',
        label: 'Link'
      }
    ]

  };

  var buttonIcon = {
    type: 'string',
    component: 'dropdown',
    label: 'Icon',
    ref: 'props.buttonIcon',
    defaultValue: 'download',
    options: function () {
      return getIcons().then(function (items) {
        return items;
      });
    }
  };

  var buttonAlign = {
    ref: 'props.buttonAlign',
    label: 'Alignment',
    type: 'string',
    component: 'dropdown',
    defaultValue: 'left',
    options: [
      {
        value: 'center',
        label: 'Center'
      },
      {
        value: 'left',
        label: 'Left'
      },
      {
        value: 'right',
        label: 'Right'
      }
    ],
    show: function (data) {
      return data.props.fullWidth === false;
    }
  };

  var fullWidth = {
    type: 'boolean',
    component: 'buttongroup',
    label: 'Button width',
    ref: 'props.fullWidth',
    options: [
      {
        value: true,
        label: 'Full width',
        tooltip: 'Button has the same width as the element.'
      },
      {
        value: false,
        label: 'Auto width',
        tooltip: 'Auto width depending on the label defined.'
      }
    ],
    defaultValue: false
  };

	// ****************************************************************************************
	// Export Format
	// ****************************************************************************************

  var exportDesc = {
    type: 'string',
    component: 'text',
    label: 'Note: All data resulting of the definition of Dimensions and Measures will be exported.'
  };

  var exportFormat = {
    type: 'string',
    component: 'dropdown',
    ref: 'props.exportFormat',
    label: 'Format',
    defaultValue: 'OOXML',
    options: [
      {
        value: 'OOXML',
        label: 'Open Xml (Excel)'
      },
      {
        value: 'CSV_C',
        label: 'Comma separated CSV'
      },
      {
        value: 'CSV_T',
        label: 'Tab separated CSV'
      }
    ]

  };

  var exportState = {
    type: 'string',
    component: 'dropdown',
    ref: 'props.exportState',
    label: 'State',
    defaultValue: 'P',
    options: [
      {
        value: 'A',
        label: 'All values'
      },
      {
        value: 'P',
        label: 'Possible values'
      }
    ]

  };

  var exportFileName = {
    ref: 'props.exportFileName',
    label: 'File name (optional)',
    type: 'string',
    expression: 'optional'
  };

	// ****************************************************************************************
	// Debug Panel
	// ****************************************************************************************
  var isDebug = {
    label: 'Show debug table',
    type: 'boolean',
    component: 'switch',
    ref: 'props.isDebug',
    options: [{
      value: true,
      label: 'Enable'
    }, {
      value: false,
      label: 'Disable'
    }],
    defaultValue: false
  };

  var debugDesc = {
    type: 'string',
    component: 'text',
    label: 'The debug table helps you to create the desired result. It always shows only a maximum of 500 rows.'
  };

  var debugPanel = {
    type: 'items',
    label: 'Debug',
    items: {
      isDebug: isDebug,
      debugDesc: debugDesc
    }
  };

	// ****************************************************************************************
	// Appearance Panel
	// ****************************************************************************************

  var appearancePanel = {
    uses: 'settings',
    items: {
      general: {
        items: {
          showTitles: {
            defaultValue: false
          }
        }
      },
      settings: {
        type: 'items',
        label: 'Button label',
        items: {
          buttonLabel: buttonLabel
        }
      },
      button: {
        type: 'items',
        label: 'Button layout',
        items: {
          buttonTheme: buttonTheme,
          fullWidth: fullWidth,
          buttonAlign: buttonAlign,
          buttonIcon: buttonIcon
        }
      },
      export: {
        type: 'items',
        label: 'Export definition',
        items: {
          exportDesc: exportDesc,
          exportFormat: exportFormat,
          exportState: exportState,
          exportFileName: exportFileName
        }
      },
      debugPanel: debugPanel
    }
  };

	// Return values
  return {
    type: 'items',
    component: 'accordion',
    items: {
      dimensions: dimensions,
      measures: measures,
      sorting: sorting,
      appearance: appearancePanel
    }
  };

});
