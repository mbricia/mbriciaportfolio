from pathlib import Path
from html import unescape


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
TEXT = unescape(HTML)
CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "script.js").read_text(encoding="utf-8")


def run():
    assert 'class="build-activity-layout"' in HTML
    assert 'id="activitySummary"' in HTML
    assert 'id="activityMonths"' in HTML
    assert 'class="activity-weekdays"' in HTML
    assert "Code, documentation, and automation repository updates." in TEXT
    assert 'class="automation-milestones"' in HTML
    assert "Automation Milestones" in TEXT
    assert HTML.count('class="milestone-item"') >= 5
    assert 'class="proof-stats"' in HTML
    assert HTML.count('class="bento-stat') == 4

    assert "buildActivityCalendar" in JS
    assert "formatActivitySummary" in JS
    assert "GITHUB_ACTIVITY_REPOS" in JS
    for repository in [
        "mbriciaportfolio",
        "n8n-ai-recruitment-candidate-pipeline",
        "n8n-ai-lead-qualification-automation",
        "n8n-inventory-low-stock-automation",
    ]:
        assert repository in JS
    assert "api.github.com/repos/mbricia" in JS
    assert "grid-template-rows:repeat(7,1fr)" in CSS.replace(" ", "")
    assert "grid-template-columns:28pxminmax(610px,1fr)" in CSS.replace(" ", "")
    assert ".automation-milestones{" in CSS
    print("PASS hybrid build activity and automation milestone checks")


if __name__ == "__main__":
    run()
