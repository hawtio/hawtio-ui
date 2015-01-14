/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    function hawtioList($templateCache: any, $compile: any): {
        restrict: string;
        replace: boolean;
        templateUrl: string;
        scope: {
            'config': string;
        };
        link: ($scope: any, $element: any, $attr: any) => void;
    };
}
