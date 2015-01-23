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
        controller: (string | (($scope: any, $element: any, $attrs: any) => void))[];
        link: ($scope: any, $element: any, $attrs: any) => void;
    };
}
