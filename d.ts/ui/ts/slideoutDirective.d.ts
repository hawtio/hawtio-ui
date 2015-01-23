/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    class SlideOut {
        restrict: string;
        replace: boolean;
        transclude: boolean;
        templateUrl: string;
        scope: {
            show: string;
            direction: string;
            top: string;
            height: string;
            title: string;
        };
        controller: (string | (($scope: any, $element: any, $attrs: any, $transclude: any, $compile: any) => void))[];
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
