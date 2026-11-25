(() => {
  const canvas = document.getElementById("dust");
  const context = canvas?.getContext("2d", { alpha: true });
  if (!canvas || !context) return;

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const particles = [];
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let frameId = 0;
  let previousTime = 0;

  function seedParticles() {
    const count = Math.min(56, Math.max(16, Math.round(width * height / 36000)));
    particles.length = 0;
    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        radius: .3 + Math.random() * .85,
        rise: 2 + Math.random() * 5,
        drift: (Math.random() - .5) * 3,
        sway: 2 + Math.random() * 9,
        alpha: .12 + Math.random() * .28,
        phase: Math.random() * Math.PI * 2,
        tint: Math.random() > .48 ? "#d8ffb3" : "#b5f878"
      });
    }
  }

  function drawDust(time, elapsed = 0, animate = false) {
    context.clearRect(0, 0, width, height);
    for (const particle of particles) {
      if (animate && width > 0 && height > 0) {
        particle.y -= particle.rise * elapsed / height;
        particle.x += particle.drift * elapsed / width;
        if (particle.y < -.03) {
          particle.y = 1.04;
          particle.x = Math.random();
        }
        if (particle.x < -.03) particle.x = 1.03;
        if (particle.x > 1.03) particle.x = -.03;
      }

      const shimmer = animate ? .68 + .32 * Math.sin(time * .0011 + particle.phase) : .78;
      const x = particle.x * width + Math.sin(time * .00035 + particle.phase) * particle.sway;
      const y = particle.y * height;
      context.globalAlpha = particle.alpha * shimmer;
      context.fillStyle = particle.tint;
      context.shadowColor = particle.tint;
      context.shadowBlur = particle.radius * 3;
      context.beginPath();
      context.arc(x, y, particle.radius, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
    context.shadowBlur = 0;
  }

  function animate(time) {
    if (document.hidden || motionPreference.matches) {
      frameId = 0;
      drawDust(0);
      return;
    }
    const elapsed = previousTime ? Math.min((time - previousTime) / 1000, .05) : 0;
    previousTime = time;
    drawDust(time, elapsed, true);
    frameId = window.requestAnimationFrame(animate);
  }

  function syncAnimation() {
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
    previousTime = 0;
    if (document.hidden || motionPreference.matches) {
      drawDust(0);
    } else {
      frameId = window.requestAnimationFrame(animate);
    }
  }

  function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    seedParticles();
    syncAnimation();
  }

  window.addEventListener("resize", resizeCanvas, { passive: true });
  document.addEventListener("visibilitychange", syncAnimation);
  motionPreference.addEventListener?.("change", syncAnimation);
  resizeCanvas();
})();
