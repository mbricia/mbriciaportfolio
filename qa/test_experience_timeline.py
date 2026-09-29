from pathlib import Path
from html import unescape

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
TEXT = unescape(HTML)


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def run():
    expected = [
        "2020–2023",
        "Rate Programmer · Quadrant Information Services",
        "2023–Present",
        "Freelance Technical & Development Work",
        "STKR Manila Printing Services",
        "application logic",
        "debugging",
        "troubleshooting",
        "n8n, APIs, webhooks, Google Sheets, Gmail, and AI integrations",
    ]
    for text in expected:
        require(text in TEXT, f"Missing experience content: {text}")

    freelance = TEXT.index("Freelance Technical & Development Work")
    stkr = TEXT.index("STKR Manila Printing Services")
    quadrant = TEXT.index("Rate Programmer · Quadrant Information Services")
    require(freelance < stkr < quadrant, "Experience should be reverse chronological: freelance → STKR → Quadrant")

    require('id="about"' in HTML, "About section is missing")
    require('class="experience-list"' in HTML, "Experience list is missing")
    print("PASS current-work-first experience timeline and automation continuity")


if __name__ == "__main__":
    run()
