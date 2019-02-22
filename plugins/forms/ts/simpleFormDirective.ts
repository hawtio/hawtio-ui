/// <reference path="formHelpers.ts"/>
/// <reference path="mappingRegistry.ts"/>
namespace Forms {

  export class SimpleFormConfig {

    public name = 'form';
    public method = 'post';

    // the name of the attribute in the scope which is the data to be edited
    public entity = 'entity';

    // the name of the full schema
    public schemaName = 'schema';

    // set to 'view' or 'create' for different modes
    public mode: string = 'edit';

    // the definition of the form
    public data: any = {};
    public json: any = undefined;

    // the scope
    public scope: any = null;

    // the name to look up in the scope for the configuration data
    public scopeName: string = null;

    public properties = [];
    public action = '';

    public formclass = 'hawtio-form form-horizontal';
    public controlgroupclass = 'form-group';
    public controlclass = 'col-sm-10';
    public labelclass = 'col-sm-2 control-label';

    public showtypes = 'false';
    public showhelp = 'true';
    public showempty = 'true';

    public onsubmit = 'onSubmit';

    public getMode(): string {
      return this.mode || "edit";
    }

    public getEntity() {
      return this.entity || "entity";
    }

    public isReadOnly() {
      return this.getMode() === "view";
    }
  }

  export class SimpleForm {
    public restrict = 'A';
    public scope = true;
    public replace = true;
    public transclude = true;

    private attributeName = 'simpleForm';

    // see constructor for why this is here...
    public link: (scope, element, attrs) => any;

    constructor(public $compile) {
      // necessary to ensure 'this' is this object <sigh>
      this.link = (scope, element, attrs) => {
        return this.doLink(scope, element, attrs);
      }
    }

    public isReadOnly() {
      return false;
    }

