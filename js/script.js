(() => {
  const $ = (s, scope = document) => scope.querySelector(s);
  const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];
  const validRoutes = ['overview','work','kopi-app','capstone','systems','credentials','about','contact'];

  const workspace = $('#workspace');
  const routeLabel = $('#routeLabel');
  const navItems = $$('.nav-item');
  const views = $$('.view');
  const mobileDrawer = $('#mobileDrawer');
  const commandOverlay = $('#commandOverlay');
  const commandInput = $('#commandInput');
  const commandButtons = $$('#commandResults button');
  let activeCommand = 0;
  const themeToggle = $('#themeToggle');
  const themeLabel = $('.theme-toggle-label');
  const themeIcon = $('.theme-toggle-icon');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const themeQuery = window.matchMedia('(prefers-color-scheme: light)');

  const applyTheme = (theme, {persist = true} = {}) => {
    const next = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(next === 'light'));
      themeToggle.setAttribute('title', next === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }
    if (themeLabel) themeLabel.textContent = next === 'light' ? 'Light' : 'Dark';
    if (themeIcon) themeIcon.textContent = next === 'light' ? '☀' : '☾';
    if (themeMeta) themeMeta.setAttribute('content', next === 'light' ? '#f3f6f8' : '#070a0f');
    if (persist) {
      try { localStorage.setItem('portfolio-theme', next); } catch (_) {}
    }
  };

  applyTheme(document.documentElement.dataset.theme || 'dark', {persist:false});
  themeToggle?.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
  });
  themeQuery.addEventListener?.('change', event => {
    try {
      if (!localStorage.getItem('portfolio-theme')) applyTheme(event.matches ? 'light' : 'dark', {persist:false});
    } catch (_) {}
  });

  const mountLearningProgress = () => {
    if (!document.querySelector('link[data-learning-styles]')) {
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'css/learning.css';
      stylesheet.dataset.learningStyles = 'true';
      document.head.appendChild(stylesheet);
    }

    const overviewStack = $('.overview-stack');
    const principlePanel = $('.principle-panel', overviewStack || document);
    if (overviewStack && principlePanel && !$('.learning-card', overviewStack)) {
      principlePanel.insertAdjacentHTML('beforebegin', `
        <button class="learning-card panel" type="button" data-route="systems" aria-label="Explore current n8n Academy learning progress">
          <div class="learning-card-head"><span>CURRENTLY LEARNING / 2026</span><em>2 CERTIFICATES EARNED</em></div>
          <div class="learning-card-title"><strong>AI Automation with n8n</strong><small>Last updated · Sep 15, 2026</small></div>
          <div class="learning-progress" aria-label="Current learning progress">
            <div class="learning-progress-step is-done">
              <span class="learning-progress-dot" aria-hidden="true">✓</span>
              <div><b>COMPLETED</b><strong>n8n Quickstart</strong><small>Completed with a passing grade and earned a Certificate of Completion.</small></div>
            </div>
            <div class="learning-progress-step is-done">
              <span class="learning-progress-dot" aria-hidden="true">✓</span>
              <div><b>COMPLETED COURSE</b><strong>Essentials: Your First Workflows</strong><small>Completed with a passing grade and earned the second Certificate of Completion.</small></div>
            </div>
            <div class="learning-progress-step is-current">
              <span class="learning-progress-dot" aria-hidden="true"></span>
              <div><b>CURRENT FOCUS</b><strong>Integrations: APIs & Connected Workflows</strong><small>Next in the n8n program: deeper work with APIs, connected services, and practical integration workflows.</small></div>
            </div>
            <div class="learning-progress-step is-next">
              <span class="learning-progress-dot" aria-hidden="true">04</span>
              <div><b>NEXT COURSE</b><strong>In Practice: AI, Testing & Best Practices</strong><small>Upcoming program course focused on AI, testing, and stronger workflow practices.</small></div>
            </div>
          </div>
          <div class="learning-card-footer"><span>n8n</span><span>Workflow Automation</span><span>APIs</span><span>2 Certificates</span><i>Explore Learning Lab →</i></div>
        </button>`);
    }

    const systemsGrid = $('[data-view="systems"] .capability-grid');
    if (systemsGrid && !$('#learning-lab')) {
      systemsGrid.insertAdjacentHTML('afterend', `
        <section class="learning-lab panel" id="learning-lab" aria-labelledby="learning-lab-title">
          <div class="learning-lab-header">
            <div>
              <p class="mini-kicker">ACTIVE LEARNING TRACK / 2026</p>
              <h3 id="learning-lab-title">From workflow fundamentals to connected automations.</h3>
            </div>
            <div class="learning-status"><span class="status-dot"></span><strong>n8n Academy · Current focus: Integrations</strong><small>2 Certificates of Completion · September 15, 2026</small></div>
          </div>

          <div class="learning-progress-log">
            <div class="learning-progress-log-head"><span>LEARNING PROGRESS</span><em>SEP 15, 2026</em></div>
            <ol>
              <li class="is-complete"><span>01</span><div><strong>n8n Quickstart</strong><small>Completed with a passing grade and earned a Certificate of Completion.</small></div></li>
              <li class="is-complete"><span>02</span><div><strong>Essentials: Your First Workflows</strong><small>Completed program course with a passing grade and earned a second Certificate of Completion.</small></div></li>
              <li class="is-active"><span>03</span><div><strong>Integrations: APIs & Connected Workflows</strong><small>Current focus: APIs, connected services, and practical integration workflows.</small></div></li>
              <li><span>04</span><div><strong>In Practice: AI, Testing & Best Practices</strong><small>Next course in the learning path: AI usage, testing, and stronger automation practices.</small></div></li>
            </ol>
          </div>

          <div class="learning-lab-grid">
            <article><span>01 / COMPLETED</span><strong>n8n Quickstart</strong><p>Established the platform basics and earned the first Certificate of Completion.</p></article>
            <article><span>02 / COMPLETED COURSE</span><strong>Essentials: Your First Workflows</strong><p>Completed the first full program course with a passing grade and earned the second certificate.</p></article>
            <article><span>03 / CURRENT FOCUS</span><strong>Integrations: APIs & Connected Workflows</strong><p>Moving deeper into APIs, connected services, and reusable integration patterns for practical automation.</p></article>
            <article><span>04 / NEXT COURSE</span><strong>In Practice: AI, Testing & Best Practices</strong><p>Next step in the program before turning the learning into independently built, portfolio-ready automations.</p></article>
          </div>
          <div class="learning-lab-footer"><span>n8n</span><span>Workflow Automation</span><span>APIs</span><span>Connected Workflows</span><em>CURRENT FOCUS · INTEGRATIONS / APIS</em></div>
        </section>`);
    }

    const credentialsLayout = $('[data-view="credentials"] .credentials-layout');
    if (credentialsLayout && !$('[data-certificate="quickstart"]', credentialsLayout)) {
      credentialsLayout.insertAdjacentHTML('beforeend', `
        <article class="panel credential-certificate" data-certificate="quickstart">
          <a class="certificate-preview" href="assets/certificates/n8n-quickstart.svg" target="_blank" rel="noreferrer" aria-label="View n8n Quickstart Certificate of Completion">
            <img src="assets/certificates/n8n-quickstart.svg" alt="n8n Quickstart Certificate of Completion awarded to Mark Jhollan Bricia" />
          </a>
          <div class="certificate-copy">
            <span>CERTIFICATE OF COMPLETION / 2026</span>
            <h3>n8n Quickstart</h3>
            <strong>n8n Academy</strong>
            <p>Successfully completed with a passing grade. Awarded September 15, 2026.</p>
            <div class="certificate-actions"><a href="assets/certificates/n8n-quickstart.svg" target="_blank" rel="noreferrer">View Certificate ↗</a><button type="button" data-route="systems">View Learning Lab →</button></div>
          </div>
        </article>`);
    }

    if (credentialsLayout && !$('[data-certificate="essentials-first-workflows"]', credentialsLayout)) {
      credentialsLayout.insertAdjacentHTML('beforeend', `
        <article class="panel credential-certificate" data-certificate="essentials-first-workflows">
          <a class="certificate-preview" href="assets/certificates/n8n-essentials-first-workflows.svg" target="_blank" rel="noreferrer" aria-label="View Essentials: Your First Workflows Certificate of Completion">
            <img src="assets/certificates/n8n-essentials-first-workflows.svg" alt="Essentials: Your First Workflows Certificate of Completion awarded to Mark Jhollan Bricia" />
          </a>
          <div class="certificate-copy">
            <span>CERTIFICATE OF COMPLETION / 2026</span>
            <h3>Essentials: Your First Workflows</h3>
            <strong>n8n Academy</strong>
            <p>Successfully completed with a passing grade. Awarded September 15, 2026.</p>
            <div class="certificate-actions"><a href="assets/certificates/n8n-essentials-first-workflows.svg" target="_blank" rel="noreferrer">View Certificate ↗</a><button type="button" data-route="systems">View Learning Lab →</button></div>
          </div>
        </article>`);
    }
  };

  mountLearningProgress();

  const mountProfessionalTimeline = () => {
    const aboutView = $('[data-view="about"]');
    const timeline = $('.timeline-card', aboutView || document);
    if (!aboutView || !timeline || timeline.dataset.experienceAligned === 'true') return;

    timeline.innerHTML = `
      <div class="timeline-item"><span>EARLY</span><strong>Computer exposure</strong><p>Built daily familiarity with PCs, software, peripherals, and troubleshooting through hands-on use, creating the practical foundation for later IT and development work.</p></div>
      <div class="timeline-item"><span>2018–2019</span><strong>Software engineering foundation</strong><p>Developed a team capstone through research, documentation, testing, and manual debugging, turning software-engineering fundamentals into a working database-backed system.</p></div>
      <div class="timeline-item"><span>2020–2023</span><strong>Quadrant Information Services · Rate Programmer</strong><p>Developed and maintained system components based on project requirements, working with databases and application logic to support project delivery.</p></div>
      <div class="timeline-item"><span>2023–Present</span><strong>Freelance Technical & Development Work</strong><p>Built and supported small software and web projects for students and local clients, handling implementation, debugging, troubleshooting, and revisions to deliver working project outputs.</p></div>
      <div class="timeline-item"><span>2023–Present</span><strong>STKR Maniac Printing Services</strong><p>Managed client print orders and prepared production-ready files from design through final output, completing customer requests for documents, stickers, shirts, and other print work. Maintained and troubleshot printers, computers, and related production equipment during daily operations, helping keep client work and production available.</p></div>
      <div class="timeline-item"><span>2026</span><strong>Independent products & automation</strong><p>Built and shipped AVENLO web products, developed the Kopi Brews application prototype, and expanded into n8n automation to turn current learning into practical, portfolio-ready work.</p></div>`;
    timeline.dataset.experienceAligned = 'true';

    const storyParagraphs = $$('.story-card p', aboutView);
    const finalStory = storyParagraphs[storyParagraphs.length - 1];
    if (finalStory) {
      finalStory.textContent = 'That is the thread connecting my software-engineering foundation, professional programming work, freelance development and IT support, small-business technical operations, shipped web products, and current application and automation work.';
    }
  };

  mountProfessionalTimeline();

  const mountCvDownload = () => {
    const cvLinks = $$('a[href="Mark-Jhollan-Bricia-CV.pdf"]');
    if (!cvLinks.length) return;

    cvLinks.forEach(link => {
      link.addEventListener('click', async event => {
        event.preventDefault();
        try {
          const response = await fetch('assets/cv/Mark-Jhollan-Bricia-CV.base64.txt', {cache:'no-store'});
          if (!response.ok) throw new Error('CV asset unavailable');
          const base64 = (await response.text()).trim();
          const binary = atob(base64);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
          const blob = new Blob([bytes], {type:'application/pdf'});
          const url = URL.createObjectURL(blob);
          const download = document.createElement('a');
          download.href = url;
          download.download = 'Mark-Jhollan-Bricia-Master-ATS-CV-v3.pdf';
          document.body.appendChild(download);
          download.click();
          download.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1200);
        } catch (_) {
          window.open('Mark-Jhollan-Bricia-CV.pdf', '_blank', 'noopener');
        }
      });
    });
  };

  mountCvDownload();

  const normalizeRoute = (value) => validRoutes.includes(value) ? value : 'overview';

  const go = (route, options = {}) => {
    route = normalizeRoute(route);
    views.forEach(v => v.classList.toggle('is-active', v.dataset.view === route));
    navItems.forEach(n => n.classList.toggle('is-active', n.dataset.route === route));
    if (routeLabel) routeLabel.textContent = route;
    document.title = `Mark Jhollan Bricia — ${route[0].toUpperCase() + route.slice(1)}`;
    if (!options.skipHistory && location.hash !== `#${route}`) history.pushState({route}, '', `#${route}`);
    if (workspace) workspace.scrollTo({top:0, behavior: options.instant ? 'auto' : 'smooth'});
    if (mobileDrawer) mobileDrawer.hidden = true;
    closeCommand();
  };

  $$('[data-route]').forEach(el => el.addEventListener('click', (e) => {
    if (el.tagName === 'A') e.preventDefault();
    go(el.dataset.route);
  }));

  window.addEventListener('popstate', () => go(normalizeRoute(location.hash.slice(1)), {skipHistory:true, instant:true}));
  go(normalizeRoute(location.hash.slice(1)), {skipHistory:true, instant:true});

  const updateTime = () => {
    const value = new Intl.DateTimeFormat('en-PH', {timeZone:'Asia/Manila',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date());
    const el = $('#localTime'); if (el) el.textContent = `${value} PHT`;
  };
  updateTime(); setInterval(updateTime, 1000);

  $('#mobileMenu')?.addEventListener('click', () => { mobileDrawer.hidden = false; });
  $('#mobileClose')?.addEventListener('click', () => { mobileDrawer.hidden = true; });

  const visibleCommands = () => commandButtons.filter(b => !b.hidden);
  const setActiveCommand = () => visibleCommands().forEach((b,i) => b.classList.toggle('active', i === activeCommand));
  function openCommand(){ commandOverlay.hidden = false; activeCommand = 0; commandButtons.forEach(b => b.hidden = false); setActiveCommand(); requestAnimationFrame(() => commandInput?.focus()); }
  function closeCommand(){ if (!commandOverlay) return; commandOverlay.hidden = true; if (commandInput) commandInput.value = ''; }
  $('#commandTrigger')?.addEventListener('click', openCommand);
  commandOverlay?.addEventListener('click', e => { if (e.target === commandOverlay) closeCommand(); });
  commandButtons.forEach(b => b.addEventListener('click', () => go(b.dataset.command)));
  commandInput?.addEventListener('input', () => {
    const q = commandInput.value.trim().toLowerCase();
    commandButtons.forEach(b => b.hidden = q ? !b.textContent.toLowerCase().includes(q) : false);
    activeCommand = 0; setActiveCommand();
  });

  document.addEventListener('keydown', (e) => {
    const paletteOpen = commandOverlay && !commandOverlay.hidden;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); paletteOpen ? closeCommand() : openCommand(); return; }
    if (paletteOpen) {
      if (e.key === 'Escape') { e.preventDefault(); closeCommand(); return; }
      const visible = visibleCommands(); if (!visible.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); activeCommand = (activeCommand + 1) % visible.length; setActiveCommand(); visible[activeCommand].scrollIntoView({block:'nearest'}); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeCommand = (activeCommand - 1 + visible.length) % visible.length; setActiveCommand(); visible[activeCommand].scrollIntoView({block:'nearest'}); }
      else if (e.key === 'Enter') { e.preventDefault(); go(visible[activeCommand].dataset.command); }
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey || ['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
    const shortcuts = {o:'overview',w:'work',k:'kopi-app',s:'systems',c:'credentials',a:'about',x:'contact','3':'capstone'};
    const route = shortcuts[e.key.toLowerCase()]; if (route) go(route);
  });

  const toast = $('#toast'); let toastTimer;
  $$('[data-placeholder-link]').forEach(link => link.addEventListener('click', e => {
    e.preventDefault(); toast?.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast?.classList.remove('show'), 2600);
  }));
})();