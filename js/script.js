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
