/**
 * @module DataTable
 * @main DataTable
 */
var DataTable;
(function (DataTable) {
    DataTable.pluginName = 'hawtio-ui-datatable';
    DataTable.log = Logger.get(DataTable.pluginName);
    DataTable._module = angular.module(DataTable.pluginName, []);
    hawtioPluginLoader.addModule(DataTable.pluginName);
})(DataTable || (DataTable = {}));
/// <reference path="datatablePlugin.ts"/>
/**
 * @module DataTable
 */
var DataTable;
(function (DataTable) {
    DataTable._module.directive('hawtioSimpleTable', ["$compile", "$timeout", function ($compile, $timeout) {
            return {
                restrict: 'A',
                scope: {
                    config: '=hawtioSimpleTable'
                },
                link: function ($scope, $element, $attrs) {
                    $element.addClass('hawtio-simple-table');
                    var defaultPrimaryKeyFn = function (entity) {
                        // default function to use id/_id/_key/name as primary key, and fallback to use all property values
                        var primaryKey = entity["id"] || entity["_id"] || entity["_key"] || entity["name"];
                        if (primaryKey === undefined) {
                            throw new Error("Missing primary key. Please add a property called 'id', '_id', '_key', or 'name' " +
                                "to your entities. Alternatively, set the 'primaryKeyFn' configuration option.");
                        }
                        return primaryKey;
                    };
                    var config = $scope.config;
                    var dataName = config.data || "data";
                    // need to remember which rows has been selected as the config.data / config.selectedItems
                    // so we can re-select them when data is changed/updated, and entity may be new instances
                    // so we need a primary key function to generate a 'primary key' of the entity
                    var primaryKeyFn = config.primaryKeyFn || defaultPrimaryKeyFn;
                    $scope.rows = [];
                    var scope = $scope.$parent || $scope;
                    var listener = function () {
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
                            }
                            else {
                                sortField = _.first(config.columnDefs.slice(1))['field'];
                            }
                            config['sortInfo'] = {
                                sortBy: sortField,
                                ascending: isFieldSortedAscendingByDefault(sortField, config)
                            };
                        }
                        // any custom sort function on the field?
                        var customSort = _.find(config.columnDefs, function (e) {
                            if (e['field'] === config['sortInfo'].sortBy) {
                                return e;
                            }
                        });
                        // the columnDefs may have a custom sort function in the key named customSortField
                        if (angular.isDefined(customSort)) {
                            customSort = customSort['customSortField'];
                        }
                        // sort data
                        var sortInfo = $scope.config.sortInfo || { sortBy: '', ascending: true };
                        var sortedData = _.sortBy(value || [], customSort || (function (item) { return ((item[sortInfo.sortBy] || '') + '').toLowerCase(); }));
                        if (!sortInfo.ascending) {
                            sortedData.reverse();
                        }
                        // enrich the rows with information about their index
                        var idx = -1;
                        var rows = _.map(sortedData, function (entity) {
                            idx++;
                            return {
                                entity: entity,
                                index: idx,
                                getProperty: function (name) {
                                    return entity[name];
                                }
                            };
                        });
                        // okay the data was changed/updated so we need to re-select previously selected items
                        // and for that we need to evaluate the primary key function so we can match new data with old data.
                        var reSelectedItems = [];
                        rows.forEach(function (row, idx) {
                            var rpk = primaryKeyFn(row.entity);
                            var selected = _.some(config.selectedItems, function (s) {
                                var spk = primaryKeyFn(s);
                                return angular.equals(rpk, spk);
                            });
                            if (selected) {
                                // need to enrich entity with index, as we push row.entity to the re-selected items
                                row.entity.index = row.index;
                                reSelectedItems.push(row.entity);
                                row.selected = true;
                                DataTable.log.debug("Data changed so keep selecting row at index " + row.index);
                            }
                        });
                        config.selectedItems.length = 0;
                        (_a = config.selectedItems).push.apply(_a, reSelectedItems);
                        Core.pathSet(scope, ['hawtioSimpleTable', dataName, 'rows'], rows);
                        $scope.rows = rows;
                        var _a;
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
                            selectionArray = Core.pathGet(scope, name);
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
                    $scope.toggleAllSelections = function () {
                        var allRowsSelected = $scope.config.allRowsSelected;
                        var newFlag = allRowsSelected;
                        var selectionArray = getSelectionArray();
                        selectionArray.splice(0, selectionArray.length);
                        angular.forEach($scope.rows, function (row) {
                            row.selected = newFlag;
                            if (allRowsSelected && $scope.showRow(row)) {
                                selectionArray.push(row.entity);
                            }
                        });
                    };
                    $scope.toggleRowSelection = function (row) {
                        if (row) {
                            var selectionArray = getSelectionArray();
                            if (!isMultiSelect()) {
                                // lets clear all other selections
                                selectionArray.splice(0, selectionArray.length);
                                angular.forEach($scope.rows, function (r) {
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
                                }
                                else {
                                    // clear the all selected checkbox
                                    $scope.config.allRowsSelected = false;
                                    if (idx >= 0) {
                                        selectionArray.splice(idx, 1);
                                    }
                                }
                            }
                        }
                    };
                    $scope.sortBy = function (field) {
                        if ($scope.config.sortInfo.sortBy === field) {
                            $scope.config.sortInfo.ascending = !$scope.config.sortInfo.ascending;
                        }
                        else {
                            $scope.config.sortInfo.sortBy = field;
                            $scope.config.sortInfo.ascending = isFieldSortedAscendingByDefault(field, $scope.config);
                        }
                        scope.$broadcast("hawtio.datatable." + dataName);
                    };
                    $scope.getClass = function (field) {
                        if ('sortInfo' in $scope.config) {
                            if ($scope.config.sortInfo.sortBy === field) {
                                if ($scope.config.sortInfo.ascending) {
                                    return 'sorting_asc';
                                }
                                else {
                                    return 'sorting_desc';
                                }
                            }
                        }
                        return '';
                    };
                    $scope.showRow = function (row) {
                        var filter = Core.pathGet($scope, ['config', 'filterOptions', 'filterText']);
                        if (Core.isBlank(filter)) {
                            return true;
                        }
                        var data = null;
                        // it may be a node selection (eg JMX plugin with Folder tree structure) then use the title
                        try {
                            data = row['entity']['title'];
                        }
                        catch (e) {
                            // ignore
                        }
                        if (!data) {
                            // use the row as-is
                            data = row.entity;
                        }
                        var match = FilterHelpers.search(data, filter);
                        return match;
                    };
                    $scope.isSelected = function (row) {
                        return row && _.some(config.selectedItems, row.entity);
                    };
                    $scope.onRowClicked = function (row) {
                        var id = $scope.config.gridKey;
                        if (id) {
                            var func = $scope.config.onClickRowHandlers[id];
                            if (func) {
                                func(row);
                            }
                        }
                    };
                    $scope.onRowSelected = function (row) {
                        var idx = config.selectedItems.indexOf(row.entity);
                        if (idx >= 0) {
                            DataTable.log.debug("De-selecting row at index " + row.index);
                            config.selectedItems.splice(idx, 1);
                            delete row.selected;
                        }
                        else {
                            if (!config.multiSelect) {
                                config.selectedItems.length = 0;
                            }
                            DataTable.log.debug("Selecting row at index " + row.index);
                            // need to enrich entity with index, as we push row.entity to the selected items
                            row.entity.index = row.index;
                            config.selectedItems.push(row.entity);
                            if (!angular.isDefined(row.selected) || !row.selected) {
                                row.selected = true;
                            }
                        }
                    };
                    $scope.$watchCollection('rows', function () {
                        // lets add the header and row cells
                        var rootElement = $element;
                        rootElement.empty();
                        rootElement.addClass('dataTable');
                        var showCheckBox = firstValueDefined(config, ["showSelectionCheckbox", "displaySelectionCheckbox"], true);
                        var enableRowClickSelection = firstValueDefined(config, ["enableRowClickSelection"], false);
                        var scrollable = config.maxBodyHeight !== undefined;
                        var headHtml = buildHeadHtml(config.columnDefs, showCheckBox, isMultiSelect(), scrollable);
                        var bodyHtml = buildBodyHtml(config.columnDefs, showCheckBox, enableRowClickSelection);
                        if (scrollable) {
                            var head = $compile(headHtml)($scope);
                            var body = $compile(bodyHtml)($scope);
                            buildScrollableTable(rootElement, head, body, $timeout, config.maxBodyHeight);
                        }
                        else {
                            var html = headHtml + bodyHtml;
                            var newContent = $compile(html)($scope);
                            rootElement.html(newContent);
                        }
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
        angular.forEach(names, function (name) {
            var value = object[name];
            if (!found && angular.isDefined(value)) {
                answer = value;
                found = true;
            }
        });
        return answer;
    }
    /**
     * Returns true if the field's default sorting is ascending
     *
     * @param field the name of the field
     * @param config the config object, which contains the columnDefs values
     * @return true if the field's default sorting is ascending, false otherwise
     */
    function isFieldSortedAscendingByDefault(field, config) {
        if (config.columnDefs) {
            for (var _i = 0, _a = config.columnDefs; _i < _a.length; _i++) {
                var columnDef = _a[_i];
                if (columnDef.field === field && columnDef.ascending !== undefined) {
                    return columnDef.ascending;
                }
            }
        }
        return true;
    }
    /**
     * Builds the thead HTML.
     *
     * @param columnDefs column definitions
     * @param showCheckBox add extra column for checkboxes
     * @param multiSelect show "select all" checkbox
     * @param scrollable table with fixed height and scrollbar
     */
    function buildHeadHtml(columnDefs, showCheckBox, multiSelect, scrollable) {
        var headHtml = "<thead><tr>";
        if (showCheckBox) {
            headHtml += "\n<th class='simple-table-checkbox'>";
            if (multiSelect) {
                headHtml += "<input type='checkbox' ng-show='rows.length' ng-model='config.allRowsSelected' " +
                    "ng-change='toggleAllSelections()'>";
            }
            headHtml += "</th>";
        }
        for (var i = 0, len = columnDefs.length; i < len; i++) {
            var columnDef = columnDefs[i];
            var sortingArgs = '';
            if (columnDef.sortable === undefined || columnDef.sortable) {
                sortingArgs = "class='sorting' ng-click=\"sortBy('" + columnDef.field + "')\" ";
            }
            headHtml += "\n<th " + sortingArgs +
                " ng-class=\"getClass('" + columnDef.field + "')\">{{config.columnDefs[" + i +
                "].displayName}}</th>";
        }
        if (scrollable) {
            headHtml += "\n<th></th>";
        }
        headHtml += "\n</tr></thead>\n";
        return headHtml;
    }
    /**
     * Builds the tbody HTML.
     *
     * @param columnDefs column definitions
     * @param showCheckBox show selection checkboxes
     * @param enableRowClickSelection enable row click selection
     */
    function buildBodyHtml(columnDefs, showCheckBox, enableRowClickSelection) {
        // use a function to check if a row is selected so the UI can be kept up to date asap
        var bodyHtml = "<tbody><tr ng-repeat='row in rows track by $index' ng-show='showRow(row)' " +
            "ng-class=\"{'active': isSelected(row)}\" >";
        if (showCheckBox) {
            bodyHtml += "\n<td class='simple-table-checkbox'><input type='checkbox' ng-model='row.selected' " +
                "ng-change='toggleRowSelection(row)'></td>";
        }
        var onMouseDown = enableRowClickSelection ? "ng-click='onRowSelected(row)' " : "";
        for (var i = 0, len = columnDefs.length; i < len; i++) {
            var columnDef = columnDefs[i];
            var cellTemplate = columnDef.cellTemplate || '<div class="ngCellText" title="{{row.entity.' +
                columnDef.field + '}}">{{row.entity.' + columnDef.field + '}}</div>';
            bodyHtml += "\n<td + " + onMouseDown + ">" + cellTemplate + "</td>";
        }
        bodyHtml += "\n</tr></tbody>";
        return bodyHtml;
    }
    /**
     * Transform original table into a scrollable table.
     *
     * @param $table jQuery object referencing the DOM table element
     * @param head thead HTML
     * @param body tbody HTML
     * @param $timeout Angular's $timeout service
     * @param maxBodyHeight maximum tbody height
     */
    function buildScrollableTable($table, head, body, $timeout, maxBodyHeight) {
        $table.html(body);
        $table.addClass('scroll-body-table');
        if ($table.parent().hasClass('scroll-body-table-wrapper')) {
            $table.parent().scrollTop(0);
        }
        else {
            var $headerTable = $table.clone();
            $headerTable.html(head);
            $headerTable.removeClass('scroll-body-table');
            $headerTable.addClass('scroll-header-table');
            $table.wrap('<div class="scroll-body-table-wrapper"></div>');
            var $bodyTableWrapper = $table.parent();
            $bodyTableWrapper.css('max-height', maxBodyHeight);
            $bodyTableWrapper.wrap('<div></div>');
            var $tableWrapper = $bodyTableWrapper.parent();
            $tableWrapper.addClass('table');
            $tableWrapper.addClass('table-bordered');
            var scrollBarWidth = $bodyTableWrapper.width() - $table.width();
            $headerTable.find('th:last-child').width(scrollBarWidth);
            $headerTable.insertBefore($bodyTableWrapper);
            $timeout(function () {
                $(window).resize(function () {
                    // Get the tbody columns width array
                    var colWidths = $table.find('tr:first-child td').map(function () {
                        return $(this).width();
                    }).get();
                    // Set the width of thead columns
                    $headerTable.find('th').each(function (i, th) {
                        $(th).width(colWidths[i]);
                    });
                    // Set the width of tbody columns
                    $table.find('tr').each(function (i, tr) {
                        $(tr).find('td').each(function (j, td) {
                            $(td).width(colWidths[j]);
                        });
                    });
                }).resize(); // Trigger resize handler
            });
        }
    }
})(DataTable || (DataTable = {}));
/**
 * Module that contains several helper functions related to hawtio's code editor
 *
 * @module CodeEditor
 * @main CodeEditor
 */
var CodeEditor;
(function (CodeEditor) {
    /**
     * @property GlobalCodeMirrorOptions
     * @for CodeEditor
     * @type CodeMirrorOptions
     */
    CodeEditor.GlobalCodeMirrorOptions = {
        theme: "default",
        tabSize: 4,
        lineNumbers: true,
        indentWithTabs: true,
        lineWrapping: true,
        autoCloseTags: true
    };
    /**
     * Tries to figure out what kind of text we're going to render in the editor, either
     * text, javascript or XML.
     *
     * @method detectTextFormat
     * @for CodeEditor
     * @static
     * @param value
     * @returns {string}
     */
    function detectTextFormat(value) {
        var answer = "text";
        if (value) {
            answer = "javascript";
            var trimmed = _.trim(value);
            if (trimmed && _.startsWith(trimmed, '<') && _.endsWith(trimmed, '>')) {
                answer = "xml";
            }
        }
        return answer;
    }
    CodeEditor.detectTextFormat = detectTextFormat;
    /**
     * Auto formats the CodeMirror editor content to pretty print
     *
     * @method autoFormatEditor
     * @for CodeEditor
     * @static
     * @param {CodeMirrorEditor} editor
     * @return {void}
     */
    function autoFormatEditor(editor) {
        if (editor) {
            var content = editor.getValue();
            var mode = editor.getOption('mode');
            switch (mode) {
                case 'xml':
                    content = window.html_beautify(content, { indent_size: 2 });
                    break;
                case 'javascript':
                    content = window.js_beautify(content, { indent_size: 2 });
                    break;
            }
            editor.setValue(content);
        }
    }
    CodeEditor.autoFormatEditor = autoFormatEditor;
    /**
     * Used to configures the default editor settings (per Editor Instance)
     *
     * @method createEditorSettings
     * @for CodeEditor
     * @static
     * @param {Object} options
     * @return {Object}
     */
    function createEditorSettings(options) {
        if (options === void 0) { options = {}; }
        options.extraKeys = options.extraKeys || {};
        // Handle Mode
        (function (mode) {
            mode = mode || { name: "text" };
            if (typeof mode !== "object") {
                mode = { name: mode };
            }
            var modeName = mode.name;
            if (modeName === "javascript") {
                angular.extend(mode, {
                    "json": true
                });
            }
        })(options.mode);
        // Handle Code folding folding
        (function (options) {
            var javascriptFolding = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);
            var xmlFolding = CodeMirror.newFoldFunction(CodeMirror.tagRangeFinder);
            // Mode logic inside foldFunction to allow for dynamic changing of the mode.
            // So don't have to listen to the options model and deal with re-attaching events etc...
            var foldFunction = function (codeMirror, line) {
                var mode = codeMirror.getOption("mode");
                var modeName = mode["name"];
                if (!mode || !modeName)
                    return;
                if (modeName === 'javascript') {
                    javascriptFolding(codeMirror, line);
                }
                else if (modeName === "xml" || _.startsWith(modeName, "html")) {
                    xmlFolding(codeMirror, line);
                }
                ;
            };
            options.onGutterClick = foldFunction;
            options.extraKeys = angular.extend(options.extraKeys, {
                "Ctrl-Q": function (codeMirror) {
                    foldFunction(codeMirror, codeMirror.getCursor().line);
                }
            });
        })(options);
        var readOnly = options.readOnly;
        if (!readOnly) {
            /*
             options.extraKeys = angular.extend(options.extraKeys, {
             "'>'": function (codeMirror) {
             codeMirror.closeTag(codeMirror, '>');
             },
             "'/'": function (codeMirror) {
             codeMirror.closeTag(codeMirror, '/');
             }
             });
             */
            options.matchBrackets = true;
        }
        // Merge the global config in to this instance of CodeMirror
        angular.extend(options, CodeEditor.GlobalCodeMirrorOptions);
        return options;
    }
    CodeEditor.createEditorSettings = createEditorSettings;
})(CodeEditor || (CodeEditor = {}));
var HawtioEditor;
(function (HawtioEditor) {
    HawtioEditor.pluginName = "hawtio-ui-editor";
    HawtioEditor.templatePath = "plugins/editor/html";
    HawtioEditor.log = Logger.get(HawtioEditor.pluginName);
})(HawtioEditor || (HawtioEditor = {}));
/// <reference path="editorGlobals.ts"/>
/// <reference path="CodeEditor.ts"/>
var HawtioEditor;
(function (HawtioEditor) {
    HawtioEditor._module = angular.module(HawtioEditor.pluginName, []);
    HawtioEditor._module.run(function () {
        HawtioEditor.log.debug("loaded");
    });
    hawtioPluginLoader.addModule(HawtioEditor.pluginName);
})(HawtioEditor || (HawtioEditor = {}));
/// <reference path="editorPlugin.ts"/>
/// <reference path="CodeEditor.ts"/>
/**
 * @module HawtioEditor
 */
var HawtioEditor;
(function (HawtioEditor) {
    HawtioEditor._module.directive('hawtioEditor', ["$parse", function ($parse) {
            return HawtioEditor.Editor($parse);
        }]);
    function Editor($parse) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: UrlHelpers.join(HawtioEditor.templatePath, "editor.html"),
            scope: {
                text: '=hawtioEditor',
                mode: '=',
                readOnly: '=?',
                outputEditor: '@',
                name: '@'
            },
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
                    $scope.codeMirror = null;
                    $scope.doc = null;
                    $scope.options = [];
                    UI.observe($scope, $attrs, 'name', 'editor');
                    $scope.applyOptions = function () {
                        if ($scope.codeMirror) {
                            _.forEach($scope.options, function (option) {
                                try {
                                    $scope.codeMirror.setOption(option.key, option.value);
                                }
                                catch (err) {
                                    // ignore
                                }
                            });
                        }
                    };
                    $scope.$watch(_.debounce(function () {
                        if ($scope.codeMirror) {
                            $scope.codeMirror.refresh();
                        }
                    }, 100, { trailing: true }));
                    $scope.$watch('codeMirror', function () {
                        if ($scope.codeMirror) {
                            $scope.doc = $scope.codeMirror.getDoc();
                            $scope.codeMirror.on('change', function (changeObj) {
                                $scope.text = $scope.doc.getValue();
                                $scope.dirty = !$scope.doc.isClean();
                                Core.$apply($scope);
                            });
                        }
                    });
                }],
            link: function ($scope, $element, $attrs) {
                if ('dirty' in $attrs) {
                    $scope.dirtyTarget = $attrs['dirty'];
                    $scope.$watch("$parent['" + $scope.dirtyTarget + "']", function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            $scope.dirty = newValue;
                        }
                    });
                }
                var config = _.cloneDeep($attrs);
                delete config['$$observers'];
                delete config['$$element'];
                delete config['$attr'];
                delete config['class'];
                delete config['hawtioEditor'];
                delete config['mode'];
                delete config['dirty'];
                delete config['outputEditor'];
                if ('onChange' in $attrs) {
                    var onChange = $attrs['onChange'];
                    delete config['onChange'];
                    $scope.options.push({
                        onChange: function (codeMirror) {
                            var func = $parse(onChange);
                            if (func) {
                                func($scope.$parent, { codeMirror: codeMirror });
                            }
                        }
                    });
                }
                angular.forEach(config, function (value, key) {
                    $scope.options.push({
                        key: key,
                        'value': value
                    });
                });
                $scope.$watch('mode', function () {
                    if ($scope.mode) {
                        if (!$scope.codeMirror) {
                            $scope.options.push({
                                key: 'mode',
                                'value': $scope.mode
                            });
                        }
                        else {
                            $scope.codeMirror.setOption('mode', $scope.mode);
                        }
                    }
                });
                $scope.$watch('readOnly', function (readOnly) {
                    var val = Core.parseBooleanValue(readOnly, false);
                    if ($scope.codeMirror) {
                        $scope.codeMirror.setOption('readOnly', val);
                    }
                    else {
                        $scope.options.push({
                            key: 'readOnly',
                            value: val
                        });
                    }
                });
                function getEventName(type) {
                    var name = $scope.name || 'default';
                    return "hawtioEditor_" + name + "_" + type;
                }
                $scope.$watch('dirty', function (dirty) {
                    if ('dirtyTarget' in $scope) {
                        $scope.$parent[$scope.dirtyTarget] = dirty;
                    }
                    $scope.$emit(getEventName('dirty'), dirty);
                });
                /*
                $scope.$watch(() => { return $element.is(':visible'); }, (newValue, oldValue) => {
                  if (newValue !== oldValue && $scope.codeMirror) {
                      $scope.codeMirror.refresh();
                  }
                });
                */
                $scope.$watch('text', function (text) {
                    if (!$scope.codeMirror) {
                        var options = {
                            value: text
                        };
                        options = CodeEditor.createEditorSettings(options);
                        $scope.codeMirror = CodeMirror.fromTextArea($element.find('textarea').get(0), options);
                        var outputEditor = $scope.outputEditor;
                        if (outputEditor) {
                            var outputScope = $scope.$parent || $scope;
                            Core.pathSet(outputScope, outputEditor, $scope.codeMirror);
                        }
                        $scope.applyOptions();
                        $scope.$emit(getEventName('instance'), $scope.codeMirror);
                    }
                    else if ($scope.doc) {
                        if (!$scope.codeMirror.hasFocus()) {
                            var text = $scope.text || "";
                            if (angular.isArray(text) || angular.isObject(text)) {
                                text = JSON.stringify(text, null, "  ");
                                $scope.mode = "javascript";
                                $scope.codeMirror.setOption("mode", "javascript");
                            }
                            $scope.doc.setValue(text);
                            $scope.doc.markClean();
                            $scope.dirty = false;
                        }
                    }
                });
            }
        };
    }
    HawtioEditor.Editor = Editor;
})(HawtioEditor || (HawtioEditor = {}));
var Toastr;
(function (Toastr) {
    var pluginName = 'hawtio-toastr';
    var _module = angular.module(pluginName, []);
    hawtioPluginLoader.addModule(pluginName);
})(Toastr || (Toastr = {}));
var Core;
(function (Core) {
    var visibleToastElem = null;
    var timeoutId;
    /**
     * Displays an alert message which is typically the result of some asynchronous operation
     *
     * @method notification
     * @static
     * @param type which is usually "success", "info", "warning", or "danger" (for error) and matches css alert-* css styles
     * @param message the text to display
     *
     */
    function notification(type, message) {
        var toastHtml = "\n      <div class=\"toast-pf alert alert-" + type + " alert-dismissable\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">\n          <span class=\"pficon pficon-close\"></span>\n        </button>\n        <span class=\"pficon pficon-" + resolveToastIcon(type) + "\"></span>\n        " + message + "\n      </div>\n    ";
        var toastFrag = document.createRange().createContextualFragment(toastHtml);
        var toastElem = toastFrag.querySelector('div');
        var bodyElem = document.querySelector('body');
        // if toast element is in the DOM
        if (visibleToastElem && visibleToastElem.parentNode) {
            clearTimeout(timeoutId);
            bodyElem.removeChild(visibleToastElem);
        }
        visibleToastElem = bodyElem.appendChild(toastElem);
        if (type === 'success' || type === 'info') {
            timeoutId = window.setTimeout(function () {
                if (toastElem.parentNode) {
                    bodyElem.removeChild(toastElem);
                }
            }, 8000);
        }
    }
    Core.notification = notification;
    function resolveToastIcon(type) {
        switch (type) {
            case 'success':
                return 'ok';
            case 'warning':
                return 'warning-triangle-o';
            case 'danger':
                return 'error-circle-o';
            default:
                return 'info';
        }
    }
    /**
     * Clears all the pending notifications
     * @method clearNotifications
     * @static
     */
    function clearNotifications() {
    }
    Core.clearNotifications = clearNotifications;
})(Core || (Core = {}));
var UI;
(function (UI) {
    UI.pluginName = 'hawtio-ui';
    UI.log = Logger.get(UI.pluginName);
    UI.templatePath = 'plugins/ui/html/';
})(UI || (UI = {}));
/// <reference path="uiHelpers.ts"/>
/**
 * Module that contains a bunch of re-usable directives to assemble into pages in hawtio
 *
 * @module UI
 * @main UI
 */
