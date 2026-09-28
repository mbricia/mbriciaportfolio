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

  const projectDetails = {
    recruitment: {
      category: 'AI Automation · 2026',
      title: 'AI Recruitment & Candidate Pipeline',
      status: 'Repository available',
      summary: 'A connected recruitment workflow that turns candidate emails into structured records, supports recruiter decisions, and keeps follow-ups visible.',
      points: [
        'Connects four workflows for candidate intake, recruiter actions, reminders, and technical error handling.',
        'Prevents duplicate records and keeps key hiring decisions under human control.',
        'Uses AI for interpretation and message drafting, with structured records for review and follow-up.',
      ],
      stack: ['n8n', 'OpenAI', 'Gmail', 'Google Sheets'],
      links: [
        { label: 'View GitHub repository ↗', url: 'https://github.com/mbricia/n8n-ai-recruitment-candidate-pipeline' },
      ],
    },
    'lead-qualification': {
      category: 'AI Automation · 2026',
      title: 'AI Client Inquiry & Lead Qualification',
      status: 'Repository available',
      summary: 'An inquiry pipeline that validates submissions, extracts useful information, scores leads with clear business rules, and routes the next action.',
      points: [
        'Validates and deduplicates incoming submissions before processing.',
        'Uses AI for extraction and drafting while keeping business scoring rule-based.',
        'Routes Hot, Warm, and Cold leads into appropriate records and follow-up paths.',
      ],
      stack: ['n8n', 'OpenAI', 'APIs', 'JavaScript'],
      links: [
        { label: 'View GitHub repository ↗', url: 'https://github.com/mbricia/n8n-ai-lead-qualification-automation' },
      ],
    },
    inventory: {
      category: 'Business Automation · 2026',
      title: 'Inventory & Low-Stock Automation',
      status: 'Repository available',
      summary: 'A scheduled inventory workflow that checks thresholds, consolidates low-stock items, and produces clear alerts and status summaries.',
      points: [
        'Checks current stock against reorder thresholds on a schedule.',
        'Combines low-stock items into one readable reorder report.',
        'Handles the zero-low-stock case so it does not send a misleading alert.',
      ],
      stack: ['n8n', 'Google Sheets', 'Gmail', 'JavaScript'],
      links: [
        { label: 'View GitHub repository ↗', url: 'https://github.com/mbricia/n8n-inventory-low-stock-automation' },
      ],
    },
    'kopi-brews': {
      category: 'Mobile App',
      title: 'Kopi Brews Operations App',
      status: 'Private prototype',
      summary: 'A multi-user café operations prototype that brings ordering, inventory, sales insights, loyalty, rewards, and customer history into one application.',
      points: [
        'Supports administrator, cashier, and customer workflows in one application.',
        'Uses Firestore for operational records and real-time updates.',
        'Built as a private prototype and not publicly released.',
      ],
      stack: ['React Native', 'Firebase', 'Firestore'],
      links: [],
    },
    eleventh28: {
      category: 'Software Engineering · 2018–2019',
      title: 'Eleventh28 POS + Kitchen Display',
      status: 'Team capstone',
      summary: 'A restaurant desktop system built as a team capstone, covering cashier transactions, kitchen status, ingredient inventory, reporting, and database utilities.',
      points: [
        'Provides role-based access for Administrator, Cashier, and Cook users.',
        'Moves POS orders into a kitchen queue with status tracking.',
        'Links products to ingredients for costing and automatic stock deduction.',
      ],
      stack: ['C#', 'WinForms', 'MySQL', 'Crystal Reports'],
      links: [],
    },
    avenlo: {
      category: 'Web Products',
      title: 'AVENLO Web Products',
      status: 'Live demos',
      summary: 'A family of three responsive static websites built, documented, and deployed as independent product concepts.',
      points: [
        'AVENLO SaaS presents a focused software product landing experience.',
        'AVENLO Café explores a hospitality-focused brand and customer journey.',
        'AVENLO Portfolio provides a separate personal portfolio presentation.',
      ],
      stack: ['HTML', 'CSS', 'JavaScript'],
      links: [
        { label: 'Open AVENLO SaaS ↗', url: 'https://avenlo-saas.netlify.app/' },
        { label: 'Open AVENLO Café ↗', url: 'https://avenlo-cafe.netlify.app/' },
        { label: 'Open AVENLO Portfolio ↗', url: 'https://avenlo-portfolio.netlify.app/' },
      ],
    },
  };

  const projectDialog = document.getElementById('projectDialog');
  const projectDialogClose = document.getElementById('projectDialogClose');
  let lastProjectTrigger = null;

  const setProjectDialogContent = (project) => {
    document.getElementById('projectDialogCategory').textContent = project.category;
    document.getElementById('projectDialogTitle').textContent = project.title;
    document.getElementById('projectDialogStatus').textContent = project.status;
    document.getElementById('projectDialogSummary').textContent = project.summary;

    const points = document.getElementById('projectDialogPoints');
    points.replaceChildren(...project.points.map((point) => {
      const item = document.createElement('li');
      item.textContent = point;
      return item;
    }));

    const stack = document.getElementById('projectDialogStack');
    stack.replaceChildren(...project.stack.map((technology) => {
      const item = document.createElement('span');
      item.textContent = technology;
      return item;
    }));

    const links = document.getElementById('projectDialogLinks');
    links.replaceChildren(...project.links.map(({ label, url }) => {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = label;
      return link;
    }));
  };

  document.querySelectorAll('.project-open').forEach((button) => {
    button.addEventListener('click', () => {
      const project = projectDetails[button.dataset.project];
      if (!projectDialog || !project) return;
      lastProjectTrigger = button;
      setProjectDialogContent(project);
      projectDialog.showModal();
      document.body.classList.add('dialog-open');
    });
  });

  projectDialogClose?.addEventListener('click', () => projectDialog.close());
  projectDialog?.addEventListener('click', (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });
  projectDialog?.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    lastProjectTrigger?.focus();
  });

  const portfolioActivity = document.getElementById('portfolioActivity');
  const activitySnapshot = document.getElementById('activitySnapshot');
  const ACTIVITY_DAY_COUNT = 365;
  const GITHUB_ACTIVITY_REPOS = [
    'mbriciaportfolio',
    'n8n-ai-recruitment-candidate-pipeline',
    'n8n-ai-lead-qualification-automation',
    'n8n-inventory-low-stock-automation',
  ];
  const activityEndDate = new Date();
  activityEndDate.setUTCHours(23, 59, 59, 999);
  const activityStartDate = new Date(activityEndDate);
  activityStartDate.setUTCDate(activityEndDate.getUTCDate() - (ACTIVITY_DAY_COUNT - 1));
  activityStartDate.setUTCHours(0, 0, 0, 0);
  const GITHUB_ACTIVITY_API = 'https://api.github.com/repos/mbricia';

  const activityDateKey = (date) => date.toISOString().slice(0, 10);
  const formatActivityDate = (date) => new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  const getActivityLevel = (count) => {
    if (count >= 8) return 4;
    if (count >= 4) return 3;
    if (count >= 2) return 2;
    if (count >= 1) return 1;
    return 0;
  };

  const renderActivity = (commits) => {
    if (!portfolioActivity || !activitySnapshot) return;

    const commitsByDay = commits.reduce((counts, commit) => {
      const timestamp = commit?.commit?.author?.date || commit?.commit?.committer?.date;
      if (!timestamp) return counts;
      const key = activityDateKey(new Date(timestamp));
      counts.set(key, (counts.get(key) || 0) + 1);
      return counts;
    }, new Map());

    let totalCommits = 0;
    const cells = Array.from({ length: ACTIVITY_DAY_COUNT }, (_, index) => {
      const date = new Date(activityStartDate);
      date.setUTCDate(activityStartDate.getUTCDate() + index);
      const count = commitsByDay.get(activityDateKey(date)) || 0;
      totalCommits += count;

      const cell = document.createElement('span');
      cell.className = `activity-cell level-${getActivityLevel(count)}`;
      cell.title = `${formatActivityDate(date)} · ${count} ${count === 1 ? 'commit' : 'commits'}`;
      cell.style.setProperty('--i', Math.floor(index / 7));
      return cell;
    });

    portfolioActivity.replaceChildren(...cells);
    portfolioActivity.setAttribute(
      'aria-label',
      `Selected public repository activity from ${formatActivityDate(activityStartDate)} to ${formatActivityDate(activityEndDate)}: ${totalCommits} commits loaded.`
    );
    activitySnapshot.textContent = `Selected public repositories · live 12-month activity through ${formatActivityDate(activityEndDate)}`;
  };

  const fetchRepositoryCommits = async (repository) => {
    const commits = [];

    for (let page = 1; page <= 3; page += 1) {
      const url = `${GITHUB_ACTIVITY_API}/${repository}/commits?per_page=100&page=${page}&since=${encodeURIComponent(activityStartDate.toISOString())}`;
      const response = await fetch(url, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (!response.ok) throw new Error(`GitHub activity unavailable for ${repository}`);

      const pageCommits = await response.json();
      commits.push(...pageCommits);
      if (pageCommits.length < 100) break;
    }

    return commits;
  };

  const loadPortfolioActivity = async () => {
    if (!portfolioActivity || !activitySnapshot) return;

    renderActivity([]);

    try {
      const repositories = await Promise.all(GITHUB_ACTIVITY_REPOS.map(fetchRepositoryCommits));
      renderActivity(repositories.flat());
    } catch (_) {
      activitySnapshot.textContent = 'Selected public repositories · live activity temporarily unavailable';
      portfolioActivity.setAttribute('aria-label', 'Public GitHub build activity is temporarily unavailable');
    }
  };

  loadPortfolioActivity();

  requestAnimationFrame(() => {
    document.documentElement.classList.add('page-loaded');
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const particleCanvas = document.getElementById('particleBackground');
  const PARTICLE_AREA_DIVISOR_DESKTOP = 1750;
  const PARTICLE_AREA_DIVISOR_MOBILE = 2300;
  const PARTICLE_MIN_DESKTOP = 620;
  const PARTICLE_MAX_DESKTOP = 1000;
  const PARTICLE_MIN_MOBILE = 120;
  const PARTICLE_MAX_MOBILE = 190;

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

    const clampParticleCount = (value, min, max) => Math.min(max, Math.max(min, value));

    const getParticleCount = () => {
      const area = width * height;

      if (mobileQuery.matches) {
        return clampParticleCount(
          Math.round(area / PARTICLE_AREA_DIVISOR_MOBILE),
          PARTICLE_MIN_MOBILE,
          PARTICLE_MAX_MOBILE
        );
      }

      return clampParticleCount(
        Math.round(area / PARTICLE_AREA_DIVISOR_DESKTOP),
        PARTICLE_MIN_DESKTOP,
        PARTICLE_MAX_DESKTOP
      );
    };

    const buildParticles = () => {
      const count = getParticleCount();
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        depth: 0.35 + Math.random() * 0.85,
        radius: 0.5 + Math.random() * 1.15,
        alpha: 0.11 + Math.random() * 0.17,
        highlight: Math.random() < 0.18,
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

        const radius = particle.radius * particle.depth * (particle.highlight ? 1.5 : 1);
        const alpha = Math.min(particle.alpha + (particle.highlight ? 0.14 : 0), 0.34);

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
      '.bento-activity, .automation-milestones, .proof-stats, .project-card, .section-heading, .about-card, .contact-card'
    ),
  ];

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`);
  });

  document.querySelectorAll('.activity-cell').forEach((cell, index) => {
    cell.style.setProperty('--i', Math.floor(index / 7));
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
