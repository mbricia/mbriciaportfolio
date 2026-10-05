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
      link.download = 'Mark-Jhollan-Bricia-CV.pdf';
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
      flow: {
        steps: [
          'Candidate Email',
          'Parse application',
          'Duplicate check',
          'AI interpretation',
          'Recruiter review',
          'Route hiring decision',
          'Hiring branches',
          'Drafts and reminders',
          'Activity and error log',
        ],
        nodes: [
          { id: 'candidate-email', title: 'Candidate Email', detail: 'Receives the candidate message and attached application.', x: 1, y: 4, step: 0 },
          { id: 'parse-application', title: 'Parse Application', detail: 'Normalizes the candidate and role details for processing.', x: 18, y: 4, step: 1 },
          { id: 'duplicate-check', title: 'Duplicate Check', detail: 'Blocks repeated candidate or application records.', x: 35, y: 4, step: 2 },
          { id: 'ai-interpretation', title: 'AI Interpretation', detail: 'Extracts intent and prepares a candidate-facing draft.', x: 52, y: 4, step: 3 },
          { id: 'recruiter-review', title: 'Recruiter Review', detail: 'Keeps hiring decisions and stage changes human-controlled.', x: 69, y: 4, step: 4 },
          { id: 'decision-router', title: 'Decision Router', detail: 'Routes the recruiter decision to the correct next action.', x: 86, y: 4, step: 5, kind: 'decision' },
          { id: 'shortlisted', title: 'Shortlisted', detail: 'Prepares the qualified-candidate communication path.', x: 1, y: 56, step: 6, kind: 'branch' },
          { id: 'on-hold', title: 'On Hold', detail: 'Keeps the candidate available for a later decision.', x: 18, y: 56, step: 6, kind: 'branch' },
          { id: 'rejected', title: 'Rejected', detail: 'Prepares a controlled rejection communication draft.', x: 35, y: 56, step: 6, kind: 'branch' },
          { id: 'gmail-draft', title: 'Gmail Draft', detail: 'Creates a reviewable message instead of auto-sending it.', x: 52, y: 56, step: 7 },
          { id: 'follow-up-reminder', title: 'Follow-up Reminder', detail: 'Schedules due and overdue recruiter follow-ups.', x: 69, y: 56, step: 7 },
          { id: 'activity-error-log', title: 'Activity & Error Log', detail: 'Records lifecycle actions and technical failures.', x: 86, y: 56, step: 8 },
        ],
        routes: [
          { from: 'candidate-email', to: 'parse-application', step: 0 },
          { from: 'parse-application', to: 'duplicate-check', step: 1 },
          { from: 'duplicate-check', to: 'ai-interpretation', step: 2 },
          { from: 'ai-interpretation', to: 'recruiter-review', step: 3 },
          { from: 'recruiter-review', to: 'decision-router', step: 4 },
          { from: 'decision-router', to: 'shortlisted', step: 5, lane: -2 },
          { from: 'decision-router', to: 'on-hold', step: 5, lane: -1 },
          { from: 'decision-router', to: 'rejected', step: 5 },
          { from: 'shortlisted', to: 'gmail-draft', step: 6, via: 'bottom', lane: 2 },
          { from: 'on-hold', to: 'gmail-draft', step: 6, via: 'bottom', lane: 1 },
          { from: 'rejected', to: 'gmail-draft', step: 6 },
          { from: 'shortlisted', to: 'follow-up-reminder', step: 6, via: 'bottom', lane: 4 },
          { from: 'on-hold', to: 'follow-up-reminder', step: 6, via: 'bottom', lane: 3 },
          { from: 'gmail-draft', to: 'activity-error-log', step: 7, via: 'bottom', lane: 1 },
          { from: 'follow-up-reminder', to: 'activity-error-log', step: 7 },
          { from: 'ai-interpretation', to: 'activity-error-log', step: 7, kind: 'exception', lane: 2 },
        ],
      },
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
      flow: {
        steps: [
          'Capture Inquiry',
          'Validate fields',
          'Check duplicates',
          'Extract with AI',
          'Apply rule-based score',
          'Route by temperature',
          'Lead branches',
          'Record result',
          'Respond and monitor',
        ],
        nodes: [
          { id: 'capture-inquiry', title: 'Capture Inquiry', detail: 'Receives client details through the public webhook.', x: 1, y: 4, step: 0 },
          { id: 'validate-fields', title: 'Validate Fields', detail: 'Checks required fields and the submitted email format.', x: 18, y: 4, step: 1 },
          { id: 'duplicate-check', title: 'Duplicate Check', detail: 'Stops an existing inquiry before an unnecessary AI call.', x: 35, y: 4, step: 2 },
          { id: 'ai-extraction', title: 'AI Extraction', detail: 'Structures the inquiry and drafts a useful response.', x: 52, y: 4, step: 3 },
          { id: 'rule-score', title: 'Rule-Based Score', detail: 'Applies the deterministic and explainable 0–100 score.', x: 69, y: 4, step: 4 },
          { id: 'temperature-router', title: 'Temperature Router', detail: 'Splits the lead into Hot, Warm, or Cold follow-up.', x: 86, y: 4, step: 5, kind: 'decision' },
          { id: 'failure-alert', title: 'Failure Alert', detail: 'Reports invalid input or workflow failures for review.', x: 1, y: 56, step: 8, kind: 'exception' },
          { id: 'hot-lead', title: 'Hot Lead', detail: 'Prioritizes the high-intent lead for immediate action.', x: 18, y: 56, step: 6, kind: 'branch' },
          { id: 'warm-lead', title: 'Warm Lead', detail: 'Routes the lead into a measured follow-up sequence.', x: 35, y: 56, step: 6, kind: 'branch' },
          { id: 'cold-lead', title: 'Cold Lead', detail: 'Keeps the low-intent lead in a lighter nurture path.', x: 52, y: 56, step: 6, kind: 'branch' },
          { id: 'record-sheets', title: 'Record in Sheets', detail: 'Stores the structured result, score, and route.', x: 69, y: 56, step: 7 },
          { id: 'client-response', title: 'Client Response', detail: 'Returns the correct HTTP response and reply action.', x: 86, y: 56, step: 8 },
        ],
        routes: [
          { from: 'capture-inquiry', to: 'validate-fields', step: 0 },
          { from: 'validate-fields', to: 'duplicate-check', step: 1 },
          { from: 'duplicate-check', to: 'ai-extraction', step: 2 },
          { from: 'ai-extraction', to: 'rule-score', step: 3 },
          { from: 'rule-score', to: 'temperature-router', step: 4 },
          { from: 'temperature-router', to: 'hot-lead', step: 5, lane: -2 },
          { from: 'temperature-router', to: 'warm-lead', step: 5, lane: -1 },
          { from: 'temperature-router', to: 'cold-lead', step: 5 },
          { from: 'hot-lead', to: 'record-sheets', step: 6, via: 'bottom', lane: 2 },
          { from: 'warm-lead', to: 'record-sheets', step: 6, via: 'bottom', lane: 1 },
          { from: 'cold-lead', to: 'record-sheets', step: 6 },
          { from: 'record-sheets', to: 'client-response', step: 7 },
          { from: 'validate-fields', to: 'failure-alert', step: 7, kind: 'exception', lane: 1 },
          { from: 'ai-extraction', to: 'failure-alert', step: 7, kind: 'exception', lane: 2 },
        ],
      },
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
      flow: {
        steps: [
          'Daily Schedule',
          'Read inventory',
          'Inspect each item',
          'Compare thresholds',
          'Route stock state',
          'Stock branches',
          'Consolidate and count',
          'Alert decision',
          'Daily management summary',
        ],
        nodes: [
          { id: 'daily-schedule', title: 'Daily Schedule', detail: 'Starts the monitoring workflow at the configured time.', x: 1, y: 4, step: 0 },
          { id: 'read-inventory', title: 'Read Inventory', detail: 'Loads stock counts and reorder levels from Google Sheets.', x: 18, y: 4, step: 1 },
          { id: 'inspect-item', title: 'Inspect Each Item', detail: 'Processes every inventory row using the same checks.', x: 35, y: 4, step: 2 },
          { id: 'compare-thresholds', title: 'Compare Thresholds', detail: 'Compares current stock with the item reorder point.', x: 52, y: 4, step: 3 },
          { id: 'stock-router', title: 'Stock Router', detail: 'Separates low-stock items from healthy inventory.', x: 69, y: 4, step: 4, kind: 'decision' },
          { id: 'daily-summary', title: 'Daily Summary', detail: 'Reports the overall inventory state to management.', x: 86, y: 4, step: 8 },
          { id: 'low-stock', title: 'Low Stock', detail: 'Collects items at or below their reorder level.', x: 1, y: 56, step: 5, kind: 'branch' },
          { id: 'healthy-stock', title: 'Healthy Stock', detail: 'Keeps in-stock items in the daily status totals.', x: 18, y: 56, step: 5, kind: 'branch' },
          { id: 'consolidate-items', title: 'Consolidate Items', detail: 'Combines all low-stock rows into one reorder list.', x: 35, y: 56, step: 6 },
          { id: 'low-count-decision', title: 'Low-Count Decision', detail: 'Checks whether the consolidated list contains any item.', x: 52, y: 56, step: 6, kind: 'decision' },
          { id: 'send-alert', title: 'Send Reorder Alert', detail: 'Emails one HTML reorder alert when low stock exists.', x: 69, y: 56, step: 7 },
          { id: 'suppress-alert', title: 'Suppress Alert', detail: 'Skips the reorder email when every item is healthy.', x: 86, y: 56, step: 7 },
        ],
        routes: [
          { from: 'daily-schedule', to: 'read-inventory', step: 0 },
          { from: 'read-inventory', to: 'inspect-item', step: 1 },
          { from: 'inspect-item', to: 'compare-thresholds', step: 2 },
          { from: 'compare-thresholds', to: 'stock-router', step: 3 },
          { from: 'stock-router', to: 'low-stock', step: 4, lane: -1 },
          { from: 'stock-router', to: 'healthy-stock', step: 4 },
          { from: 'low-stock', to: 'consolidate-items', step: 5, via: 'bottom', lane: 1 },
          { from: 'consolidate-items', to: 'low-count-decision', step: 6 },
          { from: 'low-count-decision', to: 'send-alert', step: 6 },
          { from: 'low-count-decision', to: 'suppress-alert', step: 6, via: 'bottom', lane: 1 },
          { from: 'send-alert', to: 'daily-summary', step: 7, lane: -1 },
          { from: 'suppress-alert', to: 'daily-summary', step: 7 },
          { from: 'healthy-stock', to: 'daily-summary', step: 7, kind: 'alternate', lane: 2 },
        ],
      },
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
      summary: 'A C#/WinForms restaurant system built as a team capstone, using MySQL and SQL queries to connect cashier transactions, kitchen status, inventory, and reporting.',
      problem: 'Restaurant operations need cashier transactions, kitchen order status, ingredient inventory, and reporting to stay connected.',
      build: [
        'C# WinForms desktop system supports Administrator, Cashier, and Cook roles.',
        'POS orders move into a kitchen queue with status tracking.',
        'MySQL provides the relational database, with SQL queries used to read and manage application data.',
        'Products link to ingredients for costing and automatic stock deduction, backed by MySQL and Crystal Reports.',
      ],
      proof: [
        'Built as a team capstone during 2018–2019, with the team ownership kept explicit in the portfolio.',
        'A public source repository is available for the original system code.',
      ],
      stack: ['C#', 'WinForms', 'SQL', 'MySQL', 'Crystal Reports'],
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
  const projectDialogPanel = document.getElementById('projectDialogPanel');
  const projectDialogClose = document.getElementById('projectDialogClose');
  const projectDialogFlow = document.getElementById('projectDialogFlow');
  const projectDialogFlowShell = document.getElementById('projectDialogFlowShell');
  const projectDialogFlowStatus = document.getElementById('projectDialogFlowStatus');
  const projectDialogFlowStages = document.getElementById('projectDialogFlowStages');
  const projectDialogFlowRouteLayer = document.getElementById('projectDialogFlowRouteLayer');
  let lastProjectTrigger = null;
  let activeProjectFlow = null;

  const FLOW_VIEWBOX_WIDTH = 1000;
  const FLOW_VIEWBOX_HEIGHT = 500;
  const FLOW_NODE_WIDTH = 135;
  const FLOW_NODE_HEIGHT = 160;
  const FLOW_SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  const clampProjectFlowProgress = (value) => Math.min(1, Math.max(0, value));

  const getProjectFlowNodeBox = (node) => ({
    left: node.x * (FLOW_VIEWBOX_WIDTH / 100),
    top: node.y * (FLOW_VIEWBOX_HEIGHT / 100),
    right: node.x * (FLOW_VIEWBOX_WIDTH / 100) + FLOW_NODE_WIDTH,
    bottom: node.y * (FLOW_VIEWBOX_HEIGHT / 100) + FLOW_NODE_HEIGHT,
    centerX: node.x * (FLOW_VIEWBOX_WIDTH / 100) + (FLOW_NODE_WIDTH / 2),
    centerY: node.y * (FLOW_VIEWBOX_HEIGHT / 100) + (FLOW_NODE_HEIGHT / 2),
  });

  const buildProjectFlowRoutePath = (fromNode, toNode, route) => {
    const from = getProjectFlowNodeBox(fromNode);
    const to = getProjectFlowNodeBox(toNode);
    const sameRow = Math.abs(fromNode.y - toNode.y) < 2;

    if (sameRow && route.via !== 'bottom') {
      const movingRight = to.centerX > from.centerX;
      const startX = movingRight ? from.right : from.left;
      const endX = movingRight ? to.left : to.right;
      return `M ${startX} ${from.centerY} H ${endX}`;
    }

    if (sameRow) {
      const laneY = Math.min(
        FLOW_VIEWBOX_HEIGHT - 6,
        Math.max(from.bottom, to.bottom) + 14 + ((route.lane || 0) * 7)
      );
      return `M ${from.centerX} ${from.bottom} V ${laneY} H ${to.centerX} V ${to.bottom}`;
    }

    const movingDown = to.centerY > from.centerY;
    const startY = movingDown ? from.bottom : from.top;
    const endY = movingDown ? to.top : to.bottom;
    const laneY = ((startY + endY) / 2) + ((route.lane || 0) * 8);
    return `M ${from.centerX} ${startY} V ${laneY} H ${to.centerX} V ${endY}`;
  };

  const renderProjectFlowRoutes = (flow) => {
    if (!projectDialogFlowRouteLayer) return;

    const nodesById = Object.fromEntries(flow.nodes.map((node) => [node.id, node]));
    const routeElements = flow.routes.map((route) => {
      const fromNode = nodesById[route.from];
      const toNode = nodesById[route.to];
      const routeGroup = document.createElementNS(FLOW_SVG_NAMESPACE, 'g');
      routeGroup.setAttribute('class', 'project-flow-route');
      routeGroup.dataset.step = String(route.step);

      if (route.kind) routeGroup.classList.add(`is-${route.kind}`);

      const pathData = buildProjectFlowRoutePath(fromNode, toNode, route);
      const basePath = document.createElementNS(FLOW_SVG_NAMESPACE, 'path');
      basePath.setAttribute('class', 'project-flow-route-base');
      basePath.setAttribute('d', pathData);
      basePath.setAttribute('pathLength', '1');
      basePath.setAttribute('marker-end', 'url(#projectFlowArrow)');

      const progressPath = document.createElementNS(FLOW_SVG_NAMESPACE, 'path');
      progressPath.setAttribute('class', 'project-flow-route-progress');
      progressPath.setAttribute('d', pathData);
      progressPath.setAttribute('pathLength', '1');

      routeGroup.append(basePath, progressPath);
      return routeGroup;
    });

    projectDialogFlowRouteLayer.replaceChildren(...routeElements);
  };

  const setProjectFlowProgress = (progress) => {
    const stages = Array.from(projectDialogFlowStages?.children || []);
    const routes = Array.from(projectDialogFlowRouteLayer?.children || []);
    if (!stages.length || !activeProjectFlow || !projectDialogFlowShell || !projectDialogFlowStatus) return;

    const normalizedProgress = clampProjectFlowProgress(progress);
    const progressPosition = normalizedProgress * (activeProjectFlow.steps.length - 1);
    const activeIndex = Math.round(progressPosition);

    projectDialogFlowShell.style.setProperty('--flow-progress', normalizedProgress);

    let currentStageAnnounced = false;
    stages.forEach((stage, index) => {
      const stageStep = Number(stage.dataset.step);
      const isActive = stageStep === activeIndex;
      stage.classList.toggle('is-active', isActive);
      stage.classList.toggle('is-complete', stageStep < activeIndex);

      if (isActive && !currentStageAnnounced) {
        stage.setAttribute('aria-current', 'step');
        currentStageAnnounced = true;
      } else {
        stage.removeAttribute('aria-current');
      }
    });

    routes.forEach((route) => {
      const routeStep = Number(route.dataset.step);
      const routeProgress = clampProjectFlowProgress(progressPosition - routeStep);
      route.style.setProperty('--route-progress', routeProgress);
      route.classList.toggle('is-active', routeStep === activeIndex);
      route.classList.toggle('is-complete', routeProgress >= .999);
    });

    const activeTitle = activeProjectFlow.steps[activeIndex];
    const statusText = `Stage ${activeIndex + 1} of ${activeProjectFlow.steps.length} · ${activeTitle}`;
    if (projectDialogFlowStatus.textContent !== statusText) {
      projectDialogFlowStatus.textContent = statusText;
    }
  };

  const updateProjectFlowProgress = () => {
    if (!projectDialogPanel || !projectDialogFlow || !projectDialogFlowShell || projectDialogFlow.hidden) return;

    const isMobileFlow = window.matchMedia('(max-width: 900px)').matches;
    let start = projectDialogFlow.offsetTop;
    let distance = projectDialogFlow.offsetHeight - projectDialogFlowShell.offsetHeight;

    if (isMobileFlow) {
      start -= projectDialogPanel.clientHeight * .3;
      distance = projectDialogFlow.offsetHeight - (projectDialogPanel.clientHeight * .4);
    }

    setProjectFlowProgress((projectDialogPanel.scrollTop - start) / Math.max(distance, 1));
  };

  projectDialogPanel?.addEventListener('scroll', updateProjectFlowProgress, { passive: true });

  const setProjectDialogContent = (project) => {
    projectDialog.classList.toggle('has-automation-flow', Boolean(project.flow));
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

    projectDialogFlow.hidden = !project.flow;
    activeProjectFlow = project.flow || null;
    const orderedFlowNodes = [...(project.flow?.nodes || [])]
      .sort((first, second) => first.step - second.step || first.y - second.y || first.x - second.x);
    projectDialogFlowStages.replaceChildren(...orderedFlowNodes.map(({ title, detail, x, y, step, kind }, index) => {
      const stage = document.createElement('li');
      stage.className = 'project-flow-stage';
      stage.dataset.step = String(step);
      stage.style.setProperty('--flow-x', x);
      stage.style.setProperty('--flow-y', y);
      if (kind) stage.classList.add(`is-${kind}`);

      const stageIndex = document.createElement('span');
      stageIndex.className = 'project-flow-index';
      stageIndex.textContent = String(index + 1).padStart(2, '0');

      const stageTitle = document.createElement('strong');
      stageTitle.textContent = title;

      const stageDetail = document.createElement('small');
      stageDetail.textContent = detail;

      stage.append(stageIndex, stageTitle, stageDetail);
      return stage;
    }));
    if (project.flow) renderProjectFlowRoutes(project.flow);
    else projectDialogFlowRouteLayer.replaceChildren();
    projectDialogFlowStatus.textContent = '';
    projectDialogFlowShell.style.setProperty('--flow-progress', 0);
    projectDialogFlow.style.setProperty('--flow-step-count', project.flow?.steps.length || 0);
    if (project.flow) setProjectFlowProgress(0);

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
      projectDialogPanel.scrollTop = 0;
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
