/// <reference path="datatablePlugin.d.ts" />
/**
 * @module DataTable
 */
declare module DataTable {
    class SimpleDataTable {
        $compile: any;
        restrict: string;
        scope: {
            config: string;
            target: string;
            showFiles: string;
        };
        link: (scope: any, element: any, attrs: any) => any;
        constructor($compile: any);
        private doLink($scope, $element, $attrs);
    }
}