var UI;
(function (UI) {
    UI._module = angular.module(UI.pluginName, []);
    UI._module.factory('UI', function () {
        return UI;
    });
    UI._module.factory('marked', function () {
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: true,
            sanitize: false,
            smartLists: true,
            langPrefix: 'language-'
        });
        return marked;
    });
    UI._module.directive('compile', ['$compile', function ($compile) {
            return function (scope, element, attrs) {
                scope.$watch(function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs['compile']);
                }, function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);
                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                });
            };
        }]);
    /*
    UI._module.controller("CodeEditor.PreferencesController", ["$scope", "localStorage", "$templateCache", ($scope, localStorage, $templateCache) => {
      $scope.exampleText = $templateCache.get("exampleText");
      $scope.codeMirrorEx = $templateCache.get("codeMirrorExTemplate");
      $scope.javascript = "javascript";
  
      $scope.preferences = CodeEditor.GlobalCodeMirrorOptions;
  
      // If any of the preferences change, make sure to save them automatically
      $scope.$watch("preferences", function(newValue, oldValue) {
        if (newValue !== oldValue) {
          // such a cheap and easy way to update the example view :-)
          $scope.codeMirrorEx += " ";
          localStorage['CodeMirrorOptions'] = angular.toJson(angular.extend(CodeEditor.GlobalCodeMirrorOptions, $scope.preferences));
        }
      }, true);
  
    }]);
    */
    UI._module.run([function () {
            UI.log.debug("loaded");
            /*
            var opts = localStorage['CodeMirrorOptions'];
            if (opts) {
              opts = angular.fromJson(opts);
              CodeEditor.GlobalCodeMirrorOptions = angular.extend(CodeEditor.GlobalCodeMirrorOptions, opts);
            }
            */
        }]);
    hawtioPluginLoader.addModule(UI.pluginName);
})(UI || (UI = {}));
/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    UI._module.directive('hawtioAutoDropdown', ['$timeout', function ($timeout) { return ({
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                function locateElements(event) {
                    var el = $element.get(0);
                    if (event && event.relatedNode !== el && event.type) {
                        if (event && event.type !== 'resize') {
                            return;
                        }
                    }
                    var overflowEl = $($element.find('.dropdown.overflow'));
                    var overflowMenu = $(overflowEl.find('ul.dropdown-menu'));
                    var margin = 0;
                    var availableWidth = 0;
                    try {
                        overflowEl.addClass('pull-right');
                        margin = overflowEl.outerWidth() - overflowEl.innerWidth();
                        availableWidth = overflowEl.position().left - $element.position().left - 50;
                        overflowEl.removeClass('pull-right');
                    }
                    catch (e) {
                        UI.log.debug("caught " + e);
                    }
                    overflowMenu.children().insertBefore(overflowEl);
                    var overflowItems = [];
                    $element.children(':not(.overflow):not(:hidden)').each(function () {
                        var self = $(this);
                        availableWidth = availableWidth - self.outerWidth(true);
                        if (availableWidth < 0) {
                            overflowItems.push(self);
                        }
                    });
                    for (var i = overflowItems.length - 1; i > -1; i--) {
                        overflowItems[i].prependTo(overflowMenu);
                    }
                    if (overflowMenu.children().length > 0) {
                        overflowEl.css('visibility', 'visible');
                    }
                    if (availableWidth > 130) {
                        var noSpace = false;
                        overflowMenu.children(':not(.overflow)').filter(function () {
                            return $(this).css('display') !== 'none';
                        }).each(function () {
                            if (noSpace) {
                                return;
                            }
                            var self = $(this);
                            if (availableWidth > self.outerWidth()) {
                                availableWidth = availableWidth - self.outerWidth();
                                self.insertBefore(overflowEl);
                            }
                            else {
                                noSpace = true;
                            }
                        });
                    }
                    if (overflowMenu.children().length === 0) {
                        overflowEl.css('visibility', 'hidden');
                    }
                }
                $(window).resize(_.throttle(locateElements, 100));
                $scope.$on('$routeChangeSuccess', function () { return $timeout(locateElements, 0, false); });
                $timeout(locateElements, 0, false);
            }
        }); }]);
})(UI || (UI = {}));
/// <reference path="uiPlugin.ts"/>
var UI;
(function (UI) {
    // simple directive that adds the patternfly card BG color to the content area of a hawtio app
    UI._module.directive('hawtioCardBg', ['$timeout', function ($timeout) {
            return {
                restrict: 'AC',
                link: function (scope, element, attr) {
                    $timeout(function () {
                        var parent = $('body');
                        //console.log("Parent: ", parent);
                        parent.addClass('cards-pf');
                        element.on('$destroy', function () {
                            parent.removeClass('cards-pf');
                        });
                    }, 10);
                }
            };
        }]);
})(UI || (UI = {}));
/// <reference path="uiPlugin.ts"/>
var UI;
(function (UI) {
    clipboardDirective.$inject = ["$timeout"];
    function clipboardDirective($timeout) {
        'ngInject';
        return {
            restrict: 'A',
            scope: {
                hawtioClipboard: '@'
            },
            link: function ($scope, $element, $attrs) {
                var copied = false;
                $element.attr('data-clipboard-target', $scope.hawtioClipboard);
                $element.tooltip({ placement: 'bottom', title: 'Copy to clipboard' });
                new Clipboard($element.get(0)).on('success', function () {
                    $element.tooltip('destroy');
                    $timeout(function () {
                        $element.tooltip({ placement: 'bottom', title: 'Copied!' });
                        $element.tooltip('show');
                        copied = true;
                    }, 200);
                });
                $element.on('mouseleave', function () {
                    if (copied) {
                        $element.tooltip('destroy');
                        $timeout(function () {
                            $element.tooltip({ placement: 'bottom', title: 'Copy to clipboard' });
                            copied = false;
                        }, 200);
                    }
                });
            }
        };
    }
    UI._module.directive('hawtioClipboard', clipboardDirective);
})(UI || (UI = {}));
/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    var log = Logger.get("hawtio-ui-confirm-dialog");
    UI._module.directive('hawtioConfirmDialog', function () {
        return new UI.ConfirmDialog();
    });
    /**
     * Directive that opens a simple standard confirmation dialog.  See ConfigDialogConfig
     * for configuration properties
     *
     * @class ConfirmDialog
     */
    var ConfirmDialog = (function () {
        function ConfirmDialog() {
            this.restrict = 'A';
            this.replace = true;
            this.transclude = true;
            this.templateUrl = UI.templatePath + 'confirmDialog.html';
            /**
             * @property scope
             * @type ConfirmDialogConfig
             */
            this.scope = {
                show: '=hawtioConfirmDialog',
                title: '@',
                okButtonText: '@',
                showOkButton: '@',
                cancelButtonText: '@',
                onCancel: '&?',
                onOk: '&?',
                onClose: '&?',
                size: '@',
                optionalSize: '@' // deprecated
            };
            this.controller = ["$scope", "$element", "$attrs", "$transclude", "$compile", function ($scope, $element, $attrs, $transclude, $compile) {
                    $scope.clone = null;
                    // Set optional size modifier class
                    $scope.size = $scope.size || $scope.optionalSize;
                    if ($scope.size === 'sm' || $scope.size === 'lg') {
                        $scope.sizeClass = 'modal-' + $scope.size;
                    }
                    $transclude(function (clone) {
                        $scope.clone = $(clone).filter('.dialog-body');
                    });
                    $scope.$watch('show', function () {
                        if ($scope.show) {
                            setTimeout(function () {
                                $scope.body = $('.modal-body');
                                $scope.body.html($compile($scope.clone.html())($scope.$parent));
                                Core.$apply($scope);
                            }, 50);
                        }
                    });
                    $attrs.$observe('okButtonText', function (value) {
                        if (!angular.isDefined(value)) {
                            $scope.okButtonText = "OK";
                        }
                    });
                    $attrs.$observe('cancelButtonText', function (value) {
                        if (!angular.isDefined(value)) {
                            $scope.cancelButtonText = "Cancel";
                        }
                    });
                    $attrs.$observe('title', function (value) {
                        if (!angular.isDefined(value)) {
                            $scope.title = "Are you sure?";
                        }
                    });
                    function checkClosed() {
                        setTimeout(function () {
                            // lets make sure we don't have a modal-backdrop hanging around!
                            var backdrop = $("div.modal-backdrop");
                            if (backdrop && backdrop.length) {
                                log.debug("Removing the backdrop div!", backdrop);
                                backdrop.remove();
                            }
                        }, 200);
                    }
                    $scope.cancel = function () {
                        $scope.show = false;
                        $scope.$parent.$eval($scope.onCancel);
                        checkClosed();
                    };
                    $scope.submit = function () {
                        $scope.show = false;
                        $scope.$parent.$eval($scope.onOk);
                        checkClosed();
                    };
                    $scope.close = function () {
                        $scope.$parent.$eval($scope.onClose);
                        checkClosed();
                    };
                }];
        }
        return ConfirmDialog;
    }());
    UI.ConfirmDialog = ConfirmDialog;
})(UI || (UI = {}));
/// <reference path="uiPlugin.ts"/>
/**
 * @module UI
 */
