/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    function TemplatePopover($templateCache: any, $compile: any, $document: any): {
        restrict: string;
        link: ($scope: any, $element: any, $attr: any) => void;
    };
}
