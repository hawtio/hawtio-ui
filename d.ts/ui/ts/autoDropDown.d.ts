/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    /**
     * TODO turn this into a normal directive function
     *
     * @property AutoDropDown
     * @type IAutoDropDown
     */
    var AutoDropDown: {
        restrict: string;
        link: ($scope: any, $element: any, $attrs: any) => void;
    };
}
