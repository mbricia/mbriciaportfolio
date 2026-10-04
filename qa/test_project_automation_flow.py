from pathlib import Path
import re
import subprocess


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "script.js").read_text(encoding="utf-8")


RUNTIME_CHECK = r"""
const fs = require('fs');
const vm = require('vm');

class FakeElement {
  constructor(id = '') {
    this.id = id;
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
  'projectDialogFlowStages',
];
const elements = Object.fromEntries(ids.map(id => [id, new FakeElement(id)]));
elements.projectDialogPanel.clientHeight = 720;
elements.projectDialogFlow.offsetTop = 280;
elements.projectDialogFlow.offsetHeight = 980;
elements.projectDialogFlowShell.offsetHeight = 360;
const projectKeys = ['recruitment', 'lead-qualification', 'inventory', 'kopi-brews', 'eleventh28', 'avenlo'];
const triggers = projectKeys.map(key => {
  const trigger = new FakeElement();
  trigger.dataset.project = key;
  return trigger;
});

const document = {
  body: new FakeElement('body'),
  getElementById: id => elements[id] || null,
  createElement: () => new FakeElement(),
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
  recruitment: 'Candidate Intake',
  'lead-qualification': 'Capture Inquiry',
  inventory: 'Read Inventory',
};
for (const [key, firstTitle] of Object.entries(expected)) {
  const trigger = triggers.find(item => item.dataset.project === key);
  trigger.listeners.click[0]();
  if (elements.projectDialogFlow.hidden) throw new Error(`${key} flow is hidden`);
  if (!elements.projectDialog.classList.contains('has-automation-flow')) {
    throw new Error(`${key} did not receive the expanded automation dialog`);
  }
  if (elements.projectDialogFlowStages.children.length !== 5) throw new Error(`${key} does not have five stages`);
  const firstStage = elements.projectDialogFlowStages.children[0];
  const renderedTitle = firstStage.children[1].textContent;
  if (renderedTitle !== firstTitle) throw new Error(`${key} first stage mismatch: ${renderedTitle}`);
  if ('tabIndex' in firstStage) throw new Error(`${key} static flow stage creates an unnecessary tab stop`);
  if (!firstStage.classList.contains('is-active')) throw new Error(`${key} first stage is not active when opened`);
  if (firstStage['aria-current'] !== 'step') throw new Error(`${key} active stage is not announced`);
  if (elements.projectDialogFlowStatus.textContent !== `Stage 1 of 5 · ${firstTitle}`) {
    throw new Error(`${key} initial stage status is incorrect`);
  }
  elements.projectDialog.close();
  if (activeElement !== trigger) throw new Error(`${key} focus was not restored`);
}

const nonAutomation = triggers.find(item => item.dataset.project === 'kopi-brews');
nonAutomation.listeners.click[0]();
if (!elements.projectDialogFlow.hidden) throw new Error('Non-automation flow remained visible');
if (elements.projectDialogFlowStages.children.length !== 0) throw new Error('Non-automation flow retained stale stages');
if (elements.projectDialog.classList.contains('has-automation-flow')) {
  throw new Error('Non-automation project retained the expanded dialog');
}

const recruitment = triggers.find(item => item.dataset.project === 'recruitment');
recruitment.listeners.click[0]();
const stages = elements.projectDialogFlowStages.children;
const scrollHandlers = elements.projectDialogPanel.listeners.scroll || [];
if (scrollHandlers.length !== 1) throw new Error('Dialog panel has no workflow progress scroll handler');

const travel = elements.projectDialogFlow.offsetHeight - elements.projectDialogFlowShell.offsetHeight;
elements.projectDialogPanel.scrollTop = elements.projectDialogFlow.offsetTop + (travel / 2);
scrollHandlers[0]();
if (!stages[2].classList.contains('is-active')) throw new Error('Middle scroll position did not activate stage 3');
if (!stages[0].classList.contains('is-complete') || !stages[1].classList.contains('is-complete')) {
  throw new Error('Earlier stages were not marked complete');
}
if (stages[0]['aria-current'] || stages[1]['aria-current']) throw new Error('Completed stages remained current');
if (stages[2]['aria-current'] !== 'step') throw new Error('Stage 3 is not announced as current');
if (elements.projectDialogFlowStatus.textContent !== 'Stage 3 of 5 · AI Interpretation') {
  throw new Error('Middle stage status is incorrect');
}
const middleProgress = Number(elements.projectDialogFlowShell.style.getPropertyValue('--flow-progress'));
if (Math.abs(middleProgress - 0.5) > 0.01) throw new Error(`Flow progress is ${middleProgress}, expected 0.5`);

elements.projectDialogPanel.scrollTop = elements.projectDialogFlow.offsetTop + travel;
scrollHandlers[0]();
if (!stages[4].classList.contains('is-active')) throw new Error('Final scroll position did not activate stage 5');
if (!stages.slice(0, 4).every(stage => stage.classList.contains('is-complete'))) {
  throw new Error('Final scroll position did not complete the earlier stages');
}
if (elements.projectDialogFlowStatus.textContent !== 'Stage 5 of 5 · Follow-up & Logs') {
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
    assert "Automation flow" in HTML
    assert "Input → Logic → Action" in HTML
    assert "Scroll to run the workflow" in HTML

    expected_flows = {
        "recruitment": [
            "Candidate Intake",
            "Duplicate Check",
            "AI Interpretation",
            "Recruiter Review",
            "Follow-up & Logs",
        ],
        "lead-qualification": [
            "Capture Inquiry",
            "Validate & Deduplicate",
            "Extract & Score",
            "Hot / Warm / Cold Route",
            "Record & Respond",
        ],
        "inventory": [
            "Read Inventory",
            "Compare Thresholds",
            "Consolidate Low Stock",
            "Send Alert",
            "Daily Summary",
        ],
    }

    for project, stages in expected_flows.items():
        project_key = re.escape(project)
        assert re.search(rf"(?:'{project_key}'|{project_key}):\s*{{", JS)
        for stage in stages:
            assert stage in JS, f"Missing {project} flow stage: {stage}"

    assert JS.count("flow: [") == 3
    assert "projectDialogFlow.hidden = !project.flow" in JS
    assert "projectDialogFlowStages.replaceChildren" in JS

    for selector in [
        ".project-dialog-flow{",
        ".project-dialog-flow-shell{",
        ".project-dialog.has-automation-flow{",
        ".project-flow-stages{",
        ".project-flow-stage{",
        ".project-flow-stage.is-active{",
        ".project-flow-stage.is-complete{",
        ".project-flow-connector{",
    ]:
        assert selector in CSS, f"Missing automation-flow style: {selector}"

    assert "grid-template-columns:repeat(5,minmax(0,1fr))" in CSS
    assert ".project-flow-stages{grid-template-columns:1fr}" in CSS
    assert "@media (prefers-reduced-motion: reduce)" in CSS
    assert ".project-flow-progress-track span{transition:none!important}" in CSS
    assert ".project-flow-stage.is-active{transform:none!important}" in CSS

    stage_rule = re.search(r"\.project-flow-stage\{(?P<body>.*?)\n\}", CSS, re.S)
    assert stage_rule, "Missing base project flow stage rule"
    assert "opacity:" not in stage_rule.group("body"), "Upcoming stage text must not be dimmed with opacity"

    test_runtime_behavior()

    print("PASS project-specific automation flows and responsive dialog structure")


if __name__ == "__main__":
    run()
