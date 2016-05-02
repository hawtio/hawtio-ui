/**
 * @module UI
 */
/// <reference path="uiPlugin.ts"/>
module UI {

  export var selectedTags = _module.filter('selectedTags', ['$rootScope', ($rootScope) => {
    return (items, property, selected) => {
      if (selected.length === 0) {
        return items;
      }
      var answer = [];
      _.forEach(items, (item) => {
        var itemTags = $rootScope.$eval(property, item);
        if (_.intersection(itemTags, selected).length === selected.length) {
          answer.push(item);
        }
      });
      return answer;
    };
  }]);

  export var hawtioTagFilter = _module.directive("hawtioTagFilter", ['localStorage', '$location', (localStorage, $location) => {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: UI.templatePath + 'tagFilter.html',
      scope: {
        selected: '=',
        tags: '=?',
        collection: '=',
        collectionProperty: '@',
        saveAs: '@'
      },
      link: ($scope, $element, $attr) => {

        SelectionHelpers.decorate($scope);

        // TODO
        /*
        if (!Core.isBlank($scope.saveAs)) {
          var search = $location.search();
          if ($scope.saveAs in search) {
            $scope.selected.add(angular.fromJson(search[$scope.saveAs]));
          } else if ($scope.saveAs in localStorage) {
            var val = localStorage[$scope.saveAs];
            if (val === 'undefined') {
              delete localStorage[$scope.saveAs];
            } else {
              $scope.selected.add(angular.fromJson(val));
            }
          }
        }
        */

        function maybeFilterVisibleTags() {
          if($scope.collection && $scope.collectionProperty) {
            if (!$scope.selected.length) {
              $scope.visibleTags = $scope.tags;
              $scope.filteredCollection = $scope.collection;
            } else {
              filterVisibleTags();
            }
            $scope.visibleTags = $scope.visibleTags.map((t) => {
              return {
                id: t,
                count: $scope.filteredCollection.map((c) => {
                    return c[$scope.collectionProperty]; 
                  }).reduce((count, c) => {
                    if (_.some(c, t)) {
                      return count + 1;
                    }
                    return count;
                  }, 0)
              };
            });
          } else {
            $scope.visibleTags = $scope.tags;
          }
        }

        function filterVisibleTags() {
          $scope.filteredCollection = $scope.collection.filter((c) => {
            return SelectionHelpers.filterByGroup($scope.selected, c[$scope.collectionProperty]);
          });
          $scope.visibleTags = [];
          $scope.filteredCollection.forEach((c) => {
            $scope.visibleTags = _.union($scope.visibleTags, c[$scope.collectionProperty]);
          });
        }
        $scope.$watchCollection('collection', (collection) => {
          var tagValues = _.union(_.map(collection, (item) => $scope.$eval($scope.collectionProperty, item)));
          var tags = [];
          _.forEach(tagValues, (values) => {
            tags = _.union(tags, values);
          });
          //log.debug("tags: ", tags);
          $scope.tags = tags;

        });
        $scope.$watchCollection('tags', (newValue, oldValue) => {
          if (newValue !== oldValue) {
            SelectionHelpers.syncGroupSelection($scope.selected, $scope.tags);
            maybeFilterVisibleTags();
          }
        });
        $scope.$watchCollection('selected', (selected) => {
          $scope.selected = _.uniq(selected);

          //log.debug("newValue: ", $scope.selected);
          //TODO
          /*
          if (!Core.isBlank($scope.saveAs)) {
            var saveAs = angular.toJson($scope.selected);
            localStorage[$scope.saveAs] = saveAs;
            $location.replace().search($scope.saveAs, saveAs);
          }
          */
          maybeFilterVisibleTags();
        });
      }
    }
  }]);

}