var UI;
(function (UI) {
    UI._module.controller("UI.DeveloperPageController", ["$scope", "$http", function ($scope, $http) {
            $scope.getContents = function (filename, cb) {
                var fullUrl = UrlHelpers.join(UI.templatePath, "test", filename);
                $http({ method: 'GET', url: fullUrl })
                    .success(function (data, status, headers, config) {
                    cb(data);
                })
                    .error(function (data, status, headers, config) {
                    cb("Failed to fetch " + filename + ": " + data);
                });
            };
        }]);
})(UI || (UI = {}));
/// <reference path="uiHelpers.ts"/>
/**
 * @module UI
 */
var UI;
(function (UI) {
    /**
     * Simple helper class for creating <a href="http://angular-ui.github.io/bootstrap/#/modal">angular ui bootstrap modal dialogs</a>
     * @class Dialog
     */
    var Dialog = (function () {
        function Dialog() {
            this.show = false;
            this.options = {
                backdropFade: true,
                dialogFade: true
            };
        }
        /**
         * Opens the dialog
         * @method open
         */
        Dialog.prototype.open = function () {
            this.show = true;
        };
        /**
         * Closes the dialog
         * @method close
         */
        Dialog.prototype.close = function () {
            this.show = false;
            // lets make sure and remove any backgroup fades
            this.removeBackdropFadeDiv();
            setTimeout(this.removeBackdropFadeDiv, 100);
        };
        Dialog.prototype.removeBackdropFadeDiv = function () {
            $("div.modal-backdrop").remove();
        };
        return Dialog;
    }());
    UI.Dialog = Dialog;
    function multiItemConfirmActionDialog(options) {
        var $dialog = HawtioCore.injector.get("$dialog");
        return $dialog.dialog({
            resolve: {
                options: function () { return options; }
            },
            templateUrl: UrlHelpers.join(UI.templatePath, 'multiItemConfirmActionDialog.html'),
            controller: ["$scope", "dialog", "options", function ($scope, dialog, options) {
                    $scope.options = options;
                    $scope.close = function (result) {
                        dialog.close();
                        options.onClose(result);
                    };
                    $scope.getName = function (item) {
                        return Core.pathGet(item, options.index.split('.'));
                    };
                }]
        });
    }
    UI.multiItemConfirmActionDialog = multiItemConfirmActionDialog;
})(UI || (UI = {}));
///<reference path="uiPlugin.ts"/>
var UI;
(function (UI) {
    UI.hawtioDrag = UI._module.directive("hawtioDrag", [function () {
            return {
                replace: false,
                transclude: true,
                restrict: 'A',
                template: '<span ng-transclude></span>',
                scope: {
                    data: '=hawtioDrag'
                },
                link: function (scope, element, attrs) {
                    element.attr({
                        draggable: 'true'
                    });
                    //log.debug("hawtioDrag, data: ", scope.data);
                    var el = element[0];
                    el.draggable = true;
                    el.addEventListener('dragstart', function (event) {
                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setData('data', scope.data);
                        element.addClass('drag-started');
                        return false;
                    }, false);
                    el.addEventListener('dragend', function (event) {
                        element.removeClass('drag-started');
                    }, false);
                }
            };
        }]);
    UI.hawtioDrop = UI._module.directive("hawtioDrop", [function () {
            return {
                replace: false,
                transclude: true,
                restrict: 'A',
                template: '<span ng-transclude></span>',
                scope: {
                    onDrop: '&?hawtioDrop',
                    ngModel: '=',
                    property: '@',
                    prefix: '@'
                },
                link: function (scope, element, attrs) {
                    //log.debug("hawtioDrop, onDrop: ", scope.onDrop);
                    //log.debug("hawtioDrop, ngModel: ", scope.ngModel);
                    //log.debug("hawtioDrop, property: ", scope.property);
                    var dragEnter = function (event) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                        element.addClass('drag-over');
                        return false;
                    };
                    var el = element[0];
                    el.addEventListener('dragenter', dragEnter, false);
                    el.addEventListener('dragover', dragEnter, false);
                    el.addEventListener('dragleave', function (event) {
                        element.removeClass('drag-over');
                        return false;
                    }, false);
                    el.addEventListener('drop', function (event) {
                        if (event.stopPropagation) {
                            event.stopPropagation();
                        }
                        element.removeClass('drag-over');
                        var data = event.dataTransfer.getData('data');
                        if (scope.onDrop) {
                            scope.$eval(scope.onDrop, {
                                data: data,
                                model: scope.ngModel,
                                property: scope.property
                            });
                        }
                        var eventName = 'hawtio-drop';
                        if (!Core.isBlank(scope.prefix)) {
                            eventName = scope.prefix + '-' + eventName;
                        }
                        // let's emit this too so parent scopes can watch for the data
                        scope.$emit(eventName, {
                            data: data,
                            model: scope.ngModel,
                            property: scope.property
                        });
                        Core.$apply(scope);
                        return false;
                    }, false);
                }
            };
        }]);
})(UI || (UI = {}));
/// <reference path="uiPlugin.ts"/>
/**
 * @module UI
 */
