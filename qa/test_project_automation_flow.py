from pathlib import Path
import re
import subprocess


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "script.js").read_text(encoding="utf-8")


def contrast_ratio(foreground, background):
    def luminance(hex_color):
        channels = [int(hex_color[index:index + 2], 16) / 255 for index in (1, 3, 5)]
        linear = [channel / 12.92 if channel <= 0.03928 else ((channel + 0.055) / 1.055) ** 2.4 for channel in channels]
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]

    light, dark = sorted((luminance(foreground), luminance(background)), reverse=True)
    return (light + 0.05) / (dark + 0.05)


RUNTIME_CHECK = r"""
const fs = require('fs');
const vm = require('vm');

class FakeElement {
  constructor(id = '', tagName = '') {
    this.id = id;
    this.tagName = tagName;
    this.textContent = '';
    this.children = [];
    this.listeners = {};
    this.dataset = {};
    this.hidden = false;
    this.open = false;
    this.className = '';
    this.scrollTop = 0;
    this.clientHeight = 0;
    this.offsetHeight = 0;
    this.offsetTop = 0;
    this.attributes = {};
    this.classes = new Set();
    this.classList = {
      add: (...names) => names.forEach(name => this.classes.add(name)),
      remove: (...names) => names.forEach(name => this.classes.delete(name)),
      toggle: (name, force) => {
        if (force === true) this.classes.add(name);
        else if (force === false) this.classes.delete(name);
        else if (this.classes.has(name)) this.classes.delete(name);
        else this.classes.add(name);
        return this.classes.has(name);
      },
      contains: name => this.classes.has(name),
    };
    this.styles = {};
    this.style = {
      setProperty: (name, value) => { this.styles[name] = String(value); },
      getPropertyValue: name => this.styles[name] || '',
    };
  }
  addEventListener(type, handler) { (this.listeners[type] ||= []).push(handler); }
  replaceChildren(...children) { this.children = children; }
  append(...children) { this.children.push(...children); }
  setAttribute(name, value) { this.attributes[name] = String(value); this[name] = String(value); }
  removeAttribute(name) { delete this.attributes[name]; delete this[name]; }
  showModal() { this.open = true; }
  close() { this.open = false; for (const handler of this.listeners.close || []) handler(); }
  focus() { activeElement = this; }
}

let activeElement = null;
const ids = [
  'projectDialog', 'projectDialogClose', 'projectDialogCategory', 'projectDialogTitle',
  'projectDialogStatus', 'projectDialogSummary', 'projectDialogProblem', 'projectDialogBuild',
  'projectDialogProof', 'projectDialogStack', 'projectDialogLinks', 'projectDialogPanel',
  'projectDialogFlow', 'projectDialogFlowShell', 'projectDialogFlowStatus',
  'projectDialogFlowCanvas', 'projectDialogFlowStages', 'projectDialogFlowRouteLayer',
];
const elements = Object.fromEntries(ids.map(id => [id, new FakeElement(id)]));
elements.projectDialogPanel.clientHeight = 720;
elements.projectDialogFlow.offsetTop = 280;
elements.projectDialogFlow.offsetHeight = 1865;
elements.projectDialogFlowShell.offsetHeight = 560;
const projectKeys = ['recruitment', 'lead-qualification', 'inventory', 'kopi-brews', 'eleventh28', 'avenlo'];
const triggers = projectKeys.map(key => {
  const trigger = new FakeElement();
  trigger.dataset.project = key;
  return trigger;
});

const document = {
  body: new FakeElement('body'),
  getElementById: id => elements[id] || null,
  createElement: tagName => new FakeElement('', tagName),
  createElementNS: (_namespace, tagName) => new FakeElement('', tagName),
  querySelectorAll: selector => selector === '.project-open' ? triggers : [],
};
const source = fs.readFileSync('js/script.js', 'utf8');
const boundary = source.indexOf('  const portfolioActivity');
if (boundary < 0) throw new Error('Dialog script boundary not found');
vm.runInNewContext(`${source.slice(0, boundary)}})();`, {
  document,
  window: {
    open() {},
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  },
  Uint8Array,
  Blob,
  URL,
  atob,
  setTimeout,
  requestAnimationFrame: callback => { callback(); return 1; },
  cancelAnimationFrame() {},
});

const expected = {
  recruitment: { firstTitle: 'Candidate Email', finalTitle: 'Activity & Error Log' },
  'lead-qualification': { firstTitle: 'Capture Inquiry', finalTitle: 'Client Response' },
  inventory: { firstTitle: 'Daily Schedule', finalTitle: 'Daily Summary' },
};
for (const [key, { firstTitle }] of Object.entries(expected)) {
  const trigger = triggers.find(item => item.dataset.project === key);
  trigger.listeners.click[0]();
  if (elements.projectDialogFlow.hidden) throw new Error(`${key} flow is hidden`);
  if (!elements.projectDialog.classList.contains('has-automation-flow')) {
    throw new Error(`${key} did not receive the expanded automation dialog`);
  }
  if (elements.projectDialogFlowStages.children.length < 10) throw new Error(`${key} does not expose the full routed workflow`);
  if (elements.projectDialogFlowRouteLayer.children.length < 10) throw new Error(`${key} does not render its routing paths`);
  const firstStage = elements.projectDialogFlowStages.children[0];
  const renderedTitle = firstStage.children[1].textContent;
  if (renderedTitle !== firstTitle) throw new Error(`${key} first stage mismatch: ${renderedTitle}`);
  const finalStage = elements.projectDialogFlowStages.children[elements.projectDialogFlowStages.children.length - 1];
  if (finalStage.children[1].textContent !== expected[key].finalTitle) {
    throw new Error(`${key} mobile sequence does not end with ${expected[key].finalTitle}`);
  }
  if ('tabIndex' in firstStage) throw new Error(`${key} static flow stage creates an unnecessary tab stop`);
  if (!firstStage.classList.contains('is-active')) throw new Error(`${key} first stage is not active when opened`);
  if (firstStage['aria-current'] !== 'step') throw new Error(`${key} active stage is not announced`);
  const futureStage = elements.projectDialogFlowStages.children[1];
  if (futureStage.classList.contains('is-active') || futureStage.classList.contains('is-complete')) {
    throw new Error(`${key} future stage is not visually pending`);
  }
  if (futureStage['aria-current']) throw new Error(`${key} future stage is announced as current`);
  if (elements.projectDialogFlowStatus.textContent !== `Stage 1 of 9 · ${firstTitle}`) {
    throw new Error(`${key} initial stage status is incorrect`);
  }
  elements.projectDialog.close();
  if (activeElement !== trigger) throw new Error(`${key} focus was not restored`);
}

const nonAutomation = triggers.find(item => item.dataset.project === 'kopi-brews');
nonAutomation.listeners.click[0]();
if (!elements.projectDialogFlow.hidden) throw new Error('Non-automation flow remained visible');
if (elements.projectDialogFlowStages.children.length !== 0) throw new Error('Non-automation flow retained stale stages');
if (elements.projectDialogFlowRouteLayer.children.length !== 0) throw new Error('Non-automation flow retained stale routes');
if (elements.projectDialog.classList.contains('has-automation-flow')) {
  throw new Error('Non-automation project retained the expanded dialog');
}

const recruitment = triggers.find(item => item.dataset.project === 'recruitment');
recruitment.listeners.click[0]();
const stages = elements.projectDialogFlowStages.children;
const stageByTitle = title => stages.find(stage => stage.children[1].textContent === title);
const recruitmentRoutes = elements.projectDialogFlowRouteLayer.children;
const exceptionRoute = recruitmentRoutes.find(route => route.classList.contains('is-exception'));
if (!exceptionRoute || exceptionRoute.children[0].attributes.pathLength !== '1') {
  throw new Error('Exception route base path is not normalized for a visible dash pattern');
}
const longRejoinLanes = [recruitmentRoutes[11], recruitmentRoutes[12]].map(route => {
  const path = route.children[0].attributes.d;
  const lane = path.match(/V ([0-9.]+) H/);
  return lane && lane[1];
});
if (!longRejoinLanes.every(Boolean) || new Set(longRejoinLanes).size !== longRejoinLanes.length) {
  throw new Error(`Recruitment rejoin routes overlap at lane ${longRejoinLanes.join(', ')}`);
}
const scrollHandlers = elements.projectDialogPanel.listeners.scroll || [];
if (scrollHandlers.length !== 1) throw new Error('Dialog panel has no workflow progress scroll handler');

const travel = elements.projectDialogFlow.offsetHeight - elements.projectDialogFlowShell.offsetHeight;
elements.projectDialogPanel.scrollTop = elements.projectDialogFlow.offsetTop + (travel / 2);
scrollHandlers[0]();
if (!stageByTitle('Recruiter Review').classList.contains('is-active')) throw new Error('Middle scroll position did not activate recruiter review');
if (!stageByTitle('Candidate Email').classList.contains('is-complete') || !stageByTitle('AI Interpretation').classList.contains('is-complete')) {
  throw new Error('Earlier stages were not marked complete');
}
if (stageByTitle('Candidate Email')['aria-current'] || stageByTitle('AI Interpretation')['aria-current']) throw new Error('Completed stages remained current');
if (stageByTitle('Recruiter Review')['aria-current'] !== 'step') throw new Error('Recruiter review is not announced as current');
if (elements.projectDialogFlowStatus.textContent !== 'Stage 5 of 9 · Recruiter review') {
  throw new Error('Middle stage status is incorrect');
}
const middleProgress = Number(elements.projectDialogFlowShell.style.getPropertyValue('--flow-progress'));
if (Math.abs(middleProgress - 0.5) > 0.01) throw new Error(`Flow progress is ${middleProgress}, expected 0.5`);

elements.projectDialogPanel.scrollTop = elements.projectDialogFlow.offsetTop + (travel * .75);
scrollHandlers[0]();
for (const branchTitle of ['Shortlisted', 'On Hold', 'Rejected']) {
  if (!stageByTitle(branchTitle).classList.contains('is-active')) {
    throw new Error(`${branchTitle} branch did not activate with the routing stage`);
  }
}
const activeBranchRoutes = elements.projectDialogFlowRouteLayer.children.filter(route => route.classList.contains('is-active'));
if (activeBranchRoutes.length < 3) throw new Error('Routing stage did not activate all branch connectors');

elements.projectDialogPanel.scrollTop = elements.projectDialogFlow.offsetTop + travel;
scrollHandlers[0]();
if (!stageByTitle('Activity & Error Log').classList.contains('is-active')) throw new Error('Final scroll position did not activate the final stage');
if (!stages.filter(stage => stage !== stageByTitle('Activity & Error Log')).every(stage => stage.classList.contains('is-complete'))) {
  throw new Error('Final scroll position did not complete the earlier stages');
}
if (elements.projectDialogFlowStatus.textContent !== 'Stage 9 of 9 · Activity and error log') {
  throw new Error('Final stage status is incorrect');
}
"""


