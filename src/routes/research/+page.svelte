<script lang="ts">
    import { fade } from 'svelte/transition';
    import { initParticles } from '$lib/particles.ts';
    import { onMount } from 'svelte';
    import ImageCard from '$lib/components/ImageCard.svelte';
    
    // Import all research-related images
    import dataTransfer from '$assets/images/DataUtransferUinUaUgivenUduration.png';
    import distribution from '$assets/images/DistributionUofUnetworkUtrafficUlabels.png';
    import gatAccuracy from '$assets/images/GATUAccuracyUGRAPH.png';
    import gatConfusion from '$assets/images/GATUConfusionUmatrix.png';
    import gcnnAccuracy from '$assets/images/GCNNUAccuracyUGraph.png';
    import gcnAccuracy from '$assets/images/GCNNUAccuracyUGraph.png';
    import gcnConfusion from '$assets/images/GCNUConfusionUMatrix.png';
    import gcnRoc from '$assets/images/GCNUROCUCurve .png';
    import heavyTraffic from '$assets/images/HeavyUtrafficUbehaviour.png';
    import protocolUsed from '$assets/images/ProtocolUusedUbyUeachUTrafficUtype.png';
    import summaryKPIs from '$assets/images/SummaryUKPIs.png';
    import sumDuration from '$assets/images/SumUofUDuration.png';
    import trafficBehaviour from '$assets/images/TrafficUBehaviour.png';
    import rfcCm from '$assets/images/UrfcUcm.png';
    import gatGraph from '$assets/images/GATUGRAPH1.png';
    import gcnGraph from '$assets/images/GCNUGraph.png';
    import architecture from '$assets/images/Architecture.png';
    
    import type { Tab } from '$lib/types';
    
    let particlesCanvas: HTMLCanvasElement;
    let activeTab: string = 'dataset';
    const tabs: Tab[] = [
        { id: 'dataset', label: 'Dataset' },
        { id: 'graph', label: 'Graph Construction' },
        { id: 'model', label: 'Model Architecture' },
        { id: 'evaluation', label: 'Evaluation' }
    ];

    const colabLinks = {
        gat: 'https://colab.research.google.com/drive/1gZ9JlOfMzhQwMof41xDi9B6d-mbhS2JP?usp=sharing',
        gcn: 'https://colab.research.google.com/drive/18dIrwmhpUUqiJXyHhdQlAc56bNtYXmOe?usp=sharing'
    };

    onMount(() => {
        const cleanup = initParticles(particlesCanvas);
        return cleanup;
    });

    function setActiveTab(tabId: string): void {
        activeTab = tabId;
    }
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
                    <a href="/research" class="text-cyan-400">Research</a>
                    <a href="/simulation" class="text-white hover:text-cyan-400 transition-colors">Simulation</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-12 relative">
        <!-- Tabs -->
        <div class="flex flex-wrap gap-2 mb-12">
            <div class="w-full flex gap-2 p-1 bg-slate-800/30 backdrop-blur-sm rounded-2xl">
                {#each tabs as tab}
                    <button
                        class="flex-1 px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300
                        {activeTab === tab.id 
                            ? 'bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/20' 
                            : 'text-gray-400 hover:text-white hover:bg-slate-700/50'}"
                        on:click={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Content -->
        <div class="grid gap-8" in:fade={{duration: 200}}>
            {#if activeTab === 'dataset'}
                <div class="grid md:grid-cols-2 gap-8">
                    <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                        <h2 class="text-2xl font-bold text-cyan-400 mb-4 group-hover:text-cyan-300 transition-colors">IoT-23 Dataset Overview</h2>
                        <p class="text-gray-300 mb-6 group-hover:text-gray-200 transition-colors">
                            Comprehensive collection of IoT network traffic data featuring both benign and malicious patterns.
                            Contains 23 scenarios covering various attack types and normal operations.
                        </p>
                        <div class="bg-slate-900/50 rounded-xl p-6 font-mono text-sm text-gray-300 border border-slate-800/50 group-hover:border-slate-700/50 transition-colors">
                            <pre class="group-hover:text-gray-200">Dataset Statistics:
├── Total Sessions: 325,000
├── Attack Types: 7
├── Benign Traffic: 76%
└── Malicious Traffic: 24%</pre>
                        </div>
                    </div>
                    
                    <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                        <h2 class="text-2xl font-bold text-cyan-400 mb-4">Data Distribution</h2>
                        <ImageCard 
                            src={distribution} 
                            alt="Distribution of network traffic labels"
                            caption="Distribution of network traffic labels across the dataset" 
                        />
                    </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-8 mt-8">
                    <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                        <h2 class="text-2xl font-bold text-cyan-400 mb-4">Traffic Behavior Analysis</h2>
                        <ImageCard 
                            src={trafficBehaviour} 
                            alt="Traffic behavior patterns"
                            caption="Visualization of traffic behavior patterns" 
                        />
                    </div>
                    
                    <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                        <h2 class="text-2xl font-bold text-cyan-400 mb-4">Protocol Distribution</h2>
                        <ImageCard 
                            src={protocolUsed} 
                            alt="Protocol distribution by traffic type"
                            caption="Protocols used by each traffic type" 
                        />
                    </div>
                </div>
            {/if}

            {#if activeTab === 'graph'}
                <div class="grid md:grid-cols-2 gap-8">
                    <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                        <h2 class="text-2xl font-bold text-cyan-400 mb-4">Graph Construction Process</h2>
                        <p class="text-gray-300 mb-4">
                            Network traffic is transformed into a temporal graph structure where nodes represent devices
                            and edges represent network interactions.
                        </p>
                        <ImageCard 
                            src={heavyTraffic}
                            alt="Network graph construction process" 
                            caption="Converting network traffic to graph representation"
                        />
                    </div>
                    
                    <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                        <h2 class="text-2xl font-bold text-cyan-400 mb-4">Feature Engineering</h2>
                        <div class="bg-slate-900/50 rounded-xl p-4 font-mono text-sm text-gray-300">
                            <pre>Node Features:
├── Device Type
├── Protocol Distribution
├── Traffic Volume
└── Connection States

Edge Features:
├── Protocol Type
├── Duration
├── Bytes Transferred
└── Port Numbers</pre>
                        </div>
                    </div>
                </div>
            {/if}

            {#if activeTab === 'model'}
                <!-- Overall Architecture -->
                <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                    <h2 class="text-2xl font-bold text-cyan-400 mb-4">Overall Architecture</h2>
                    <p class="text-gray-300 mb-6">
                        The NetShield pipeline processes raw network flows into graph structures and passes them
                        through GNN-based classifiers to detect malicious traffic patterns.
                    </p>
                    <ImageCard
                        src={architecture}
                        alt="NetShield overall architecture diagram"
                        caption="End-to-end architecture of the NetShield detection system"
                    />
                </div>

                <!-- GAT Model -->
                <div class="grid md:grid-cols-2 gap-8">
                    <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-2xl font-bold text-cyan-400">Graph Attention Network (GAT)</h2>
                            <a
                                href={colabLinks.gat}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 hover:border-amber-400/50 transition-all duration-200"
                            >
                                <!-- Colab icon -->
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.9 4.8C14.9 2.8 12.4 1.8 9.8 1.8c-5.2 0-9.5 4.3-9.5 9.5s4.3 9.5 9.5 9.5c4.5 0 8.3-3.1 9.2-7.4h-2.5c-.9 2.8-3.5 4.9-6.7 4.9-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9c1.9 0 3.6.8 4.9 2l-3.8 3.8H22V.2l-5.1 4.6z"/>
                                </svg>
                                Open in Colab
                            </a>
                        </div>
                        <p class="text-gray-300 mb-4">
                            The Graph Attention Network leverages attention mechanisms to weigh the importance
                            of neighbouring nodes during message passing.
                        </p>
                        <ImageCard
                            src={gatGraph}
                            alt="GAT training graph"
                            caption="GAT accuracy and loss curves during training"
                        />
                    </div>

                    <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-2xl font-bold text-cyan-400">GAT Accuracy</h2>
                        </div>
                        <ImageCard
                            src={gatAccuracy}
                            alt="GAT accuracy graph"
                            caption="GAT model accuracy over training epochs"
                        />
                        <div class="mt-4 bg-slate-900/50 rounded-xl p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                            <pre>class GNNLayer(nn.Module):
    def __init__(self):
        super().__init__()
        self.gat = GATConv(
            in_channels=64,
            out_channels=64,
            heads=4
        )</pre>
                        </div>
                    </div>
                </div>

                <!-- GCN Model -->
                <div class="grid md:grid-cols-2 gap-8">
                    <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-2xl font-bold text-cyan-400">Graph Convolutional Network (GCN)</h2>
                            <a
                                href={colabLinks.gcn}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 hover:border-amber-400/50 transition-all duration-200"
                            >
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.9 4.8C14.9 2.8 12.4 1.8 9.8 1.8c-5.2 0-9.5 4.3-9.5 9.5s4.3 9.5 9.5 9.5c4.5 0 8.3-3.1 9.2-7.4h-2.5c-.9 2.8-3.5 4.9-6.7 4.9-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9c1.9 0 3.6.8 4.9 2l-3.8 3.8H22V.2l-5.1 4.6z"/>
                                </svg>
                                Open in Colab
                            </a>
                        </div>
                        <p class="text-gray-300 mb-4">
                            The Graph Convolutional Network applies spectral convolutions over the graph structure
                            to aggregate neighbourhood features for classification.
                        </p>
                        <ImageCard
                            src={gcnGraph}
                            alt="GCN training graph"
                            caption="GCN accuracy and loss curves during training"
                        />
                    </div>

                    <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-2xl font-bold text-cyan-400">GCN Accuracy</h2>
                        </div>
                        <ImageCard
                            src={gcnAccuracy}
                            alt="GCN accuracy graph"
                            caption="GCN model accuracy over training epochs"
                        />
                    </div>
                </div>
            {/if}

            {#if activeTab === 'evaluation'}
                <div class="grid md:grid-cols-2 gap-8">
                    <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                        <h2 class="text-2xl font-bold text-cyan-400 mb-4">Performance Metrics</h2>
                        <ImageCard 
                            src={gcnRoc} 
                            alt="Performance metrics" 
                            caption="ROC curve showing detection performance"
                        />
                    </div>
                    
                    <div class="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                        <h2 class="text-2xl font-bold text-cyan-400 mb-4">Comparative Analysis</h2>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-300">NetShield (Ours)</span>
                                <div class="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div class="w-[92%] h-full bg-cyan-400"></div>
                                </div>
                                <span class="text-cyan-400">92%</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-300">Baseline GCN</span>
                                <div class="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div class="w-[78%] h-full bg-gray-400"></div>
                                </div>
                                <span class="text-gray-400">78%</span>
                            </div>
                        </div>

                        <!-- Colab links in evaluation tab for quick access -->
                        <div class="mt-8 pt-6 border-t border-slate-700">
                            <p class="text-sm text-gray-400 mb-3">Explore the model notebooks:</p>
                            <div class="flex flex-col gap-3">
                                <a
                                    href={colabLinks.gat}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 hover:border-amber-400/50 transition-all duration-200"
                                >
                                    <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.9 4.8C14.9 2.8 12.4 1.8 9.8 1.8c-5.2 0-9.5 4.3-9.5 9.5s4.3 9.5 9.5 9.5c4.5 0 8.3-3.1 9.2-7.4h-2.5c-.9 2.8-3.5 4.9-6.7 4.9-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9c1.9 0 3.6.8 4.9 2l-3.8 3.8H22V.2l-5.1 4.6z"/>
                                    </svg>
                                    GAT Notebook — Open in Colab
                                </a>
                                <a
                                    href={colabLinks.gcn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 hover:border-amber-400/50 transition-all duration-200"
                                >
                                    <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.9 4.8C14.9 2.8 12.4 1.8 9.8 1.8c-5.2 0-9.5 4.3-9.5 9.5s4.3 9.5 9.5 9.5c4.5 0 8.3-3.1 9.2-7.4h-2.5c-.9 2.8-3.5 4.9-6.7 4.9-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9c1.9 0 3.6.8 4.9 2l-3.8 3.8H22V.2l-5.1 4.6z"/>
                                    </svg>
                                    GCN Notebook — Open in Colab
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    :global(html) {
        scroll-behavior: smooth;
    }
</style>