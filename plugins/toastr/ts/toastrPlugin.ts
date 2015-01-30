/// <reference path="../../includes.ts"/>
module Toastr {
  var pluginName = 'hawtio-toastr';
  var _module = angular.module(pluginName, []);
  hawtioPluginLoader.addModule(pluginName);
}

module Core {

  /**
   * Displays an alert message which is typically the result of some asynchronous operation
   *
   * @method notification
   * @static
   * @param type which is usually "success" or "error" and matches css alert-* css styles
   * @param message the text to display
   *
   */
  export function notification(type:string, message:string, options:any = null) {
    if (options === null) {
      options = {};
    }

    if (type === 'error' || type === 'warning') {
      if (!angular.isDefined(options.onclick)) {
        options.onclick = window['showLogPanel'];
      }
    }

    toastr[type](message, '', options);
  }

  /**
   * Clears all the pending notifications
   * @method clearNotifications
   * @static
   */
  export function clearNotifications() {
    toastr.clear();
  }


}
