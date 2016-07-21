/// <reference path="../docs.ts"/>

module UIDocs {

  _module.controller("WelcomePageController", ["$scope", "marked", "$http", "$timeout", function ($scope, marked, $http, $timeout) {
    $timeout(function() {
      $http.get('README.md').success(function(data) {
        log.debug("Fetched README.md, data: ", data);
        $scope.readme = marked(data);
      }).error(function(data) {
        log.debug("Failed to fetch README.md: ", data);
      });
    }, 500);

  }]);

}