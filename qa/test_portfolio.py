from pathlib import Path
from html import unescape
import re

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
TEXT = unescape(HTML)
CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "script.js").read_text(encoding="utf-8")


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def test_information_architecture():
    for section_id in ["home", "projects", "about", "contact"]:
        require(f'id="{section_id}"' in HTML, f"Missing section: {section_id}")
        require(f'href="#{section_id}"' in HTML, f"Missing nav link: {section_id}")

    for obsolete in [
        'class="sidebar"',
        'data-view=',
        'commandOverlay',
        'RECRUITER SNAPSHOT',
        'terminal-prompt',
        '~/portfolio/',
        'LEARNING PROGRESS',
    ]:
        require(obsolete not in HTML, f"Obsolete dashboard UI remains: {obsolete}")


def test_home_is_simple_and_clear():
    for text in [
        "Mark Jhollan Bricia",
        "Software Developer · AI Automation · IT Support",
        "View Projects",
        "Download CV",
        "Open to remote opportunities",
    ]:
        require(text in TEXT, f"Home is missing: {text}")

    require(HTML.count('class="skill-pill"') <= 6, "Home should not overload the skill list")
    require('class="portrait-frame"' in HTML, "Portrait frame is missing")
    require('src="assets/profile/mark-jhollan.png"' in HTML, "Portrait asset is missing")
    require('alt="Professional portrait of Mark Jhollan Bricia"' in HTML, "Portrait alt text is missing")


def test_project_proof():
    projects = [
        "AI Recruitment & Candidate Pipeline",
        "AI Client Inquiry & Lead Qualification",
        "Inventory & Low-Stock Automation",
        "Kopi Brews Operations App",
        "Eleventh28 POS + Kitchen Display",
        "AVENLO Web Products",
    ]
    for project in projects:
        require(project in TEXT, f"Missing project: {project}")

    require("Private prototype" in TEXT, "Kopi Brews status must remain explicit")
    require("Team capstone" in TEXT, "Eleventh28 must remain identified as a team capstone")
    require("not publicly released" in TEXT, "Kopi Brews public-release status must remain explicit")

    for url in [
        "https://avenlo-saas.netlify.app/",
        "https://avenlo-cafe.netlify.app/",
        "https://avenlo-portfolio.netlify.app/",
    ]:
        require(url in HTML, f"Missing AVENLO live demo: {url}")


def test_about_and_credentials():
    for text in [
        "Rate Programmer · Quadrant Information Services",
        "Freelance Technical & Development Work",
        "STKR Maniac Printing Services",
        "BS Information Technology",
        "Major in Software Engineering",
        "n8n Foundations Professional Certificate",
        "4 course certificates completed",
        "n8n is one of the tools I use, not the whole skill set.",
    ]:
        require(text in TEXT, f"About section is missing: {text}")

    for asset in [
        "assets/certificates/n8n-quickstart.svg",
        "assets/certificates/n8n-essentials-first-workflows.svg",
        "assets/certificates/n8n-integrations-apis-connected-workflows.svg",
        "assets/certificates/n8n-in-practice-ai-testing-best-practices.webp",
    ]:
        require(asset in HTML, f"Missing certificate link: {asset}")


def test_contact():
    for value in [
        "mailto:makmakbricia@gmail.com",
        "https://www.linkedin.com/in/mark-jhollan-bricia-a783a1182/",
        "https://github.com/mbricia",
    ]:
        require(value in HTML, f"Missing contact link: {value}")


def test_document_integrity():
    ids = re.findall(r'\bid="([^"]+)"', HTML)
    dupes = sorted({i for i in ids if ids.count(i) > 1})
    require(not dupes, f"Duplicate HTML ids: {dupes}")

    for tag in re.findall(r'<img\b[^>]*>', HTML, flags=re.I):
        require(re.search(r'\balt="[^"]*"', tag, flags=re.I) is not None, f"Image missing alt: {tag}")
        src = re.search(r'\bsrc="([^"]+)"', tag, flags=re.I)
        require(src is not None, f"Image missing src: {tag}")
        path = src.group(1)
        if not re.match(r'^[a-z]+://', path):
            require((ROOT / path).exists(), f"Missing local image: {path}")

    local_links = re.findall(r'(?:src|href)="((?!https?:|#|mailto:|tel:)[^"]+)"', HTML)
    for rel in local_links:
        require((ROOT / rel).exists(), f"Missing local referenced file: {rel}")

    require(CSS.count("{") == CSS.count("}"), "CSS braces are unbalanced")
    require("98%" not in HTML and "99%" not in HTML, "Portfolio must not show fake skill percentages")

    for url in re.findall(r'href="(https?://[^"]+)"', HTML):
        require(url.startswith("https://"), f"External link should use HTTPS: {url}")


def run():
    tests = [
        test_information_architecture,
        test_home_is_simple_and_clear,
        test_project_proof,
        test_about_and_credentials,
        test_contact,
        test_document_integrity,
    ]
    for test in tests:
        test()
        print(f"PASS {test.__name__}")
    print(f"PASS {len(tests)} simplified portfolio tests")


if __name__ == "__main__":
    run()
