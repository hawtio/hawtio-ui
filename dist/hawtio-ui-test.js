///<reference path="../defs.d.ts"/>

/// <reference path="../../includes.ts"/>
var UITestPages;
(function (UITestPages) {
    UITestPages.templatePath = 'test-plugins/ui/html';
    var path = UITestPages.templatePath;
    UITestPages.pluginName = 'hawtio-ui-test-pages';
    UITestPages._module = angular.module(UITestPages.pluginName, []);
    var tab = null;
    UITestPages._module.config(['$routeProvider', 'HawtioNavBuilderProvider', function ($routeProvider, builder) {
        tab = builder.create().id(UITestPages.pluginName).href(function () {
            return '/ui';
        }).title(function () {
            return "UI Components";
        }).subPath('Icons', 'icons', builder.join(path, 'icon.html')).subPath('Auto Columns', 'auto-columns', builder.join(path, 'auto-columns.html')).subPath('Auto Dropdown', 'auto-dropdown', builder.join(path, 'auto-dropdown.html')).subPath('Breadcrumbs', 'breadcrumbs', builder.join(path, 'breadcrumbs.html')).subPath('Color Picker', 'color-picker', builder.join(path, 'color-picker.html')).subPath('Confirm Dialog', 'confirm-dialog', builder.join(path, 'confirm-dialog.html')).subPath('Drop Down', 'drop-down', builder.join(path, 'drop-down.html')).subPath('Editable Property', 'editable-property', builder.join(path, 'editable-property.html')).subPath('Editor', 'editor', builder.join(path, 'editor.html')).subPath('Expandable', 'expandable', builder.join(path, 'expandable.html')).subPath('File Upload', 'file-upload', builder.join(path, 'file-upload.html')).subPath('JSPlumb', 'jsplumb', builder.join(path, 'jsplumb.html')).subPath('Pager', 'pager', builder.join(path, 'pager.html')).subPath('Slideout', 'slideout', builder.join(path, 'slideout.html')).subPath('Template Popover', 'template-popover', builder.join(path, 'template-popover.html')).subPath('Zero Clipboard', 'zero-clipboard', builder.join(path, 'zero-clipboard.html')).build();
        builder.configureRouting($routeProvider, tab);
    }]);
    UITestPages._module.run(['HawtioNav', function (nav) {
        nav.add(tab);
        nav.add({
            id: 'project-link',
            isSelected: function () {
                return false;
            },
            title: function () {
                return 'github';
            },
            attributes: {
                class: 'pull-right'
            },
            linkAttributes: {
                target: '_blank'
            },
            href: function () {
                return 'https://github.com/hawtio/hawtio-ui';
            }
        });
        nav.add({
            id: 'hawtio-link',
            isSelected: function () {
                return false;
            },
            title: function () {
                return 'hawtio';
            },
            attributes: {
                class: 'pull-right'
            },
            linkAttributes: {
                target: '_blank'
            },
            href: function () {
                return 'http://hawt.io';
            }
        });
    }]);
    hawtioPluginLoader.addModule(UITestPages.pluginName);
})(UITestPages || (UITestPages = {}));
var Test;
(function (Test) {
    // simple test plugin for messing with the nav bar
    Test.pluginName = 'test';
    Test.templatePath = 'test/html';
    Test.log = Logger.get(Test.pluginName);
    Test._module = angular.module(Test.pluginName, []);
    var tab = null;
    var tab2 = null;
    var tabs = [];
    Test._module.config(['$routeProvider', 'HawtioNavBuilderProvider', '$locationProvider', function ($routeProvider, builder, $locationProvider) {
        $locationProvider.html5Mode(true);
        tab = builder.create().id(Test.pluginName).title(function () {
            return "Test";
        }).href(function () {
            return "/test1";
        }).subPath("Sub Page 1", "page1", builder.join(Test.templatePath, 'page1.html')).subPath("Sub Page 2", "page2", builder.join(Test.templatePath, 'page2.html')).subPath("Sub Page 3", "page3", builder.join(Test.templatePath, 'page3.html')).build();
        tab2 = builder.create().id(builder.join(Test.pluginName, '2')).title(function () {
            return "Test2";
        }).href(function () {
            return "/test2";
        }).page(function () {
            return builder.join(Test.templatePath, 'page1.html');
        }).build();
        ['1', '2', '3', '4'].forEach(function (index) {
            tabs.push(builder.create().id(builder.join('test', index)).title(function () {
                return 'Test ' + index;
            }).href(function () {
                return '/many/' + index;
            }).build());
        });
        console.log("Tabs:", tabs);
        builder.configureRouting($routeProvider, tab);
        builder.configureRouting($routeProvider, tab2);
        $routeProvider.when('/many/:index', { templateUrl: builder.join(Test.templatePath, 'page1.html') });
        // Manually configured route
        $routeProvider.when('/foo/bar', { templateUrl: builder.join(Test.templatePath, 'page1.html') });
    }]);
    Test._module.run(["HawtioNav", function (HawtioNav) {
        Test.log.debug('loaded');
        /*
        HawtioNav.add(tab);

        HawtioNav.add(tab2);
        tabs.forEach(function(tab) { HawtioNav.add(tab); });

        var builder = HawtioNav.builder();

        var subTab1 = builder.id('fooSubTab')
                            .href(function() { return '/foo/bar'; })
                            .title(function() { return 'My Sub Tab 2'; })
                            .build();

        var subTab2 = builder.id('fooSubTab')
                            .href(function() { return '/foo/barBaz'; })
                            .title(function() { return 'My Sub Tab 2'; })
                            .build();

        var tab3 = builder.id('foo')
                          .href(function() { return '/foo'; })
                          .title(function() { return 'My Tab'; })
                          .tabs(subTab1, subTab2)
                          .build();
        
        HawtioNav.add(tab3);
        */
    }]);
    hawtioPluginLoader.addModule(Test.pluginName);
})(Test || (Test = {}));

