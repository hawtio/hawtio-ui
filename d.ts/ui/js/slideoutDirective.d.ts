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
        controller: {}[];
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
