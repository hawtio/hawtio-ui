/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    class ViewportHeight {
        restrict: string;
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
    class HorizontalViewport {
        restrict: string;
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
