from pathlib import Path
import base64

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
JS = (ROOT / "js" / "script.js").read_text(encoding="utf-8")
DATA = ROOT / "assets" / "cv" / "Mark-Jhollan-Bricia-CV.base64.txt"


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def run():
    require(DATA.exists(), "Updated CV data asset is missing")
    raw = base64.b64decode(DATA.read_text(encoding="utf-8").strip())
    require(raw.startswith(b"%PDF-"), "Updated CV data is not a PDF")
    require('data-cv-download' in HTML, "CV download controls are missing")
    require("Mark-Jhollan-Bricia-CV.base64.txt" in JS, "CV download should use the updated CV data asset")
    require("Mark-Jhollan-Bricia-Master-ATS-CV-v5.pdf" in JS, "CV filename should use master ATS v5")
    print("PASS simplified CV download wiring checks")


if __name__ == "__main__":
    run()
