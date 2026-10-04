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
    this.classList = { add() {}, remove() {} };
  }
  addEventListener(type, handler) { (this.listeners[type] ||= []).push(handler); }
  replaceChildren(...children) { this.children = children; }
  append(...children) { this.children.push(...children); }
  setAttribute(name, value) { this[name] = value; }
  showModal() { this.open = true; }
  close() { this.open = false; for (const handler of this.listeners.close || []) handler(); }
  focus() { activeElement = this; }
}

let activeElement = null;
const ids = [
  'projectDialog', 'projectDialogClose', 'projectDialogCategory', 'projectDialogTitle',
  'projectDialogStatus', 'projectDialogSummary', 'projectDialogProblem', 'projectDialogBuild',
  'projectDialogProof', 'projectDialogStack', 'projectDialogLinks', 'projectDialogFlow',
  'projectDialogFlowStages',
];
const elements = Object.fromEntries(ids.map(id => [id, new FakeElement(id)]));
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
  window: { open() {} },
  Uint8Array,
  Blob,
  URL,
  atob,
  setTimeout,
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
  if (elements.projectDialogFlowStages.children.length !== 5) throw new Error(`${key} does not have five stages`);
  const firstStage = elements.projectDialogFlowStages.children[0];
  const renderedTitle = firstStage.children[1].textContent;
  if (renderedTitle !== firstTitle) throw new Error(`${key} first stage mismatch: ${renderedTitle}`);
  if ('tabIndex' in firstStage) throw new Error(`${key} static flow stage creates an unnecessary tab stop`);
  elements.projectDialog.close();
  if (activeElement !== trigger) throw new Error(`${key} focus was not restored`);
}

const nonAutomation = triggers.find(item => item.dataset.project === 'kopi-brews');
nonAutomation.listeners.click[0]();
if (!elements.projectDialogFlow.hidden) throw new Error('Non-automation flow remained visible');
if (elements.projectDialogFlowStages.children.length !== 0) throw new Error('Non-automation flow retained stale stages');
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
    assert "Automation flow" in HTML
    assert "Input → Logic → Action" in HTML

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
        ".project-flow-stages{",
        ".project-flow-stage{",
        ".project-flow-connector{",
    ]:
        assert selector in CSS, f"Missing automation-flow style: {selector}"

    assert "grid-template-columns:repeat(5,minmax(0,1fr))" in CSS
    assert ".project-flow-stages{grid-template-columns:1fr}" in CSS

    test_runtime_behavior()

    print("PASS project-specific automation flows and responsive dialog structure")


if __name__ == "__main__":
    run()
