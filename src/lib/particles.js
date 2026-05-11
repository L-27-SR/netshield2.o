export function initParticles(canvas) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    let animationFrameId;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        };
    }
    
    // Initialize particles
    function init() {
        resizeCanvas();
        particles.length = 0;
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        ctx.strokeStyle = 'rgba(0, 246, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 246, 255, 0.2)';
            ctx.fill();
        });
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', init);
    init();
    animate();
    
    // Cleanup function
    return () => {
        window.removeEventListener('resize', init);
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
}

export function initGraphAnimation(canvas) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const nodes = [];
    const edges = [];
    let animationFrameId;
    
    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
    
    class Node {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.targetX = Math.random() * canvas.width;
            this.targetY = Math.random() * canvas.height;
            this.size = 4;
            this.speed = 0.02;
            this.progress = 0;
        }
        
        update() {
            this.progress += this.speed;
            if (this.progress >= 1) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.targetX = Math.random() * canvas.width;
                this.targetY = Math.random() * canvas.height;
                this.progress = 0;
            }
            
            const t = easeInOutCubic(this.progress);
            this.currentX = lerp(this.x, this.targetX, t);
            this.currentY = lerp(this.y, this.targetY, t);
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.currentX, this.currentY, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 246, 255, 0.6)';
            ctx.fill();
        }
    }
    
    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
    
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    function createEdge(node1, node2) {
        edges.push({ from: node1, to: node2 });
    }
    
    function init() {
        resizeCanvas();
        nodes.length = 0;
        edges.length = 0;
        
        // Create nodes
        for (let i = 0; i < 8; i++) {
            nodes.push(new Node());
        }
        
        // Create edges between nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (Math.random() < 0.3) { // 30% chance to create an edge
                    createEdge(nodes[i], nodes[j]);
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw edges
        edges.forEach(edge => {
            const distance = Math.hypot(
                edge.from.currentX - edge.to.currentX,
                edge.from.currentY - edge.to.currentY
            );
            
            const opacity = Math.max(0, 1 - distance / 200);
            ctx.beginPath();
            ctx.moveTo(edge.from.currentX, edge.from.currentY);
            ctx.lineTo(edge.to.currentX, edge.to.currentY);
            ctx.strokeStyle = `rgba(0, 246, 255, ${opacity * 0.2})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        
        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', init);
    init();
    animate();
    
    return () => {
        window.removeEventListener('resize', init);
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
}
