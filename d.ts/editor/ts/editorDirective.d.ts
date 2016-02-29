/// <reference path="editorPlugin.d.ts" />
/// <reference path="CodeEditor.d.ts" />
/**
 * @module HawtioEditor
 */
declare module HawtioEditor {
    function Editor($parse: any): {
        restrict: string;
        replace: boolean;
        templateUrl: string;
        scope: {
            text: string;
            mode: string;
            readOnly: string;
            outputEditor: string;
            name: string;
        };
        controller: (string | (($scope: any, $element: any, $attrs: any) => void))[];
        link: ($scope: any, $element: any, $attrs: any) => void;
    };
}
