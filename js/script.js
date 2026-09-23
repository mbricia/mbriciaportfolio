(() => {
  const cvLinks = [...document.querySelectorAll('[data-cv-download]')];

  const downloadCv = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('assets/cv/Mark-Jhollan-Bricia-CV.base64.txt', { cache: 'no-store' });
      if (!response.ok) throw new Error('CV asset unavailable');

      const base64 = (await response.text()).trim();
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Mark-Jhollan-Bricia-Master-ATS-CV-v5.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1200);
    } catch (_) {
      window.open('Mark-Jhollan-Bricia-CV.pdf', '_blank', 'noopener');
    }
  };

  cvLinks.forEach((link) => link.addEventListener('click', downloadCv));

  requestAnimationFrame(() => {
    document.documentElement.classList.add('page-loaded');
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const particleCanvas = document.getElementById('particleBackground');
  const PARTICLE_COUNT_DESKTOP = 260;
  const PARTICLE_COUNT_MOBILE = 116;

  const initParticleBackground = () => {
    if (!particleCanvas) return;

    const context = particleCanvas.getContext('2d');
    if (!context) return;

    const mobileQuery = window.matchMedia('(max-width: 680px)');
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let width = window.innerWidth;
    let height = window.innerHeight;
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    let particles = [];
    let scrollTarget = window.scrollY * 0.025;
    let scrollShift = scrollTarget;
    let frameId = 0;
    let running = true;

    const buildParticles = () => {
      const count = mobileQuery.matches ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        depth: 0.35 + Math.random() * 0.85,
        radius: 0.38 + Math.random() * 0.9,
        alpha: 0.07 + Math.random() * 0.16,
        highlight: Math.random() < 0.12,
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.8,
      }));
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      particleCanvas.width = Math.round(width * pixelRatio);
      particleCanvas.height = Math.round(height * pixelRatio);
      particleCanvas.style.width = `${width}px`;
      particleCanvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      buildParticles();
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;
      scrollShift += (scrollTarget - scrollShift) * 0.04;

      const seconds = time * 0.001;

      particles.forEach((particle) => {
        const driftX = reduceMotion ? 0 : Math.sin(seconds * particle.speed + particle.phase) * 8 * particle.depth;
        const driftY = reduceMotion ? 0 : Math.cos(seconds * particle.speed * 0.72 + particle.phase) * 6 * particle.depth;
        const parallaxX = pointer.x * 18 * particle.depth;
        const parallaxY = pointer.y * 11 * particle.depth;
        const scrollY = (scrollShift * particle.depth) % (height + 40);

        let x = particle.x + driftX + parallaxX;
        let y = particle.y + driftY + parallaxY - scrollY * 0.18;

        x = ((x % width) + width) % width;
        y = ((y % height) + height) % height;

        const radius = particle.radius * particle.depth * (particle.highlight ? 1.35 : 1);
        const alpha = Math.min(particle.alpha + (particle.highlight ? 0.11 : 0), 0.34);

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(124, 224, 202, ${alpha})`;
        context.fill();
      });
    };

    const animate = (time) => {
      if (!running) return;
      draw(time);
      frameId = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event) => {
      if (mobileQuery.matches || reduceMotion) return;
      pointer.targetX = (event.clientX / Math.max(width, 1) - 0.5) * 2;
      pointer.targetY = (event.clientY / Math.max(height, 1) - 0.5) * 2;
    };

    const onScroll = () => {
      scrollTarget = window.scrollY * 0.025;
      if (reduceMotion) draw(0);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(frameId);
        return;
      }

      if (!running && !reduceMotion) {
        running = true;
        frameId = window.requestAnimationFrame(animate);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    if (reduceMotion) {
      draw(0);
    } else {
      frameId = window.requestAnimationFrame(animate);
    }
  };

  initParticleBackground();
  const revealTargets = [
    ...document.querySelectorAll(
      '.bento-proof > *, .project-card, .section-heading, .about-card, .contact-card'
    ),
  ];

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`);
  });

  document.querySelectorAll('.activity-cell').forEach((cell, index) => {
    cell.style.setProperty('--i', index);
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -7% 0px' }
    );

    revealTargets.forEach((element) => revealObserver.observe(element));
  }

  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = ['home', 'projects', 'about', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActiveNav = (sectionId) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${sectionId}`);
    });
  };

  setActiveNav('home');

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) setActiveNav(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.15, 0.35, 0.6] }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const sectionId = link.getAttribute('href')?.slice(1);
      if (sectionId) setActiveNav(sectionId);
    });
  });
})();
