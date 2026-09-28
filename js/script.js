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
      summary: 'A connected recruitment operations system that keeps AI interpretation separate from controlled hiring decisions.',
      problem: 'Recruitment work can scatter candidate intake, recruiter actions, follow-ups, and technical failures across separate manual steps.',
      build: [
        'Four cooperating n8n workflows share one recruitment datastore for intake, recruiter actions, reminders, and technical errors.',
        'AI handles email interpretation and candidate-facing draft generation; deterministic rules control deduplication, stage transitions, reminders, and logs.',
        'Recruiter decisions stay human-controlled, and communication is created as reviewable Gmail drafts rather than automatically sent.',
      ],
      proof: [
        'Tested candidate intake, duplicate blocking, existing-candidate/application handling, recruiter lifecycle actions, due/overdue reminders, and automatic error capture.',
        'Public workflow package includes 4 / 4 sanitized exports with synthetic evidence and no production candidate data.',
      ],
      stack: ['n8n', 'OpenAI', 'Gmail', 'Google Sheets'],
      links: [
        { label: 'View GitHub repository ↗', url: 'https://github.com/mbricia/n8n-ai-recruitment-candidate-pipeline' },
      ],
    },
    'lead-qualification': {
      category: 'AI Automation · 2026',
      title: 'AI Client Inquiry & Lead Qualification',
      status: 'Complete and tested',
      summary: 'An inquiry pipeline that validates submissions, extracts useful information, scores leads with explainable rules, and routes the next action.',
      problem: 'Manually reviewing every client inquiry takes time and can make high-value leads easier to miss.',
      build: [
        'Validates required fields and email format, then blocks duplicate inquiries before any AI call.',
        'AI extracts structured inquiry details and drafts replies; JavaScript applies deterministic 0–100 scoring and Hot / Warm / Cold routing.',
        'Returns explicit HTTP responses for valid, invalid, and duplicate submissions and uses a separate failure-alert workflow.',
      ],
      proof: [
        'Tested Hot, Warm, Cold, invalid-input, duplicate, HTTP-response, workflow-failure, and client-reply scenarios with controlled sample data.',
        'Version 1 is documented as complete and tested; the public repository uses sanitized exports and synthetic demo data.',
      ],
      stack: ['n8n', 'OpenAI', 'Webhooks', 'JavaScript'],
      links: [
        { label: 'View GitHub repository ↗', url: 'https://github.com/mbricia/n8n-ai-lead-qualification-automation' },
      ],
    },
    inventory: {
      category: 'Business Automation · 2026',
      title: 'Inventory & Low-Stock Automation',
      status: 'Repository available',
      summary: 'A scheduled inventory monitoring workflow that checks thresholds, consolidates low-stock items, and produces clear alerts and status summaries.',
      problem: 'Spreadsheet-based inventory still requires someone to manually scan rows for items that need replenishment.',
      build: [
        'A scheduled n8n workflow reads Google Sheets and checks current stock against each item\'s reorder level.',
        'Low-stock items are combined into one reorder list, while management receives one HTML alert plus a separate daily inventory summary.',
        'A zero-low-stock path suppresses unnecessary low-stock alerts while keeping the daily summary running.',
      ],
      proof: [
        'Tested a 10-item sample with 7 low-stock / 3 healthy items and a separate 0 low-stock / 10 healthy case.',
        'The public workflow is a sanitized monitoring automation and is explicitly not presented as a full POS or stock-transaction system.',
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
      problem: 'A small café needs orders, inventory, customer history, loyalty, and operational views to stay usable across different roles.',
      build: [
        'React Native prototype supports administrator, cashier, and customer workflows.',
        'Firebase and Firestore provide the application datastore and real-time operational updates.',
        'The scope combines café ordering, inventory, sales insight, loyalty, rewards, and customer-history features in one prototype.',
      ],
      proof: [
        'The project is intentionally labeled as a private prototype and is not presented as a public production release.',
        'Portfolio evidence includes real prototype screens for administrator, cashier, and loyalty flows.',
      ],
      stack: ['React Native', 'Firebase', 'Firestore'],
      links: [],
    },
    eleventh28: {
      category: 'Software Engineering · 2018–2019',
      title: 'Eleventh28 POS + Kitchen Display',
      status: 'Team capstone',
      summary: 'A restaurant desktop system built as a team capstone, connecting cashier transactions, kitchen status, ingredient inventory, and reporting.',
      problem: 'Restaurant operations need cashier transactions, kitchen order status, ingredient inventory, and reporting to stay connected.',
      build: [
        'C# WinForms desktop system supports Administrator, Cashier, and Cook roles.',
        'POS orders move into a kitchen queue with status tracking.',
        'Products link to ingredients for costing and automatic stock deduction, backed by MySQL and Crystal Reports.',
      ],
      proof: [
        'Built as a team capstone during 2018–2019, with the team ownership kept explicit in the portfolio.',
        'A public source repository is available for the original system code.',
      ],
      stack: ['C#', 'WinForms', 'MySQL', 'Crystal Reports'],
      links: [
        { label: 'View GitHub repository ↗', url: 'https://github.com/mbricia/Point-of-Sale-With-Kitchen-Display-and-Queue-System' },
      ],
    },
    avenlo: {
      category: 'Web Products',
      title: 'AVENLO Web Products',
      status: '3 live demos',
      summary: 'A family of responsive static web products built, documented, and deployed as independent concepts.',
      problem: 'Reusable web products need to stay responsive and easy to customize without unnecessary framework or build complexity.',
      build: [
        'Three independent responsive concepts cover SaaS, café, and portfolio use cases using HTML, CSS, and JavaScript.',
        'The SaaS template is documented for desktop, tablet, and mobile layouts and uses CSS custom properties for straightforward theming.',
        'The products are designed to run without a JavaScript framework or required build system.',
      ],
      proof: [
        'Three live demos are linked directly from the case study.',
        'The public AVENLO SaaS source and documentation show the static, responsive implementation and customization structure.',
      ],
      stack: ['HTML', 'CSS', 'JavaScript'],
      links: [
        { label: 'Open AVENLO SaaS ↗', url: 'https://avenlo-saas.netlify.app/' },
        { label: 'Open AVENLO Café ↗', url: 'https://avenlo-cafe.netlify.app/' },
        { label: 'Open AVENLO Portfolio ↗', url: 'https://avenlo-portfolio.netlify.app/' },
        { label: 'View SaaS source ↗', url: 'https://github.com/mbricia/Avenlo' },
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

    document.getElementById('projectDialogProblem').textContent = project.problem;

    const build = document.getElementById('projectDialogBuild');
    build.replaceChildren(...project.build.map((point) => {
      const item = document.createElement('li');
      item.textContent = point;
      return item;
    }));

    const proof = document.getElementById('projectDialogProof');
    proof.replaceChildren(...project.proof.map((point) => {
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
  const activityMonths = document.getElementById('activityMonths');
  const activitySummary = document.getElementById('activitySummary');
  const activitySnapshot = document.getElementById('activitySnapshot');
  const { buildActivityCalendar, formatActivitySummary } = window.ActivityCalendar;
  const supplementalActivityByDay = window.ActivityHistory?.supplementalActivityByDay || {};
  const GITHUB_USERNAME = 'mbricia';
  const GITHUB_REPOSITORIES_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&type=owner&sort=updated&direction=desc`;
  const activityEndDate = new Date();
  activityEndDate.setUTCHours(23, 59, 59, 999);
  const activityStartDate = new Date(activityEndDate);
  activityStartDate.setUTCDate(activityEndDate.getUTCDate() - 364);
  activityStartDate.setUTCHours(0, 0, 0, 0);
  const GITHUB_ACTIVITY_API = `https://api.github.com/repos/${GITHUB_USERNAME}`;

  const formatActivityDate = (date) => new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  const renderActivity = (commits) => {
    if (!portfolioActivity || !activityMonths || !activitySummary || !activitySnapshot) return;

    const calendar = buildActivityCalendar(commits, activityEndDate, supplementalActivityByDay);
    const cells = calendar.cells.map((day) => {
      const cell = document.createElement('span');
      cell.className = `activity-cell level-${day.level}${day.isOutsideRange ? ' is-outside-range' : ''}`;
      cell.title = `${formatActivityDate(new Date(`${day.date}T00:00:00Z`))} · ${day.count} ${day.count === 1 ? 'commit' : 'commits'}`;
      cell.style.setProperty('--i', day.weekIndex);
      return cell;
    });

    const monthLabels = calendar.months.map((month) => {
      const label = document.createElement('span');
      label.className = 'activity-month';
      label.textContent = month.label;
      label.style.gridColumnStart = month.weekIndex + 1;
      return label;
    });

    portfolioActivity.replaceChildren(...cells);
    activityMonths.replaceChildren(...monthLabels);
    activitySummary.textContent = formatActivitySummary(calendar.totalCommits);
    portfolioActivity.setAttribute(
      'aria-label',
      `GitHub contribution activity from ${formatActivityDate(new Date(`${calendar.rangeStartDate}T00:00:00Z`))} to ${formatActivityDate(activityEndDate)}: ${calendar.totalCommits} contributions loaded.`
    );
    activitySnapshot.textContent = `GitHub contribution activity · live public updates + private history through ${formatActivityDate(activityEndDate)}`;
  };

  const fetchActivityRepositories = async () => {
    const response = await fetch(GITHUB_REPOSITORIES_API, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) throw new Error('GitHub repository list unavailable');

    const repositories = await response.json();
    return repositories
      .filter((repository) => !repository.fork && !repository.archived)
      .map((repository) => repository.name);
  };

  const fetchRepositoryCommits = async (repository) => {
    const commits = [];

    for (let page = 1; page <= 3; page += 1) {
      const url = `${GITHUB_ACTIVITY_API}/${repository}/commits?per_page=100&page=${page}&author=${encodeURIComponent(GITHUB_USERNAME)}&since=${encodeURIComponent(activityStartDate.toISOString())}`;
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
      const repositories = await fetchActivityRepositories();
      const repositoryResults = await Promise.allSettled(repositories.map(fetchRepositoryCommits));
      const commits = repositoryResults.flatMap((result) => (
        result.status === 'fulfilled' ? result.value : []
      ));

      renderActivity(commits);

      const failedRepositoryCount = repositoryResults.filter((result) => result.status === 'rejected').length;
      if (failedRepositoryCount > 0) {
        activitySnapshot.textContent = `GitHub contribution activity · private history + partial live public updates · ${failedRepositoryCount} public repo${failedRepositoryCount === 1 ? '' : 's'} temporarily unavailable`;
      }
    } catch (_) {
      activitySnapshot.textContent = 'GitHub contribution activity · historical activity loaded · live public updates temporarily unavailable';
      portfolioActivity.setAttribute(
        'aria-label',
        'GitHub contribution activity: historical activity loaded; live public updates are temporarily unavailable.'
      );
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
