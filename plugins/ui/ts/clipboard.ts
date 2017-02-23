module UI {

  setTimeout(function() {
    var clipboard = new window.Clipboard('.btn-clipboard');

    clipboard.on('success', function (e) {
      let button = ($(e.trigger) as any);
      button.tooltip({placement: 'bottom', title: 'Copied!', trigger: 'click'})
      button.tooltip('show');
      button.mouseleave(() => button.tooltip('hide'));
    });
  }, 1000);

}

interface Window {
    Clipboard?: any;
}
