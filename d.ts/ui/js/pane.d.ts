/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    function hawtioPane(): {
        restrict: string;
        replace: boolean;
        transclude: boolean;
        templateUrl: string;
        scope: {
            position: string;
            width: string;
            header: string;
        };
        controller: {}[];
        link: ($scope: any, $element: any, $attr: any) => void;
    };
}
