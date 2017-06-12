module DatatableTest {

  var pluginName = "datatable-test";
  export var templatePath = "test-plugins/datatable/html";
  export var _module = angular.module(pluginName, []);

  var simpleTableTab = null;

  _module.config(["$routeProvider", 'HawtioNavBuilderProvider', ($routeProvider, builder) => {
    simpleTableTab = builder.create()
      .id(pluginName)
      .title(() => "Tables")
      .href(() => "/datatable")
      .subPath("Simple Table", "simple-table", builder.join(templatePath, "simple-table.html"), 1)
      .build();
     
     builder.configureRouting($routeProvider, simpleTableTab);
  }]);

  _module.run(['HawtioNav', (nav) => {
    nav.add(simpleTableTab);
  }]);

  hawtioPluginLoader.addModule(pluginName);

}