var UI;
(function (UI) {
    UI._module.directive('editableProperty', ["$parse", function ($parse) {
            return new UI.EditableProperty($parse);
        }]);
    var EditableProperty = (function () {
        function EditableProperty($parse) {
            this.$parse = $parse;
            this.restrict = 'E';
            this.scope = true;
            this.templateUrl = UI.templatePath + 'editableProperty.html';
            this.require = 'ngModel';
            this.link = null;
            this.link = function (scope, element, attrs, ngModel) {
                scope.inputType = attrs['type'] || 'text';
                scope.min = attrs['min'];
                scope.max = attrs['max'];
                scope.getText = function () {
                    if (!scope.text) {
                        return '';
                    }
                    if (scope.inputType === 'password') {
                        return StringHelpers.obfusicate(scope.text);
                    }
                    else {
                        return scope.text;
                    }
                };
                scope.editing = false;
                $(element.find(".fa fa-pencil")[0]).hide();
                scope.getPropertyName = function () {
                    var propertyName = $parse(attrs['property'])(scope);
                    if (!propertyName && propertyName !== 0) {
                        propertyName = attrs['property'];
                    }
                    return propertyName;
                };
                ngModel.$render = function () {
                    if (!ngModel.$viewValue) {
                        return;
                    }
                    scope.text = ngModel.$viewValue[scope.getPropertyName()];
                };
                scope.getInputStyle = function () {
                    if (!scope.text) {
                        return {};
                    }
                    var calculatedWidth = (scope.text + "").length / 1.2;
                    if (calculatedWidth < 5) {
                        calculatedWidth = 5;
                    }
                    return {
                        width: calculatedWidth + 'em'
                    };
                };
                scope.showEdit = function () {
                    $(element.find(".fa fa-pencil")[0]).show();
                };
                scope.hideEdit = function () {
                    $(element.find(".fa fa-pencil")[0]).hide();
                };
                function inputSelector() {
                    return 'input[type=' + scope.inputType + ']';
                }
                scope.$watch('editing', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (newValue) {
                            setTimeout(function () {
                                $(element.find(inputSelector())).focus().select();
                            }, 50);
                        }
                    }
                });
                scope.doEdit = function () {
                    scope.editing = true;
                };
                scope.stopEdit = function () {
                    $(element.find(inputSelector())[0]).val(ngModel.$viewValue[scope.getPropertyName()]);
                    scope.editing = false;
                };
                scope.saveEdit = function () {
                    var value = $(element.find(inputSelector())[0]).val();
                    var obj = ngModel.$viewValue;
                    obj[scope.getPropertyName()] = value;
                    ngModel.$setViewValue(obj);
                    ngModel.$render();
                    scope.editing = false;
                    scope.$parent.$eval(attrs['onSave']);
                };
            };
        }
        return EditableProperty;
    }());
    UI.EditableProperty = EditableProperty;
})(UI || (UI = {}));
/// <reference path="uiPlugin.ts"/>
var UI;
(function (UI) {
    var hawtioFileDrop = UI._module.directive("hawtioFileDrop", [function () {
            return {
                restrict: 'A',
                replace: false,
                link: function (scope, element, attr) {
                    var fileName = attr['hawtioFileDrop'];
                    var downloadURL = attr['downloadUrl'];
                    var mimeType = attr['mimeType'] || 'application/octet-stream';
                    if (Core.isBlank(fileName) || Core.isBlank(downloadURL)) {
                        return;
                    }
                    // DownloadURL needs an absolute URL
                    if (!_.startsWith(downloadURL, "http")) {
                        var uri = new URI();
                        downloadURL = uri.path(downloadURL).toString();
                    }
                    var fileDetails = mimeType + ":" + fileName + ":" + downloadURL;
                    element.attr({
                        draggable: true
                    });
                    element[0].addEventListener("dragstart", function (event) {
                        if (event.dataTransfer) {
                            UI.log.debug("Drag started, event: ", event, "File details: ", fileDetails);
                            event.dataTransfer.setData("DownloadURL", fileDetails);
                        }
                        else {
                            UI.log.debug("Drag event object doesn't contain data transfer: ", event);
                        }
                    });
                    attr.$observe('downloadUrl', function (url) {
                        fileDetails = mimeType + ":" + fileName + ":" + url;
                    });
                }
            };
        }]);
})(UI || (UI = {}));
/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    UI.hawtioFilter = UI._module.directive("hawtioFilter", [function () {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                templateUrl: UI.templatePath + 'filter.html',
                scope: {
                    placeholder: '@',
                    cssClass: '@',
                    saveAs: '@?',
                    ngModel: '='
                },
                controller: ["$scope", "localStorage", "$location", "$element", function ($scope, localStorage, $location, $element) {
                        $scope.getClass = function () {
                            var answer = [];
                            if (!Core.isBlank($scope.cssClass)) {
                                answer.push($scope.cssClass);
                            }
                            if (!Core.isBlank($scope.ngModel)) {
                                answer.push("has-text");
                            }
                            return answer.join(' ');
                        };
                        // sync with local storage and the location bar, maybe could refactor this into a helper function
                        if (!Core.isBlank($scope.saveAs)) {
                            if ($scope.saveAs in localStorage) {
                                var val = localStorage[$scope.saveAs];
                                if (!Core.isBlank(val)) {
                                    $scope.ngModel = val;
                                }
                                else {
                                    $scope.ngModel = '';
                                }
                            }
                            else {
                                $scope.ngModel = '';
                            }
                            /*
                             // input loses focus when we muck with the search, at least on firefox
                            var search = $location.search();
                            if ($scope.saveAs in search) {
                              $scope.ngModel = search[$scope.saveAs];
                            }
                            */
                            var updateFunc = function () {
                                localStorage[$scope.saveAs] = $scope.ngModel;
                                // input loses focus when we do this
                                //$location.search($scope.saveAs, $scope.ngModel);
                            };
                            $scope.$watch('ngModel', updateFunc);
                        }
                    }]
            };
        }]);
})(UI || (UI = {}));
/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    UI._module.directive('gridster', function () {
        return new UI.GridsterDirective();
    });
    var GridsterDirective = (function () {
        function GridsterDirective() {
            this.restrict = 'A';
            this.replace = true;
            this.controller = ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
                }];
            this.link = function ($scope, $element, $attrs) {
                var widgetMargins = [6, 6];
                var widgetBaseDimensions = [150, 150];
                var gridSize = [150, 150];
                var extraRows = 10;
                var extraCols = 6;
                if (angular.isDefined($attrs['extraRows'])) {
                    extraRows = $attrs['extraRows'].toNumber();
                }
                if (angular.isDefined($attrs['extraCols'])) {
                    extraCols = $attrs['extraCols'].toNumber();
                }
                var grid = $('<ul style="margin: 0"></ul>');
                var styleStr = '<style type="text/css">';
                var styleStr = styleStr + '</style>';
                $element.append($(styleStr));
                $element.append(grid);
                $scope.gridster = grid.gridster({
                    widget_margins: widgetMargins,
                    grid_size: gridSize,
                    extra_rows: extraRows,
                    extra_cols: extraCols
                }).data('gridster');
            };
        }
        return GridsterDirective;
    }());
    UI.GridsterDirective = GridsterDirective;
})(UI || (UI = {}));
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    function groupBy() {
        return function (list, group) {
            if (!list || list.length === 0) {
                return list;
            }
            if (Core.isBlank(group)) {
                return list;
            }
            var newGroup = 'newGroup';
            var endGroup = 'endGroup';
            var currentGroup = undefined;
            function createNewGroup(list, item, index) {
                item[newGroup] = true;
                item[endGroup] = false;
                currentGroup = item[group];
                if (index > 0) {
                    list[index - 1][endGroup] = true;
                }
            }
            function addItemToExistingGroup(item) {
                item[newGroup] = false;
                item[endGroup] = false;
            }
            list.forEach(function (item, index) {
                var createGroup = item[group] !== currentGroup;
                if (angular.isArray(item[group])) {
                    if (currentGroup === undefined) {
                        createGroup = true;
                    }
                    else {
                        var targetGroup = item[group];
                        if (targetGroup.length !== currentGroup.length) {
                            createGroup = true;
                        }
                        else {
                            createGroup = false;
                            targetGroup.forEach(function (item) {
                                if (!createGroup && !_.some(currentGroup, function (i) { return i === item; })) {
                                    createGroup = true;
                                }
                            });
                        }
                    }
                }
                if (createGroup) {
                    createNewGroup(list, item, index);
                }
                else {
                    addItemToExistingGroup(item);
                }
            });
            return list;
        };
    }
    UI.groupBy = groupBy;
    UI._module.filter('hawtioGroupBy', UI.groupBy);
})(UI || (UI = {}));
var UI;
(function (UI) {
    UI._module.directive('httpSrc', ['$http', function ($http) {
            return {
                // do not share scope with sibling img tags and parent
                // (prevent show same images on img tag)
                scope: {
                    httpSrcChanged: '='
                },
                link: function ($scope, elem, attrs) {
                    function revokeObjectURL() {
                        if ($scope.objectURL) {
                            URL.revokeObjectURL($scope.objectURL);
                        }
                    }
                    $scope.$watch('objectURL', function (objectURL, oldURL) {
                        if (objectURL !== oldURL) {
                            elem.attr('src', objectURL);
                            if (typeof $scope.httpSrcChanged !== 'undefined') {
                                $scope.httpSrcChanged = objectURL;
                            }
                        }
                    });
                    $scope.$on('$destroy', revokeObjectURL);
                    attrs.$observe('httpSrc', function (url) {
                        revokeObjectURL();
                        if (url && url.indexOf('data:') === 0) {
                            $scope.objectURL = url;
                        }
                        else if (url) {
                            $http.get(url, { responseType: 'arraybuffer' })
                                .then(function (response) {
                                var blob = new Blob([response.data], { type: attrs['mediaType'] ? attrs['mediaType'] : 'application/octet-stream' });
                                $scope.objectURL = URL.createObjectURL(blob);
                            });
                        }
                    });
                }
            };
        }]);
})(UI || (UI = {}));
/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    function hawtioList($templateCache, $compile) {
        return {
            restrict: '',
            replace: true,
            templateUrl: UI.templatePath + 'list.html',
            scope: {
                'config': '=hawtioList'
            },
            link: function ($scope, $element, $attr) {
                $scope.rows = [];
                $scope.name = "hawtioListScope";
                if (!$scope.config.selectedItems) {
                    $scope.config.selectedItems = [];
                }
                $scope.$watch('rows', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $scope.config.selectedItems.length = 0;
                        var selected = _.filter($scope.rows, function (row) { return row.selected; });
                        selected.forEach(function (row) {
                            $scope.config.selectedItems.push(row.entity);
                        });
                    }
                }, true);
                $scope.cellTemplate = $templateCache.get('cellTemplate.html');
                $scope.rowTemplate = $templateCache.get('rowTemplate.html');
                var columnDefs = $scope.config['columnDefs'];
                var fieldName = 'name';
                var displayName = 'Name';
                if (columnDefs && columnDefs.length > 0) {
                    var def = _.first(columnDefs);
                    fieldName = def['field'] || fieldName;
                    displayName = def['displayName'] || displayName;
                    if (def['cellTemplate']) {
                        $scope.cellTemplate = def['cellTemplate'];
                    }
                }
                var configName = $attr['hawtioList'];
                var dataName = $scope.config['data'];
                if (Core.isBlank(configName) || Core.isBlank(dataName)) {
                    return;
                }
                $scope.listRoot = function () {
                    return $element.find('.hawtio-list-root');
                };
                $scope.getContents = function (row) {
                    //first make our row
                    var innerScope = $scope.$new();
                    innerScope.row = row;
                    var rowEl = $compile($scope.rowTemplate)(innerScope);
                    //now compile the cell but use the parent scope
                    var innerParentScope = $scope.parentScope.$new();
                    innerParentScope.row = row;
                    innerParentScope.col = {
                        field: fieldName
                    };
                    var cellEl = $compile($scope.cellTemplate)(innerParentScope);
                    $(rowEl).find('.hawtio-list-row-contents').append(cellEl);
                    return rowEl;
                };
                $scope.setRows = function (data) {
                    $scope.rows = [];
                    var list = $scope.listRoot();
                    list.empty();
                    if (data) {
                        data.forEach(function (row) {
                            var newRow = {
                                entity: row,
                                getProperty: function (name) {
                                    if (!angular.isDefined(name)) {
                                        return null;
                                    }
                                    return row[name];
                                }
                            };
                            list.append($scope.getContents(newRow));
                            $scope.rows.push(newRow);
                        });
                    }
                };
                // find the parent scope that has our configuration
                var parentScope = UI.findParentWith($scope, configName);
                if (parentScope) {
                    $scope.parentScope = parentScope;
                    parentScope.$watch(dataName, $scope.setRows, true);
                }
            }
        };
    }
    UI.hawtioList = hawtioList;
    UI._module.directive('hawtioList', ["$templateCache", "$compile", UI.hawtioList]);
})(UI || (UI = {}));
/// <reference path="uiPlugin.ts"/>
var UI;
(function (UI) {
    var objectView = UI._module.directive("hawtioObject", ["$templateCache", "$interpolate", "$compile", function ($templateCache, $interpolate, $compile) {
            return {
                restrict: "A",
                replace: true,
                templateUrl: UI.templatePath + "object.html",
                scope: {
                    "entity": "=?hawtioObject",
                    "config": "=?",
                    "path": "=?",
                    "row": "=?"
                },
                link: function ($scope, $element, $attr) {
                    function interpolate(template, path, key, value) {
                        var interpolateFunc = $interpolate(template);
                        if (!key) {
                            return interpolateFunc({
                                data: value,
                                path: path
                            });
                        }
                        else {
                            return interpolateFunc({
                                key: _.startCase(key),
                                data: value,
                                path: path
                            });
                        }
                    }
                    function getEntityConfig(path, config) {
                        var answer = undefined;
                        var properties = Core.pathGet(config, ['properties']);
                        if (!answer && properties) {
                            angular.forEach(properties, function (config, propertySelector) {
                                var regex = new RegExp(propertySelector);
                                if (regex.test(path)) {
                                    // log.debug("Matched selector: ", propertySelector, " for path: ", path);
                                    if (answer && !answer.override && !config.override) {
                                        // log.debug("Merged config");
                                        answer = _.merge(answer, config);
                                    }
                                    else {
                                        // log.debug("Set config");
                                        answer = _.cloneDeep(config);
                                    }
                                }
                            });
                        }
                        // log.debug("Answer for path: ", path, " : ", answer);
                        return answer;
                    }
                    function getTemplate(path, config, def) {
                        var answer = def;
                        var config = getEntityConfig(path, config);
                        if (config && config.template) {
                            answer = config.template;
                        }
                        return answer;
                    }
                    function compile(template, path, key, value, config) {
                        var config = getEntityConfig(path, config);
                        if (config && config.hidden) {
                            return;
                        }
                        var interpolated = null;
                        // avoid interpolating custom templates
                        if (config && config.template) {
                            interpolated = config.template;
                        }
                        else {
                            interpolated = interpolate(template, path, key, value);
                        }
                        var scope = $scope.$new();
                        scope.row = $scope.row;
                        scope.entityConfig = config;
                        scope.data = value;
                        scope.path = path;
                        return $compile(interpolated)(scope);
                    }
                    function renderPrimitiveValue(path, entity, config) {
                        var template = getTemplate(path, config, $templateCache.get('primitiveValueTemplate.html'));
                        return compile(template, path, undefined, entity, config);
                    }
                    function renderDateValue(path, entity, config) {
                        var template = getTemplate(path, config, $templateCache.get('dateValueTemplate.html'));
                        return compile(template, path, undefined, entity, config);
                    }
                    function renderObjectValue(path, entity, config) {
                        var isArray = false;
                        var el = undefined;
                        angular.forEach(entity, function (value, key) {
                            if (angular.isNumber(key) && "length" in entity) {
                                isArray = true;
                            }
                            if (isArray) {
                                return;
                            }
                            if (_.startsWith(key, "$")) {
                                return;
                            }
                            if (!el) {
                                el = angular.element('<span></span>');
                            }
                            if (angular.isArray(value)) {
                                el.append(renderArrayAttribute(path + '/' + key, key, value, config));
                            }
                            else if (angular.isObject(value)) {
                                if (_.size(value) === 0) {
                                    el.append(renderPrimitiveAttribute(path + '/' + key, key, 'empty', config));
                                }
                                else {
                                    el.append(renderObjectAttribute(path + '/' + key, key, value, config));
                                }
                            }
                            else if (StringHelpers.isDate(value)) {
                                el.append(renderDateAttribute(path + '/' + key, key, new Date(value), config));
                            }
                            else {
                                el.append(renderPrimitiveAttribute(path + '/' + key, key, value, config));
                            }
                        });
                        if (el) {
                            return el.children();
                        }
                        else {
                            return el;
                        }
                    }
                    function getColumnHeaders(path, entity, config) {
                        var answer = undefined;
                        if (!entity) {
                            return answer;
                        }
                        var hasPrimitive = false;
                        entity.forEach(function (item) {
                            if (!hasPrimitive && angular.isObject(item)) {
                                if (!answer) {
                                    answer = [];
                                }
                                var keys = _.keys(item);
                                var notFunctions = _.filter(keys, function (key) { return !angular.isFunction(item[key]); });
                                var notHidden = _.filter(notFunctions, function (key) {
                                    var conf = getEntityConfig(path + '/' + key, config);
                                    if (conf && conf.hidden) {
                                        return false;
                                    }
                                    return true;
                                });
                                return _.union(answer, notHidden);
                            }
                            else {
                                answer = undefined;
                                hasPrimitive = true;
                            }
                        });
                        if (answer) {
                            answer = _.reject(answer, function (item) { return _.startsWith("" + item, '$'); });
                        }
                        //log.debug("Column headers: ", answer);
                        return answer;
                    }
                    function renderTable(template, path, key, value, headers, config) {
                        var el = angular.element(interpolate(template, path, key, value));
                        var thead = el.find('thead');
                        var tbody = el.find('tbody');
                        var headerTemplate = $templateCache.get('headerTemplate.html');
                        var cellTemplate = $templateCache.get('cellTemplate.html');
                        var rowTemplate = $templateCache.get('rowTemplate.html');
                        var headerRow = angular.element(interpolate(rowTemplate, path, undefined, undefined));
                        headers.forEach(function (header) {
                            headerRow.append(interpolate(headerTemplate, path + '/' + header, header, undefined));
                        });
                        thead.append(headerRow);
                        value.forEach(function (item, index) {
                            var tr = angular.element(interpolate(rowTemplate, path + '/' + index, undefined, undefined));
                            headers.forEach(function (header) {
                                var td = angular.element(interpolate(cellTemplate, path + '/' + index + '/' + header, undefined, undefined));
                                td.append(renderThing(path + '/' + index + '/' + header, item[header], config));
                                tr.append(td);
                            });
                            tbody.append(tr);
                        });
                        return el;
                    }
                    function renderArrayValue(path, entity, config) {
                        var headers = getColumnHeaders(path, entity, config);
                        if (!headers) {
                            var template = getTemplate(path, config, $templateCache.get('arrayValueListTemplate.html'));
                            return compile(template, path, undefined, entity, config);
                        }
                        else {
                            var template = getTemplate(path, config, $templateCache.get('arrayValueTableTemplate.html'));
                            return renderTable(template, path, undefined, entity, headers, config);
                        }
                    }
                    function renderPrimitiveAttribute(path, key, value, config) {
                        var template = getTemplate(path, config, $templateCache.get('primitiveAttributeTemplate.html'));
                        return compile(template, path, key, value, config);
                    }
                    function renderDateAttribute(path, key, value, config) {
                        var template = getTemplate(path, config, $templateCache.get('dateAttributeTemplate.html'));
                        return compile(template, path, key, value, config);
                    }
                    function renderObjectAttribute(path, key, value, config) {
                        var template = getTemplate(path, config, $templateCache.get('objectAttributeTemplate.html'));
                        return compile(template, path, key, value, config);
                    }
                    function renderArrayAttribute(path, key, value, config) {
                        var headers = getColumnHeaders(path, value, config);
                        if (!headers) {
                            var template = getTemplate(path, config, $templateCache.get('arrayAttributeListTemplate.html'));
                            return compile(template, path, key, value, config);
                        }
                        else {
                            var template = getTemplate(path, config, $templateCache.get('arrayAttributeTableTemplate.html'));
                            return renderTable(template, path, key, value, headers, config);
                        }
                    }
                    function renderThing(path, entity, config) {
                        if (angular.isArray(entity)) {
                            return renderArrayValue(path, entity, config);
                        }
                        else if (angular.isObject(entity)) {
                            return renderObjectValue(path, entity, config);
                        }
                        else if (StringHelpers.isDate(entity)) {
                            return renderDateValue(path, Date.create(entity), config);
                        }
                        else {
                            return renderPrimitiveValue(path, entity, config);
                        }
                    }
                    $scope.$watch('entity', function (entity) {
                        if (!entity) {
                            $element.empty();
                            return;
                        }
                        if (!$scope.path) {
                            // log.debug("Setting entity: ", $scope.entity, " as the root element");
                            $scope.path = "";
                        }
                        /*
                        if (angular.isDefined($scope.$index)) {
                          log.debug("$scope.$index: ", $scope.$index);
                        }
                        */
                        if (!angular.isDefined($scope.row)) {
                            // log.debug("Setting entity: ", entity);
                            $scope.row = {
                                entity: entity
                            };
                        }
                        $element.html(renderThing($scope.path, entity, $scope.config));
                    }, true);
                }
            };
        }]);
})(UI || (UI = {}));
/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    function hawtioPane() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: UI.templatePath + 'pane.html',
            scope: {
                position: '@',
                width: '@',
                header: '@'
            },
            controller: ["$scope", "$element", "$attrs", "$transclude", "$document", "$timeout", "$compile", "$templateCache", "$window", function ($scope, $element, $attrs, $transclude, $document, $timeout, $compile, $templateCache, $window) {
                    $scope.moving = false;
                    $transclude(function (clone) {
                        $element.find(".pane-content").append(clone);
                        if (Core.isBlank($scope.header)) {
                            return;
                        }
                        var headerTemplate = $templateCache.get($scope.header);
                        var wrapper = $element.find(".pane-header-wrapper");
                        wrapper.html($compile(headerTemplate)($scope));
                        $timeout(function () {
                            $element.find(".pane-viewport").css("top", wrapper.height());
                        }, 500);
                    });
                    $scope.setViewportTop = function () {
                        var wrapper = $element.find(".pane-header-wrapper");
                        $timeout(function () {
                            $element.find(".pane-viewport").css("top", wrapper.height());
                        }, 10);
                    };
                    $scope.setWidth = function (width) {
                        if (width < 6) {
                            return;
                        }
                        $element.width(width);
                        $element.parent().css($scope.padding, $element.width() + "px");
                        $scope.setViewportTop();
                    };
                    $scope.open = function () {
                        $scope.setWidth($scope.width);
                    };
                    $scope.close = function () {
                        $scope.width = $element.width();
                        $scope.setWidth(6);
                    };
                    $scope.$on('pane.close', $scope.close);
                    $scope.$on('pane.open', $scope.open);
                    $scope.toggle = function () {
                        if ($scope.moving) {
                            return;
                        }
                        if ($element.width() > 6) {
                            $scope.close();
                        }
                        else {
                            $scope.open();
                        }
                    };
                    $scope.startMoving = function ($event) {
                        $event.stopPropagation();
                        $event.preventDefault();
                        $event.stopImmediatePropagation();
                        $document.on("mouseup.hawtio-pane", function ($event) {
                            $timeout(function () {
                                $scope.moving = false;
                            }, 250);
                            $event.stopPropagation();
                            $event.preventDefault();
                            $event.stopImmediatePropagation();
                            $document.off(".hawtio-pane");
                            Core.$apply($scope);
                        });
                        $document.on("mousemove.hawtio-pane", function ($event) {
                            $scope.moving = true;
                            $event.stopPropagation();
                            $event.preventDefault();
                            $event.stopImmediatePropagation();
                            if ($scope.position === 'left') {
                                $scope.setWidth($event.pageX + 2);
                            }
                            else {
                                $scope.setWidth($window.innerWidth - $event.pageX + 2);
                            }
                            Core.$apply($scope);
                        });
                    };
                }],
            link: function ($scope, $element, $attr) {
                var parent = $element.parent();
                var position = "left";
                if ($scope.position) {
                    position = $scope.position;
                }
                $element.addClass(position);
                var width = $element.width();
                var padding = "padding-" + position;
                $scope.padding = padding;
                var original = parent.css(padding);
                parent.css(padding, width + "px");
                $scope.$on('$destroy', function () {
                    parent.css(padding, original);
                });
            }
        };
    }
    UI.hawtioPane = hawtioPane;
    UI._module.directive('hawtioPane', UI.hawtioPane);
})(UI || (UI = {}));
/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    UI._module.directive('hawtioMessagePanel', function () {
        return new UI.MessagePanel();
    });
    var MessagePanel = (function () {
        function MessagePanel() {
            this.restrict = 'A';
            this.link = function ($scope, $element, $attrs) {
                var height = "100%";
                if ('hawtioMessagePanel' in $attrs) {
                    var wantedHeight = $attrs['hawtioMessagePanel'];
                    if (!Core.isBlank(wantedHeight)) {
                        height = wantedHeight;
                    }
                }
                var speed = "1s";
                if ('speed' in $attrs) {
                    var wantedSpeed = $attrs['speed'];
                    if (!Core.isBlank(wantedSpeed)) {
                        speed = wantedSpeed;
                    }
                }
                $element.css({
                    position: 'absolute',
                    bottom: 0,
                    height: 0,
                    'min-height': 0,
                    transition: 'all ' + speed + ' ease-in-out'
                });
                $element.parent().mouseover(function () {
                    $element.css({
                        height: height,
                        'min-height': 'auto'
                    });
                });
                $element.parent().mouseout(function () {
                    $element.css({
                        height: 0,
                        'min-height': 0
                    });
                });
            };
        }
        return MessagePanel;
    }());
    UI.MessagePanel = MessagePanel;
    UI._module.directive('hawtioInfoPanel', function () {
        return new UI.InfoPanel();
    });
    var InfoPanel = (function () {
        function InfoPanel() {
            this.restrict = 'A';
            this.link = function ($scope, $element, $attrs) {
                var validDirections = {
                    'left': {
                        side: 'right',
                        out: 'width'
                    },
                    'right': {
                        side: 'left',
                        out: 'width'
                    },
                    'up': {
                        side: 'bottom',
                        out: 'height'
                    },
                    'down': {
                        side: 'top',
                        out: 'height'
                    }
                };
                var direction = "right";
                if ('hawtioInfoPanel' in $attrs) {
                    var wantedDirection = $attrs['hawtioInfoPanel'];
                    if (!Core.isBlank(wantedDirection)) {
                        if (_.some(_.keys(validDirections), wantedDirection)) {
                            direction = wantedDirection;
                        }
                    }
                }
                var speed = "1s";
                if ('speed' in $attrs) {
                    var wantedSpeed = $attrs['speed'];
                    if (!Core.isBlank(wantedSpeed)) {
                        speed = wantedSpeed;
                    }
                }
                var toggle = "open";
                if ('toggle' in $attrs) {
                    var wantedToggle = $attrs['toggle'];
                    if (!Core.isBlank(wantedSpeed)) {
                        toggle = wantedToggle;
                    }
                }
                var initialCss = {
                    position: 'absolute',
                    transition: 'all ' + speed + ' ease-in-out'
                };
                var openCss = {};
                openCss[validDirections[direction]['out']] = '100%';
                var closedCss = {};
                closedCss[validDirections[direction]['out']] = 0;
                initialCss[validDirections[direction]['side']] = 0;
                initialCss[validDirections[direction]['out']] = 0;
                $element.css(initialCss);
                $scope.$watch(toggle, function (newValue, oldValue) {
                    if (Core.parseBooleanValue(newValue)) {
                        $element.css(openCss);
                    }
                    else {
                        $element.css(closedCss);
                    }
                });
                $element.click(function () {
                    $scope[toggle] = false;
                    Core.$apply($scope);
                });
            };
        }
        return InfoPanel;
    }());
    UI.InfoPanel = InfoPanel;
})(UI || (UI = {}));
/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    UI._module.directive('hawtioRow', function () {
        return new UI.DivRow();
    });
    // expand the element to accomodate a group of elements to prevent them from wrapping
    var DivRow = (function () {
        function DivRow() {
            this.restrict = 'A';
            this.link = function ($scope, $element, $attrs) {
                $element.get(0).addEventListener("DOMNodeInserted", function () {
                    var targets = $element.children();
                    var width = 0;
                    angular.forEach(targets, function (target) {
                        var el = angular.element(target);
                        switch (el.css('display')) {
                            case 'none':
                                break;
                            default:
                                width = width + el.outerWidth(true) + 5;
                        }
                    });
                    $element.width(width);
                });
            };
        }
        return DivRow;
    }());
    UI.DivRow = DivRow;
})(UI || (UI = {}));
/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    UI._module.directive('hawtioSlideout', function () {
        return new UI.SlideOut();
    });
    var SlideOut = (function () {
        function SlideOut() {
            this.restrict = 'A';
            this.replace = true;
            this.transclude = true;
            this.templateUrl = UI.templatePath + 'slideout.html';
            this.scope = {
                show: '=hawtioSlideout',
                direction: '@',
                top: '@',
                height: '@',
                title: '@',
                close: '@'
            };
            this.controller = ["$scope", "$element", "$attrs", "$transclude", "$compile", function ($scope, $element, $attrs, $transclude, $compile) {
                    $scope.clone = null;
                    $transclude(function (clone) {
                        $scope.clone = $(clone).filter('.dialog-body');
                    });
                    UI.observe($scope, $attrs, 'direction', 'right');
                    UI.observe($scope, $attrs, 'top', '10%', function (value) {
                        $element.css('top', value);
                    });
                    UI.observe($scope, $attrs, 'height', '80%', function (value) {
                        $element.css('height', value);
                    });
                    UI.observe($scope, $attrs, 'title', '');
                    UI.observe($scope, $attrs, 'close', 'true');
                    $scope.$watch('show', function () {
                        if ($scope.show) {
                            $scope.body = $element.find('.slideout-body');
                            $scope.body.html($compile($scope.clone.html())($scope.$parent));
                        }
                    });
                    $scope.hidePanel = function ($event) {
                        UI.log.debug("Event: ", $event);
                        $scope.show = false;
                    };
                }];
            this.link = function ($scope, $element, $attrs) {
                $scope.$watch('show', function () {
                    if ($scope.show) {
                        $element.addClass('out');
                        $element.focus();
                    }
                    else {
                        $element.removeClass('out');
                    }
                });
            };
        }
        return SlideOut;
    }());
    UI.SlideOut = SlideOut;
})(UI || (UI = {}));
/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    UI._module.directive('hawtioPager', function () {
        return new UI.TablePager();
    });
    var TablePager = (function () {
        function TablePager() {
            var _this = this;
            this.restrict = 'A';
            this.scope = true;
            this.templateUrl = UI.templatePath + 'tablePager.html';
            this.$scope = null;
            this.element = null;
            this.attrs = null;
            this.tableName = null;
            this.setRowIndexName = null;
            this.rowIndexName = null;
            // necessary to ensure 'this' is this object <sigh>
            this.link = function (scope, element, attrs) {
                return _this.doLink(scope, element, attrs);
            };
        }
        TablePager.prototype.doLink = function (scope, element, attrs) {
            var _this = this;
            this.$scope = scope;
            this.element = element;
            this.attrs = attrs;
            this.tableName = attrs["hawtioPager"] || attrs["array"] || "data";
            this.setRowIndexName = attrs["onIndexChange"] || "onIndexChange";
            this.rowIndexName = attrs["rowIndex"] || "rowIndex";
            scope.first = function () {
                _this.goToIndex(0);
            };
            scope.last = function () {
                _this.goToIndex(scope.tableLength() - 1);
            };
            scope.previous = function () {
                if (scope.rowIndex() > 0) {
                    _this.goToIndex(scope.rowIndex() - 1);
                }
            };
            scope.next = function () {
                if (scope.rowIndex() < scope.tableLength() - 1) {
                    _this.goToIndex(scope.rowIndex() + 1);
                }
            };
            scope.isEmptyOrFirst = function () {
                var idx = scope.rowIndex();
                var length = scope.tableLength();
                return length <= 0 || idx <= 0;
            };
            scope.isEmptyOrLast = function () {
                var idx = scope.rowIndex();
                var length = scope.tableLength();
                return length < 1 || idx + 1 >= length;
            };
            scope.rowIndex = function () {
                return Core.pathGet(scope.$parent, _this.rowIndexName.split('.'));
            };
            scope.tableLength = function () {
                var data = _this.tableData();
                return data ? data.length : 0;
            };
        };
        TablePager.prototype.tableData = function () {
            return Core.pathGet(this.$scope.$parent, this.tableName.split('.')) || [];
        };
        TablePager.prototype.goToIndex = function (idx) {
            var name = this.setRowIndexName;
            var fn = this.$scope[name];
            if (angular.isFunction(fn)) {
                fn(idx);
            }
            else {
                console.log("No function defined in scope for " + name + " but was " + fn);
                this.$scope[this.rowIndexName] = idx;
            }
        };
        return TablePager;
    }());
    UI.TablePager = TablePager;
})(UI || (UI = {}));
/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    function TemplatePopover($templateCache, $compile, $document) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                var title = UI.getIfSet('title', $attr, undefined);
                var trigger = UI.getIfSet('trigger', $attr, 'hover');
                var html = true;
                var contentTemplate = UI.getIfSet('content', $attr, 'popoverTemplate');
                var placement = UI.getIfSet('placement', $attr, 'auto');
                var delay = UI.getIfSet('delay', $attr, '100');
                var container = UI.getIfSet('container', $attr, 'body');
                var selector = UI.getIfSet('selector', $attr, 'false');
                if (container === 'false') {
                    container = false;
                }
                if (selector === 'false') {
                    selector = false;
                }
                var template = $templateCache.get(contentTemplate);
                if (!template) {
                    return;
                }
                $element.on('$destroy', function () {
                    $element.popover('destroy');
                });
                $element.popover({
                    title: title,
                    trigger: trigger,
                    html: html,
                    content: function () {
                        var res = $compile(template)($scope);
                        Core.$digest($scope);
                        return res;
                    },
                    delay: delay,
                    container: container,
                    selector: selector,
                    placement: function (tip, element) {
                        if (placement !== 'auto') {
                            return placement;
                        }
                        var el = $element;
                        var offset = el.offset();
                        /* not sure on auto bottom/top
            
                        var elVerticalCenter = offset['top'] + (el.outerHeight() / 2);
                        if (elVerticalCenter < 300) {
                          return 'bottom';
                        }
            
                        var height = window.innerHeight;
                        if (elVerticalCenter > window.innerHeight - 300) {
                          return 'top';
                        }
                        */
                        var width = $document.innerWidth();
                        var elHorizontalCenter = offset['left'] + (el.outerWidth() / 2);
                        var midpoint = width / 2;
                        if (elHorizontalCenter < midpoint) {
                            return 'right';
                        }
                        else {
                            return 'left';
                        }
                    }
                });
            }
        };
    }
    UI.TemplatePopover = TemplatePopover;
    UI._module.directive('hawtioTemplatePopover', ["$templateCache", "$compile", "$document", UI.TemplatePopover]);
})(UI || (UI = {}));
/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    function HawtioTocDisplay(marked, $location, $anchorScroll, $compile) {
        return {
            restrict: 'A',
            scope: {
                getContents: '&'
            },
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
                    $scope.remaining = -1;
                    $scope.render = false;
                    $scope.chapters = [];
                    $scope.addChapter = function (item) {
                        UI.log.debug("Adding:", item);
                        $scope.chapters.push(item);
                        if (!angular.isDefined(item['text'])) {
                            $scope.fetchItemContent(item);
                        }
                    };
                    $scope.getTarget = function (id) {
                        if (!id) {
                            return '';
                        }
                        return id.replace(".", "_");
                    };
                    $scope.getFilename = function (href, ext) {
                        var filename = href.split('/').last();
                        if (ext && !filename.endsWith(ext)) {
                            filename = filename + '.' + ext;
                        }
                        return filename;
                    };
                    $scope.$watch('remaining', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            var renderIfPageLoadFails = false;
                            if (newValue === 0 || renderIfPageLoadFails) {
                                $scope.render = true;
                            }
                        }
                    });
                    $scope.fetchItemContent = function (item) {
                        var me = $scope;
                        $scope.$eval(function (parent) {
                            parent.getContents({
                                filename: item['filename'],
                                cb: function (data) {
                                    if (data) {
                                        if (item['filename'].endsWith(".md")) {
                                            item['text'] = marked(data);
                                        }
                                        else {
                                            item['text'] = data;
                                        }
                                        $scope.remaining--;
                                        Core.$apply(me);
                                    }
                                }
                            });
                        });
                    };
                }],
            link: function ($scope, $element, $attrs) {
                var offsetTop = 0;
                var logbar = $('.logbar');
                var contentDiv = $("#toc-content");
                if (logbar.length) {
                    offsetTop = logbar.height() + logbar.offset().top;
                }
                else if (contentDiv.length) {
                    var offsetContentDiv = contentDiv.offset();
                    if (offsetContentDiv) {
                        offsetTop = offsetContentDiv.top;
                    }
                }
                if (!offsetTop) {
                    // set to a decent guestimate
                    offsetTop = 90;
                }
                var previousHtml = null;
                var html = $element;
                if (!contentDiv || !contentDiv.length) {
                    contentDiv = $element;
                }
                var ownerScope = $scope.$parent || $scope;
                var scrollDuration = 1000;
                var linkFilter = $attrs["linkFilter"];
                var htmlName = $attrs["html"];
                if (htmlName) {
                    ownerScope.$watch(htmlName, function () {
                        var htmlText = ownerScope[htmlName];
                        if (htmlText && htmlText !== previousHtml) {
                            previousHtml = htmlText;
                            var markup = $compile(htmlText)(ownerScope);
                            $element.children().remove();
                            $element.append(markup);
                            loadChapters();
                        }
                    });
                }
                else {
                    loadChapters();
                }
                // make the link active for the first panel on the view
                $(window).scroll(setFirstChapterActive);
                function setFirstChapterActive() {
                    // lets find the first panel which is visible...
                    var cutoff = $(window).scrollTop();
                    $element.find("li a").removeClass("active");
                    $('.panel-body').each(function () {
                        var offset = $(this).offset();
                        if (offset && offset.top >= cutoff) {
                            // lets make the related TOC link active
                            var id = $(this).attr("id");
                            if (id) {
                                var link = html.find("a[chapter-id='" + id + "']");
                                link.addClass("active");
                                // stop iterating and just make first one active
                                return false;
                            }
                        }
                    });
                }
                function findLinks() {
                    var answer = html.find('a');
                    if (linkFilter) {
                        answer = answer.filter(linkFilter);
                    }
                    return answer;
                }
                function loadChapters() {
                    if (!html.get(0).id) {
                        html.get(0).id = 'toc';
                    }
                    $scope.tocId = '#' + html.get(0).id;
                    $scope.remaining = findLinks().length;
                    findLinks().each(function (index, a) {
                        UI.log.debug("Found:", a);
                        var filename = $scope.getFilename(a.href, a.getAttribute('file-extension'));
                        var item = {
                            filename: filename,
                            title: a.textContent,
                            link: a
                        };
                        $scope.addChapter(item);
                    });
                    // TODO this doesn't seem to have any effect ;)
                    setTimeout(function () {
                        setFirstChapterActive();
                    }, 100);
                }
                $scope.$watch('render', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (newValue) {
                            if (!contentDiv.next('.hawtio-toc').length) {
                                var div = $('<div class="hawtio-toc"></div>');
                                div.appendTo(contentDiv);
                                var selectedChapter = $location.search()["chapter"];
                                // lets load the chapter panels
                                $scope.chapters.forEach(function (chapter, index) {
                                    UI.log.debug("index:", index);
                                    var panel = $('<div></div>');
                                    var panelHeader = null;
                                    var chapterId = $scope.getTarget(chapter['filename']);
                                    var link = chapter["link"];
                                    if (link) {
                                        link.setAttribute("chapter-id", chapterId);
                                    }
                                    if (index > 0) {
                                        panelHeader = $('<div class="panel-title"><a class="toc-back" href="">Back to Top</a></div>');
                                    }
                                    var panelBody = $('<div class="panel-body" id="' + chapterId + '">' + chapter['text'] + '</div>');
                                    if (panelHeader) {
                                        panel.append(panelHeader).append($compile(panelBody)($scope));
                                    }
                                    else {
                                        panel.append($compile(panelBody)($scope));
                                    }
                                    panel.hide().appendTo(div).fadeIn(1000);
                                    if (chapterId === selectedChapter) {
                                        // lets scroll on startup to allow for bookmarking
                                        scrollToChapter(chapterId);
                                    }
                                });
                                var pageTop = contentDiv.offset().top - offsetTop;
                                div.find('a.toc-back').each(function (index, a) {
                                    $(a).click(function (e) {
                                        e.preventDefault();
                                        $('body,html').animate({
                                            scrollTop: pageTop
                                        }, 2000);
                                    });
                                });
                                // handle clicking links in the TOC
                                findLinks().each(function (index, a) {
                                    var href = a.href;
                                    var filename = $scope.getFilename(href, a.getAttribute('file-extension'));
                                    $(a).click(function (e) {
                                        UI.log.debug("Clicked:", e);
                                        e.preventDefault();
                                        var chapterId = $scope.getTarget(filename);
                                        $location.search("chapter", chapterId);
                                        Core.$apply(ownerScope);
                                        scrollToChapter(chapterId);
                                        return true;
                                    });
                                });
                            }
                        }
                    }
                });
                // watch for back / forward / url changes
                ownerScope.$on("$locationChangeSuccess", function (event, current, previous) {
                    // lets do this asynchronously to avoid Error: $digest already in progress
                    setTimeout(function () {
                        // lets check if the chapter selection has changed
                        var currentChapter = $location.search()["chapter"];
                        scrollToChapter(currentChapter);
                    }, 50);
                });
                /**
                 * Lets scroll to the given chapter ID
                 *
                 * @param chapterId
                 */
                function scrollToChapter(chapterId) {
                    UI.log.debug("selected chapter changed:", chapterId);
                    if (chapterId) {
                        var target = '#' + chapterId;
                        var top = 0;
                        var targetElements = $(target);
                        if (targetElements.length) {
                            var offset = targetElements.offset();
                            if (offset) {
                                top = offset.top - offsetTop;
                            }
                            $('body,html').animate({
                                scrollTop: top
                            }, scrollDuration);
                        }
                    }
                }
            }
        };
    }
    UI.HawtioTocDisplay = HawtioTocDisplay;
    UI._module.directive('hawtioTocDisplay', ["marked", "$location", "$anchorScroll", "$compile", UI.HawtioTocDisplay]);
})(UI || (UI = {}));
/**
 * @module UI
 */
