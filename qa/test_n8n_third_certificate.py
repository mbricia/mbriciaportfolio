from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CERT_PATH = ROOT / "assets" / "certificates" / "n8n-integrations-apis-connected-workflows.svg"


def test_integrations_certificate_is_preserved_and_linked():
    assert CERT_PATH.exists(), "Integrations certificate asset is missing"
    assert "assets/certificates/n8n-integrations-apis-connected-workflows.svg" in HTML

    cert = CERT_PATH.read_text(encoding="utf-8")
    assert 'preserveAspectRatio="xMidYMid meet"' in cert
    assert "Integrations: APIs" in cert
    assert "September 16, 2026" in cert


if __name__ == "__main__":
    test_integrations_certificate_is_preserved_and_linked()
    print("PASS integrations certificate preservation check")
