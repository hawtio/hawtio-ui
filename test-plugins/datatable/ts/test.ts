/// <reference path="datatablePlugin.ts"/>
module DatatableTest {

  _module.controller('DatatableTest.SimpleTableTestController', ['$scope', '$location', ($scope, $location) => {
    $scope.myData = [
      { name: "James", twitter: "jstrachan" },
      { name: "Stan", twitter: "gashcrumb" },
      { name: "Claus", twitter: "davsclaus" }
    ];

    $scope.selectedItems = [];


    $scope.mygrid = {
      data: 'myData',
      showFilter: false,
      showColumnMenu: false,
      multiSelect: ($location.search()["multi"] || "").startsWith("f") ? false : true,
      filterOptions: {
        filterText: "",
        useExternalFilter: false
      },
      selectedItems: $scope.selectedItems,
      rowHeight: 32,
      selectWithCheckboxOnly: true,
      columnDefs: [
        {
          field: 'name',
          displayName: 'Name',
          width: "***"
          //width: 300
        },
        {
          field: 'twitter',
          displayName: 'Twitter',
          cellTemplate: '<div class="ngCellText">@{{row.entity.twitter}}</div>',
          //width: 400
          width: "***"
        }
      ]
    }
  }]);
}
