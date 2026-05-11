// Common type definitions for the application

// Network Graph Types
export interface Node {
    id: string;
}

export interface Edge {
    from: string;
    to: string;
    protocol: string;
    packetLength: number;
    interarrivalTime: number;
}

export interface Graph {
    nodes: Node[];
    edges: Edge[];
}

// Simulation Types
export interface SimulationConfig {
    title: string;
    description: string;
    primaryImage: string;
    secondaryImage: string;
}

export interface SimulationTypes {
    [key: string]: SimulationConfig;
}

export interface SimulationParameters {
    simulationType: string;
    trafficVolume: number;
    attackIntensity: number;
    detectionSensitivity: number;
}

// UI Types
export interface Tab {
    id: string;
    label: string;
}