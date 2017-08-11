module UITest {

  export var templatePath = 'test-plugins/ui/html';
  var path = templatePath;
  export var pluginName = 'hawtio-ui-test-pages';
  export var _module = angular.module(pluginName, []);

  _module.constant('ExampleTabs', []);

  _module.config(['ExampleTabs', '$routeProvider', 'HawtioNavBuilderProvider', function(tabs, $routeProvider, builder) {
    tabs.push(builder.create()
                  .id(builder.join(pluginName, 'editor'))
                  .href( () => '/ui' )
                  .title( () => 'Editor' )
                    .subPath('Editor', 'editor', builder.join(path, 'editor.html'))
                  .build());

    tabs.push(builder.create()
                   .id(builder.join(pluginName, 'components'))
                   .href( () => '/components' )
                   .title( () => 'UI Components' )
                     .subPath('Auto Dropdown', 'auto-dropdown', builder.join(path, 'auto-dropdown.html'))
                     .subPath('Clipboard', 'clipboard', builder.join(path, 'clipboard.html'))
                     .subPath('Confirm Dialog', 'confirm-dialog', builder.join(path, 'confirm-dialog.html'))
                     .subPath('Editable Property', 'editable-property', builder.join(path, 'editable-property.html'))
                     .subPath('Expandable', 'expandable', builder.join(path, 'expandable.html'))
                     //.subPath('File Upload', 'file-upload', builder.join(path, 'file-upload.html'))
                     .subPath('Pager', 'pager', builder.join(path, 'pager.html'))
                     .subPath('Slideout', 'slideout', builder.join(path, 'slideout.html'))
                     .subPath('Tags', 'tags', builder.join(path, 'tags.html'))
                     .subPath('Template Popover', 'template-popover', builder.join(path, 'template-popover.html'))
                     .subPath('Toast Notification', 'toast-notification', builder.join(path, 'toast-notification.html'))
                   .build());

    _.forEach(tabs, (tab) => builder.configureRouting($routeProvider, tab));

  }]);

  _module.run(['ExampleTabs', 'HawtioNav', function(tabs, nav) {
    _.forEach(tabs, (tab) => {
      nav.add(tab);
    });
  }]);

  hawtioPluginLoader.addModule(pluginName);
}
