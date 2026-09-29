from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "Mark-Jhollan-Bricia-CV.pdf"


def run():
    data = PDF.read_bytes()
    assert data.startswith(b"%PDF-1.4"), "CV should be a valid PDF"
    assert data.rstrip().endswith(b"%%EOF"), "CV PDF is missing EOF marker"
    assert b"/Count 2" in data, "CV should remain a readable two-page document"
    assert data.count(b"/Type /Page ") == 2, "CV should contain exactly two page objects"

    for keyword in [
        b"Junior AI Automation Specialist",
        b"PROFESSIONAL SUMMARY",
        b"SELECTED AUTOMATION PROJECTS",
        b"Self-Hosted n8n Environment",
        b"Make Academy",
        b"STI College Global City",
    ]:
        assert keyword in data, f"CV PDF missing expected ATS text: {keyword!r}"

    assert len(data) > 10000, "CV PDF looks unexpectedly small"
    print("PASS ATS-friendly portfolio CV PDF structure and content")


if __name__ == "__main__":
    run()
