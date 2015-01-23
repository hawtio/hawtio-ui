/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    class GridsterDirective {
        restrict: string;
        replace: boolean;
        controller: (string | (($scope: any, $element: any, $attrs: any) => void))[];
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
