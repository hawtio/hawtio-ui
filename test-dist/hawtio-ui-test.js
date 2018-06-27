///<reference path="../dist/hawtio-ui.d.ts"/>
var UIDocs;
(function (UIDocs) {
    var pluginName = "docs";
    UIDocs.log = Logger.get(pluginName);
    UIDocs._module = angular.module(pluginName, []);
    UIDocs._module.config(["$routeProvider", function ($routeProvider) {
            $routeProvider
                .when('/docs', { templateUrl: 'test-plugins/docs/welcome/welcome.html' });
        }]);
    UIDocs._module.run(['mainNavService', function (mainNavService) {
            mainNavService.addItem({
                title: 'Home',
                href: '/docs',
                rank: 1
            });
        }]);
    hawtioPluginLoader.addModule(pluginName);
})(UIDocs || (UIDocs = {}));
var DatatableTest;
(function (DatatableTest) {
    var pluginName = "datatable-test";
    DatatableTest.templatePath = "test-plugins/datatable/html";
    DatatableTest._module = angular.module(pluginName, []);
    DatatableTest._module.config(["$routeProvider", function ($routeProvider) {
            $routeProvider
                .when('/simple-table', { templateUrl: 'test-plugins/datatable/html/simple-table.html' });
        }]);
    DatatableTest._module.run(['mainNavService', function (mainNavService) {
            mainNavService.addItem({
                title: 'Simple Table',
                href: '/simple-table'
            });
        }]);
    hawtioPluginLoader.addModule(pluginName);
})(DatatableTest || (DatatableTest = {}));
/// <reference path="datatablePlugin.ts"/>
var DatatableTest;
(function (DatatableTest) {
    DatatableTest._module.controller("DatatableTest.SimpleTableController", ["$scope", "$templateCache", "$location", function ($scope, $templateCache, $location) {
            $scope.toJson = angular.toJson;
            // 1 - Table with single row selection via click on row
            $scope.config1 = {
                data: 'model1',
                selectedItems: [],
                columnDefs: [
                    {
                        field: 'name',
                        displayName: 'Pod Name'
                    },
                    {
                        field: 'status',
                        displayName: 'Status'
                    },
                    {
                        field: 'ip',
                        displayName: 'IP',
                        customSortField: processIpForSorting,
                        sortable: false
                    },
                ],
                enableRowClickSelection: true,
                showSelectionCheckbox: false,
                multiSelect: false,
                sortInfo: { "sortBy": "status", "ascending": true },
            };
            $scope.model1 = [
                { name: "fabric8-311", status: "running", ip: '10.188.2.3' },
                { name: "camel-041", status: "running", ip: '10.188.2.20' },
                { name: "activemq-004", status: "failed", ip: '10.188.2.111' }
            ];
            $scope.markup1 = $templateCache.get("markup1.html");
            // 2 - Table with multiple row selection using checkboxes
            $scope.config2 = {
                data: 'model2',
                selectedItems: [],
                columnDefs: [
                    {
                        field: 'name',
                        displayName: 'Pod Name'
                    },
                    {
                        field: 'status',
                        displayName: 'Status',
                        cellTemplate: '<div class="ngCellText status-{{row.entity.status}}">{{row.entity.status}}</div>'
                    },
                    {
                        field: 'ip',
                        displayName: 'IP',
                        customSortField: processIpForSorting
                    },
                ],
                enableRowClickSelection: false,
                showSelectionCheckbox: true,
                multiSelect: true,
                primaryKeyFn: function (entity) { return entity.name + "_" + entity.ip; },
            };
            $scope.model2 = [
                { name: "fabric8-311", status: "running", ip: '10.188.2.3' },
                { name: "camel-041", status: "running", ip: '10.188.2.20' },
                { name: "activemq-004", status: "failed", ip: '10.188.2.111' }
            ];
            $scope.markup2 = $templateCache.get("markup2.html");
            // 3 - Table with fixed height and search box
            $scope.config3 = {
                data: 'model3',
                selectedItems: [],
                columnDefs: [
                    {
                        field: 'name',
                        displayName: 'Pod Name'
                    },
                    {
                        field: 'status',
                        displayName: 'Status'
                    },
                    {
                        field: 'ip',
                        displayName: 'IP',
                        customSortField: processIpForSorting
                    },
                ],
                maxBodyHeight: 100,
                filterOptions: { filterText: "" }
            };
            $scope.model3 = [
                { name: "fabric8-311", status: "running", ip: '10.188.2.3' },
                { name: "camel-041", status: "running", ip: '10.188.2.20' },
                { name: "activemq-004", status: "failed", ip: '10.188.2.111' },
                { name: "keycloak-511", status: "running", ip: '10.188.2.4' },
                { name: "wildfly-241", status: "running", ip: '10.188.2.21' },
                { name: "tomcat-377", status: "failed", ip: '10.188.2.178' },
                { name: "karaf-033", status: "running", ip: '10.188.2.220' },
            ];
            $scope.markup3 = $templateCache.get("markup3.html");
        }]);
    function processIpForSorting(field) {
        // use a custom sort to sort ip address
        var ip = field.ip;
        // i guess there is maybe nicer ways of sort this without parsing and slicing
        var regex = /(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/;
        var groups = regex.exec(ip);
        if (angular.isDefined(groups)) {
            var g1 = ("00" + groups[1]).slice(-3);
            var g2 = ("00" + groups[2]).slice(-3);
            var g3 = ("00" + groups[3]).slice(-3);
            var g4 = ("00" + groups[4]).slice(-3);
            var answer = g1 + g2 + g3 + g4;
            console.log(answer);
            return answer;
        }
        else {
            return 0;
        }
    }
})(DatatableTest || (DatatableTest = {}));
/// <reference path="datatablePlugin.ts"/>
var DatatableTest;
(function (DatatableTest) {
    DatatableTest._module.controller('DatatableTest.SimpleTableTestController', ['$scope', '$location', function ($scope, $location) {
            $scope.myData = [
                { name: "James", twitter: "jstrachan", city: 'LONDON', ip: '172.17.0.11' },
                { name: "Stan", twitter: "gashcrumb", city: 'boston', ip: '172.17.0.9' },
                { name: "Claus", twitter: "davsclaus", city: 'Malmo', ip: '172.17.0.10' },
                { name: "Alexandre", twitter: "alexkieling", city: 'Florianopolis', ip: '172.17.0.12' }
            ];
            $scope.mygrid = {
                data: 'myData',
                showFilter: false,
                showColumnMenu: false,
                multiSelect: _.startsWith($location.search()["multi"] || "", "f") ? false : true,
                filterOptions: {
                    filterText: "",
                    useExternalFilter: false
                },
                selectedItems: [],
                rowHeight: 32,
                selectWithCheckboxOnly: true,
                columnDefs: [
                    {
                        field: 'name',
                        displayName: 'Name',
                        width: "***"
                        //width: 300
                    },
                    {
                        field: 'city',
                        displayName: 'City',
                        width: "***"
                        //width: 300
                    },
                    {
                        field: 'twitter',
                        displayName: 'Twitter',
                        cellTemplate: '<div class="ngCellText">@{{row.entity.twitter}}</div>',
                        //width: 400
                        width: "***"
                    },
                    {
                        field: 'ip',
                        displayName: 'Pod IP',
                        width: "***",
                        customSortField: function (field) {
                            // use a custom sort to sort ip address
                            var ip = field.ip;
                            // i guess there is maybe nicer ways of sort this without parsing and slicing
                            var regex = /(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/;
                            var groups = regex.exec(ip);
                            if (angular.isDefined(groups)) {
                                var g1 = ("00" + groups[1]).slice(-3);
                                var g2 = ("00" + groups[2]).slice(-3);
                                var g3 = ("00" + groups[3]).slice(-3);
                                var g4 = ("00" + groups[4]).slice(-3);
                                var answer = g1 + g2 + g3 + g4;
                                console.log(answer);
                                return answer;
                            }
                            else {
                                return 0;
                            }
                        }
                        //width: 300
                    }
                ]
            };
            $scope.scrollGrid = angular.extend({ maxBodyHeight: 77 }, $scope.mygrid);
        }]);
})(DatatableTest || (DatatableTest = {}));
/// <reference path="../docs.ts"/>
var UIDocs;
(function (UIDocs) {
    UIDocs._module.controller("WelcomePageController", ["$scope", "marked", "$http", "$timeout", function ($scope, marked, $http, $timeout) {
            $timeout(function () {
                $http.get('README.md')
                    .then(function (response) {
                    UIDocs.log.debug("Fetched README.md, data: ", response.data);
                    $scope.readme = marked(response.data);
                })
                    .catch(function (error) {
                    UIDocs.log.debug("Failed to fetch README.md: ", error);
                });
            }, 500);
        }]);
})(UIDocs || (UIDocs = {}));
var UITest;
(function (UITest) {
    UITest.templatePath = 'test-plugins/ui/html';
    var path = UITest.templatePath;
    UITest.pluginName = 'hawtio-ui-test-pages';
    UITest._module = angular.module(UITest.pluginName, []);
    UITest._module.constant('ExampleTabs', []);
    UITest._module.config(["$routeProvider", function ($routeProvider) {
            $routeProvider
                .when('/auto-dropdown', { templateUrl: 'test-plugins/ui/html/auto-dropdown.html' })
                .when('/clipboard', { templateUrl: 'test-plugins/ui/html/clipboard.html' })
                .when('/confirm-dialog', { templateUrl: 'test-plugins/ui/html/confirm-dialog.html' })
                .when('/editable-property', { templateUrl: 'test-plugins/ui/html/editable-property.html' })
                .when('/editor', { templateUrl: 'test-plugins/ui/html/editor.html' })
                .when('/pager', { templateUrl: 'test-plugins/ui/html/pager.html' })
                .when('/template-popover', { templateUrl: 'test-plugins/ui/html/template-popover.html' })
                .when('/toast-notification', { templateUrl: 'test-plugins/ui/html/toast-notification.html' });
        }]);
    UITest._module.run(['mainNavService', function (mainNavService) {
            mainNavService.addItem({ title: 'Auto Dropdown', href: '/auto-dropdown' });
            mainNavService.addItem({ title: 'Clipboard', href: '/clipboard' });
            mainNavService.addItem({ title: 'Confirm Dialog', href: '/confirm-dialog' });
            mainNavService.addItem({ title: 'Editable Property', href: '/editable-property' });
            mainNavService.addItem({ title: 'Editor', href: '/editor' });
            mainNavService.addItem({ title: 'Pager', href: '/pager' });
            mainNavService.addItem({ title: 'Template Popover', href: '/template-popover' });
            mainNavService.addItem({ title: 'Toast Notification', href: '/toast-notification' });
        }]);
    hawtioPluginLoader.addModule(UITest.pluginName);
})(UITest || (UITest = {}));
/// <reference path="uiTestPlugin.ts"/>
var UITest;
(function (UITest) {
    UITest._module.controller("UI.UITestController2", ["$scope", "$templateCache", function ($scope, $templateCache) {
            $scope.fileUploadExMode = 'text/html';
            $scope.menuItems = [];
            for (var i = 0; i < 10; i++) {
                $scope.menuItems.push("Some Item " + i);
            }
            $scope.contacts = [
                {
                    "name": "Anthony Benoit",
                    "email": "anthony_benoit@gmail.com",
                    "address": "490 E Main Street, Norwich, CT 06360",
                },
                {
                    "name": "Chris Fisher",
                    "email": "chris_fisher@gmail.com",
                    "address": "70 Cliff Avenue, New London, CT 06320"
                },
                {
                    "name": "Pamela Rowe",
                    "email": "pamela_rowe@gmail.com",
                    "address": "50 Water Street, Mystic, CT 06355"
                },
            ];
            $scope.someVal = 1;
            $scope.autoDropDown1 = $templateCache.get("autoDropDownTemplate1");
            $scope.autoDropDown2 = $templateCache.get("autoDropDownTemplate2");
            $scope.clipboard = $templateCache.get("clipboardTemplate");
            $scope.popoverEx = $templateCache.get("myTemplate");
            $scope.popoverUsageEx = $templateCache.get("popoverExTemplate");
            $scope.autoColumnEx = $templateCache.get("autoColumnTemplate");
        }]);
    UITest._module.controller("UI.UITestController1", ["$scope", "$templateCache", function ($scope, $templateCache) {
            $scope.pagerExampleHtml = $templateCache.get("pagerExample.html");
            $scope.rowIndex = 0;
            $scope.messages = [{
                    message: 'one'
                },
                {
                    message: 'two'
                },
                {
                    message: 'three'
                },
                {
                    message: 'four'
                }];
            $scope.selectRow = function (index) {
                $scope.rowIndex = index;
            };
            $scope.getMessage = function (index) {
                return $scope.messages[index];
            };
            $scope.nodes = ["node1", "node2"];
            $scope.otherNodes = ["node4", "node5", "node6"];
            $scope.anchors = ["Top", "Right", "Bottom", "Left"];
            $scope.editablePropertyEx1 = '<editable-property ng-model="editablePropertyModelEx1" property="property"></editable-property>';
            $scope.editablePropertyModelEx1 = {
                property: "This is editable (hover to edit)"
            };
            $scope.showDeleteOne = new UI.Dialog();
            $scope.showDeleteTwo = new UI.Dialog();
            $scope.fileUploadEx1 = '<div hawtio-file-upload="files" target="test1"></div>';
            $scope.fileUploadEx2 = '<div hawtio-file-upload="files" target="test2" show-files="false"></div>';
            $scope.fileUploadExMode = 'text/html';
            $scope.confirmationEx1 = '' +
                '<button class="btn btn-default" ng-click="showDeleteOne.open()">Delete stuff</button>\n' +
                '\n' +
                '<div hawtio-confirm-dialog="showDeleteOne.show"\n' +
                'title="Delete stuff?"\n' +
                'ok-button-text="Yes, Delete the Stuff"\n' +
                'cancel-button-text="No, Keep the Stuff"\n' +
                'on-cancel="onCancelled(\'One\')"\n' +
                'on-ok="onOk(\'One\')">\n' +
                '  <div class="dialog-body">\n' +
                '    <p>\n' +
                '        Are you sure you want to delete all the stuff?\n' +
                '    </p>\n' +
                '  </div>\n' +
                '</div>\n';
            $scope.editorEx1 = '' +
                'Instance 1\n' +
                '<div class="row-fluid">\n' +
                '   <div hawtio-editor="someText" mode="mode" dirty="dirty"></div>\n' +
                '   <div>Text : {{someText}}</div>\n' +
                '</div>\n' +
                '\n' +
                'Instance 2 (readonly)\n' +
                '<div class="row-fluid">\n' +
                '   <div hawtio-editor="someText" read-only="true" mode="mode" dirty="dirty"></div>\n' +
                '   <div>Text : {{someText}}</div>\n' +
                '</div>';
            $scope.toastNotificationEx1 = "Core.notification('success', 'Saved successfully!');";
            $scope.notificationType = 'success';
            $scope.showToastNotification = function () { return Core.notification($scope.notificationType, 'Notification message.'); };
            $scope.transcludedValue = "and this is transcluded";
            $scope.onCancelled = function (number) {
                Core.notification('info', 'cancelled ' + number);
            };
            $scope.onOk = function (number) {
                Core.notification('info', number + ' ok!');
            };
            $scope.dirty = false;
            $scope.mode = 'javascript';
            $scope.someText = "var someValue = 0;\n" +
                "var someFunc = function() {\n" +
                "  return \"Hello World!\";\n" +
                "}\n";
            $scope.myColor = "#FF887C";
            $scope.showColorDialog = false;
            $scope.files = [];
            $scope.$watch('files', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    console.log("Files: ", $scope.files);
                }
            }, true);
            $scope.GlobalCodeMirrorOptions = CodeEditor.GlobalCodeMirrorOptions;
        }]);
})(UITest || (UITest = {}));

