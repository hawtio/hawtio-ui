/// <reference path="colors.d.ts" />
/// <reference path="uiPlugin.d.ts" />
/**
 * @module UI
 */
declare module UI {
    var selected: string;
    var unselected: string;
    /**
  Directive that allows the user to pick a color from a pre-defined pallete of colors.
  
  Use it like:
  
  ```html
  <div hawtio-color-picker="myModel"></div>
  ```
  
  'myModel' will be bound to the color the user clicks on
  
  @class ColorPicker
     */
    class ColorPicker {
        restrict: string;
        replace: boolean;
        scope: {
            property: string;
        };
        templateUrl: string;
        compile: (tElement: any, tAttrs: any, transclude: any) => {
            post: (scope: any, iElement: any, iAttrs: any, controller: any) => void;
        };
        controller: (string | (($scope: any, $element: any, $timeout: any) => void))[];
    }
}
