<script>
    import { onMount } from 'svelte';
    import { initParticles, initGraphAnimation } from '$lib/particles';
    
    let particlesCanvas;
    let graphCanvas;
    
    // Animated counter for statistics
    function animateCount(element, target, duration = 2000) {
        let start = 0;
        const step = timestamp => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            element.textContent = Math.floor(progress * target).toLocaleString();
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }
    
    // Info cards data
    const infoCards = [
        {
            title: 'Advanced Methodology',
            description: 'Graph-based approach utilizing advanced topology analysis for real-time network traffic pattern detection and anomaly identification.',
            icon: '🔍'
        },
        {
            title: 'IoT-23 Dataset',
            description: 'Trained on the comprehensive IoT-23 dataset, featuring real-world benign and malicious IoT network traffic patterns.',
            icon: '📊'
        },
        {
            title: 'GNN Architecture',
            description: 'Implementing state-of-the-art Graph Convolutional Networks (GCN) and Graph Attention Networks (GAT) for superior pattern recognition.',
            icon: '🧠'
        }
    ];

    // Typewriter effect for hero text
    let displayText = "";
    let fullText = "Intelligent Network Intrusion Detection for IoT";
    let charIndex = 0;

    onMount(() => {
        const cleanupParticles = initParticles(particlesCanvas);
        const cleanupGraph = initGraphAnimation(graphCanvas);

        // Animate statistics when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target);
                    animateCount(el, target);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));

        // Setup typewriter effect
        const typewriterInterval = setInterval(() => {
            if (charIndex < fullText.length) {
                displayText += fullText[charIndex];
                charIndex++;
            } else {
                clearInterval(typewriterInterval);
            }
        }, 50);

        return () => {
            cleanupParticles();
            cleanupGraph();
            observer.disconnect();
            clearInterval(typewriterInterval);
        };
    });
</script>

<!-- Navigation -->
<nav class="fixed w-full bg-slate-900/90 backdrop-blur-sm z-50 px-6 py-4">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <div class="w-6 h-6 rounded-full bg-cyan-400/40 flex items-center justify-center">
                    <div class="w-4 h-4 rounded-full bg-cyan-300"></div>
                </div>
            </div>
            <span class="text-cyan-400 font-bold text-xl">NetShield</span>
        </div>
        <div class="space-x-8">
            <a href="/research" class="text-white hover:text-cyan-400 transition-colors duration-300">Research</a>
            <a href="/analytics" class="text-white hover:text-cyan-400 transition-colors duration-300">Analytics</a>
            <a href="/simulation" class="text-white hover:text-cyan-400 transition-colors duration-300">Simulation</a>
        </div>
    </div>
</nav>

<main class="min-h-screen bg-slate-900 text-white relative overflow-hidden">
    <canvas
        bind:this={particlesCanvas}
        class="absolute inset-0 w-full h-full opacity-30"
    ></canvas>
    
    <!-- Hero Section -->
    <div class="relative pt-32 pb-20 px-6">
        <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h1 class="text-5xl md:text-7xl font-bold mb-6">
                    <span class="text-cyan-400">Net</span>Shield
                    <div class="relative w-16 h-1 bg-cyan-400 mt-4 overflow-hidden">
                        <div class="absolute inset-0 bg-cyan-300 animate-pulse"></div>
                    </div>
                </h1>
                <p class="text-2xl md:text-3xl mb-8 text-gray-300 font-light h-20">
                    {displayText}
                    <span class="animate-blink">|</span>
                </p>
                <p class="max-w-2xl text-gray-400 mb-12 text-lg">
                    Leveraging the power of graph neural networks to detect and prevent network 
                    intrusions in IoT environments with unprecedented accuracy and real-time 
                    response capabilities.
                </p>
                <div class="flex gap-4">
                    <a
                        href="/simulation"
                        class="inline-block px-8 py-4 bg-slate-800 text-cyan-400 border border-cyan-400
                        rounded-2xl hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300
                        shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40"
                    >
                        Launch Simulation
                    </a>
                    <a
                        href="/research"
                        class="inline-block px-8 py-4 bg-transparent text-white border border-white/20
                        rounded-2xl hover:border-white/40 transition-all duration-300"
                    >
                        View Research
                    </a>
                </div>
            </div>
            <div class="relative aspect-square w-full max-w-lg mx-auto">
                <canvas
                    bind:this={graphCanvas}
                    class="absolute inset-0 w-full h-full"
                ></canvas>
            </div>
        </div>
    </div>

    <!-- Statistics Section -->
    <div class="relative px-6 py-16 bg-gradient-to-b from-slate-900/0 via-slate-800/50 to-slate-900/0">
        <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div class="p-6">
                <div class="text-4xl font-bold text-cyan-400 mb-2">
                    <span class="stat-number" data-target="87">0</span>%
                </div>
                <div class="text-gray-400">Detection Accuracy</div>
            </div>
            <div class="p-6">
                <div class="text-4xl font-bold text-cyan-400 mb-2">
                    <span class="stat-number" data-target="500">0</span>ms
                </div>
                <div class="text-gray-400">Response Time</div>
            </div>
            <div class="p-6">
                <div class="text-4xl font-bold text-cyan-400 mb-2">
                    <span class="stat-number" data-target="1000000">0</span>+
                </div>
                <div class="text-gray-400">Network Packets Analyzed</div>
            </div>
            <div class="p-6">
                <div class="text-4xl font-bold text-cyan-400 mb-2">
                    <span class="stat-number" data-target="5">0</span>
                </div>
                <div class="text-gray-400">Attack Types Detected</div>
            </div>
        </div>
    </div>
    
    <!-- Info Cards -->
    <div class="px-6 pb-24">
        <div class="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {#each infoCards as card}
                <div 
                    class="group p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700
                    hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10"
                >
                    <div class="text-4xl mb-4">{card.icon}</div>
                    <h3 class="text-xl font-semibold mb-3 text-cyan-400">{card.title}</h3>
                    <p class="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {card.description}
                    </p>
                </div>
            {/each}
        </div>
    </div>

    <!-- Features Section -->
    <div class="px-6 py-24 bg-slate-800/30">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold mb-12 text-center">
                <span class="text-cyan-400">Advanced</span> Features
            </h2>
            <div class="grid md:grid-cols-2 gap-8">
                <div class="group p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700
                    hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10">
                    <div class="flex items-start gap-4">
                        <div class="p-3 rounded-lg bg-cyan-400/10 text-cyan-400">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z">
                                </path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold mb-2 text-cyan-400">Real-time Protection</h3>
                            <p class="text-gray-400">Continuous monitoring and instant threat detection with 
                            sub-second response times for immediate protection.</p>
                        </div>
                    </div>
                </div>
                <div class="group p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700
                    hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10">
                    <div class="flex items-start gap-4">
                        <div class="p-3 rounded-lg bg-cyan-400/10 text-cyan-400">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M13 10V3L4 14h7v7l9-11h-7z">
                                </path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold mb-2 text-cyan-400">Adaptive Learning</h3>
                            <p class="text-gray-400">Self-improving system that continuously learns from new 
                            threat patterns and network behaviors.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    :global(html) {
        scroll-behavior: smooth;
    }

    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }

    .animate-blink {
        animation: blink 1s infinite;
    }
</style>
