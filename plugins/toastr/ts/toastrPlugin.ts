module Toastr {
  var pluginName = 'hawtio-toastr';
  var _module = angular.module(pluginName, []);
  hawtioPluginLoader.addModule(pluginName);
}

module Core {

  let visibleToastElem: HTMLElement = null;
  let timeoutId: number;

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
    let toastHtml = `
      <div class="toast-pf alert alert-${type}">
        <span class="pficon pficon-ok"></span>
        ${message}
      </div>
    `;
    let toastFrag = document.createRange().createContextualFragment(toastHtml);
    let toastElem = toastFrag.querySelector('div');

    let bodyElem = document.querySelector('body');

    // if toast element is in the DOM
    if (visibleToastElem && visibleToastElem.parentNode) {
      clearTimeout(timeoutId);
      bodyElem.removeChild(visibleToastElem);
    }
    visibleToastElem = bodyElem.appendChild(toastElem);

    timeoutId = window.setTimeout(() => {
      bodyElem.removeChild(toastElem);
    }, 3000);
  }

  /**
   * Clears all the pending notifications
   * @method clearNotifications
   * @static
   */
  export function clearNotifications() {
  }


}
