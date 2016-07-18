/// <reference path="datatablePlugin.ts"/>

module DatatableTest {

  _module.controller("DatatableTest.SimpleTableController",
      ["$scope", "$templateCache", "$location", ($scope, $templateCache, $location) => {

    $scope.toJson = angular.toJson;

    // 1 - Table with single row selection via click on row
    $scope.config1 = {
      data: 'model1',
      selectedItems: [],
      columnDefs: [
        {
          field: 'name',
          displayName: 'Pod Name'
        },
        {
          field: 'status',
          displayName: 'Status'
        },
        {
          field: 'ip',
          displayName: 'IP',
          customSortField: processIpForSorting
        },
      ],
      enableRowClickSelection: true,
      showSelectionCheckbox: false,
      multiSelect: false,
      sortInfo: {"sortBy": "ip", "ascending": true},
    };
    $scope.model1 = [
      {name: "fabric8-311", status: "running", ip: '10.188.2.3'},
      {name: "camel-041", status: "running", ip: '10.188.2.20'},
      {name: "activemq-004", status: "failed", ip: '10.188.2.111'}
    ];
    $scope.markup1 = $templateCache.get("markup1.html");

    // 2 - Table with multiple row selection using checkboxes
    $scope.config2 = {
      data: 'model2',
      selectedItems: [],
      columnDefs: [
        {
          field: 'name',
          displayName: 'Pod Name'
        },
        {
          field: 'status',
          displayName: 'Status',
          cellTemplate: '<div class="ngCellText status-{{row.entity.status}}">{{row.entity.status}}</div>'         
        },
        {
          field: 'ip',
          displayName: 'IP',
          customSortField: processIpForSorting
        },
      ],
      enableRowClickSelection: false,
      showSelectionCheckbox: true,
      multiSelect: true,
      primaryKeyFn: (entity) => { return entity.name + "_" + entity.ip },
    };
    $scope.model2 = [
      {name: "fabric8-311", status: "running", ip: '10.188.2.3'},
      {name: "camel-041", status: "running", ip: '10.188.2.20'},
      {name: "activemq-004", status: "failed", ip: '10.188.2.111'}
    ];
    $scope.markup2 = $templateCache.get("markup2.html");

    // 3 - Table with fixed height and search box
    $scope.config3 = {
      data: 'model3',
      selectedItems: [],
      columnDefs: [
        {
          field: 'name',
          displayName: 'Pod Name'
        },
        {
          field: 'status',
          displayName: 'Status'
        },
        {
          field: 'ip',
          displayName: 'IP',
          customSortField: processIpForSorting
        },
      ],
      maxBodyHeight: 100,
      filterOptions: {filterText: ""}
    };
    $scope.model3 = [
      {name: "fabric8-311", status: "running", ip: '10.188.2.3'},
      {name: "camel-041", status: "running", ip: '10.188.2.20'},
      {name: "activemq-004", status: "failed", ip: '10.188.2.111'},
      {name: "keycloak-511", status: "running", ip: '10.188.2.4'},
      {name: "wildfly-241", status: "running", ip: '10.188.2.21'},
      {name: "tomcat-377", status: "failed", ip: '10.188.2.178'},
      {name: "karaf-033", status: "running", ip: '10.188.2.220'},
    ];
    $scope.markup3 = $templateCache.get("markup3.html");

  }]);

  function processIpForSorting(field):any {
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
  
}
