/// <reference types="angular" />
/**
 * Module that contains several helper functions related to hawtio's code editor
 *
 * @module CodeEditor
 * @main CodeEditor
 */
declare module CodeEditor {
    /**
     * Options for the CodeMirror text editor
     *
     * @class CodeMirrorOptions
     */
    interface CodeMirrorOptions {
        /**
         * @property theme
         * @type String
         */
        theme: string;
        /**
         * @property tabSize
         * @type number
         */
        tabSize: number;
        /**
         * @property lineNumbers
         * @type boolean
         */
        lineNumbers: boolean;
        /**
         * @property indentWithTabs
         * @type boolean
         */
        indentWithTabs: boolean;
        /**
         * @property lineWrapping
         * @type boolean
         */
        lineWrapping: boolean;
        /**
         * @property autoClosetags
         * @type boolean
         */
        autoClosetags: boolean;
    }
    /**
     * @property GlobalCodeMirrorOptions
     * @for CodeEditor
     * @type CodeMirrorOptions
     */
    var GlobalCodeMirrorOptions: {
        theme: string;
        tabSize: number;
        lineNumbers: boolean;
        indentWithTabs: boolean;
        lineWrapping: boolean;
        autoCloseTags: boolean;
    };
    /**
     * Tries to figure out what kind of text we're going to render in the editor, either
     * text, javascript or XML.
     *
     * @method detectTextFormat
     * @for CodeEditor
     * @static
     * @param value
     * @returns {string}
     */
    function detectTextFormat(value: any): string;
    /**
     * Auto formats the CodeMirror editor content to pretty print
     *
     * @method autoFormatEditor
     * @for CodeEditor
     * @static
     * @param {CodeMirrorEditor} editor
     * @return {void}
     */
    function autoFormatEditor(editor: CodeMirrorEditor): void;
    /**
     * Used to configures the default editor settings (per Editor Instance)
     *
     * @method createEditorSettings
     * @for CodeEditor
     * @static
     * @param {Object} options
     * @return {Object}
     */
    function createEditorSettings(options?: any): any;
}
declare module HawtioEditor {
    var pluginName: string;
    var templatePath: string;
    var log: Logging.Logger;
}
declare module HawtioEditor {
    var _module: angular.IModule;
}
/**
 * @module HawtioEditor
 */
declare module HawtioEditor {
    function Editor($parse: any): {
        restrict: string;
        replace: boolean;
        templateUrl: string;
        scope: {
            text: string;
            mode: string;
            readOnly: string;
            outputEditor: string;
            name: string;
        };
        controller: (string | (($scope: any, $element: any, $attrs: any) => void))[];
        link: ($scope: any, $element: any, $attrs: any) => void;
    };
}
/**
 * Force Graph plugin & directive
 *
 * @module ForceGraph
 */
