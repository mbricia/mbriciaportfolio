from pathlib import Path
import base64

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "Mark-Jhollan-Bricia-CV.pdf"
CV_B64 = ROOT / "assets" / "cv" / "Mark-Jhollan-Bricia-CV.base64.txt"


def run():
    data = PDF.read_bytes()
    assert data.startswith(b"%PDF-"), "CV should be a valid PDF"
    assert data.rstrip().endswith(b"%%EOF"), "CV PDF is missing EOF marker"
    assert b"/Count 1" in data, "CV should remain a one-page document"
    assert data.count(b"/Type /Page") >= 1, "CV should contain a page object"

    decoded = base64.b64decode(CV_B64.read_text(encoding="utf-8").strip())
    assert decoded == data, "Portfolio download asset and fallback PDF must stay identical"

    assert len(data) > 4000, "CV PDF looks unexpectedly small"
    print("PASS one-page ATS CV PDF structure and download synchronization")


if __name__ == "__main__":
    run()
