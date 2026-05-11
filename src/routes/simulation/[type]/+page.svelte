<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { initParticles } from '$lib/particles.ts';
    import ImageCard from '$lib/components/ImageCard.svelte';
    
    // Import simulation-related images
    import dataTransfer from '$assets/images/DataUtransferUinUaUgivenUduration.png';
    import heavyTraffic from '$assets/images/HeavyUtrafficUbehaviour.png';
    import trafficBehaviour from '$assets/images/TrafficUBehaviour.png';
    
    import type { SimulationConfig, SimulationTypes } from '$lib/types';
    
    let particlesCanvas: HTMLCanvasElement;
    
    // Get the simulation type from the route parameter
    $: simulationType = $page.params.type as string;
    
    // Simulation configuration based on type
    $: simulationConfig: SimulationConfig = ({
        ddos: {
            title: 'DDoS Attack Simulation',
            description: 'Simulate and analyze Distributed Denial of Service attack patterns and detection methods.',
            primaryImage: heavyTraffic,
            secondaryImage: trafficBehaviour
        },
        intrusion: {
            title: 'Network Intrusion Simulation',
            description: 'Simulate and analyze various network intrusion patterns and their detection.',
            primaryImage: trafficBehaviour,
            secondaryImage: dataTransfer
        },
        anomaly: {
            title: 'Traffic Anomaly Simulation',
            description: 'Simulate and detect unusual patterns in network traffic that may indicate security threats.',
            primaryImage: dataTransfer,
            secondaryImage: heavyTraffic
        }
    } as SimulationTypes)[simulationType] || {
        title: 'Custom Simulation',
        description: 'Configure and run a custom network traffic simulation.',
        primaryImage: heavyTraffic,
        secondaryImage: trafficBehaviour
    };

    onMount(() => {
        const cleanup = initParticles(particlesCanvas);
        return cleanup;
    });
</script>

<div class="min-h-screen bg-slate-900 text-white relative overflow-hidden">
    <canvas
        class="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        bind:this={particlesCanvas}
    ></canvas>

    <!-- Navigation -->
    <nav class="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800/50">
        <div class="max-w-7xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <div class="w-6 h-6 rounded-full bg-cyan-400/40 flex items-center justify-center">
                            <div class="w-4 h-4 rounded-full bg-cyan-300"></div>
                        </div>
                    </div>
                    <a href="/" class="text-cyan-400 font-bold text-xl">NetShield</a>
                </div>
                <div class="space-x-8">
                    <a href="/" class="text-white hover:text-cyan-400 transition-colors">Home</a>
                    <a href="/research" class="text-white hover:text-cyan-400 transition-colors">Research</a>
                    <a href="/simulation" class="text-cyan-400">Simulation</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-12 relative">
        <div class="mb-8">
            <a href="/simulation" class="text-cyan-400 hover:text-cyan-300 flex items-center transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Simulations
            </a>
        </div>

        <h1 class="text-4xl font-bold mb-4">
            {simulationConfig.title}
        </h1>
        <p class="text-gray-300 mb-12 max-w-3xl">
            {simulationConfig.description}
        </p>

        <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                <h2 class="text-2xl font-bold text-cyan-400 mb-4">Simulation Results</h2>
                <ImageCard 
                    src={simulationConfig.primaryImage} 
                    alt="Primary simulation visualization"
                    caption="Network traffic pattern visualization" 
                />
            </div>

            <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                <h2 class="text-2xl font-bold text-cyan-400 mb-4">Detection Analysis</h2>
                <ImageCard 
                    src={simulationConfig.secondaryImage}
                    alt="Secondary simulation visualization" 
                    caption="Detection algorithm performance" 
                />
            </div>
        </div>

        <div class="mt-8 bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
            <h2 class="text-2xl font-bold text-cyan-400 mb-4">Simulation Controls</h2>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="p-4 bg-slate-900/50 rounded-xl">
                    <h3 class="text-lg font-medium text-cyan-400 mb-2">Traffic Volume</h3>
                    <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value="50" 
                        class="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
                    >
                </div>
                <div class="p-4 bg-slate-900/50 rounded-xl">
                    <h3 class="text-lg font-medium text-cyan-400 mb-2">Attack Intensity</h3>
                    <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value="30" 
                        class="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
                    >
                </div>
                <div class="p-4 bg-slate-900/50 rounded-xl">
                    <h3 class="text-lg font-medium text-cyan-400 mb-2">Detection Sensitivity</h3>
                    <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value="70" 
                        class="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
                    >
                </div>
            </div>
            <div class="flex justify-center mt-6">
                <button class="px-8 py-3 bg-cyan-500 text-slate-900 rounded-xl font-medium hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
                    Run Simulation
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
    }
    
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        background: #22d3ee;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
    }
    
    input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: #22d3ee;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
        border: none;
    }
</style>