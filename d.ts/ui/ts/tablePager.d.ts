/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    class TablePager {
        restrict: string;
        scope: boolean;
        templateUrl: string;
        link: (scope: any, element: any, attrs: any) => any;
        $scope: any;
        element: any;
        attrs: any;
        tableName: string;
        setRowIndexName: string;
        rowIndexName: string;
        constructor();
        private doLink(scope, element, attrs);
        tableData(): any;
        goToIndex(idx: number): void;
    }
}
