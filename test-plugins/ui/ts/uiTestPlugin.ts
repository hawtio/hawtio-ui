/// <reference path="../../includes.ts"/>
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
                   .id(builder.join(pluginName, 'tab2'))
                   .href(function () { return '/ui2'; })
                   .title(function () { return "UI Components 2"; })
                     .subPath('Tags', 'tags', builder.join(path, 'tags.html'))
                     .subPath('Expandable', 'expandable', builder.join(path, 'expandable.html'))
                     .subPath('Template Popover', 'template-popover', builder.join(path, 'template-popover.html'))
                     .subPath('Drop Down', 'drop-down', builder.join(path, 'drop-down.html'))
                     .subPath('Auto Dropdown', 'auto-dropdown', builder.join(path, 'auto-dropdown.html'))
                     .subPath('Zero Clipboard', 'zero-clipboard', builder.join(path, 'zero-clipboard.html'))
                   .build());

    tabs.push(builder.create()
                   .id(builder.join(pluginName, 'tab1'))
                   .href(function () { return '/ui1'; })
                   .title(function () { return "UI Components 1"; })
                     .subPath('Icons', 'icons', builder.join(path, 'icon.html'))
                     .subPath('Breadcrumbs', 'breadcrumbs', builder.join(path, 'breadcrumbs.html'))
                     .subPath('Color Picker', 'color-picker', builder.join(path, 'color-picker.html'))
                     .subPath('Confirm Dialog', 'confirm-dialog', builder.join(path, 'confirm-dialog.html'))
                     .subPath('Editable Property', 'editable-property', builder.join(path, 'editable-property.html'))
                     .subPath('Expandable', 'expandable', builder.join(path, 'expandable.html'))
                     //.subPath('File Upload', 'file-upload', builder.join(path, 'file-upload.html'))
                     .subPath('JSPlumb', 'jsplumb', builder.join(path, 'jsplumb.html'))
                     .subPath('Pager', 'pager', builder.join(path, 'pager.html'))
                     .subPath('Slideout', 'slideout', builder.join(path, 'slideout.html'))
                   .build());

    _.forEach(tabs, (tab) => builder.configureRouting($routeProvider, tab));

  }]);

  _module.run(['ExampleTabs', 'HawtioNav', function(tabs, nav) {
    _.forEach(tabs, (tab) => {
      nav.add(tab);
    });
    nav.add({
      id: 'project-link',
      isSelected: function() { return false; },
      title: function() { return 'github'; },
      attributes: {
        class: 'pull-right'
      },
      linkAttributes: {
        target: '_blank'
      },
      href: function() { return 'https://github.com/hawtio/hawtio-ui'; }
    });
    nav.add({
      id: 'hawtio-link',
      isSelected: function() { return false; },
      title: function() { return 'hawtio'; },
      attributes: {
        class: 'pull-right'
      },
      linkAttributes: {
        target: '_blank'
      },
      href: function() { return 'http://hawt.io'; }
    });
  }]);


  hawtioPluginLoader.addModule(pluginName);
}

