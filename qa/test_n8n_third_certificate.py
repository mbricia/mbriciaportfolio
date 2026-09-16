from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = (ROOT / 'js' / 'script.js').read_text(encoding='utf-8')
CERT_PATH = ROOT / 'assets' / 'certificates' / 'n8n-integrations-apis-connected-workflows.svg'


def test_third_certificate_updates_learning_progress_and_credentials():
    expected = [
        '3 CERTIFICATES EARNED',
        'Last updated · Sep 16, 2026',
        'n8n Academy · 3 certificates earned',
        'Latest completion · September 16, 2026',
        '03 / COMPLETED COURSE',
        'NEXT COURSE · AI / TESTING / BEST PRACTICES',
        'data-certificate="integrations-apis-connected-workflows"',
        'Awarded September 16, 2026.',
        'Mark-Jhollan-Bricia-Master-ATS-CV-v4.pdf',
    ]
    for text in expected:
        assert text in SCRIPT, f'missing updated learning/certificate copy: {text}'
    stale = [
        '2 CERTIFICATES EARNED',
        '2 Certificates of Completion · September 15, 2026',
        '03 / CURRENT FOCUS',
        'CURRENT FOCUS · INTEGRATIONS / APIS',
    ]
    for text in stale:
        assert text not in SCRIPT, f'stale learning status still present: {text}'


def test_integrations_certificate_uses_original_uploaded_artwork():
    assert CERT_PATH.exists(), 'third certificate asset is missing'
    cert = CERT_PATH.read_text(encoding='utf-8')
    assert 'viewBox="0 0 1122 792"' in cert
    assert 'preserveAspectRatio="xMidYMid meet"' in cert
    assert 'data:image/webp;base64,' in cert
    assert 'September 16, 2026' in cert
    assert 'Integrations: APIs &amp; Connected Workflows' in cert
