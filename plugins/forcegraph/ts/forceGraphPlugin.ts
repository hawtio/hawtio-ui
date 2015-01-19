/// <reference path="../../includes.ts"/>
/// <reference path="forceGraphDirective.ts"/>
/**
 * Force Graph plugin & directive
 *
 * @module ForceGraph
 */
module ForceGraph {
  var pluginName = 'forceGraph';

  export var _module = angular.module(pluginName, []);

  _module.directive('hawtioForceGraph', function () {
    return new ForceGraph.ForceGraphDirective();
  });

  hawtioPluginLoader.addModule(pluginName);
}
