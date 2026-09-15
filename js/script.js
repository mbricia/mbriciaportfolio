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
        <button class="learning-card panel" type="button" data-route="systems" aria-label="Explore current AI automation learning track">
          <div class="learning-card-head"><span>CURRENTLY LEARNING / 2026</span><em>AI AGENT PHASE</em></div>
          <div class="learning-card-title"><strong>AI Automation with n8n</strong><small>Last updated · Sep 15, 2026</small></div>
          <div class="learning-progress" aria-label="Current learning progress">
            <div class="learning-progress-step is-done">
              <span class="learning-progress-dot" aria-hidden="true">✓</span>
              <div><b>RECENTLY COMPLETED</b><strong>Getting Started + Working with Data</strong><small>Completed the hands-on exercises and knowledge checks across both course sections.</small></div>
            </div>
            <div class="learning-progress-step is-current">
              <span class="learning-progress-dot" aria-hidden="true"></span>
              <div><b>BUILDING AN AI AGENT</b><strong>Building an AI Agent</strong><small>Current focus: “Your first AI agent” and the section knowledge check.</small></div>
            </div>
            <div class="learning-progress-step is-next">
              <span class="learning-progress-dot" aria-hidden="true">→</span>
              <div><b>NEXT MILESTONE</b><strong>Final exam and wrap up</strong><small>Finish the course, then turn the learning into an original portfolio automation.</small></div>
            </div>
          </div>
          <div class="learning-card-footer"><span>n8n</span><span>AI Agent</span><span>Workflow Automation</span><i>Explore Learning Lab →</i></div>
        </button>`);
    }

    const systemsGrid = $('[data-view="systems"] .capability-grid');
    if (systemsGrid && !$('#learning-lab')) {
      systemsGrid.insertAdjacentHTML('afterend', `
        <section class="learning-lab panel" id="learning-lab" aria-labelledby="learning-lab-title">
          <div class="learning-lab-header">
            <div>
              <p class="mini-kicker">ACTIVE LEARNING TRACK / 2026</p>
              <h3 id="learning-lab-title">Learning by building, not collecting badges.</h3>
            </div>
            <div class="learning-status"><span class="status-dot"></span><strong>n8n · Building an AI agent</strong><small>Hands-on learning in progress</small></div>
          </div>

          <div class="learning-progress-log">
            <div class="learning-progress-log-head"><span>RECENT PROGRESS</span><em>SEP 15, 2026</em></div>
            <ol>
              <li><span>01</span><div><strong>Completed Getting started</strong><small>Finished the real-world automation hands-on exercise and the section knowledge check.</small></div></li>
              <li><span>02</span><div><strong>Completed Working with data</strong><small>Finished the business workflow hands-on exercise and the section knowledge check.</small></div></li>
              <li class="is-active"><span>03</span><div><strong>Building an AI Agent</strong><small>Current course phase: “Your first AI agent” followed by the AI-agent knowledge check.</small></div></li>
              <li><span>04</span><div><strong>Final exam and wrap up</strong><small>Complete the course final exam before moving into a self-directed automation build.</small></div></li>
            </ol>
          </div>

          <div class="learning-lab-grid">
            <article><span>01 / COMPLETED</span><strong>Getting started</strong><p>Hands-on automation of a real-world use case plus the accompanying knowledge check.</p></article>
            <article><span>02 / COMPLETED</span><strong>Working with data</strong><p>Hands-on business workflow automation plus the accompanying data-focused knowledge check.</p></article>
            <article><span>03 / CURRENT</span><strong>Your first AI agent</strong><p>Now working through the AI-agent section and its hands-on exercise before the section assessment.</p></article>
            <article><span>04 / NEXT PROOF</span><strong>Original AI automation</strong><p>After the final exam, the next portfolio milestone is a self-directed workflow documented as problem → automation → result.</p></article>
          </div>
          <div class="learning-lab-footer"><span>n8n</span><span>Workflow Automation</span><span>AI Agent</span><span>Hands-on Exercises</span><em>LEARNING IN PUBLIC · PROOF ADDED WHEN READY</em></div>
        </section>`);
    }
  };

  mountLearningProgress();


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
