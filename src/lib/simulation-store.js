import { writable } from 'svelte/store';

export const attacks = {
    // ...existing code...
};

export const networkGraph = writable({
    nodes: [],
    edges: []
});

export function updateNetworkGraph(graphData) {
    networkGraph.set(graphData);
}

export function addNode(node) {
    networkGraph.update(graph => {
        graph.nodes = [...graph.nodes, node];
        return graph;
    });
}

export function addEdge(edge) {
    networkGraph.update(graph => {
        graph.edges = [...graph.edges, edge];
        return graph;
    });
}

export function clearGraph() {
    networkGraph.set({
        nodes: [],
        edges: []
    });
}