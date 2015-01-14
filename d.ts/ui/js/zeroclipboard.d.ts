/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    function ZeroClipboardDirective($parse: any): {
        restrict: string;
        link: ($scope: any, $element: any, $attr: any) => void;
    };
}
