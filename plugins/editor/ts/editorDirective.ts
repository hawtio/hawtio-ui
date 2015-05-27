/// <reference path="editorPlugin.ts"/>
/// <reference path="CodeEditor.ts"/>
/**
 * @module HawtioEditor
 */
module HawtioEditor {

  _module.directive('hawtioEditor', ["$parse", ($parse) => {
    return HawtioEditor.Editor($parse);
  }]);

  export function Editor($parse) {

    return {
      restrict: 'A',
      replace: true,
      templateUrl: UrlHelpers.join(templatePath, "editor.html"),
      scope: {
        text: '=hawtioEditor',
        mode:  '=',
        outputEditor: '@',
        name: '@'
      },
      controller: ["$scope", "$element", "$attrs", ($scope, $element, $attrs) => {
        $scope.codeMirror = null;
        $scope.doc = null;
        $scope.options = [];

        UI.observe($scope, $attrs, 'name', 'editor');

        $scope.applyOptions = () => {
          if ($scope.codeMirror) {
            $scope.options.each(function(option) {
              $scope.codeMirror.setOption(option.key, option['value']);
            });
            $scope.options = [];
          }
        };

        $scope.$watch(_.debounce(() => {
          if ($scope.codeMirror) {
              $scope.codeMirror.refresh();
          }
        }, 100, { trailing: true}));

        $scope.$watch('codeMirror', () => {
          if ($scope.codeMirror) {
            $scope.doc = $scope.codeMirror.getDoc();
            $scope.codeMirror.on('change', function(changeObj) {
              $scope.text = $scope.doc.getValue();
              $scope.dirty = !$scope.doc.isClean();
              Core.$apply($scope);
            });
          }
        });

        $scope.$watch('text', function(oldValue, newValue) {
          if ($scope.codeMirror && $scope.doc) {
            if (!$scope.codeMirror.hasFocus()) {
              var text = $scope.text || "";
              if (angular.isArray(text) || angular.isObject(text)) {
                text = JSON.stringify(text, null, "  ");
                $scope.mode = "javascript";
                $scope.codeMirror.setOption("mode", "javascript");
              }
              $scope.doc.setValue(text);
            }
          }
        });

      }],

      link: ($scope, $element, $attrs) => {
        if ('dirty' in $attrs) {
          $scope.dirtyTarget = $attrs['dirty'];
          $scope.$watch("$parent['" + $scope.dirtyTarget + "']", (newValue, oldValue) => {
            if (newValue !== oldValue) {
              $scope.dirty = newValue;
            }
          });
        }
        var config = _.cloneDeep($attrs);
        delete config['$$element']
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
            onChange: (codeMirror) => {
              var func = $parse(onChange);
              if (func) {
                func($scope.$parent, { codeMirror:codeMirror });
              }
            }
          });
        }
        angular.forEach(config, function(value, key) {
          $scope.options.push({
            key: key,
            'value': value
          });
        });
        $scope.$watch('mode', () => {
          if ($scope.mode) {
            if (!$scope.codeMirror) {
              $scope.options.push({
                key: 'mode',
                'value': $scope.mode
              });
            } else {
              $scope.codeMirror.setOption('mode', $scope.mode);
            }
          }
        });
        $scope.$watch('dirty', (newValue, oldValue) => {
          if ($scope.dirty && !$scope.doc.isClean()) {
            $scope.doc.markClean();
          }
          if (newValue !== oldValue && 'dirtyTarget' in $scope) {
            $scope.$parent[$scope.dirtyTarget] = $scope.dirty;
          }
        });
        /*
        $scope.$watch(() => { return $element.is(':visible'); }, (newValue, oldValue) => {
          if (newValue !== oldValue && $scope.codeMirror) {
              $scope.codeMirror.refresh();
          }
        });
        */
        $scope.$watch('text', function() {
          if (!$scope.codeMirror) {

            var options:any = {
              value: $scope.text
            };

            options = CodeEditor.createEditorSettings(options);
            $scope.codeMirror = CodeMirror.fromTextArea($element.find('textarea').get(0), options);
            var outputEditor = $scope.outputEditor;
            if (outputEditor) {
              var outputScope = $scope.$parent || $scope;
              Core.pathSet(outputScope, outputEditor, $scope.codeMirror);
            }
            $scope.applyOptions();
          }
        });
      }

    };
  }
}
