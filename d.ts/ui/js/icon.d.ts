/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    /**
     * Test controller for the icon help page
     * @param $scope
     * @param $templateCache
     * @constructor
     */
    var IconTestController: ng.IModule;
    /**
     * The hawtio-icon directive
     * @returns {{}}
     */
    function hawtioIcon(): {
        restrict: string;
        replace: boolean;
        templateUrl: string;
        scope: {
            icon: string;
        };
        link: ($scope: any, $element: any, $attrs: any) => void;
    };
}