angular.module("hawtio-ui-test-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("test-plugins/ui/html/auto-columns.html","<div ng-controller=\"UI.UITestController2\">\n\n  <div>\n    <div class=\"row\">\n      <h3>Auto Columns</h3>\n      <p>Lays out a bunch of inline-block child elements into columns automatically based on the size of the parent container.  Specify the selector for the child items as an argument</p>\n\n      <script type=\"text/ng-template\" id=\"autoColumnTemplate\">\n<div id=\"container\"\n     style=\"height: 225px;\n            width: 785px;\n            background: lightgrey;\n            border-radius: 4px;\"\n     hawtio-auto-columns=\".ex-children\"\n     min-margin=\"5\">\n  <div class=\"ex-children\"\n       style=\"display: inline-block;\n              width: 64px; height: 64px;\n              border-radius: 4px;\n              background: lightgreen;\n              text-align: center;\n              vertical-align: middle;\n              margin: 5px;\"\n       ng-repeat=\"div in divs\">{{div}}</div>\n</div>\n      </script>\n      <div hawtio-editor=\"autoColumnEx\" mode=\"fileUploadExMode\"></div>\n      <div class=\"directive-example\">\n        <div compile=\"autoColumnEx\"></div>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("test-plugins/ui/html/auto-dropdown.html","<div ng-controller=\"UI.UITestController2\">\n\n  <div>\n    <div class=\"row\">\n      <h3>Auto Drop Down</h3>\n      <p>Handy for horizontal lists of things like menus, if the width of the element is smaller than the items inside any overflowing elements will be collected into a special dropdown element that\'s required at the end of the list</p>\n      <script type=\"text/ng-template\" id=\"autoDropDownTemplate\">\n        <ul class=\"nav nav-tabs\" hawtio-auto-dropdown>\n          <!-- All of our menu items -->\n          <li ng-repeat=\"item in menuItems\">\n            <a href=\"\">{{item}}</a>\n          </li>\n          <!-- The dropdown that will collect overflow elements -->\n          <li class=\"dropdown overflow\" style=\"float: right !important; visibility: hidden;\">\n            <a href=\"\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n              <i class=\"fa fa-chevron-down\"></i>\n            </a>\n            <ul class=\"dropdown-menu right\"></ul>\n          </li>\n        </ul>\n      </script>\n      <div hawtio-editor=\"autoDropDown\" mode=\"fileUploadExMode\"></div>\n      <div class=\"directive-example\">\n        <div compile=\"autoDropDown\"></div>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("test-plugins/ui/html/breadcrumbs.html","<div ng-controller=\"UI.UITestController2\">\n\n  <div>\n\n    <div class=\"row\">\n      <h3>BreadCrumbs</h3>\n      <p>A breadcrumb implementation that supports dropdowns for each node.  The data structure is a tree structure with a single starting node.  When the user makes a selection the directive will update the \'path\' property of the config object.  The directive also watches the \'path\' property, allowing you to also set the initial state of the breadcrumbs.</p>\n      <script type=\"text/ng-template\" id=\"breadcrumbTemplate\">\n<p>path: {{breadcrumbConfig.path}}</p>\n<ul class=\"nav nav-tabs\">\n<hawtio-breadcrumbs config=\"breadcrumbConfig\"></hawtio-breadcrumbs>\n</ul>\n      </script>\n      <h5>HTML</h5>\n      <div hawtio-editor=\"breadcrumbEx\" mode=\"fileUploadExMode\"></div>\n      <h5>JSON</h5>\n      <div hawtio-editor=\"breadcrumbConfigTxt\" mode=\"javascript\"></div>\n      <div class=\"directive-example\">\n        <div compile=\"breadcrumbEx\"></div>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
$templateCache.put("test-plugins/ui/html/color-picker.html","<div ng-controller=\"UI.UITestController1\">\n\n  <div class=\"row\">\n    <h3>Color picker</h3>\n\n    <p>Currently used on the preferences page to associate a color with a given URL regex</p>\n\n    <div hawtio-editor=\"colorPickerEx\" mode=\"fileUploadExMode\"></div>\n    <div class=\"directive-example\">\n      <div compile=\"colorPickerEx\"></div>\n    </div>\n    <hr>\n  </div>\n\n\n</div>\n");
$templateCache.put("test-plugins/ui/html/confirm-dialog.html","<div ng-controller=\"UI.UITestController1\">\n\n  <div class=\"row\">\n    <h3>Confirmation Dialog</h3>\n\n    <p>Displays a simple confirmation dialog with a standard title and buttons, just the dialog body needs to be\n      provided. The buttons can be customized as well as the actions when the ok or cancel button is clicked</p>\n\n    <div hawtio-editor=\"confirmationEx1\" mode=\"fileUploadExMode\"></div>\n    <div class=\"directive-example\">\n      <div compile=\"confirmationEx1\"></div>\n    </div>\n\n    <div hawtio-editor=\"confirmationEx2\" mode=\"fileUploadExMode\"></div>\n    <div class=\"directive-example\">\n      <div compile=\"confirmationEx2\"></div>\n    </div>\n    <hr>\n  </div>\n\n</div>\n");
$templateCache.put("test-plugins/ui/html/drop-down.html","<div ng-controller=\"UI.UITestController2\">\n\n  <div>\n\n    <div class=\"row\">\n      <h3>Drop Down</h3>\n      <p>A bootstrap.js drop-down widget driven by a simple json structure</p>\n      <script type=\"text/ng-template\" id=\"dropDownTemplate\">\n<p>someVal: {{someVal}}</p>\n  <div hawtio-drop-down=\"dropDownConfig\"></div>\n      </script>\n      <h5>HTML</h5>\n      <div hawtio-editor=\"dropDownEx\" mode=\"fileUploadExMode\"></div>\n      <h5>JSON</h5>\n      <div hawtio-editor=\"dropDownConfigTxt\" mode=\"javascript\"></div>\n      <div class=\"directive-example\">\n        <div compile=\"dropDownEx\"></div>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("test-plugins/ui/html/editable-property.html","<div ng-controller=\"UI.UITestController1\">\n\n  <div class=\"row\">\n    <h3>Editable Property</h3>\n\n    <p>Use to display a value that the user can edit at will</p>\n\n    <div hawtio-editor=\"editablePropertyEx1\" mode=\"fileUploadExMode\"></div>\n    <div class=\"directive-example\">\n      <div compile=\"editablePropertyEx1\"></div>\n    </div>\n    <hr>\n  </div>\n\n</div>\n");
$templateCache.put("test-plugins/ui/html/editor.html","<div ng-controller=\"UI.UITestController1\">\n\n  <div>\n    <div class=\"row\">\n        <h3>CodeMirror</h3>\n\n        <p>A directive that wraps the codeMirror editor.</p>\n\n        <div hawtio-editor=\"editorEx1\" mode=\"fileUploadExMode\"></div>\n        <div class=\"directive-example\">\n          <div compile=\"editorEx1\"></div>\n        </div>\n      </div>\n  </div>\n\n\n</div>\n");
$templateCache.put("test-plugins/ui/html/expandable.html","<div ng-controller=\"UI.UITestController1\">\n\n  <div class=\"row\">\n    <h3>Expandable</h3>\n\n    <p>Use to hide content under a header that a user can display when necessary</p>\n\n    <div hawtio-editor=\"expandableEx\" mode=\"fileUploadExMode\"></div>\n    <div class=\"directive-example\">\n      <div compile=\"expandableEx\"></div>\n    </div>\n    <hr>\n  </div>\n\n</div>\n");
$templateCache.put("test-plugins/ui/html/file-upload.html","<div ng-controller=\"UI.UITestController1\">\n\n  <div class=\"row\">\n    <h3>File upload</h3>\n\n    <p>Use to upload files to the hawtio webapp backend. Files are stored in a temporary directory and managed via the\n      UploadManager JMX MBean</p>\n\n    <p>Showing files:</p>\n\n    <div hawtio-editor=\"fileUploadEx1\" mode=\"fileUploadExMode\"></div>\n    <div class=\"directive-example\">\n      <div compile=\"fileUploadEx1\"></div>\n    </div>\n    <hr>\n    <p>Not showing files:</p>\n\n    <div hawtio-editor=\"fileUploadEx2\" mode=\"fileUploadExMode\"></div>\n    <div class=\"directive-example\">\n      <div compile=\"fileUploadEx2\"></div>\n    </div>\n  </div>\n  <hr>\n</div>\n\n</div>\n");
$templateCache.put("test-plugins/ui/html/icon.html","<div ng-controller=\"UI.IconTestController\">\n\n  <script type=\"text/ng-template\" id=\"example-html\">\n\n<style>\n\n/* Define icon sizes in CSS\n   use the \'class\' attribute\n   to handle icons that are\n   wider than they are tall */\n.fa fa-example i:before,\n.fa fa-example img {\n  vertical-align: middle;\n  line-height: 32px;\n  font-size: 32px;\n  height: 32px;\n  width: auto;\n}\n\n.fa fa-example img.girthy {\n  height: auto;\n  width: 32px;\n}\n</style>\n\n<!-- Here we turn an array of\n     simple objects into icons! -->\n<ul class=\"fa fa-example list-inline\">\n  <li ng-repeat=\"icon in icons\">\n    <hawtio-icon config=\"icon\"></hawtio-icon>\n  </li>\n</ul>\n  </script>\n\n  <script type=\"text/ng-template\" id=\"example-config-json\">\n[{\n  \"title\": \"Awesome!\",\n  \"src\": \"fa fa-thumbs-up\"\n},\n{\n  \"title\": \"Apache Karaf\",\n  \"type\": \"icon\",\n  \"src\": \"fa fa-beaker\"\n},\n{\n  \"title\": \"Fabric8\",\n  \"type\": \"img\",\n  \"src\": \"img/icons/fabric8_icon.svg\"\n},\n{\n  \"title\": \"Apache Cassandra\",\n  \"src\": \"img/icons/cassandra.svg\",\n  \"class\": \"girthy\"\n}]\n  </script>\n\n\n  <div class=\"row\">\n    <h3>Icons</h3>\n    <p>A simple wrapper to handle arbitrarily using FontAwesome icons or images via a simple configuration</p>\n    <h5>HTML</h5>\n    <p>The icon sizes are specified in CSS, we can also pass a \'class\' field to the icon as well to handle icons that are wider than they are tall for certain layouts</p>\n    <div hawtio-editor=\"exampleHtml\" mode=\"html\"></div>\n    <h5>JSON</h5>\n    <p>Here we define the configuration for our icons, in this case we\'re just creating a simple array of icon definitions to show in a list</p>\n    <div hawtio-editor=\"exampleConfigJson\" mode=\"javascript\"></div>\n    <div class=\"directive-example\">\n      <div compile=\"exampleHtml\"></div>\n    </div>\n  </div>\n\n\n</div>\n");
$templateCache.put("test-plugins/ui/html/jsplumb.html","<div ng-controller=\"UI.UITestController1\">\n\n  <div>\n\n    <div class=\"row\">\n      <h3>JSPlumb</h3>\n      <p>Use to create an instance of JSPlumb</p>\n      <script type=\"text/ng-template\" id=\"jsplumbTemplate\">\n<div>\n  <div class=\"ex-node-container\" hawtio-jsplumb>\n    <!-- Nodes just need to have an ID and the jsplumb-node class -->\n    <div ng-repeat=\"node in nodes\"\n         id=\"{{node}}\"\n         anchors=\"AutoDefault\"\n         class=\"jsplumb-node ex-node\">\n      <i class=\"fa fa-plus clickable\" ng-click=\"createEndpoint(node)\"></i> Node: {{node}}\n    </div>\n    <!-- You can specify a connect-to attribute and a comma separated list of IDs to connect nodes -->\n    <div id=\"node3\"\n         class=\"jsplumb-node ex-node\"\n         anchors=\"Left,Right\"\n         connect-to=\"node1,node2\">\n      <i class=\"fa fa-plus clickable\" ng-click=\"createEndpoint(\'node3\')\"></i> Node 3\n    </div>\n    <!-- Expressions and stuff will work too -->\n    <div ng-repeat=\"node in otherNodes\"\n         id=\"{{node}}\"\n         class=\"jsplumb-node ex-node\"\n         anchors=\"Continuous\"\n         connect-to=\"{{otherNodes[$index - 1]}}\"><i class=\"fa fa-plus clickable\" ng-click=\"createEndpoint(node)\"></i> Node: {{node}}</div>\n  </div>\n\n</div>\n      </script>\n      <div hawtio-editor=\"jsplumbEx\" mode=\"fileUploadExMode\"></div>\n\n      <div class=\"directive-example\">\n        <div compile=\"jsplumbEx\"></div>\n      </div>\n    </div>\n</div>\n");
$templateCache.put("test-plugins/ui/html/pager.html","<div ng-controller=\"UI.UITestController1\">\n\n  <div>\n    <div class=\"row\">\n      <h3>Pager</h3>\n      <hr>\n    </div>\n  </div>\n\n</div>\n");
$templateCache.put("test-plugins/ui/html/slideout.html","<div ng-controller=\"UI.UITestController1\">\n\n  <div class=\"row\">\n    <h3>Slideout</h3>\n    <p>Displays a panel that slides out from either the left or right and immediately disappears when closed</p>\n\n    <div hawtio-editor=\"sliderEx1\" mode=\"fileUploadExMode\"></div>\n    <div class=\"directive-example\">\n      <div compile=\"sliderEx1\"></div>\n    </div>\n\n    <div hawtio-editor=\"sliderEx2\" mode=\"fileUploadExMode\"></div>\n    <div class=\"directive-example\">\n      <div compile=\"sliderEx2\"></div>\n    </div>\n    <hr>\n  </div>\n\n</div>\n");
$templateCache.put("test-plugins/ui/html/template-popover.html","<div ng-controller=\"UI.UITestController2\">\n\n  <div>\n    <div class=\"row\">\n      <h3>Template Popover</h3>\n      <p>Uses bootstrap popover but lets you supply an angular template to render as the popover body.  For example here\'s a simple template for the popover body:</p>\n      <script type=\"text/ng-template\" id=\"myTemplate\">\n<table>\n  <tbody>\n    <tr ng-repeat=\"(k, v) in stuff track by $index\">\n      <td>{{k}}</td>\n      <td>{{v}}</td>\n    </tr>\n  </tbody>\n</table>\n      </script>\n      <div hawtio-editor=\"popoverEx\" mode=\"fileUploadExMode\"></div>\n\n      <p>\n      You can then supply this template as an argument to hawtioTemplatePopover.  By default it will look for a template in $templateCache called \"popoverTemplate\", or specify a templte for the \"content\" argument.  You can specify \"placement\" if you want the popover to appear on a certain side, or \"auto\" and the directive will calculate an appropriate side (\"right\" or \"left\") depending on where the element is in the window.\n      </p>\n\n      <script type=\"text/ng-template\" id=\"popoverExTemplate\">\n<ul>\n  <li ng-repeat=\"stuff in things\" hawtio-template-popover content=\"myTemplate\">{{stuff.name}}</li>\n</ul>\n      </script>\n      <div hawtio-editor=\"popoverUsageEx\" mode=\"fileUploadExMode\"></div>\n      <div class=\"directive-example\">\n        <div compile=\"popoverUsageEx\"></div>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
$templateCache.put("test-plugins/ui/html/zero-clipboard.html","<div ng-controller=\"UI.UITestController2\">\n\n  <div>\n    <div class=\"row\">\n      <h3>Zero Clipboard</h3>\n      <p>Directive that attaches a zero clipboard instance to an element so a user can click on a button to copy some text to the clipboard</p>\n      <p>Best way to use this is next to a readonly input that displays the same data to be copied, that way folks that have Flash disabled can still copy the text.</p>\n      <script type=\"text/ng-template\" id=\"zeroClipboardTemplate\">\n        <input type=\"text\" class=\"no-bottom-margin\" readonly value=\"Some Text!\">\n        <button class=\"btn\" zero-clipboard data-clipboard-text=\"Some Text!\" title=\"Click to copy!\">\n          <i class=\"fa fa-copy\"></i>\n        </button>\n      </script>\n      <div hawtio-editor=\"zeroClipboard\" mode=\"fileUploadExMode\"></div>\n      <div class=\"directive-example\">\n        <div compile=\"zeroClipboard\"></div>\n      </div>\n    </div>\n\n\n  </div>\n</div>\n");}]); hawtioPluginLoader.addModule("hawtio-ui-test-templates");