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
        controller: (string | (($scope: any, $element: any, $attrs: any, $transclude: any, $document: any, $timeout: any, $compile: any, $templateCache: any, $window: any) => void))[];
        link: ($scope: any, $element: any, $attr: any) => void;
    };
}
