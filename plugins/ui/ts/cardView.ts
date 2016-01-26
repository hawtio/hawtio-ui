/// <reference path="uiPlugin.ts"/>

module UI {

  // simple directive that adds the patternfly card BG color to the content area of a hawtio app
  _module.directive('hawtioCardBg', ['$timeout', ($timeout) => {
    return {
      restrict: 'AC',
      link: (scope, element, attr) => {
        $timeout(() => {
          var parent = $('#main');
          //console.log("Parent: ", parent);
          parent.addClass('cards-pf container-cards-pf');
          element.on('$destroy', () => {
            parent.removeClass('cards-pf container-cards-pf');
          });
        }, 10);
      }
    }
  }]);
}
