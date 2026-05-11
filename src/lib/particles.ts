interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
}

export function initParticles(canvas: HTMLCanvasElement): (() => void) {
    if (!canvas) return () => {};
    
    const ctx = canvas.getContext('2d');
    const particles: Particle[] = [];
    let animationFrameId: number;
    
    function resizeCanvas(): void {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle(): Particle {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        };
    }
    
    // Initialize particles
    function init(): void {
        resizeCanvas();
        particles.length = 0;
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    // Update particle positions and draw
    function animate(): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Update
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen edges
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.y > canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = canvas.height;
            
            // Draw
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        });
        
        // Draw connections
        particles.forEach((particleA, i) => {
            particles.slice(i + 1).forEach(particleB => {
                const dx = particleA.x - particleB.x;
                const dy = particleA.y - particleB.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particleA.x, particleA.y);
                    ctx.lineTo(particleB.x, particleB.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.1;
                    ctx.stroke();
                }
            });
        });
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize and start animation
    init();
    animate();
    
    // Return cleanup function
    return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationFrameId);
    };
}
