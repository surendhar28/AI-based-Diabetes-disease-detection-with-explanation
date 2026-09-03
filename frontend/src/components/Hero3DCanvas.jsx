import React, { useEffect, useRef } from 'react';

export default function Hero3DCanvas({ mode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for 3D tilt interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left - width / 2) * 0.0015;
      targetMouseY = (e.clientY - rect.top - height / 2) * 0.0015;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Create 3D particles & 4 Agent Nodes
    const particleCount = 180;
    const particles = [];

    const agentNodes = [
      { name: 'Diabetes', color: '#14b8a6', radius: 18, angleOffset: 0 },
      { name: 'Heart', color: '#f43f5e', radius: 18, angleOffset: (Math.PI * 2) / 4 },
      { name: 'Kidney', color: '#f59e0b', radius: 18, angleOffset: (Math.PI * 4) / 4 },
      { name: 'Lung', color: '#0284c7', radius: 18, angleOffset: (Math.PI * 6) / 4 },
    ];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 120 + Math.random() * 260;

      particles.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        baseRadius: radius,
        theta,
        phi,
        speed: (Math.random() * 0.002 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2.5 + 1.2,
      });
    }

    let rotationX = 0;
    let rotationY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      rotationY += 0.003 + mouseX * 0.1;
      rotationX += mouseY * 0.1;

      const fov = 400; // 3D Perspective field of view
      const centerX = width / 2;
      const centerY = height / 2;

      // Color scheme based on mode
      const nodeLineColor = mode === 'light' ? 'rgba(15, 118, 110, 0.15)' : 'rgba(20, 184, 166, 0.2)';
      const pColor = mode === 'light' ? 'rgba(15, 118, 110, 0.4)' : 'rgba(45, 212, 191, 0.6)';

      const projectedParticles = [];

      // Transform & Project Particles in 3D
      particles.forEach((p) => {
        p.theta += p.speed;
        p.x = p.baseRadius * Math.sin(p.phi) * Math.cos(p.theta);
        p.y = p.baseRadius * Math.sin(p.phi) * Math.sin(p.theta);

        // Rotate around Y
        let rx1 = p.x * Math.cos(rotationY) - p.z * Math.sin(rotationY);
        let rz1 = p.x * Math.sin(rotationY) + p.z * Math.cos(rotationY);

        // Rotate around X
        let ry1 = p.y * Math.cos(rotationX) - rz1 * Math.sin(rotationX);
        let rz2 = p.y * Math.sin(rotationX) + rz1 * Math.cos(rotationX);

        // Perspective Projection
        const scale = fov / (fov + rz2 + 350);
        const projX = rx1 * scale + centerX;
        const projY = ry1 * scale + centerY;

        projectedParticles.push({
          x: projX,
          y: projY,
          scale,
          z: rz2,
          size: p.size * scale,
        });

        // Draw particle dot
        if (scale > 0) {
          ctx.beginPath();
          ctx.arc(projX, projY, Math.max(p.size * scale, 0.5), 0, Math.PI * 2);
          ctx.fillStyle = pColor;
          ctx.globalAlpha = Math.min(Math.max((rz2 + 300) / 600, 0.1), 0.8);
          ctx.fill();
        }
      });

      // Connect near particles in 3D
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projectedParticles.length; i += 4) {
        for (let j = i + 1; j < projectedParticles.length; j += 12) {
          const dx = projectedParticles[i].x - projectedParticles[j].x;
          const dy = projectedParticles[i].y - projectedParticles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(projectedParticles[i].x, projectedParticles[i].y);
            ctx.lineTo(projectedParticles[j].x, projectedParticles[j].y);
            ctx.strokeStyle = nodeLineColor;
            ctx.globalAlpha = (1 - dist / 90) * 0.4;
            ctx.stroke();
          }
        }
      }

      // Render 4 Agent Core Orbs in 3D
      agentNodes.forEach((agent) => {
        const orbitRadius = 180;
        const orbitAngle = rotationY * 1.5 + agent.angleOffset;

        const ax = Math.cos(orbitAngle) * orbitRadius;
        const ay = Math.sin(orbitAngle * 0.8) * 50;
        const az = Math.sin(orbitAngle) * orbitRadius;

        // Rotate X
        const ry = ay * Math.cos(rotationX) - az * Math.sin(rotationX);
        const rz = ay * Math.sin(rotationX) + az * Math.cos(rotationX);

        const scale = fov / (fov + rz + 350);
        const projX = ax * scale + centerX;
        const projY = ry * scale + centerY;

        if (scale > 0) {
          // Draw Glowing 3D Agent Core
          const glowRadius = Math.max(agent.radius * scale * 2.5, 5);
          const radGrad = ctx.createRadialGradient(projX, projY, 0, projX, projY, glowRadius);
          radGrad.addColorStop(0, agent.color);
          radGrad.addColorStop(0.5, `${agent.color}66`);
          radGrad.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(projX, projY, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = radGrad;
          ctx.globalAlpha = Math.min(Math.max((rz + 300) / 500, 0.3), 1.0);
          ctx.fill();

          // Core Solid Orb
          ctx.beginPath();
          ctx.arc(projX, projY, Math.max(agent.radius * scale * 0.6, 3), 0, Math.PI * 2);
          ctx.fillStyle = mode === 'light' ? '#ffffff' : '#080c0f';
          ctx.strokeStyle = agent.color;
          ctx.lineWidth = 3 * scale;
          ctx.fill();
          ctx.stroke();

          // Connect Agent Core to Center
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(projX, projY);
          ctx.strokeStyle = agent.color;
          ctx.globalAlpha = 0.35;
          ctx.lineWidth = 1.5 * scale;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
