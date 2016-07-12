/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
module UI {

  /**
   * Test controller for the icon help page
   * @param $scope
   * @param $templateCache
   * @constructor
   */
  export var IconTestController = _module.controller("UI.IconTestController", ["$scope", "$templateCache", ($scope, $templateCache) => {
    $scope.exampleHtml = $templateCache.get('example-html');
    $scope.exampleConfigJson = $templateCache.get('example-config-json');

    $scope.$watch('exampleConfigJson', (newValue, oldValue) => {
      $scope.icons = angular.fromJson($scope.exampleConfigJson);
      //log.debug("Icons: ", $scope.icons);
    });
  }]);

  /**
   * The hawtio-icon directive
   * @returns {{}}
   */
  export function hawtioIcon() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: UI.templatePath + 'icon.html',
      scope: {
        icon: '=config'
      },
      link: ($scope, $element, $attrs) => {
        if (!$scope.icon) {
          return;
        }
        if (!('type' in $scope.icon) && !Core.isBlank($scope.icon.src)) {
          if (_.startsWith($scope.icon.src, "fa fa-")) {
            $scope.icon.type = "icon";
          } else {
            $scope.icon.type = "img";
          }
        }
        //log.debug("Created icon: ", $scope.icon);
      }
    };
  }
  _module.directive('hawtioIcon', UI.hawtioIcon);

}
