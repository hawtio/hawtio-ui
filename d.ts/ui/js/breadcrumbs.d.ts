/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    function hawtioBreadcrumbs(): {
        restrict: string;
        replace: boolean;
        templateUrl: string;
        require: string;
        scope: {
            config: string;
        };
        controller: {}[];
    };
}
