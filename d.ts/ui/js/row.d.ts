/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    class DivRow {
        restrict: string;
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
