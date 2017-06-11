/// <reference path="../docs.ts"/>

module UIDocs {

  _module.controller("WelcomePageController", ["$scope", "marked", "$http", "$timeout", function ($scope, marked, $http, $timeout) {
    $timeout(function() {
      $http.get('README.md')
        .then(function(response) {
          log.debug("Fetched README.md, data: ", response.data);
          $scope.readme = marked(response.data);
        })
        .catch(function(error) {
          log.debug("Failed to fetch README.md: ", error);
        });
    }, 500);

  }]);

}