from pathlib import Path
from html import unescape


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
TEXT = unescape(HTML)
CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "script.js").read_text(encoding="utf-8")
MAKE_PROOF = ROOT / "assets" / "certificates" / "make-academy-badges-2026.png"


def test_project_overview_opens_one_accessible_case_study_dialog():
    assert HTML.count('class="project-card"') == 6
    assert HTML.count('class="project-open"') == 6
    assert HTML.count('data-project="') == 6
    assert '<details>' not in HTML
    assert '<dialog class="project-dialog" id="projectDialog"' in HTML
    assert 'aria-labelledby="projectDialogTitle"' in HTML
    assert 'id="projectDialogClose"' in HTML
    assert 'const projectDetails' in JS
    assert 'showModal()' in JS
    assert "projectDialog.close()" in JS
    assert ".project-dialog::backdrop" in CSS
    assert "backdrop-filter:blur(18px)" in CSS.replace(" ", "")


def test_projects_are_grouped_and_link_to_real_automation_repositories():
    assert "Automation Systems" in TEXT
    assert "Software & Web Products" in TEXT
    for url in [
        "https://github.com/mbricia/n8n-ai-recruitment-candidate-pipeline",
        "https://github.com/mbricia/n8n-ai-lead-qualification-automation",
        "https://github.com/mbricia/n8n-inventory-low-stock-automation",
    ]:
        assert url in JS


def test_three_make_badges_use_real_uploaded_proof():
    assert MAKE_PROOF.exists(), "Real Make Academy badge proof image is missing"
    assert "assets/certificates/make-academy-badges-2026.png" in HTML
    assert 'class="make-badge-proof"' in HTML
    assert "object-fit:contain" in CSS.replace(" ", "")
    assert "4 n8n certificates + 3 Make Academy badges." in TEXT
    assert "Make Intermediate" in TEXT
    assert "Issued Sep 28, 2026" in TEXT
    assert "AI Automation Explorer" in TEXT
    assert "Make Foundation" in TEXT


if __name__ == "__main__":
    tests = [
        test_project_overview_opens_one_accessible_case_study_dialog,
        test_projects_are_grouped_and_link_to_real_automation_repositories,
        test_three_make_badges_use_real_uploaded_proof,
    ]
    for test in tests:
        test()
        print(f"PASS {test.__name__}")
