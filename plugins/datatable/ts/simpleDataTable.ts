/// <reference path="datatablePlugin.ts"/>
/**
 * @module DataTable
 */
module DataTable {

  _module.directive('hawtioSimpleTable', ["$compile", ($compile) => {
    return {
      restrict: 'A',
      scope: {
        config: '=hawtioSimpleTable'
      },
      link: ($scope, $element, $attrs) => {

        var defaultPrimaryKeyFn = (entity, idx) => {
          // default function to use id/_id/name as primary key, and fallback to use index
          return entity["id"] || entity["_id"] || entity["_key"] || entity["name"] || idx;
        };

        var config = $scope.config;

        var dataName = config.data || "data";
        // need to remember which rows has been selected as the config.data / config.selectedItems
        // so we can re-select them when data is changed/updated, and entity may be new instances
        // so we need a primary key function to generate a 'primary key' of the entity
        var primaryKeyFn = config.primaryKeyFn || defaultPrimaryKeyFn;
        $scope.rows = [];

        var scope = $scope.$parent || $scope;

        var listener = () => {
          var value = Core.pathGet(scope, dataName);
          if (value && !angular.isArray(value)) {
            value = [value];
            Core.pathSet(scope, dataName, value);
          }

          if (!('sortInfo' in config) && 'columnDefs' in config) {
            // an optional defaultSort can be used to indicate a column
            // should not automatic be the default sort
            var ds = _.first(config.columnDefs)['defaultSort'];
            var sortField;
            if (angular.isUndefined(ds) || ds === true) {
              sortField = _.first(config.columnDefs)['field'];
            } else {
              sortField = _.first(config.columnDefs.slice(1))['field']
            }
            config['sortInfo'] = {
              sortBy: sortField,
              ascending: true
            };
          }

          // any custom sort function on the field?
          var customSort:any = _.find(config.columnDefs, (e) => {
            if (e['field'] === config['sortInfo'].sortBy) {
              return e;
            }
          });
          // the columnDefs may have a custom sort function in the key named customSortField
          if (angular.isDefined(customSort)) {
            customSort = customSort['customSortField']
          }

          var sortInfo = $scope.config.sortInfo || { sortBy: '', ascending: true };
          // enrich the rows with information about their index
          var idx = -1;
          var rows = _.map(_.sortBy(value || [], customSort || sortInfo.sortBy, !sortInfo.ascending), (entity) => {
            idx++;
            return {
              entity: entity,
              index: idx,
              getProperty: (name) => {
                return entity[name];
              }
            };
          });

          // okay the data was changed/updated so we need to re-select previously selected items
          // and for that we need to evaluate the primary key function so we can match new data with old data.
          var reSelectedItems = [];
          rows.forEach((row:any, idx:number) => {
            var rpk = primaryKeyFn(row.entity, row.index);
            var selected = _.some(config.selectedItems, (s:any) => {
              var spk = primaryKeyFn(s, s.index);
              return angular.equals(rpk, spk);
            });
            if (selected) {
              // need to enrich entity with index, as we push row.entity to the re-selected items
              row.entity.index = row.index;
              reSelectedItems.push(row.entity);
              row.selected = true;
              log.debug("Data changed so keep selecting row at index " + row.index);
            }
          });
          config.selectedItems = reSelectedItems;

          Core.pathSet(scope, ['hawtioSimpleTable', dataName, 'rows'], rows);
          $scope.rows = rows;
        };

        scope.$watchCollection(dataName, listener);

        // lets add a separate event so we can force updates
        // if we find cases where the delta logic doesn't work
        // (such as for nested hawtioinput-input-table)
        scope.$on("hawtio.datatable." + dataName, listener);

        function getSelectionArray() {
          var selectionArray = config.selectedItems;
          if (!selectionArray) {
            selectionArray = [];
            config.selectedItems = selectionArray;
          }
          if (angular.isString(selectionArray)) {
            var name = selectionArray;
            selectionArray =  Core.pathGet(scope, name);
            if (!selectionArray) {
              selectionArray = [];
              scope[name] = selectionArray;
            }
          }
          return selectionArray;
        }

        function isMultiSelect() {
          var multiSelect = $scope.config.multiSelect;
          if (angular.isUndefined(multiSelect)) {
            multiSelect = true;
          }
          return multiSelect;
        }

        $scope.toggleAllSelections = () => {
          var allRowsSelected = $scope.config.allRowsSelected;
          var newFlag = allRowsSelected;
          var selectionArray = getSelectionArray();
          selectionArray.splice(0, selectionArray.length);
          angular.forEach($scope.rows, (row) => {
            row.selected = newFlag;
            if (allRowsSelected) {
              selectionArray.push(row.entity);
            }
          });
        };

        $scope.toggleRowSelection = (row) => {
          if (row) {
            var selectionArray = getSelectionArray();
            if (!isMultiSelect()) {
              // lets clear all other selections
              selectionArray.splice(0, selectionArray.length);
              angular.forEach($scope.rows, (r) => {
                if (r !== row) {
                  r.selected = false;
                }
              });
            }
            var entity = row.entity;
            if (entity) {
              var idx = selectionArray.indexOf(entity);
              if (row.selected) {
                if (idx < 0) {
                  selectionArray.push(entity);
                }
              } else {
                // clear the all selected checkbox
                $scope.config.allRowsSelected = false;
                if (idx >= 0) {
                  selectionArray.splice(idx, 1);
                }
              }
            }
          }
        };

        $scope.sortBy = (field) => {
          if ($scope.config.sortInfo.sortBy === field) {
            $scope.config.sortInfo.ascending = !$scope.config.sortInfo.ascending;
          } else {
            $scope.config.sortInfo.sortBy = field;
            $scope.config.sortInfo.ascending = true;
          }
          scope.$broadcast("hawtio.datatable." + dataName);
        };

        $scope.getClass = (field) => {
          if ('sortInfo' in $scope.config) {
            if ($scope.config.sortInfo.sortBy === field) {
              if ($scope.config.sortInfo.ascending) {
                return 'asc';
              } else {
                return 'desc';
              }
            }
          }

          return '';
        };

        $scope.showRow = (row) => {
          var filter = Core.pathGet($scope, ['config', 'filterOptions', 'filterText']);
          if (Core.isBlank(filter)) {
            return true;
          }

          var data = null;

          // it may be a node selection (eg JMX plugin with Folder tree structure) then use the title
          try {
              data = row['entity']['title'];
          } catch (e) {
            // ignore
          }

          if (!data) {
            // use the row as-is
            data = row.entity;
          }

          var match = FilterHelpers.search(data, filter);
          return match;
        };

        $scope.isSelected = (row) => {
          return _.some(config.selectedItems, row.entity);
        };

        $scope.onRowSelected = (row) => {
          var idx = config.selectedItems.indexOf(row.entity);
          if (idx >= 0) {
            log.debug("De-selecting row at index " + row.index);
            config.selectedItems.splice(idx, 1);
            delete row.selected;
          } else {
            if (!config.multiSelect) {
              config.selectedItems.length = 0;
            }
            log.debug("Selecting row at index " + row.index);
            // need to enrich entity with index, as we push row.entity to the selected items
            row.entity.index = row.index;
            config.selectedItems.push(row.entity);
            if (!angular.isDefined(row.selected) || !row.selected) {
              row.selected = true;
            }
          }
        };

        $scope.$watchCollection('rows', () => {
          // lets add the header and row cells
          var rootElement = $element;
          rootElement.empty();

          var showCheckBox = firstValueDefined(config, ["showSelectionCheckbox", "displaySelectionCheckbox"], true);
          var enableRowClickSelection = firstValueDefined(config, ["enableRowClickSelection"], false);

          var onMouseDown;
          if (enableRowClickSelection) {
            onMouseDown = "ng-click='onRowSelected(row)' ";
          } else {
            onMouseDown = "";
          }
          var headHtml = "<thead><tr>";
          // use a function to check if a row is selected so the UI can be kept up to date asap
          var bodyHtml = "<tbody><tr ng-repeat='row in rows track by $index' ng-show='showRow(row)' ng-class=\"{'selected': isSelected(row)}\" >";
          var idx = 0;
          if (showCheckBox) {
            var toggleAllHtml = isMultiSelect() ?
              "<input type='checkbox' ng-show='rows.length' ng-model='config.allRowsSelected' ng-change='toggleAllSelections()'>" : "";

            headHtml += "\n<th class='simple-table-checkbox'>" +
              toggleAllHtml +
              "</th>"
            bodyHtml += "\n<td class='simple-table-checkbox'><input type='checkbox' ng-model='row.selected' ng-change='toggleRowSelection(row)'></td>"
          }
          angular.forEach(config.columnDefs, (colDef) => {
            var field = colDef.field;
            var cellTemplate = colDef.cellTemplate || '<div class="ngCellText" title="{{row.entity.' + field + '}}">{{row.entity.' + field + '}}</div>';

            headHtml += "\n<th class='clickable no-fade table-header' ng-click=\"sortBy('" + field + "')\" ng-class=\"getClass('" + field + "')\">{{config.columnDefs[" + idx + "].displayName}}<span class='indicator'></span></th>"

            bodyHtml += "\n<td + " + onMouseDown + ">" + cellTemplate + "</td>"
            idx += 1;
          });
          var html = headHtml + "\n</tr></thead>\n" +
            bodyHtml + "\n</tr></tbody>";

          var newContent = $compile(html)($scope);
          rootElement.html(newContent);
        });

      }
    };
  }]);
  
  /**
   * Returns the first property value defined in the given object or the default value if none are defined
   *
   * @param object the object to look for properties
   * @param names the array of property names to look for
   * @param defaultValue the value if no property values are defined
   * @return {*} the first defined property value or the defaultValue if none are defined
   */
  function firstValueDefined(object, names, defaultValue) {
    var answer = defaultValue;
    var found = false;
    angular.forEach(names, (name) => {
      var value = object[name];
      if (!found && angular.isDefined(value)) {
        answer = value;
        found = true;
      }
    });
    return answer;
  }

}

