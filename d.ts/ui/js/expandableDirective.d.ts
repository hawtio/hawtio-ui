/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    class Expandable {
        log: Logging.Logger;
        restrict: string;
        replace: boolean;
        open(model: any, expandable: any, scope: any): void;
        close(model: any, expandable: any, scope: any): void;
        forceClose(model: any, expandable: any, scope: any): void;
        forceOpen(model: any, expandable: any, scope: any): void;
        link: any;
        constructor();
    }
}
