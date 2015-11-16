/// <reference path="uiPlugin.ts"/>
//
module UI {

  _module.directive('hawtioWindowHeight', ['$window', ($window) => {
    return {
      restrict: 'A',
      replace: false,
      link: (scope, element, attrs) => {
  
        var viewportHeight = $window.innerHeight;
        console.log("Viewport height: ", viewportHeight);

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
          element.parents().each((index, el) => {
            el = $(el);
            processElement(el);
          });
          processElement(element);
        }
        //layout();
        scope.$watch(_.debounce(layout, 1000, { trailing: true}));
        //$($window).on('resize', layout);
      }
    };
  }]);


}
