from pathlib import Path
import base64
import hashlib

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = (ROOT / "js" / "script.js").read_text(encoding="utf-8")
CV_B64 = (ROOT / "assets" / "cv" / "Mark-Jhollan-Bricia-CV.base64.txt").read_text(encoding="utf-8").strip()


def test_about_timeline_uses_arr_aligned_experience_copy():
    expected = [
        "Developed and maintained system components based on project requirements, working with databases and application logic to support project delivery.",
        "Built and supported small software and web projects for students and local clients, handling implementation, debugging, troubleshooting, and revisions to deliver working project outputs.",
        "Managed client print orders and prepared production-ready files from design through final output, completing customer requests for documents, stickers, shirts, and other print work.",
        "STKR Maniac Printing Services",
    ]
    for text in expected:
        assert text in SCRIPT, f"missing ARR-aligned portfolio copy: {text}"


def test_portfolio_download_asset_is_master_v3_pdf():
    pdf_bytes = base64.b64decode(CV_B64)
    assert pdf_bytes.startswith(b"%PDF-")
    assert hashlib.sha256(pdf_bytes).hexdigest() == "4d39ddb3fcd15dd522aefc6e602313bff601bdc1414722f244cb9cad5fc56393"
    assert "Mark-Jhollan-Bricia-Master-ATS-CV-v3.pdf" in SCRIPT
