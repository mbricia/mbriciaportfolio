from pathlib import Path
from html import unescape
import base64

ROOT = Path(__file__).resolve().parents[1]
HTML = unescape((ROOT / "index.html").read_text(encoding="utf-8"))
SCRIPT = (ROOT / "js" / "script.js").read_text(encoding="utf-8")
CV_B64 = (ROOT / "assets" / "cv" / "Mark-Jhollan-Bricia-CV.base64.txt").read_text(encoding="utf-8").strip()


def test_about_uses_current_experience_copy():
    expected = [
        "Rate Programmer · Quadrant Information Services",
        "Freelance Technical & Development Work",
        "STKR Manila Printing Services",
        "application logic",
        "debugging",
        "troubleshooting",
        "n8n, APIs, webhooks, Google Sheets, Gmail, and AI integrations",
    ]
    for text in expected:
        assert text in HTML, f"missing current portfolio experience copy: {text}"

    assert HTML.index("Freelance Technical & Development Work") < HTML.index("STKR Manila Printing Services")
    assert HTML.index("STKR Manila Printing Services") < HTML.index("Rate Programmer · Quadrant Information Services")


def test_portfolio_download_asset_is_master_v5_pdf():
    pdf_bytes = base64.b64decode(CV_B64)
    assert pdf_bytes.startswith(b"%PDF-")
    assert b"/Count 1" in pdf_bytes
    assert "Mark-Jhollan-Bricia-Master-ATS-CV-v5.pdf" in SCRIPT


if __name__ == "__main__":
    test_about_uses_current_experience_copy()
    test_portfolio_download_asset_is_master_v5_pdf()
    print("PASS portfolio experience continuity and one-page CV checks")
