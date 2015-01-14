/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    class EditableProperty {
        private $parse;
        restrict: string;
        scope: boolean;
        templateUrl: string;
        require: string;
        link: any;
        constructor($parse: any);
    }
}
