/// <reference path="datatablePlugin.ts"/>
module DatatableTest {

  _module.controller('DatatableTest.SimpleTableTestController', ['$scope', '$location', ($scope, $location) => {
    $scope.myData = [
      {name: "James", twitter: "jstrachan", city: 'LONDON', ip: '172.17.0.11'},
      {name: "Stan", twitter: "gashcrumb", city: 'boston', ip: '172.17.0.9'},
      {name: "Claus", twitter: "davsclaus", city: 'Malmo', ip: '172.17.0.10'},
      {name: "Alexandre", twitter: "alexkieling", city: 'Florianopolis', ip: '172.17.0.12'}     
    ];

    $scope.mygrid = {
      data: 'myData',
      showFilter: false,
      showColumnMenu: false,
      multiSelect: _.startsWith($location.search()["multi"] || "", "f") ? false : true,
      filterOptions: {
        filterText: "",
        useExternalFilter: false
      },
      selectedItems: [],
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
          field: 'city',
          displayName: 'City',
          width: "***"
          //width: 300
        },
        {
          field: 'twitter',
          displayName: 'Twitter',
          cellTemplate: '<div class="ngCellText">@{{row.entity.twitter}}</div>',
          //width: 400
          width: "***"
        },
        {
          field: 'ip',
          displayName: 'Pod IP',
          width: "***",
          customSortField: (field):any => {
            // use a custom sort to sort ip address
            var ip = field.ip;

            // i guess there is maybe nicer ways of sort this without parsing and slicing
            var regex = /(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/;
            var groups = regex.exec(ip);
            if (angular.isDefined(groups)) {
              var g1 = ("00" + groups[1]).slice(-3);
              var g2 = ("00" + groups[2]).slice(-3);
              var g3 = ("00" + groups[3]).slice(-3);
              var g4 = ("00" + groups[4]).slice(-3);
              var answer = g1 + g2 + g3 + g4;
              console.log(answer);
              return answer;
            } else {
              return 0;
            }
          }
          //width: 300
        }
      ]
    }

    $scope.scrollGrid = angular.extend({maxBodyHeight: 77}, $scope.mygrid);
  }]);
}
