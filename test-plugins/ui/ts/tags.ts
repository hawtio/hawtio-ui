///<reference path="uiTestPlugin.ts"/>
module UITest {

  _module.controller("UITest.TagsController", ["$scope", "$templateCache", ($scope, $templateCache) => {

    $scope.toJson = angular.toJson;

    $scope.tags = [];
    $scope.selected = [];

    var data = [
      {
        id: 'one',
        tags: ['tag1', 'tag2', 'tag3']
      },
      {
        id: 'two',
        tags: ['tag2', 'tag3']
      },
      {
        id: 'three',
        tags: ['tag1', 'tag2']
      },
      {
        id: 'four',
        tags: ['tag1', 'tag3']
      },
      {
        id: 'five',
        tags: ['tag4']
      }
      ];

      $scope.data = data;
      $scope.template = $templateCache.get('tag-ex-template.html');

  }]);

}

