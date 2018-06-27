namespace UITest {

  export var templatePath = 'test-plugins/ui/html';
  var path = templatePath;
  export var pluginName = 'hawtio-ui-test-pages';
  export var _module = angular.module(pluginName, []);

  _module.constant('ExampleTabs', []);

  _module.config(["$routeProvider", ($routeProvider) => {
    $routeProvider
      .when('/auto-dropdown', {templateUrl: 'test-plugins/ui/html/auto-dropdown.html'})
      .when('/clipboard', {templateUrl: 'test-plugins/ui/html/clipboard.html'})
      .when('/confirm-dialog', {templateUrl: 'test-plugins/ui/html/confirm-dialog.html'})
      .when('/editable-property', {templateUrl: 'test-plugins/ui/html/editable-property.html'})
      .when('/editor', {templateUrl: 'test-plugins/ui/html/editor.html'})
      .when('/pager', {templateUrl: 'test-plugins/ui/html/pager.html'})
      .when('/template-popover', {templateUrl: 'test-plugins/ui/html/template-popover.html'})
      .when('/toast-notification', {templateUrl: 'test-plugins/ui/html/toast-notification.html'});
  }]);

  _module.run(['mainNavService', (mainNavService: Nav.MainNavService) => {
    mainNavService.addItem({title: 'Auto Dropdown', href: '/auto-dropdown'});
    mainNavService.addItem({title: 'Clipboard', href: '/clipboard'});
    mainNavService.addItem({title: 'Confirm Dialog', href: '/confirm-dialog'});
    mainNavService.addItem({title: 'Editable Property', href: '/editable-property'});
    mainNavService.addItem({title: 'Editor', href: '/editor'});
    mainNavService.addItem({title: 'Pager', href: '/pager'});
    mainNavService.addItem({title: 'Template Popover', href: '/template-popover'});
    mainNavService.addItem({title: 'Toast Notification', href: '/toast-notification'});
  }]);

  hawtioPluginLoader.addModule(pluginName);
}
