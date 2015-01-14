/// <reference path="../../includes.d.ts" />
/// <reference path="uiHelpers.d.ts" />
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
        collection: any[];
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
