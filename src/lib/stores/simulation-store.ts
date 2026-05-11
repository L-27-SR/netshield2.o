import { writable } from 'svelte/store';
import type { Node, Edge, Graph } from '$lib/types';

const createSimulationStore = () => {
    const { subscribe, set, update } = writable<Graph>({
        nodes: [],
        edges: []
    });

    return {
        subscribe,
        addPacket: (sourceIP: string, destIP: string, protocol: string, packetLength: number, interarrivalTime: number) => {
            update(graph => {
                // Create unique nodes
                const uniqueIPs = new Set([...graph.nodes.map(n => n.id), sourceIP, destIP]);
                
                return {
                    nodes: Array.from(uniqueIPs).map(ip => ({ id: ip })),
                    edges: [...graph.edges, {
                        from: sourceIP,
                        to: destIP,
                        protocol,
                        packetLength,
                        interarrivalTime
                    }]
                };
            });
        },
        reset: () => set({ nodes: [], edges: [] })
    };
};

export const simulationStore = createSimulationStore();
