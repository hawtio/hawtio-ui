/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    /**
     * Directive class that organizes child elements into columns automatically
     *
     * @class AutoColumns
     */
    class AutoColumns {
        restrict: string;
        link: ($scope: any, $element: any, $attr: any) => void;
    }
}
