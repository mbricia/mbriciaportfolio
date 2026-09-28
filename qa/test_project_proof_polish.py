from pathlib import Path
from html import unescape


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
TEXT = unescape(HTML)
CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "script.js").read_text(encoding="utf-8")


def run():
    assert HTML.count('class="project-card"') == 6
    assert HTML.count('class="project-proof-line"') == 6

    for proof_line in [
        "4 workflows · 4/4 sanitized exports",
        "0–100 rule-based scoring · tested routes",
        "2 tested stock states · consolidated alerts",
        "Private prototype · multi-role operations",
        "Team capstone · POS → kitchen → inventory",
        "3 live demos · responsive static builds",
    ]:
        assert proof_line in TEXT, f"Missing project proof line: {proof_line}"

    for element_id in [
        "projectDialogProblem",
        "projectDialogBuild",
        "projectDialogProof",
        "projectDialogStack",
        "projectDialogLinks",
    ]:
        assert f'id="{element_id}"' in HTML, f"Missing dialog proof target: {element_id}"

    assert "projectDialogPoints" not in HTML
    assert "projectDialogPoints" not in JS

    for key in ["problem:", "build:", "proof:"]:
        assert JS.count(key) >= 6, f"Every project should expose {key}"

    for evidence in [
        "4 / 4 sanitized exports",
        "0–100 scoring",
        "7 low-stock / 3 healthy",
        "private prototype",
        "team capstone",
        "Three live demos",
    ]:
        assert evidence.lower() in JS.lower(), f"Missing grounded proof detail: {evidence}"

    for url in [
        "https://github.com/mbricia/n8n-ai-recruitment-candidate-pipeline",
        "https://github.com/mbricia/n8n-ai-lead-qualification-automation",
        "https://github.com/mbricia/n8n-inventory-low-stock-automation",
        "https://github.com/mbricia/Point-of-Sale-With-Kitchen-Display-and-Queue-System",
        "https://github.com/mbricia/Avenlo",
    ]:
        assert url in JS, f"Missing project proof link: {url}"

    assert ".project-proof-line{" in CSS
    assert ".project-dialog-proof-block{" in CSS
    assert ".project-dialog-meta{" in CSS

    assert "Private prototype" in TEXT
    assert "Team capstone" in TEXT
    assert "not presented as a public production release" in JS
    assert "team ownership kept explicit" in JS

    print("PASS recruiter-oriented project proof and case-study structure")


if __name__ == "__main__":
    run()