declare module ForceGraph {
    var _module: angular.IModule;
}
declare module ForceGraph {
    class ForceGraphDirective {
        restrict: string;
        replace: boolean;
        transclude: boolean;
        scope: {
            graph: string;
            nodesize: string;
            selectedModel: string;
            linkDistance: string;
            markerKind: string;
            charge: string;
        };
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
declare module ForceGraph {
    /**
     * GraphBuilder
     *
     * @class GraphBuilder
     */
    class GraphBuilder {
        private nodes;
        private links;
        private linkTypes;
        /**
         * Adds a node to this graph
         * @method addNode
         * @param {Object} node
         */
        addNode(node: any): void;
        getNode(id: any): any;
        hasLinks(id: any): boolean;
        addLink(srcId: any, targetId: any, linkType: any): void;
        nodeIndex(id: any, nodes: any): number;
        filterNodes(filter: any): void;
        buildGraph(): {
            nodes: any[];
            links: any[];
            linktypes: any;
        };
    }
}
/**
 * @module DataTable
 * @main DataTable
 */
declare module DataTable {
    var pluginName: string;
    var log: Logging.Logger;
    var _module: angular.IModule;
}
/**
 * @module DataTable
 */
declare module DataTable {
}
declare module Toastr {
}
declare module Core {
    /**
     * Displays an alert message which is typically the result of some asynchronous operation
     *
     * @method notification
     * @static
     * @param type which is usually "success" or "error" and matches css alert-* css styles
     * @param message the text to display
     *
     */
    function notification(type: string, message: string, options?: any): void;
    /**
     * Clears all the pending notifications
     * @method clearNotifications
     * @static
     */
    function clearNotifications(): void;
}
/**
 * @module UI
 */
declare module UI {
    var log: Logging.Logger;
    var scrollBarWidth: number;
    var pluginName: string;
    var templatePath: string;
}
/**
 * Module that contains a bunch of re-usable directives to assemble into pages in hawtio
 *
 * @module UI
 * @main UI
 */
declare module UI {
    var _module: angular.IModule;
}
/**
 * @module UI
 */
declare module UI {
    /**
     * TODO turn this into a normal directive function
     *
     * @property AutoDropDown
     * @type IAutoDropDown
     */
    var AutoDropDown: {
        restrict: string;
        link: ($scope: any, $element: any, $attrs: any) => void;
    };
}
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
        controller: (string | (($scope: any, $element: any, $attrs: any) => void))[];
    };
}
declare module UI {
}
declare module UI {
}
interface Window {
    Clipboard?: any;
}
declare module UI {
    /**
     * Pre defined colors used in the color picker
     * @property colors
     * @for UI
     * @type Array
     */
    var colors: string[];
}
/**
 * @module UI
 */
declare module UI {
    var selected: string;
    var unselected: string;
    /**
  Directive that allows the user to pick a color from a pre-defined pallete of colors.
  
  Use it like:
  
  ```html
  <div hawtio-color-picker="myModel"></div>
  ```
  
  'myModel' will be bound to the color the user clicks on
  
  @class ColorPicker
     */
    class ColorPicker {
        restrict: string;
        replace: boolean;
        scope: {
            property: string;
        };
        templateUrl: string;
        compile: (tElement: any, tAttrs: any, transclude: any) => {
            post: (scope: any, iElement: any, iAttrs: any, controller: any) => void;
        };
        controller: (string | (($scope: any, $element: any, $timeout: any) => void))[];
    }
}
/**
 * @module UI
 */
declare module UI {
    /**
     * Configuration object for the ConfirmDialog directive
     * @class ConfirmDialogConfig
     */
    interface ConfirmDialogConfig extends ng.IScope {
        /**
         * Model used to open/close the dialog
         *
         * @property hawtioConfirmDialog
         * @type String
         */
        show: string;
        /**
         * Sets the title of the dialog
         *
         * @property title
         * @type String
         */
        title: string;
        /**
         * Sets the text used on the dialogs "OK" button
         *
         * @property okButtonText
         * @type String
         */
        okButtonText: string;
        /**
         * Whether to show the ok button
         *
         * @property showOkButton
         * @type boolean
         */
        showOkButton: string;
        /**
         * Sets the text used on the dialog's "Cancel" button
         *
         * @property cancelButtonText
         * @type String
         */
        cancelButtonText: string;
        /**
         * callback function that's called when the dialog has been cancelled
         *
         * @property onCancel
         * @type String
         */
        onCancel: string;
        /**
         * Callback function that's called when the user has clicked "OK"
         *
         * @property onOk
         * @type String
         */
        onOk: string;
        /**
         * Callback function when the dialog has been closed either way
         *
         * @property onClose
         * @type String
         */
        onClose: string;
        /**
         * Alternative size: 'sm', 'lg'
         *
         * @property size
         * @type string
         */
        size: string;
        /**
         * @deprecated Use 'size'
         */
        optionalSize: string;
    }
    /**
     * Directive that opens a simple standard confirmation dialog.  See ConfigDialogConfig
     * for configuration properties
     *
     * @class ConfirmDialog
     */
    class ConfirmDialog {
        restrict: string;
        replace: boolean;
        transclude: boolean;
        templateUrl: string;
        /**
         * @property scope
         * @type ConfirmDialogConfig
         */
        scope: {
            show: string;
            title: string;
            okButtonText: string;
            showOkButton: string;
            cancelButtonText: string;
            onCancel: string;
            onOk: string;
            onClose: string;
            size: string;
            optionalSize: string;
        };
        controller: (string | (($scope: any, $element: JQuery, $attrs: angular.IAttributes, $transclude: any, $compile: any) => void))[];
        constructor();
    }
}
/**
 * @module UI
 */
