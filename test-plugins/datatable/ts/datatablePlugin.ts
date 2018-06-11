namespace DatatableTest {

  var pluginName = "datatable-test";
  export var templatePath = "test-plugins/datatable/html";
  export var _module = angular.module(pluginName, []);

  _module.config(["$routeProvider", ($routeProvider) => {
    $routeProvider
      .when('/simple-table', {templateUrl: 'test-plugins/datatable/html/simple-table.html'});
  }]);

  _module.run(['mainNavService', (mainNavService: Nav.MainNavService) => {
    mainNavService.addItem({
      title: 'Simple Table',
      href: '/simple-table'
    });
  }]);

  hawtioPluginLoader.addModule(pluginName);

}
