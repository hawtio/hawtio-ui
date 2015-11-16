/// <reference path="uiPlugin.ts"/>
//
module UI {

  var log = Logger.get('hawtio-window-height');

  _module.directive('hawtioWindowHeight', ['$window', ($window) => {
    return {
      restrict: 'A',
      replace: false,
      link: (scope, element, attrs) => {
  
        var viewportHeight = $window.height;
        log.debug("Viewport height: ", viewportHeight);

        element.parents().attr({
          'style': 'height: 100vh'
        });
      }
    };
  }]);


}
