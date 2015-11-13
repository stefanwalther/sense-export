/*global define*/
define( [
	'jquery',
	'angular',
	'qvangular',
	'text!./eui-overlay.css'
], function ( $, angular, qvangular, cssContent ) {
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

	addStyleToHeader( cssContent, 'eui-overlay' );

	qvangular.directive( 'euiOverlay', function () {
		return {
			restrict: 'A',
			replace: false,
			scope: {
				overlayEnabled: '=',
				overlayTitle: '@',
				overlayText: '@'
			},
			link: function ( $scope, $element, $attrs ) {

				$scope.enabled = angular.isDefined( $attrs.overlayEnabled ) ? $scope.$parent.$eval( $attrs.overlayEnabled ) : false;

				if ( $scope.enabled === true ) {

					var $overLay = $( document.createElement( 'div' ) );
					$overLay.addClass( 'eui-overlay-container' );

					var $content = $( document.createElement( 'div' ) );
					$content.addClass( 'content' );

					var $title = $( document.createElement( 'div' ) );
					$title.addClass( 'title' );
					$title.html( $scope.overlayTitle );
					$content.append( $title );

					var $text = $( document.createElement( 'div' ) );
					$text.addClass( 'text' );
					$text.html( $scope.overlayText );
					$content.append( $text );

					$overLay.append( $content );

					$element.parent().replaceWith( $overLay );
				}

			}
		}
	} );
} );
