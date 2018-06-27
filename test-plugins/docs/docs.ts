namespace UIDocs {

  let pluginName = "docs";
  export let log:Logging.Logger = Logger.get(pluginName);
  export let _module = angular.module(pluginName, []);

  _module.config(["$routeProvider", ($routeProvider) => {
    $routeProvider
      .when('/docs', {templateUrl: 'test-plugins/docs/welcome/welcome.html'});
  }]);

  _module.run(['mainNavService', (mainNavService: Nav.MainNavService) => {
      mainNavService.addItem({
      title: 'Home',
      href: '/docs',
      rank: 1
    });
  }]);

  hawtioPluginLoader.addModule(pluginName);

}