/// <reference path="./uiPlugin.ts"/>
var UI;
(function (UI) {
    UI._module.directive('hawtioViewport', function () {
        return new UI.ViewportHeight();
    });
    var ViewportHeight = (function () {
        function ViewportHeight() {
            this.restrict = 'A';
            this.link = function ($scope, $element, $attrs) {
                var lastHeight = 0;
                var resizeFunc = function () {
                    var neighbor = angular.element($attrs['hawtioViewport']);
                    var container = angular.element($attrs['containingDiv']);
                    var start = neighbor.position().top + neighbor.height();
                    var myHeight = container.height() - start;
                    if (angular.isDefined($attrs['heightAdjust'])) {
                        var heightAdjust = Core.parseIntValue($attrs['heightAdjust']);
                    }
                    myHeight = myHeight + heightAdjust;
                    $element.css({
                        height: myHeight,
                        'min-height': myHeight
                    });
                    if (lastHeight !== myHeight) {
                        lastHeight = myHeight;
                        $element.trigger('resize');
                    }
                };
                resizeFunc();
                $scope.$watch(resizeFunc);
                $().resize(function () {
                    resizeFunc();
                    Core.$apply($scope);
                    return false;
                });
            };
        }
        return ViewportHeight;
    }());
    UI.ViewportHeight = ViewportHeight;
    UI._module.directive('hawtioHorizontalViewport', function () {
        return new UI.HorizontalViewport();
    });
    var HorizontalViewport = (function () {
        function HorizontalViewport() {
            this.restrict = 'A';
            this.link = function ($scope, $element, $attrs) {
                var adjustParent = angular.isDefined($attrs['adjustParent']) && Core.parseBooleanValue($attrs['adjustParent']);
                $element.get(0).addEventListener("DOMNodeInserted", function () {
                    var canvas = $element.children();
                    $element.height(canvas.outerHeight(true));
                    if (adjustParent) {
                        $element.parent().height($element.outerHeight(true) + UI.getScrollbarWidth());
                    }
                });
            };
        }
        return HorizontalViewport;
    }());
    UI.HorizontalViewport = HorizontalViewport;
})(UI || (UI = {}));
/// <reference path="uiPlugin.ts"/>
//
var UI;
(function (UI) {
    UI._module.directive('hawtioWindowHeight', ['$window', function ($window) {
            return {
                restrict: 'A',
                replace: false,
                link: function (scope, element, attrs) {
                    var viewportHeight = $window.innerHeight;
                    function processElement(el) {
                        var offset = el.offset();
                        if (!offset) {
                            return;
                        }
                        var top = offset.top;
                        var height = viewportHeight - top;
                        if (height > 0) {
                            el.attr({
                                'style': 'height: ' + height + 'px;'
                            });
                        }
                    }
                    function layout() {
                        viewportHeight = $window.innerHeight;
                        element.parents().each(function (index, el) {
                            el = $(el);
                            processElement(el);
                        });
                        processElement(element);
                    }
                    scope.$watch(_.debounce(layout, 1000, { trailing: true }));
                }
            };
        }]);
})(UI || (UI = {}));
var UIBootstrap;
(function (UIBootstrap) {
    var pluginName = "hawtio-ui-bootstrap";
    angular.module(pluginName, ["ui.bootstrap"]);
    hawtioPluginLoader.addModule(pluginName);
    hawtioPluginLoader.addModule("hawtio-compat.transition");
    hawtioPluginLoader.addModule("hawtio-compat.dialog");
    hawtioPluginLoader.addModule("hawtio-compat.modal");
})(UIBootstrap || (UIBootstrap = {}));
