import { writable } from 'svelte/store';
import type { SimulationType, GraphData } from './types';

export const simulationState = writable({
    isRunning: false,
    type: null,
    progress: 0
});

export const attacks = {
    'port-scan': {
        id: 'port-scan',
        name: 'Port Scanning Attack',
        description: 'Simulates a port scanning attack where an attacker attempts to discover open ports on network devices.',
        icon: '🔍'
    },
    'ddos': {
        id: 'ddos',
        name: 'DDoS Attack',
        description: 'Simulates a Distributed Denial of Service attack targeting a specific network node.',
        icon: '🌊'
    },
    'mirai': {
        id: 'mirai',
        name: 'Mirai Botnet',
        description: 'Simulates a Mirai-style IoT botnet infection spreading through the network.',
        icon: '🤖'
    }
};

export const networkGraph = writable({
    nodes: [],
    edges: []
});

export function validateIPAddress(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(ip)) return false;
    
    const octets = ip.split('.');
    return octets.every(octet => {
        const num = parseInt(octet);
        return num >= 0 && num <= 255;
    });
}

export function generateRandomValidIP() {
    const generateOctet = () => Math.floor(Math.random() * 256);
    return `${generateOctet()}.${generateOctet()}.${generateOctet()}.${generateOctet()}`;
}

export function isPrivateIP(ip) {
    const octets = ip.split('.').map(Number);
    return (
        (octets[0] === 10) || // 10.0.0.0 - 10.255.255.255
        (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) || // 172.16.0.0 - 172.31.255.255
        (octets[0] === 192 && octets[1] === 168) // 192.168.0.0 - 192.168.255.255
    );
}

export function updateNetworkGraph(graphData) {
    networkGraph.set(graphData);
}