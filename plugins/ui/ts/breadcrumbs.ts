/**
 * @module UI
 */
/// <reference path="uiPlugin.ts"/>
module UI {

  export function hawtioBreadcrumbs() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: UI.templatePath + 'breadcrumbs.html',
      require: 'hawtioDropDown',
      scope: {
        config: '='
      },
      controller: ["$scope", "$element", "$attrs", ($scope, $element, $attrs) => {

        $scope.action = "itemClicked(config, $event)";

        $scope.levels = {};

        function resetAction(list) {
          _.forEach(list, (item) => item.action = $scope.action);
        }

        function lastLevel() {
          var last = _.last(_.sortBy(_.keys($scope.levels), ""));
          return last;
        }

        $scope.isLastLevel = (level) => {
          return level === lastLevel();
        }

        $scope.itemClicked = (config, $event) => {
          if (angular.isDefined(config.level)) {
            $scope.levels[config.level] = config;
            var keys = _.sortBy(_.keys($scope.levels), "");
            var toRemove = keys.slice(config.level + 1);
            _.forEach(toRemove, (i) => delete $scope.levels[i]);
            var keys = _.sortBy(_.keys($scope.levels), "");
            var path = [];
            _.forEach(keys, (key) => {
              path.push($scope.levels[key]['title']);
            });
            var pathString = '/' + path.join("/");
            $scope.config.path = pathString
          }
        };

        function addAction(config, level) {
          config.level = level;
          config.action = $scope.action;
          if (config.items) {
            _.forEach(config.items, (item) => {
              addAction(item, level + 1);
            });
          }
        }

        function setLevels(config, pathParts, level) {
          if (pathParts.length === 0) {
            return;
          }
          var part = pathParts.shift();
          if (config && config.items) {
            var matched = false;
            _.forEach(config.items, (item) => {
              if (!matched && item['title'] === part) {
                matched = true;
                $scope.levels[level] = item;
                setLevels(item, pathParts, level + 1);
              }
            });
          }
          var last = lastLevel();
          _.forOwn($scope.levels, (config, level) => {
            config.open = level === last;
            delete config.action;
            resetAction(config.items);
          });
        }

        // watch to see if the parent scope changes the path
        $scope.$watch('config.path', (path) => {
          if (!Core.isBlank(path)) {
            var pathParts = _.filter(path.split('/'), (p:string) => !Core.isBlank(p));
            // adjust $scope.levels to match the path
            _.forEach(_.keys($scope.levels), (key:number) => {
              if (key > 0) {
                delete $scope.levels[key];
              }
            });
            setLevels($scope.config, _.tail(pathParts), 1);
          }
        });

        $scope.$watch('config', (newValue, oldValue) => {
          addAction($scope.config, 0);
          delete $scope.config.action;
          $scope.levels[0] = $scope.config;
        });
      }]
    }
  }

  _module.directive('hawtioBreadcrumbs', UI.hawtioBreadcrumbs);

}
