module UI {

  setTimeout(function() {
    var clipboard = new window.Clipboard('.btn-clipboard');

    clipboard.on('success', function (e) {
      let button = ($(e.trigger) as any);
      
      let title = null;
      if (button.attr('title')) {
        title = button.attr('title');
        button.removeAttr('title');
      }
      
      button.tooltip({placement: 'bottom', title: 'Copied!', trigger: 'click'})
      button.tooltip('show');

      button.mouseleave(function() {
        button.tooltip('hide');
        if (title) {
          button.attr('title', title);
        }
      });
    });
  }, 1000);

}

interface Window {
    Clipboard?: any;
}
