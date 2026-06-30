(function () {
  const canvas = document.getElementById("ambient-canvas");
  if (!canvas) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const pointer = { x: 0, y: 0, active: false };
  let width = 0;
  let height = 0;
  let ratio = 1;
  let particles = [];
  let ribbons = [];

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function resize() {
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    buildScene();
  }

  function buildScene() {
    const particleCount = Math.min(96, Math.max(42, Math.floor(width / 20)));
    particles = Array.from({ length: particleCount }, (_, index) => ({
      x: rand(0, width),
      y: rand(0, height),
      r: rand(1.2, 3.6),
      vx: rand(-0.22, 0.22),
      vy: rand(0.18, 0.72),
      hue: index % 4 === 0 ? "255, 111, 203" : index % 3 === 0 ? "87, 240, 198" : "255, 207, 90",
      alpha: rand(0.34, 0.82)
    }));

    ribbons = [
      makeRibbon(-160, height * 0.18, width * 0.32, "#57f0c6", 0.28, 0.14),
      makeRibbon(width * 0.72, height * 0.08, width * 0.38, "#a855f7", 0.26, 0.1),
      makeRibbon(-120, height * 0.78, width * 0.42, "#ffcf5a", 0.2, 0.08),
      makeRibbon(width * 0.78, height * 0.72, width * 0.36, "#22c55e", 0.18, 0.12)
    ];
  }

  function makeRibbon(x, y, size, color, alpha, speed) {
    return {
      x,
      y,
      size,
      color,
      alpha,
      speed,
      phase: rand(0, Math.PI * 2),
      points: Array.from({ length: 7 }, (_, index) => ({
        x: index * rand(0.18, 0.34),
        y: rand(-0.42, 0.42)
      }))
    };
  }

  function drawBackground(time) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0a0d1c");
    gradient.addColorStop(0.48, "#0b111b");
    gradient.addColorStop(1, "#070b12");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(
      width * (0.2 + Math.sin(time * 0.00018) * 0.08),
      height * 0.24,
      0,
      width * 0.24,
      height * 0.2,
      Math.max(width, height) * 0.55
    );
    glow.addColorStop(0, "rgba(87, 240, 198, 0.14)");
    glow.addColorStop(1, "rgba(87, 240, 198, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  function drawRibbons(time) {
    ribbons.forEach((ribbon, ribbonIndex) => {
      const driftX = Math.sin(time * 0.00022 + ribbon.phase) * 34;
      const driftY = Math.cos(time * 0.00018 + ribbon.phase) * 24;
      const mouseX = pointer.active ? (pointer.x - width / 2) * ribbon.speed : 0;
      const mouseY = pointer.active ? (pointer.y - height / 2) * ribbon.speed : 0;
      const originX = ribbon.x + driftX + mouseX;
      const originY = ribbon.y + driftY + mouseY;

      for (let i = 0; i < ribbon.points.length - 2; i += 1) {
        const p1 = ribbon.points[i];
        const p2 = ribbon.points[i + 1];
        const p3 = ribbon.points[i + 2];
        const wobble = Math.sin(time * 0.001 + i + ribbonIndex) * ribbon.size * 0.04;

        ctx.beginPath();
        ctx.moveTo(originX + p1.x * ribbon.size, originY + p1.y * ribbon.size + wobble);
        ctx.lineTo(originX + p2.x * ribbon.size, originY + p2.y * ribbon.size - wobble);
        ctx.lineTo(originX + p3.x * ribbon.size, originY + p3.y * ribbon.size + wobble * 0.5);
        ctx.closePath();
        ctx.fillStyle = hexToRgba(ribbon.color, ribbon.alpha + i * 0.018);
        ctx.fill();
        ctx.strokeStyle = hexToRgba("#ffffff", 0.04);
        ctx.stroke();
      }
    });
  }

  function drawParticles() {
    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.y > height + 20) {
        particle.y = -20;
        particle.x = rand(0, width);
      }
      if (particle.x < -20) {
        particle.x = width + 20;
      }
      if (particle.x > width + 20) {
        particle.x = -20;
      }

      const dx = pointer.x - particle.x;
      const dy = pointer.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (pointer.active && distance < 160) {
        particle.x -= dx * 0.002;
        particle.y -= dy * 0.002;
      }

      ctx.beginPath();
      ctx.ellipse(particle.x, particle.y, particle.r * 1.5, particle.r, Math.PI * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + particle.hue + ", " + particle.alpha + ")";
      ctx.shadowColor = "rgba(" + particle.hue + ", 0.55)";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 118) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = "rgba(133, 155, 255, " + (0.08 * (1 - distance / 118)).toFixed(3) + ")";
          ctx.stroke();
        }
      }
    }
  }

  function hexToRgba(hex, alpha) {
    const value = hex.replace("#", "");
    const red = parseInt(value.slice(0, 2), 16);
    const green = parseInt(value.slice(2, 4), 16);
    const blue = parseInt(value.slice(4, 6), 16);
    return "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
  }

  function tick(time) {
    drawBackground(time);
    drawRibbons(time);
    drawParticles();
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  resize();
  requestAnimationFrame(tick);
})();
