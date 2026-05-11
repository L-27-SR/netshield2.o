<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    // Define parameter types
    export let simulationType: string = 'standard';
    export let trafficVolume: number = 50;
    export let attackIntensity: number = 30;
    export let detectionSensitivity: number = 70;
    
    const dispatch = createEventDispatcher<{
        run: { 
            simulationType: string;
            trafficVolume: number;
            attackIntensity: number;
            detectionSensitivity: number;
        };
        reset: void;
    }>();
    
    // Available simulation types
    const simulationTypes: Array<{id: string, label: string}> = [
        { id: 'standard', label: 'Standard Network Traffic' },
        { id: 'ddos', label: 'DDoS Attack' },
        { id: 'intrusion', label: 'Network Intrusion' },
        { id: 'anomaly', label: 'Traffic Anomaly' }
    ];
    
    function runSimulation(): void {
        dispatch('run', {
            simulationType,
            trafficVolume,
            attackIntensity,
            detectionSensitivity
        });
    }
    
    function resetSimulation(): void {
        dispatch('reset');
    }
</script>

<div class="space-y-6 p-6 bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-700">
    <h2 class="text-2xl font-bold text-cyan-400">Simulation Controls</h2>
    
    <div class="grid gap-4">
        <div>
            <label for="simulationType" class="block text-sm font-medium text-gray-300 mb-2">Simulation Type</label>
            <select
                id="simulationType"
                bind:value={simulationType}
                class="w-full bg-slate-900/50 border border-slate-700 rounded-xl
                text-gray-300 focus:border-cyan-400 focus:ring-cyan-400/50
                shadow-sm transition-colors duration-200 p-2.5"
            >
                {#each simulationTypes as type}
                    <option value={type.id}>{type.label}</option>
                {/each}
            </select>
        </div>
        
        <div>
            <label for="trafficVolume" class="block text-sm font-medium text-gray-300 mb-2">
                Traffic Volume: {trafficVolume}%
            </label>
            <input 
                type="range" 
                id="trafficVolume"
                bind:value={trafficVolume}
                min="1" 
                max="100" 
                class="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
            >
        </div>
        
        <div>
            <label for="attackIntensity" class="block text-sm font-medium text-gray-300 mb-2">
                Attack Intensity: {attackIntensity}%
            </label>
            <input 
                type="range" 
                id="attackIntensity"
                bind:value={attackIntensity}
                min="1" 
                max="100" 
                class="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
            >
        </div>
        
        <div>
            <label for="detectionSensitivity" class="block text-sm font-medium text-gray-300 mb-2">
                Detection Sensitivity: {detectionSensitivity}%
            </label>
            <input 
                type="range" 
                id="detectionSensitivity"
                bind:value={detectionSensitivity}
                min="1" 
                max="100" 
                class="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
            >
        </div>
        
        <div class="flex justify-between gap-4 mt-4">
            <button 
                on:click={runSimulation}
                class="flex-1 px-5 py-2.5 bg-cyan-500 text-slate-900 rounded-xl font-medium 
                hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
                Run Simulation
            </button>
            <button 
                on:click={resetSimulation}
                class="px-5 py-2.5 bg-transparent text-white border border-white/20
                rounded-xl hover:border-white/40 transition-all duration-300"
            >
                Reset
            </button>
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