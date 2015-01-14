/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    function HawtioTocDisplay(marked: any, $location: any, $anchorScroll: any, $compile: any): {
        restrict: string;
        scope: {
            getContents: string;
        };
        controller: {}[];
        link: ($scope: any, $element: any, $attrs: any) => void;
    };
}
