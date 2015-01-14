/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    class GridsterDirective {
        restrict: string;
        replace: boolean;
        controller: {}[];
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
