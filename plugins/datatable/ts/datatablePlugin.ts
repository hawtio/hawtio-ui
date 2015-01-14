/// <reference path="../../includes.ts"/>
/**
 * @module DataTable
 * @main DataTable
 */
module DataTable {

  export var pluginName = 'datatable';
  export var log:Logging.Logger = Logger.get("DataTable");

  export var _module = angular.module(pluginName, []);

  _module.config(["$routeProvider", ($routeProvider) => {
    $routeProvider.
        when('/datatable/test', {templateUrl: 'plugins/datatable/html/test.html'});
  }]);

  hawtioPluginLoader.addModule(pluginName);
}
