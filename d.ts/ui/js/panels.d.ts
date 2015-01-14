/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    class MessagePanel {
        restrict: string;
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
    class InfoPanel {
        restrict: string;
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
