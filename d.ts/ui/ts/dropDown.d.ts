/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    interface MenuItem {
        /**
         * If set this menu item will be a separator
         * with a heading to help group related menu
         * items
         */
        heading?: string;
        /**
         * The string displayed in the menu
         */
        title?: string;
        /**
         * An optional icon, if not provided a spacer
         * is used to ensure the menu is laid out
         * correctly
         */
        icon?: string;
        /**
         * Used in extensible menus to determine whether
         * or not the menu item should be shown
         */
        valid?: () => boolean;
        /**
         * Can be a string with an expression to evaluate
         * or a function
         */
        action?: any;
        /**
         * A submenu for this item
         */
        items?: MenuItem[];
        /**
         * Object name for RBAC checking
         */
        objectName?: string;
        /**
         * method name for RBAC checking
         */
        methodName?: string;
        /**
         * argument types for RBAC checking
         */
        argumentTypes?: string;
    }
    function hawtioDropDown($templateCache: any): {
        restrict: string;
        replace: boolean;
        templateUrl: string;
        scope: {
            config: string;
        };
        controller: (string | (($scope: any, $element: any, $attrs: any) => void))[];
        link: ($scope: any, $element: any, $attrs: any) => void;
    };
}
