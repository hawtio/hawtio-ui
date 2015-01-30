/// <reference path="../../includes.d.ts" />
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
