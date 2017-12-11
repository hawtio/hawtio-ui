namespace UIDocs {

  let pluginName = "docs";
  export let log:Logging.Logger = Logger.get(pluginName);
  let templatePath = "test-plugins/docs/welcome";
  export let _module = angular.module(pluginName, []);
  let welcomeTab = null;

  _module.config(["$routeProvider", 'HawtioNavBuilderProvider', ($routeProvider, builder) => {
    welcomeTab = builder.create()
      .id(pluginName)
      .title(() => "Documentation")
      .href(() => "/docs")
      .subPath("Welcome", "welcome", builder.join(templatePath, "welcome.html"), 1)
      .build();
    builder.configureRouting($routeProvider, welcomeTab);
  }]);

  _module.run(['HawtioNav', (nav) => {
    nav.add(welcomeTab);
  }]);

  hawtioPluginLoader.addModule(pluginName);

}
