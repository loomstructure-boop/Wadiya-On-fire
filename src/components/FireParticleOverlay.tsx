import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

interface FireParticleOverlayProps {
  burstOrigin: { x: number; y: number } | null;
  trailOrigin?: { x: number; y: number } | null;
}

export const FireParticleOverlay: React.FC<FireParticleOverlayProps> = ({
  burstOrigin,
  trailOrigin,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const trailRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    trailRef.current = trailOrigin || null;
  }, [trailOrigin]);

  // Trigger fire sparks explosion when burstOrigin changes
  useEffect(() => {
    if (!burstOrigin) return;

    const colors = ['#ffffff', '#fef08a', '#facc15', '#f97316', '#ef4444', '#dc2626'];
    const burstCount = 65;

    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.5;
      const life = Math.random() * 40 + 35;

      particlesRef.current.push({
        x: burstOrigin.x,
        y: burstOrigin.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 2, // upward drift
        size: Math.random() * 5 + 2.5,
        alpha: 1,
        life: 0,
        maxLife: life,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }, [burstOrigin]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, 1000, 1000);

      // 1. Runner Fire Trail Particle Generation
      if (trailRef.current) {
        const trailColors = ['#fef08a', '#fbbf24', '#f97316', '#ef4444'];
        // Spawn 3-4 trailing embers per frame behind the moving token
        for (let t = 0; t < 3; t++) {
          particlesRef.current.push({
            x: trailRef.current.x + (Math.random() - 0.5) * 14,
            y: trailRef.current.y + (Math.random() - 0.5) * 8 + 8, // near feet
            vx: (Math.random() - 0.5) * 1.5,
            vy: -(Math.random() * 2.2 + 0.8), // rising flame embers
            size: Math.random() * 4 + 2,
            alpha: 0.9,
            life: 0,
            maxLife: Math.random() * 25 + 15,
            color: trailColors[Math.floor(Math.random() * trailColors.length)],
          });
        }
      }

      // 2. Ambient Volcanic Embers (subtle background floating sparks)
      if (Math.random() < 0.25) {
        particlesRef.current.push({
          x: Math.random() * 1000,
          y: 990,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(Math.random() * 1.5 + 0.8),
          size: Math.random() * 2.5 + 1.2,
          alpha: 0.8,
          life: 0,
          maxLife: Math.random() * 80 + 50,
          color: Math.random() > 0.5 ? '#f97316' : '#facc15',
        });
      }

      // 3. Update and render all particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // slight gravity for heavier sparks
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life / (p.maxLife * 1.3)), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={1000}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