    private doLink(scope, element, attrs) {
      var config = new SimpleFormConfig;

      var fullSchemaName = attrs["schema"];
      var fullSchema = fullSchemaName ? scope[fullSchemaName] : null;

      var compiledNode: any = null;
      var childScope: any = null;
      var tabs: any = null;
      var fieldset: any = null;
      var schema: any = null;
      var configScopeName = attrs[this.attributeName] || attrs["data"];

      var firstControl = null;

      var simple = this;
      scope.$watch(configScopeName, onWidgetDataChange);

      function onWidgetDataChange(scopeData) {
        if (scopeData) {
          onScopeData(scopeData);
        }
      }

      function onScopeData(scopeData) {
        config = configure(config, scopeData, attrs);
        config.schemaName = fullSchemaName;
        config.scopeName = configScopeName;
        config.scope = scope;

        var entityName = config.getEntity();

        if (angular.isDefined(config.json)) {
          config.data = $.parseJSON(config.json);
        } else {
          config.data = scopeData;
        }

        var form = simple.createForm(config);
        fieldset = form.find('fieldset');
        schema = config.data;
        tabs = {
          elements: {},
          locations: {},
          use: false
        };

        if (schema && angular.isDefined(schema.tabs)) {
          tabs.use = true;
          tabs['div'] = (<any>$)('<div class="tabbable hawtio-form-tabs"></div>');

          angular.forEach(schema.tabs, function (value, key) {
            tabs.elements[key] = (<any>$)('<div class="tab-pane" title="' + key + '"></div>');
            tabs['div'].append(tabs.elements[key]);
            value.forEach(function (val) {
              tabs.locations[val] = key;
            });
          });

          if (!tabs.locations['*']) {
            tabs.locations['*'] = _.keys(schema.tabs)[0];
          }
        }

        if (!tabs.use) {
          fieldset.append('<div class="spacer"></div>');
        }


        if (schema) {
          // if we're using tabs lets reorder the properties...
          if (tabs.use) {
            var tabKeyToIdPropObject = {};
            angular.forEach(schema.properties, (property, id) => {
              var tabkey = findTabOrderValue(id);
              var array = tabKeyToIdPropObject[tabkey];
              if (!array) {
                array = [];
                tabKeyToIdPropObject[tabkey] = array;
              }
              array.push({ id: id, property: property });
            });

            // now lets iterate through each tab...
            angular.forEach(schema.tabs, function (value, key) {
              value.forEach(function (val) {
                var array = tabKeyToIdPropObject[val];
                if (array) {
                  angular.forEach(array, (obj) => {
                    var id = obj.id;
                    var property = obj.property;
                    if (id && property) {
                      addProperty(id, property);
                    }
                  });
                }
              });
            });
          } else {
            angular.forEach(schema.properties, (property, id) => {
              addProperty(id, property);
            });
          }
        }

        if (tabs.use) {
          var tabDiv = tabs['div'];
          var tabCount = Object.keys(tabs.elements).length;
          if (tabCount < 2) {
            // if we only have 1 tab lets extract the div contents of the tab
            angular.forEach(tabDiv.children().children(), (control) => {
              fieldset.append(control);
            });
          } else {
            fieldset.append(tabDiv);
          }
        }

        var findFunction = function (scope, func) {
          if (angular.isDefined(scope[func]) && angular.isFunction(scope[func])) {
            return scope;
          }
          if (angular.isDefined(scope.$parent) && scope.$parent !== null) {
            return findFunction(scope.$parent, func);
          } else {
            return null;
          }
        };

        var onSubmitFunc = config.onsubmit.replace('(', '').replace(')', '');
        var onSubmit = maybeGet(findFunction(scope, onSubmitFunc), onSubmitFunc);

        if (onSubmit === null) {
          onSubmit = function (json, form) {
            log.info("No submit handler defined for form:", form.get(0).name)
          }
        }

        if (angular.isDefined(onSubmit)) {
          form.submit(() => {
            log.debug("child scope: ", childScope);
            log.debug("form name: ", config);
            if (childScope[config.name].$invalid) {
              return false;
            }
            var entity = scope[entityName];
            onSubmit(entity, form);
            return false;
          });
        }

        fieldset.append('<input type="submit" style="position: absolute; left: -9999px; width: 1px; height: 1px;">');

        // now lets try default an autofocus element onto the first item if we don't find any elements with an auto-focus
        var autoFocus = form.find("*[autofocus]");
        if (!autoFocus || !autoFocus.length) {
          if (firstControl) {
            console.log("No autofocus element, so lets add one!");
            var input = firstControl.find("input").first() || firstControl.find("select").first();
            if (input) {
              input.attr("autofocus", "true");
            }
          }
        }


        if (compiledNode) {
          (<any>$)(compiledNode).remove();
        }
        if (childScope) {
          childScope.$destroy();
        }
        childScope = scope.$new(false);


        compiledNode = simple.$compile(form)(childScope);

        // now lets expose the form object to the outer scope
        var formsScopeProperty = "forms";
        var forms = scope[formsScopeProperty];
        if (!forms) {
          forms = {};
          scope[formsScopeProperty] = forms;
        }
        var formName = config.name;
        if (formName) {
          var formObject = childScope[formName];
          if (formObject) {
            forms[formName] = formObject;
          }
          var formScope = formName += "$scope";
          forms[formScope] = childScope;
        }
        (<any>$)(element).append(compiledNode);


      }

      function findTabKey(id) {
        var tabkey = tabs.locations[id];
        if (!tabkey) {
          // lets try find a tab key using regular expressions
          angular.forEach(tabs.locations, (value, key: string) => {
            if (!tabkey && key !== "*" && id.match(key)) {
              tabkey = value;
            }
          });
        }
        if (!tabkey) {
          tabkey = tabs.locations['*'];
        }
        return tabkey;
      }

      function findTabOrderValue(id) {
        var answer: any = null;
        angular.forEach(schema.tabs, function (value, key) {
          value.forEach(function (val) {
            if (!answer && val !== "*" && id.match(val)) {
              answer = val;
            }
          });
        });
        if (!answer) {
          answer = '*';
        }
        return answer;
      }

      function addProperty(id, property, ignorePrefixInLabel = property.ignorePrefixInLabel) {
        // TODO should also support getting inputs from the template cache, maybe
        // for type="template"
        var propTypeName = property.type;
        // make sure we detect string as string
        if ("java.lang.String" === propTypeName) {
          propTypeName = "string";
        }
        var propSchema = Forms.lookupDefinition(propTypeName, schema);
        if (!propSchema) {
          propSchema = Forms.lookupDefinition(propTypeName, fullSchema);
        }
        var disableHumanizeLabel = schema ? schema.disableHumanizeLabel : false;

        // lets ignore fields marked as hidden from the generated form
        if (property.hidden) {
          return;
        }

        // special for expression (Apache Camel)
        if (property.kind === "expression") {
          propSchema = Forms.lookupDefinition("expression", fullSchema);

          // create 2 inputs, the 1st is the drop down with the languages
          // and then merge the 2 inputs together, which is a hack
          // but easier to do than change the complicated Forms.createWidget to do a widget with a selectbox + input
          var childId = id + ".language";
          var childId2 = id + ".expression";

          // for the 2nd input we need to use the information from the original property for title, description, required etc.
          var adjustedProperty = jQuery.extend(true, {}, propSchema.properties.expression);
          adjustedProperty.description = property.description;
          adjustedProperty.title = property.title;
          adjustedProperty.required = property.required;

          var input: JQuery = Forms.createWidget(propTypeName, propSchema.properties.language, schema, config, childId, ignorePrefixInLabel, configScopeName, true, disableHumanizeLabel);
          var input2: JQuery = Forms.createWidget(propTypeName, adjustedProperty, schema, config, childId2, ignorePrefixInLabel, configScopeName, true, disableHumanizeLabel);

          // move the selectbox from input to input2 as we want it to be on the same line
          var selectWidget = input.find("select");
          var inputWidget = input2.find("input");
          if (selectWidget && inputWidget) {
            // adjust the widght so the two inputs can be on the same line and have same combined length as the others (600px)
            selectWidget.attr("style", "width: 120px; margin-right: 10px");
            inputWidget.attr("style", "width: 470px");
            inputWidget.before(selectWidget);
          }

          fieldset.append(input2);
          return;
        }

        var nestedProperties = null;
        if (!propSchema && "object" === propTypeName && property.properties) {
          // if we've no type name but have nested properties on an object type use those
          nestedProperties = property.properties;
        } else if (propSchema && Forms.isObjectType(propSchema)) {
          // otherwise use the nested properties from the related schema type
          nestedProperties = propSchema.properties;
        }
        if (nestedProperties) {
          angular.forEach(nestedProperties, (childProp, childId) => {
            var newId = id + "." + childId;
            addProperty(newId, childProp, property.ignorePrefixInLabel);
          });
        } else {
          var wrapInGroup = true;
          var input = Forms.createWidget(propTypeName, property, schema, config, id, ignorePrefixInLabel, configScopeName, wrapInGroup, disableHumanizeLabel);

          if (tabs.use) {
            var tabkey = findTabKey(id);
            tabs.elements[tabkey].append(input);
          } else {
            fieldset.append(input);
          }
          if (!firstControl) {
            firstControl = input;
          }
        }
      }

      function maybeGet(scope, func) {
        if (scope !== null) {
          return scope[func];
        }
        return null;
      }
    }

    private createForm(config) {
      var form = (<any>$)('<form class="' + config.formclass + '" novalidate><fieldset></fieldset></form>');
      form.attr('name', config.name);
      form.attr('action', config.action);
      form.attr('method', config.method);
      form.find('fieldset').append(this.getLegend(config));
      return form;
    }

    private getLegend(config) {
      var description = Core.pathGet(config, "data.description");
      if (description) {
        return '<legend>' + description + '</legend>';
      }
      return '';
    }
  }

}
