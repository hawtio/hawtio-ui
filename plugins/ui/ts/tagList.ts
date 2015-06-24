/// <reference path="uiPlugin.ts"/>
module UI {
  export var hawtioTagList = _module.directive("hawtioTagList", ['$interpolate', '$compile', '$templateCache', ($interpolate:ng.IInterpolateService, $compile:ng.ICompileService, $templateCache:ng.ITemplateCacheService) => {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: UrlHelpers.join(templatePath, 'tagList.html'),
      scope: {
        tags: '=',
        remove: '=?',
        selected: '=?'
      },
      link: (scope, $element, attr) => {
        var tagBase = $templateCache.get('tagBase.html');
        var tagRemove = $templateCache.get('tagRemove.html');
        scope.addSelected = (tag) => {
          if (scope.selected) {
            scope.selected.push(tag);
          }
        };
        scope.removeTag = (tag) => {
          scope.tags.remove(tag);
        };
        scope.$watchCollection('tags', (tags) => {
          log.debug("Collection changed: ", tags);
          var tmp = angular.element("<div></div>");
          tags.forEach((tag) => {
            var func = $interpolate(tagBase);
            var el = angular.element(func({ tag: tag }));
            if (scope.remove) {
              el.append($interpolate(tagRemove)({ tag: tag}));
            }
            if (scope.selected) {
              el.attr('ng-click', 'addSelected(\'' + tag + '\')');
            }
            tmp.append(el);
          });
          $element.html($compile(tmp.children())(scope));
        });
      }
    }
  }]);
}
