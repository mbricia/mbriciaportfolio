from pathlib import Path
from html import unescape


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
TEXT = unescape(HTML)
CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")


def run():
    assert 'class="portrait-badge"' not in HTML, "The 6+ portrait badge should be removed"
    assert 'class="hero-topline"' in HTML, "Hero positioning and availability should share a stronger opening line"
    assert 'class="portrait-stage"' in HTML, "Portrait should sit in a designed profile stage"
    assert 'class="portrait-principle"' in HTML, "Hero should include a concise working-principle panel"
    assert "AI-assisted. Fundamentals-owned." in TEXT
    assert "The tools changed. The responsibility didn’t." in TEXT
    assert ".portrait-stage::before" in CSS
    assert ".hero-copy h1::after" in CSS
    print("PASS polished hero composition checks")


if __name__ == "__main__":
    run()
