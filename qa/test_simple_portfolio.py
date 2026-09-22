from pathlib import Path
from html import unescape

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
TEXT = unescape(HTML)
CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "script.js").read_text(encoding="utf-8")


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def run():
    for anchor in ["#home", "#projects", "#about", "#contact"]:
        require(f'href="{anchor}"' in HTML, f"Missing primary nav link: {anchor}")

    for obsolete in [
        'class="sidebar"',
        'id="commandTrigger"',
        'id="localTime"',
        'RECRUITER SNAPSHOT',
        'terminal-prompt',
        'LEARNING PROGRESS',
        '~/portfolio/',
    ]:
        require(obsolete not in HTML, f"Old crowded UI remains in HTML: {obsolete}")

    require('class="portrait-frame"' in HTML, "Large centered portrait frame is missing")
    require('assets/profile/mark-jhollan.png' in HTML, "Profile portrait asset is missing")
    compact_css = CSS.replace(" ", "")
    require('width:min(100%,360px)' in compact_css, "Portrait should be visually larger")
    require('margin-inline:auto' in compact_css, "Portrait should be centered in its frame")

    require('Software Developer · AI Automation · IT Support' in TEXT, "Primary positioning is missing")
    require(HTML.count('class="skill-pill"') <= 6, "Home should keep skill pills intentionally limited")

    for title in [
        'AI Recruitment & Candidate Pipeline',
        'AI Client Inquiry & Lead Qualification',
        'Inventory & Low-Stock Automation',
        'Kopi Brews Operations App',
        'Eleventh28 POS + Kitchen Display',
        'AVENLO Web Products',
    ]:
        require(title in TEXT, f"Missing project: {title}")

    require('n8n Foundations Professional Certificate' in TEXT, "n8n credential summary is missing")
    require('4 course certificates completed' in TEXT, "n8n credential count is missing")
    require('AI Automation' in TEXT, "n8n should sit under broader AI Automation positioning")

    require('commandOverlay' not in JS, "Command palette JavaScript should be removed")
    require('localTime' not in JS, "Live clock JavaScript should be removed")

    print("PASS simple professional portfolio requirements")


if __name__ == "__main__":
    run()