def test_runtime_behavior():
    result = subprocess.run(
        ["node", "-e", RUNTIME_CHECK],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, result.stderr or result.stdout


def run():
    summary_position = HTML.index('id="projectDialogSummary"')
    flow_position = HTML.index('id="projectDialogFlow"')
    proof_grid_position = HTML.index('class="project-dialog-grid"')

    assert summary_position < flow_position < proof_grid_position
    flow_section = re.search(r'<section\b[^>]*\bid="projectDialogFlow"[^>]*>', HTML)
    assert flow_section, "Missing project dialog automation-flow section"
    flow_tag = flow_section.group(0)
    assert 'class="project-dialog-flow"' in flow_tag
    assert re.search(r'\shidden(?:\s|>)', flow_tag)
    assert 'id="projectDialogFlowStages"' in HTML
    assert 'id="projectDialogPanel"' in HTML
    assert 'id="projectDialogFlowShell"' in HTML
    assert 'id="projectDialogFlowStatus"' in HTML
    assert 'id="projectDialogFlowCanvas"' in HTML
    assert 'id="projectDialogFlowRoutes"' in HTML
    assert 'id="projectDialogFlowRouteLayer"' in HTML
    assert "Automation flow" in HTML
    assert "Input → Logic → Action" in HTML
    assert "Scroll to run the workflow" in HTML

    expected_flows = {
        "recruitment": [
            "Candidate Email",
            "Parse Application",
            "Duplicate Check",
            "AI Interpretation",
            "Recruiter Review",
            "Decision Router",
            "Shortlisted",
            "On Hold",
            "Rejected",
            "Gmail Draft",
            "Follow-up Reminder",
            "Activity & Error Log",
        ],
        "lead-qualification": [
            "Capture Inquiry",
            "Validate Fields",
            "Duplicate Check",
            "AI Extraction",
            "Rule-Based Score",
            "Temperature Router",
            "Hot Lead",
            "Warm Lead",
            "Cold Lead",
            "Record in Sheets",
            "Client Response",
            "Failure Alert",
        ],
        "inventory": [
            "Daily Schedule",
            "Read Inventory",
            "Inspect Each Item",
            "Compare Thresholds",
            "Stock Router",
            "Low Stock",
            "Healthy Stock",
            "Consolidate Items",
            "Low-Count Decision",
            "Send Reorder Alert",
            "Suppress Alert",
            "Daily Summary",
        ],
    }

    for project, stages in expected_flows.items():
        project_key = re.escape(project)
        assert re.search(rf"(?:'{project_key}'|{project_key}):\s*{{", JS)
        for stage in stages:
            assert stage in JS, f"Missing {project} flow stage: {stage}"

    assert JS.count("flow: {") == 3
    assert "projectDialogFlow.hidden = !project.flow" in JS
    assert "projectDialogFlowStages.replaceChildren" in JS
    assert "projectDialogFlowRouteLayer.replaceChildren" in JS

    for selector in [
        ".project-dialog-flow{",
        ".project-dialog-flow-shell{",
        ".project-flow-canvas{",
        ".project-flow-routes{",
        ".project-flow-route-progress{",
        ".project-dialog.has-automation-flow{",
        ".project-flow-stages{",
        ".project-flow-stage{",
        ".project-flow-stage.is-active{",
        ".project-flow-stage.is-complete{",
    ]:
        assert selector in CSS, f"Missing automation-flow style: {selector}"

    base_panel_rule = re.search(r"\.project-dialog-panel\{(?P<body>.*?)\n\}", CSS, re.S)
    automation_panel_rule = re.search(
        r"\.project-dialog\.has-automation-flow \.project-dialog-panel\{(?P<body>.*?)\n\}",
        CSS,
        re.S,
    )
    assert base_panel_rule and "scrollbar-width" not in base_panel_rule.group("body")
    assert automation_panel_rule and "scrollbar-width:none" in automation_panel_rule.group("body")
    assert ".project-dialog.has-automation-flow .project-dialog-panel::-webkit-scrollbar" in CSS
    assert ".project-flow-routes{display:none}" in CSS
    exception_progress_rule = re.search(
        r"\.project-flow-route\.is-exception \.project-flow-route-progress\{(?P<body>.*?)\n\}",
        CSS,
        re.S,
    )
    assert exception_progress_rule and "stroke:#" in exception_progress_rule.group("body")
    tablet_media = CSS.split("@media(max-width:900px){", 1)[1].split("@media(max-width:680px){", 1)[0]
    assert ".project-flow-canvas{height:auto;overflow:visible}" in tablet_media
    assert ".project-flow-routes{display:none}" in tablet_media
    assert "window.matchMedia('(max-width: 900px)')" in JS
    assert "@media (prefers-reduced-motion: reduce)" in CSS
    assert ".project-flow-progress-track span{transition:none!important}" in CSS
    assert ".project-flow-stage.is-active{transform:none!important}" in CSS

    stage_rule = re.search(r"\.project-flow-stage\{(?P<body>.*?)\n\}", CSS, re.S)
    assert stage_rule, "Missing base project flow stage rule"
    assert "opacity:" not in stage_rule.group("body"), "Upcoming stage text must not be dimmed with opacity"
    assert "color:" in stage_rule.group("body"), "Upcoming stages need an explicit muted text color"

    for selector in (r"\.project-flow-index", r"\.project-flow-stage small"):
        rule = re.search(rf"{selector}\{{(?P<body>.*?)\n\}}", CSS, re.S)
        color = re.search(r"color:(#[0-9a-fA-F]{6})", rule.group("body")) if rule else None
        assert color, f"Missing explicit text color for {selector}"
        assert contrast_ratio(color.group(1), "#05090b") >= 4.5, f"Pending text contrast is too low for {selector}"

    test_runtime_behavior()

    print("PASS project-specific automation flows and responsive dialog structure")


if __name__ == "__main__":
    run()
