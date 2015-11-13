/*global define*/
define( [
	'qvangular',
	'angular',
	'text!./eui-button.ng.html'
], function ( qvangular,
			  angular,
			  ngTemplate ) {
	'use strict';

	var component = {
		restrict: 'E',
		replace: true,
		template: ngTemplate,
		scope: {
			label: '=',
			theme: '=',
			icon: '=',
			fullWidth: '=',
			align: '=',
			click: '&'
		},
		controller: ['$scope', '$attrs', function ( $scope, $attrs ) {

			$scope.onClick = function () {
				if ( $scope.click ) {
					$scope.click();
				}
			};
		}]
	};

	qvangular.directive( "euiButton", function () {
		return component;
	} );

	return component;

} );
