/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    /**
     * Configuration object for the ConfirmDialog directive
     * @class ConfirmDialogConfig
     */
    interface ConfirmDialogConfig {
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
         * Optional dialog size: 'sm', 'lg'
         *
         * @property optionalSize
         * @type string
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
        scope: ConfirmDialogConfig;
        controller: (string | (($scope: any, $element: any, $attrs: any, $transclude: any, $compile: any) => void))[];
        constructor();
    }
}
