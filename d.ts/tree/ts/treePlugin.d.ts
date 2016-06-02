/// <reference path="../../includes.d.ts" />
/**
 * @module Tree
 * @main Tree
 */
declare module Tree {
    var pluginName: string;
    var log: Logging.Logger;
    function expandAll(el: any): void;
    function contractAll(el: any): void;
    /**
     * @function sanitize
     * @param tree
     *
     * Use to HTML escape all entries in a tree before passing it
     * over to the dynatree plugin to avoid cross site scripting
     * issues.
     *
     */
    function sanitize(tree: any): void;
    var _module: ng.IModule;
}
