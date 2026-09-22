from pathlib import Path
from html import unescape

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
TEXT = unescape(HTML)

CERTIFICATES = [
    ROOT / "assets" / "certificates" / "n8n-quickstart.svg",
    ROOT / "assets" / "certificates" / "n8n-essentials-first-workflows.svg",
    ROOT / "assets" / "certificates" / "n8n-integrations-apis-connected-workflows.svg",
    ROOT / "assets" / "certificates" / "n8n-in-practice-ai-testing-best-practices.webp",
]


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def run():
    require("n8n Foundations Professional Certificate" in TEXT, "n8n credential summary is missing")
    require("4 course certificates completed" in TEXT, "Completed course count is missing")
    require("AI Automation and API Integration" in TEXT, "Broader automation positioning is missing")
    require("n8n is one of the tools I use, not the whole skill set." in TEXT, "n8n should be framed as a tool, not the whole role")

    for certificate in CERTIFICATES:
        require(certificate.exists(), f"Missing certificate asset: {certificate.name}")
        require(str(certificate.relative_to(ROOT)).replace("\\", "/") in HTML, f"Certificate is not linked: {certificate.name}")

    for stale in ["LEARNING PROGRESS", "CURRENTLY LEARNING / 2026", "NEXT MILESTONE"]:
        require(stale not in HTML, f"Old learning dashboard copy remains: {stale}")

    print("PASS simplified n8n credential presentation checks")


if __name__ == "__main__":
    run()
