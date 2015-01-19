/// <reference path="../../includes.d.ts" />
declare module ForceGraph {
    /**
     * GraphBuilder
     *
     * @class GraphBuilder
     */
    class GraphBuilder {
        private nodes;
        private links;
        private linkTypes;
        /**
         * Adds a node to this graph
         * @method addNode
         * @param {Object} node
         */
        addNode(node: any): void;
        getNode(id: any): any;
        hasLinks(id: any): boolean;
        addLink(srcId: any, targetId: any, linkType: any): void;
        nodeIndex(id: any, nodes: any): number;
        filterNodes(filter: any): void;
        buildGraph(): {
            nodes: any[];
            links: any[];
            linktypes: any;
        };
    }
}
