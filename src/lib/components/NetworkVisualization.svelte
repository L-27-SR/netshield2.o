<script lang="ts">
    import { onMount } from 'svelte';

    export let nodes: Array<{id: string}> = [];
    export let edges: Array<{from: string, to: string, protocol: string, packetLength: number, interarrivalTime: number}> = [];
    export let canvasSize: {width: number, height: number} = { width: 500, height: 400 };
    
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let nodePositions: {[key: string]: {x: number, y: number}} = {};
    let animationFrameId: number;
    
    const drawNetwork = (): void => {
        if (!ctx) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        
        // Draw edges
        edges.forEach(edge => {
            const sourcePos = nodePositions[edge.from];
            const targetPos = nodePositions[edge.to];
            
            if (sourcePos && targetPos) {
                ctx.beginPath();
                ctx.moveTo(sourcePos.x, sourcePos.y);
                ctx.lineTo(targetPos.x, targetPos.y);
                
                // Style based on protocol
                switch (edge.protocol) {
                    case 'TCP':
                        ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';  // Green
                        break;
                    case 'UDP':
                        ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';  // Blue
                        break;
                    case 'ICMP':
                        ctx.strokeStyle = 'rgba(248, 113, 113, 0.6)'; // Red
                        break;
                    default:
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                }
                
                // Line width based on packet length (normalized)
                const normalizedWidth = Math.max(0.5, Math.min(3, edge.packetLength / 1000));
                ctx.lineWidth = normalizedWidth;
                
                ctx.stroke();
            }
        });
        
        // Draw nodes
        nodes.forEach(node => {
            const pos = nodePositions[node.id];
            if (pos) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(14, 165, 233, 0.8)';
                ctx.fill();
                
                ctx.fillStyle = 'white';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(node.id.split('.').pop() || '', pos.x, pos.y);
            }
        });
        
        // Request next frame
        animationFrameId = requestAnimationFrame(drawNetwork);
    };
    
    const initializePositions = (): void => {
        // Place nodes in a circle
        const radius = Math.min(canvasSize.width, canvasSize.height) * 0.35;
        const centerX = canvasSize.width / 2;
        const centerY = canvasSize.height / 2;
        
        nodes.forEach((node, index) => {
            const angle = (index / nodes.length) * Math.PI * 2;
            nodePositions[node.id] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        });
    };
    
    $: {
        // Re-initialize positions when nodes change
        if (nodes.length > 0 && canvas) {
            initializePositions();
        }
    }
    
    onMount(() => {
        ctx = canvas.getContext('2d');
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        
        if (nodes.length > 0) {
            initializePositions();
            drawNetwork();
        }
        
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    });
</script>

<canvas 
    bind:this={canvas} 
    width={canvasSize.width} 
    height={canvasSize.height} 
    class="rounded-lg bg-slate-900/70 border border-slate-700"
></canvas>