angular.module('hawtio-ui-test-templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('test-plugins/datatable/html/simple-table.html','<style>\n  .row-conf-model-1 .CodeMirror {\n    height: 530px;\n    overflow-y: auto;\n  }\n  .row-conf-model-2 .CodeMirror {\n    height: 550px;\n    overflow-y: auto;\n  }\n  .row-conf-model-3 .CodeMirror {\n    height: 530px;\n    overflow-y: auto;\n  }\n  .row-inaction-3 .directive-example {\n    margin-bottom: 200px;\n  }\n  .status-running {\n    color: blue\n  }\n  .status-failed {\n    color: red\n  }\n</style>\n<div ng-controller="DatatableTest.SimpleTableController">\n  <div class="row-fluid">\n    <div class="col-md-12">\n      <h1>Simple Table</h1>\n      <div class="alert alert-warning">\n        <span class="pficon pficon-warning-triangle-o"></span>\n        <strong>Deprecated.</strong> Please use <a href="https://www.patternfly.org/angular-patternfly/#/api/patternfly.table.component:pfTableView - with Toolbar" class="alert-link">Angular PatternFly pfTableView</a>.\n      </div>\n    </div>\n  </div>\n  <div class="row-fluid">\n    <div class="col-md-12">\n      <p>\n        Hawtio Simple Table component can be used to display, sort, filter, and select data from a JSON model, similarly to ng-grid or hawtio-datatable.\n        This lets you create a regular table element with whatever metadata you like and the &lt;thead&gt; and &lt;tbody&gt; will be generated from the column definitions to render the table dynamically; using the same kind of JSON configuration.\n        This means you can switch between ng-grid, hawtio-datatable and hawtio-simple-table based on your requirements and tradeoffs (layout versus performance versus dynamic, user configurable views etc).\n      </p>\n      <h4>Primary Key</h4>\n      <p>\n        The Simple Table uses a primary key to ensure that the rows can be kept selected when the underlying data changes due live updated.\n        It looks for a property called <code>id</code>, <code>_id</code>, <code>_key</code>, or <code>name</code> in the data objects.\n        If not found, it looks for a configuration property called <code>primaryKeyFn</code>, which specifies a function that returns the primary key.\n        Example:\n        <code>\n          primaryKeyFn: (entity) => { return entity.group + "/" + entity.name }\n        </code>\n      </p>\n      <h3>Configuration Properties</h3>\n      <p>\n        <table class="table">\n          <thead>\n            <tr><th>Name</th><th>Type</th><th>Default</th><th>Mandatory</th><th>Description</th></tr>\n          </thead>\n          <tbody>\n            <tr><td>data</td><td>String</td><td></td><td>Yes</td><td>Name of $scope property referencing the array of data objects<./td></tr>\n            <tr><td>selectedItems</td><td>Array</td><td></td><td>Yes</td><td>Array where the selected data objects shall be stored.</td></tr>\n            <tr><td>columnDefs</td><td>Array</td><td></td><td>Yes</td><td>Array of column definitions. Each definition object has a <code>field</code>, <code>displayName</code>, <code>cellTemplate</code> (optional), <code>customSortField</code> (optional), and <code>sortable</code> (optional).</td></tr>\n            <tr><td>primaryKeyFn</td><td>Function</td><td></td><td>No</td><td>Function that takes a reference to each data object and returns its primary key.<code></></td></tr>\n            <tr><td>showSelectionCheckbox</td><td>Boolean</td><td>true</td><td>No</td><td>Add a column with checkboxes for row selection.</td></tr>\n            <tr><td>enableRowClickSelection</td><td>Boolean</td><td>false</td><td>No</td><td>Allow row selection by clicking on the row.</td></tr>\n            <tr><td>multiSelect</td><td>Boolean</td><td>true</td><td>No</td><td>Allow the selection of multiple rows.</td></tr>\n            <tr><td>sortInfo</td><td>Object</td><td></td><td>No</td><td>Object with <code>sortBy</code> and <code>ascending</code> properties used as the default table sorting.</td></tr>\n            <tr><td>filterOptions</td><td>Object</td><td></td><td>No</td><td>Object with <code>filterText</code> property used as the default filter text (usually an empty text).</td></tr>\n            <tr><td>maxBodyHeight</td><td>Number</td><td></td><td>No</td><td>Maximum height of the table body. A scrollbar is added to the table.</td></tr>\n          </tbody>\n        </table>\n      </p>\n    </div>\n  </div>\n  <div class="row-fluid">\n    <div class="col-md-12">\n      <h2>Examples</h2>\n    </div>\n  </div>\n  <div class="row-fluid">\n    <div class="col-md-12">\n      <h3>1 - Table with highlight on hover and row selection on click</h3>\n    </div>\n  </div>\n  <div class="row-fluid">\n    <div class="col-md-12">\n      <h5>Markup</h5>\n      <script type="text/ng-template" id="markup1.html"><table class="table table-hover" hawtio-simple-table="config1"></table></script>\n      <div hawtio-editor="markup1" mode="html"></div>\n    </div>\n  </div>\n  <div class="row-fluid row-conf-model-1">\n    <div class="col-md-6">\n      <h5>Configuration</h5>\n      <div hawtio-editor="toJson(config1, true)" read-only="true" mode="javascript"></div>\n    </div>\n    <div class="col-md-6">\n      <h5>Model</h5>\n      <div hawtio-editor="toJson(model1, true)" read-only="true" mode="javascript"></div>\n    </div>\n  </div>\n  <div class="row-fluid">\n    <div class="col-md-12">\n      <h5>In Action</h5>\n      <div class="directive-example">\n        <div compile="markup1"></div>\n      </div>\n    </div>\n  </div>\n  <div class="row-fluid">\n    <div class="col-md-12">\n      <h3>2 - Table with multiple row selection using checkboxes</h3>\n    </div>\n  </div>\n  <div class="row-fluid">\n    <div class="col-md-12">\n      <h5>Markup</h5>\n      <script type="text/ng-template" id="markup2.html"><table class="table table-bordered" hawtio-simple-table="config2"></table></script>\n      <div hawtio-editor="markup2" mode="html"></div>\n    </div>\n  </div>\n  <div class="row-fluid row-conf-model-2">\n    <div class="col-md-6">\n      <h5>Configuration</h5>\n      <div hawtio-editor="toJson(config2, true)" read-only="true" mode="javascript"></div>\n    </div>\n    <div class="col-md-6">\n      <h5>Model</h5>\n      <div hawtio-editor="toJson(model2, true)" read-only="true" mode="javascript"></div>\n    </div>\n  </div>\n  <div class="row-fluid">\n    <div class="col-md-12">\n      <h5>In Action</h5>\n      <div class="directive-example">\n        <div compile="markup2"></div>\n      </div>\n    </div>\n  </div>\n  <div class="row-fluid">\n    <div class="col-md-12">\n      <h3>3 - Table with fixed height and search box</h3>\n    </div>\n  </div>\n  <div class="row-fluid">\n    <div class="col-md-12">\n      <h5>Markup</h5>\n      <script type="text/ng-template" id="markup3.html"><table class="table table-bordered" hawtio-simple-table="config3"></table></script>\n      <div hawtio-editor="markup3" mode="html"></div>\n    </div>\n  </div>\n  <div class="row-fluid row-conf-model-3">\n    <div class="col-md-6">\n      <h5>Configuration</h5>\n      <div hawtio-editor="toJson(config3, true)" read-only="true" mode="javascript"></div>\n    </div>\n    <div class="col-md-6">\n      <h5>Model</h5>\n      <div hawtio-editor="toJson(model3, true)" read-only="true" mode="javascript"></div>\n    </div>\n  </div>\n  <div class="row-fluid row-inaction-3">\n    <div class="col-md-12">\n      <h5>In Action</h5>\n      <div class="directive-example">\n        <div class="row toolbar-pf table-view-pf-toolbar">\n          <form class="toolbar-pf-actions search-pf">\n            <div class="form-group has-clear">\n              <div class="search-pf-input-group">\n                <label for="search1" class="sr-only">Filter</label>\n                <input id="search1" type="search" class="form-control" ng-model="config3.filterOptions.filterText" placeholder="Filter...">\n                <button type="button" class="clear" aria-hidden="true" ng-click="config3.filterOptions.filterText = \'\'"><span class="pficon pficon-close"></span></button>\n              </div>\n            </div>\n          </form>\n        </div>\n        <div compile="markup3"></div>\n      </div>\n    </div>\n  </div>\n</div>\n');
$templateCache.put('test-plugins/docs/welcome/welcome.html','<div class="row" ng-controller="WelcomePageController">\n  <div class="col-md-2">\n  </div>\n  <div class="col-md-8">\n    <div ng-bind-html="readme"></div>\n  </div>\n  <div class="col-md-2">\n  </div>\n</div>\n');
$templateCache.put('test-plugins/ui/html/auto-dropdown.html','<div ng-controller="UI.UITestController2">\n\n  <script type="text/ng-template" id="autoDropDownTemplate1">\n    <ul class="nav nav-tabs" hawtio-auto-dropdown>\n      <!-- All of our menu items -->\n      <li ng-repeat="item in menuItems">\n        <a href="">{{item}}</a>\n      </li>\n      <!-- The dropdown that will collect overflow elements -->\n      <li class="dropdown overflow">\n        <a href="#" class="dropdown-toggle" data-toggle="dropdown">\n          More <span class="caret"></span>\n        </a>\n        <ul class="dropdown-menu"></ul>\n      </li>\n    </ul>\n  </script>\n\n  <script type="text/ng-template" id="autoDropDownTemplate2">\n    <ul class="nav nav-tabs" hawtio-auto-dropdown>\n      <!-- All of our menu items -->\n      <li ng-repeat="item in menuItems">\n        <a href="">{{item}}</a>\n      </li>\n      <!-- The dropdown that will collect overflow elements -->\n      <li class="dropdown hawtio-dropdown overflow" style="float: right">\n        <a href="#" class="dropdown-toggle" data-toggle="dropdown">\n          <i class="fa fa-chevron-down"></i>\n        </a>\n        <ul class="dropdown-menu right"></ul>\n      </li>\n    </ul>\n  </script>\n\n  <div class="row">\n    <div class="col-md-12">\n      <h1>Auto Drop Down</h1>\n      <div class="alert alert-warning">\n        <span class="pficon pficon-warning-triangle-o"></span>\n        <strong>Deprecated.</strong> Please use <a href="https://github.com/hawtio/hawtio-core/blob/master/src/app/navigation/hawtio-tabs.component.ts" class="alert-link">hawtio-tabs</a> component.\n      </div>\n      <p>Handy for horizontal lists of things like menus, if the width of the element is smaller than the items inside any overflowing elements will be collected into a special dropdown element that\'s required at the end of the list.</p>\n      <h3>HTML Example 1</h3>\n      <div hawtio-editor="autoDropDown1" mode="fileUploadExMode"></div>\n      <h3>Live example 1</h3>\n      <div class="directive-example">\n        <div compile="autoDropDown1"></div>\n      </div>\n      <h3>HTML Example 2</h3>\n      <div hawtio-editor="autoDropDown2" mode="fileUploadExMode"></div>\n      <h3>Live example 2</h3>\n      <div class="directive-example">\n        <div compile="autoDropDown2"></div>\n      </div>\n      <br><br><br><br><br><br><br><br><br><br><br>\n    </div>\n  </div>\n\n</div>\n');
$templateCache.put('test-plugins/ui/html/clipboard.html','<div ng-controller="UI.UITestController2">\n  <div class="row">\n    <div class="col-md-12">\n      <h1>Clipboard</h1>\n      <p>Integration of clipboard.js, a library to copy text to clipboard.</p>\n    </div>\n    <div class="col-md-12">\n      <h3>HTML Example</h3>\n      <div hawtio-editor="clipboard" mode="fileUploadExMode"></div>\n    </div>\n    <div class="col-md-6">\n      <h3>Live Example</h3>\n      <div class="directive-example">\n        <div compile="clipboard"></div>\n      </div>\n    </div>\n  </div>\n</div>\n<script type="text/ng-template" id="clipboardTemplate">\n  <form>\n    <div class="form-group">\n      <label for="input-text1">Input text</label>\n      <div class="input-group">\n        <input type="text" id="input-text1" class="form-control" value="https://github.com/hawtio/hawtio-ui.git" readonly>\n        <div class="input-group-addon input-group-btn">\n          <button hawtio-clipboard="#input-text1" class="btn btn-default btn-sm">\n            <i class="fa fa-clipboard" aria-hidden="true"></i>\n          </button>\n        </div>\n      </div>\n    </div>\n    <div class="form-group">\n      <label for="input-text1">Textarea (1 row)</label>\n      <div class="hawtio-clipboard-container">\n        <button hawtio-clipboard="#textarea1" class="btn btn-default">\n          <i class="fa fa-clipboard" aria-hidden="true"></i>\n        </button>\n        <textarea id="textarea1" class=\'form-control\' rows=\'1\' readonly=\'true\'>row 1</textarea>\n      </div>\n    </div>\n    <div class="form-group">\n      <label for="input-text1">Textarea (2 rows)</label>\n      <div class="hawtio-clipboard-container">\n        <button hawtio-clipboard="#textarea2" class="btn btn-default">\n          <i class="fa fa-clipboard" aria-hidden="true"></i>\n        </button>\n        <textarea id="textarea2" class=\'form-control\' rows=\'2\' readonly=\'true\'>row 1\nrow 2</textarea>\n      </div>\n    </div>\n    <div class="form-group">\n      <label for="input-text1">Textarea (2 rows + scrollbar)</label>\n      <div class="hawtio-clipboard-container">\n        <button hawtio-clipboard="#textarea3" class="btn btn-default avoid-scrollbar">\n          <i class="fa fa-clipboard" aria-hidden="true"></i>\n        </button>\n        <textarea id="textarea3" class=\'form-control\' rows=\'2\' readonly=\'true\'>row 1\nrow 2\nrow 3</textarea>\n      </div>\n    </div>\n    <div class="form-group">\n      <label>Preformatted text</label>\n      <div class="hawtio-clipboard-container">\n        <button hawtio-clipboard="#pre1" class="btn btn-default btn-lg">\n          <i class="fa fa-clipboard" aria-hidden="true"></i>\n        </button>\n        <pre>{  \n  "name":"John",\n  "age":31,\n  "city":"New York"\n}</pre>\n      </div>\n      <textarea id="pre1" class="hawtio-clipboard-hidden-target">{  \n  "name":"John",\n  "age":31,\n  "city":"New York"\n}</textarea>\n    </div>\n  </form>\n</script>\n');
$templateCache.put('test-plugins/ui/html/confirm-dialog.html','<div ng-controller="UI.UITestController1">\n  <div class="row">\n    <div class="col-md-6">\n      <h3>Confirmation Dialog</h3>\n      <p>Displays a simple confirmation dialog with a standard title and buttons, just the dialog body needs to be provided. The buttons can be customized as well as the actions when the ok or cancel button is clicked.  Configuration options are:</p>\n      <dl>\n        <dt>\n          hawtio-confirm-dialog\n        </dt>\n        <dd>\n          boolean attribute your controller can use to show/hide the dialog\n        </dd>\n        <dt>\n          title\n        </dt>\n        <dd>\n          String to use as the dialog title\n        </dd>\n        <dt>\n          ok-button-text\n        </dt>\n        <dd>\n          String to use as text on the \'ok\' button\n        </dd>\n        <dt>\n          cancel-button-text\n        </dt>\n        <dd>\n          String to use as text on the \'cancel\' button\n        </dd>\n        <dt>\n          on-cancel\n        </dt>\n        <dd>\n          function that gets called when the user clicks the cancel button\n        </dd>\n        <dt>\n          on-ok\n        </dt>\n        <dd>\n          function that gets called when the user clicks the ok button\n        </dd>\n        <dt>\n          on-close\n        </dt>\n        <dd>\n          function that gets called when the dialog closes\n        </dd>\n        <dt>\n          size\n        </dt>\n        <dd>\n          Alternative size: \'sm\', \'lg\'\n        </dd>\n      </dl>\n    </div>\n    <div class="col-md-6">\n      <h5>Example HTML</h5>\n      <div hawtio-editor="confirmationEx1" mode="fileUploadExMode"></div>\n      <h5>Live Example</h5>\n      <div class="directive-example">\n        <div compile="confirmationEx1"></div>\n      </div>\n    </div>\n  </div>\n\n</div>\n');
$templateCache.put('test-plugins/ui/html/editable-property.html','<div ng-controller="UI.UITestController1">\n\n  <div class="row">\n    <div class="col-md-6">\n      <h3>Editable Property</h3>\n      <p>Use to display a value that the user can edit inline.  Configuration options:</p>\n      <dl>\n        <dt>\n          ng-model\n        </dt>\n        <dd>\n          The object in your controller that the directive will look at\n        </dd>\n        <dt>\n          property\n        </dt>\n        <dd>\n          The property in the object that the directive will display and edit\n        </dd>\n        <dt>\n          type\n        </dt>\n        <dd>\n          The type of input field to use, for example \'text\', \'number\', \'password\'\n        </dd>\n        <dt>\n          min\n        </dt>\n        <dd>\n          When using a \'number\' input type, sets the HTML5 \'min\' attribute\n        </dd>\n        <dt>\n          max\n        </dt>\n        <dd>\n          When using a \'number\' input type, sets the HTML5 \'max\' attribute\n        </dd>\n      </dl>\n    </div>\n\n    <div class="col-md-6">\n      <h5>Example HTML</h5>\n      <div hawtio-editor="editablePropertyEx1" mode="fileUploadExMode"></div>\n      <h5>Live example</h5>\n      <div class="directive-example">\n        <div compile="editablePropertyEx1"></div>\n      </div>\n    </div>\n  </div>\n\n</div>\n');
$templateCache.put('test-plugins/ui/html/editor.html','<div ng-controller="UI.UITestController1">\n  <div class="row">\n    <div class="col-md-6">\n      <h1>CodeMirror</h1>\n      <p>A directive that wraps the codeMirror editor.  More details on the editor itself is available <a href="http://codemirror.net/doc/manual.html">here</a>.  Configurations on the directive are:</p>\n      <dl>\n        <dt>\n        hawtio-editor\n        </dt>\n        <dd>\n        Attribute in the controller that contains the text string that the editor will display\n        </dd>\n        <dt>\n        mode\n        </dt>\n        <dd>\n        The type of syntax highlighting to use, i.e. \'javascript\', \'java\', etc.\n        </dd>\n        <dt>\n        read-only\n        </dt>\n        <dd>\n        Controls if the user can edit the text in editor instance\n        </dd>\n        <dt>\n        name\n        </dt>\n        <dd>\n        Instance name of the text editor\n        </dd>\n      </dl>\n      <p>\n      In addition to the directive options the containing controller can further configure the editor settings by creating an \'options\' attribute, which the editor will use.  The default options are:\n      </p>\n      <pre>\n      {{GlobalCodeMirrorOptions | json}}\n      </pre>\n      <p>\n      Use \'CodeEditor.createEditorSettings()\' to create the options object for the editor, which will ensure the above defaults are in place unless set on the options you pass into the function.\n      </p>\n    </div>\n    <div class="col-md-6">\n      <h5>HTML Example</h5>\n      <div hawtio-editor="editorEx1" mode="fileUploadExMode"></div>\n      <h5>Live Example</h5>\n      <div class="directive-example">\n        <div compile="editorEx1"></div>\n      </div>\n    </div>\n  </div>\n</div>\n');
$templateCache.put('test-plugins/ui/html/file-upload.html','<div ng-controller="UI.UITestController1">\n\n  <div class="row">\n    <h3>File upload</h3>\n\n    <p>Use to upload files to the hawtio webapp backend. Files are stored in a temporary directory and managed via the\n      UploadManager JMX MBean</p>\n\n    <p>Showing files:</p>\n\n    <div hawtio-editor="fileUploadEx1" mode="fileUploadExMode"></div>\n    <div class="directive-example">\n      <div compile="fileUploadEx1"></div>\n    </div>\n    <hr>\n    <p>Not showing files:</p>\n\n    <div hawtio-editor="fileUploadEx2" mode="fileUploadExMode"></div>\n    <div class="directive-example">\n      <div compile="fileUploadEx2"></div>\n    </div>\n  </div>\n  <hr>\n</div>\n\n</div>\n');
$templateCache.put('test-plugins/ui/html/pager.html','<div ng-controller="UI.UITestController1">\n  <script type="text/ng-template" id="pagerExample.html">\n    <div>\n      <div class="btn-group" hawtio-pager="messages" on-index-change="selectRow" row-index="rowIndex"></div>\n      <pre>{{getMessage(rowIndex) | json}}</pre>\n    </div>\n  </script>\n  <div class="row">\n    <div class="col-md-6">\n      <h1>Pager</h1>\n      <p>Widget used to navigate an array of data by element.  Handy for tabular data.  Configuration consists of:</p>\n      <dl>\n        <dt>\n          hawtio-pager\n        </dt>\n        <dd>\n          The array that the pager will track.\n        </dd>\n        <dt>\n          on-index-change\n        </dt>\n        <dd>\n          Name of a function in your controller that the directive will call when the user clicks a button on the pager.  The function will receive the new index value.  Use this to set the index and to perform any required actions when the user clicks one of the pager buttons.\n        </dd>\n        <dt>\n          row-index\n        </dt>\n        <dd>\n          Name of the variable in your controller that will track the current index in the array.\n        </dd>\n      </dl>\n    </div>\n  </div>\n  <div class="row">\n    <div class="col-md-12">\n      <h5>Example HTML</h5>\n      <div hawtio-editor="pagerExampleHtml" mode="html"></div>\n    </div>\n  </div>\n  <div class="row">\n    <div class="col-md-12">\n      <h5>Live Example</h5>\n      <div class="directive-example">\n        <div compile="pagerExampleHtml"></div>\n      </div>\n    </div>\n  </div>\n</div>\n');
$templateCache.put('test-plugins/ui/html/template-popover.html','<div ng-controller="UI.UITestController2">\n  <script type="text/ng-template" id="popoverExTemplate">\n<ul>\n  <li ng-repeat="contact in contacts" hawtio-template-popover content="myTemplate" title="Contact details"\n      placement="auto">\n    {{contact.name}}\n  </li>\n</ul>\n  </script>\n  <script type="text/ng-template" id="myTemplate">\n    <small>\n      <table class="table">\n        <tbody>\n        <tr ng-repeat="(k, v) in contact track by $index">\n          <td class="property-name">{{k}}</td>\n          <td class="property-value">{{v}}</td>\n        </tr>\n        </tbody>\n      </table>\n    </small>\n  </script>\n  <div class="row">\n    <div class="col-md-6">\n      <h1>Template Popover</h1>\n      <div class="alert alert-warning">\n        <span class="pficon pficon-warning-triangle-o"></span>\n        <strong>Deprecated.</strong> Please use <a href="http://www.patternfly.org/pattern-library/widgets/#popover" class="alert-link">PatternFly popover</a>.\n      </div>\n      <p>Uses bootstrap popover but lets you supply an angular template to render as the popover body.  For example here\'s a simple template for the popover body:</p>\n      <div hawtio-editor="popoverEx" mode="fileUploadExMode"></div>\n      <p>\n      You can then supply this template as an argument to hawtioTemplatePopover.  By default it will look for a template in $templateCache called "popoverTemplate", or specify a template for the "content" argument.  You can specify "placement" if you want the popover to appear on a certain side, or "auto" and the directive will calculate an appropriate side ("right" or "left") depending on where the element is in the window.\n      </p>\n      <dl>\n        <dt>\n          content\n        </dt>\n        <dd>\n          Template name that the directive will use from $templateCache for the popover body\n        </dd>\n        <dt>\n          title\n        </dt>\n        <dd>\n          Value for the title element of the popup, if not set the popup will have no title element.\n        </dd>\n        <dt>\n          trigger\n        </dt>\n        <dd>\n          Passed to the bootstrap popover \'trigger\' argument, defaults to \'auto\'\n        </dd>\n        <dt>\n          placement\n        </dt>\n        <dd>\n          Controls where the popup will appear in relation to the element.  Defaults to \'auto\', you can also set it to \'left\' or \'right\'.\n        </dd>\n        <dt>\n          delay\n        </dt>\n        <dd>\n          How long until the popup appears\n        </dd>\n        <dt>\n          container\n        </dt>\n        <dd>\n          DOM element that the popover will be attached to, defaults to \'body\'\n        </dd>\n      </dl>\n    </div>\n    <div class="col-md-6">\n      <h5>HTML Example</h5>\n      <div hawtio-editor="popoverUsageEx" mode="fileUploadExMode"></div>\n      <h5>Live Example</h5>\n      <div class="directive-example">\n        <div compile="popoverUsageEx"></div>\n      </div>\n    </div>\n  </div>\n</div>\n');
$templateCache.put('test-plugins/ui/html/toast-notification.html','<div ng-controller="UI.UITestController1">\n  <div class="row">\n    <div class="col-md-12">\n      <h1>Toast Notification</h1>\n      <p>Shows a toast notification on the top right corner of the page.</p>\n      <p>Possible notification types:</p>\n      <ul>\n        <li>success</li>\n        <li>info</li>\n        <li>warning</li>\n        <li>danger</li>\n      </ul>\n      <h3>Example JavaScript</h3>\n      <div hawtio-editor="toastNotificationEx1" mode="\'javascript\'"></div>\n      <h3>Live Example</h3>\n      <div class="directive-example">\n        <form class="form-horizontal">\n          <div class="form-group">\n            <label for="notificationType" class="col-sm-2 control-label">Type</label>\n            <div class="col-sm-3">\n              <select id="notificationType" ng-model="notificationType" class="form-control">\n                <option>success</option>\n                <option>info</option>\n                <option>warning</option>\n                <option>danger</option>\n              </select>\n            </div>\n          </div>\n          <div class="form-group">\n            <div class="col-sm-offset-2 col-sm-10">\n              <button type="button" ng-click="showToastNotification()">Show Toast Notification</button>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>');}]); hawtioPluginLoader.addModule("hawtio-ui-test-templates");