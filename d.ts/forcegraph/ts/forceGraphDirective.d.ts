/// <reference path="forceGraphPlugin.d.ts" />
declare module ForceGraph {
    class ForceGraphDirective {
        restrict: string;
        replace: boolean;
        transclude: boolean;
        scope: {
            graph: string;
            nodesize: string;
            selectedModel: string;
            linkDistance: string;
            markerKind: string;
            charge: string;
        };
        link: ($scope: any, $element: any, $attrs: any) => void;
    }
}
