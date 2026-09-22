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
        "STKR Maniac Printing Services",
        "application logic",
        "debugging",
        "troubleshooting",
    ]
    for text in expected:
        require(text in TEXT, f"Missing experience content: {text}")

    require('id="about"' in HTML, "About section is missing")
    require('class="experience-list"' in HTML, "Experience list is missing")
    print("PASS simplified experience section checks")


if __name__ == "__main__":
    run()
