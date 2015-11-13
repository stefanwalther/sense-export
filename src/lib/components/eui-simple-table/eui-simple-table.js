/*global define*/
define( [
	'jquery',
	'qvangular',
	'text!./eui-simple-table.ng.html'

], function ( $, qvangular, ngTemplate, cssContent ) {
	'use strict';

	function addStyleToHeader ( cssContent, id ) {
		if ( id && typeof id === 'string' ) {
			if ( !$( '#' + id ).length ) {
				$( "<style>" )
						.attr( 'id', id )
						.html( cssContent ).appendTo( "head" );
			}
		} else {
			$( "<style>" ).html( cssContent ).appendTo( "head" );
		}
	}
	addStyleToHeader( cssContent, 'eui-simple-table');

	qvangular.directive( 'euiSimpleTable', [function () {

		return {
			restrict: 'EA',
			scope: {
				hc: '='
			},
			template: ngTemplate,
			link: function ( $scope ) {
				console.log( 'eui-simple-table:data', $scope.hc );
			}
		};

	}] );

} );
