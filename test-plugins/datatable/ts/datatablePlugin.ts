///<reference path="../../includes.ts"/>

module DatatableTest {
  var pluginName = "datatable-test";
  export var templatePath = "test-plugins/datatable/html";
  export var _module = angular.module(pluginName, []);

  _module.config(["$routeProvider", ($routeProvider) => {
    $routeProvider.
        when('/datatable/test', {templateUrl: UrlHelpers.join(templatePath, 'test.html')});
  }]);

  _module.run(['HawtioNav', (nav) => {
    var builder = nav.builder();
    nav.add(builder.id(pluginName)
                   .href(() => '/datatable/test')
                   .title(() => 'Tables')
                   .build());


  }]);



  hawtioPluginLoader.addModule(pluginName);

}