declare module UI {
}
/**
 * @module UI
 */
declare module UI {
    /**
     * Simple helper class for creating <a href="http://angular-ui.github.io/bootstrap/#/modal">angular ui bootstrap modal dialogs</a>
     * @class Dialog
     */
    class Dialog {
        show: boolean;
        options: {
            backdropFade: boolean;
            dialogFade: boolean;
        };
        /**
         * Opens the dialog
         * @method open
         */
        open(): void;
        /**
         * Closes the dialog
         * @method close
         */
        close(): void;
        removeBackdropFadeDiv(): void;
    }
    interface MultiItemConfirmActionOptions {
        collection: Array<any>;
        index: string;
        onClose: (result: boolean) => void;
        action: string;
        okText?: string;
        cancelText?: string;
        title?: string;
        custom?: string;
        okClass?: string;
        cancelClass?: string;
        customClass?: string;
    }
    function multiItemConfirmActionDialog(options: MultiItemConfirmActionOptions): any;
}
declare module UI {
    var hawtioDrag: angular.IModule;
    var hawtioDrop: angular.IModule;
}
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
/**
 * @module UI
 */
declare module UI {
    class EditableProperty {
        private $parse;
        restrict: string;
        scope: boolean;
        templateUrl: string;
        require: string;
        link: any;
        constructor($parse: any);
    }
}
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
declare module UI {
}
/**
 * @module UI
 */
declare module UI {
    var hawtioFilter: angular.IModule;
}
/**
 * @module UI
 */
declare module UI {
    class GridsterDirective {
        restrict: string;
        replace: boolean;
        controller: (string | (($scope: any, $element: any, $attrs: any) => void))[];
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
declare module UI {
    function groupBy(): (list: any, group: any) => any;
}
declare module UI {
}
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
    var IconTestController: angular.IModule;
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
declare module UI {
}
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
/**
 * @module UI
 */
declare module UI {
    class MessagePanel {
        restrict: string;
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
    class InfoPanel {
        restrict: string;
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
/**
 * @module UI
 */
declare module UI {
    class DivRow {
        restrict: string;
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
/**
 * @module UI
 */
declare module UI {
    class SlideOut {
        restrict: string;
        replace: boolean;
        transclude: boolean;
        templateUrl: string;
        scope: {
            show: string;
            direction: string;
            top: string;
            height: string;
            title: string;
            close: string;
        };
        controller: (string | (($scope: any, $element: any, $attrs: any, $transclude: any, $compile: any) => void))[];
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
/**
 * @module UI
 */
declare module UI {
    class TablePager {
        restrict: string;
        scope: boolean;
        templateUrl: string;
        link: (scope, element, attrs) => any;
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
/**
 * @module UI
 */
declare module UI {
    var selectedTags: angular.IModule;
    var hawtioTagFilter: angular.IModule;
}
declare module UI {
    var hawtioTagList: angular.IModule;
}
/**
 * @module UI
 */
declare module UI {
    function TemplatePopover($templateCache: any, $compile: any, $document: any): {
        restrict: string;
        link: ($scope: any, $element: any, $attr: any) => void;
    };
}
/**
 * @module UI
 */
declare module UI {
    function HawtioTocDisplay(marked: any, $location: any, $anchorScroll: any, $compile: any): {
        restrict: string;
        scope: {
            getContents: string;
        };
        controller: (string | (($scope: any, $element: any, $attrs: any) => void))[];
        link: ($scope: any, $element: any, $attrs: any) => void;
    };
}
/**
 * @module UI
 */
declare module UI {
    class ViewportHeight {
        restrict: string;
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
    class HorizontalViewport {
        restrict: string;
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
declare module UI {
}
declare module UIBootstrap {
}