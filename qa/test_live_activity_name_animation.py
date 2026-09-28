from pathlib import Path
from html import unescape


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
TEXT = unescape(HTML)
CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "script.js").read_text(encoding="utf-8")


def run():
    assert "Open to remote opportunities" not in TEXT
    assert 'class="availability"' not in HTML
    assert 'class="name-accent"' in HTML
    assert HTML.count('class="name-letter"') == 6
    assert "@keyframes letterLift" in CSS
    assert "@keyframes nameGlow" in CSS

    assert 'id="portfolioActivity"' in HTML
    assert 'id="activitySnapshot"' in HTML
    assert "activity snapshot through Sep 22, 2026" not in TEXT
    assert "GITHUB_ACTIVITY_API" in JS
    assert "api.github.com/repos/mbricia/mbriciaportfolio/commits" in JS
    assert "fetch(GITHUB_ACTIVITY_API" in JS
    assert "renderActivity" in JS
    assert "activitySnapshot" in JS
    print("PASS live repository activity and name animation checks")


if __name__ == "__main__":
    run()
