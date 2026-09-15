from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / 'js' / 'script.js').read_text(encoding='utf-8')
CSS = (ROOT / 'css' / 'learning.css').read_text(encoding='utf-8')
CERT = (ROOT / 'assets' / 'certificates' / 'n8n-essentials-first-workflows.svg').read_text(encoding='utf-8')


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def run():
    for text in [
        'CURRENTLY LEARNING / 2026',
        'AI Automation with n8n',
        '2 CERTIFICATES EARNED',
        'n8n Quickstart',
        'Essentials: Your First Workflows',
        'Integrations: APIs & Connected Workflows',
        'In Practice: AI, Testing & Best Practices',
        'CURRENT FOCUS',
        'NEXT COURSE',
        'APIs',
        'n8n Academy · Current focus: Integrations',
        'assets/certificates/n8n-quickstart.svg',
        'assets/certificates/n8n-essentials-first-workflows.svg',
    ]:
        require(text in JS, f'Missing learning tracker content: {text}')

    for stale_text in [
        '2 COURSES COMPLETED',
        'Build an original AI automation',
        'COURSES COMPLETE · ORIGINAL BUILD NEXT',
        'n8n Academy · Integrations in progress',
    ]:
        require(stale_text not in JS, f'Stale or unsupported learning status remains: {stale_text}')

    require('data-route="systems"' in JS, 'Learning card should route to Systems')
    require('id="learning-lab"' in JS, 'Learning Lab section is missing')
    require('data-certificate="quickstart"' in JS, 'Quickstart credential card is missing')
    require('data-certificate="essentials-first-workflows"' in JS, 'Essentials credential card is missing')
    require('Awarded September 15, 2026.' in JS, 'Essentials certificate date should be shown')

    require((ROOT / 'assets/certificates/n8n-quickstart.svg').exists(), 'Quickstart certificate asset is missing')
    require((ROOT / 'assets/certificates/n8n-essentials-first-workflows.svg').exists(), 'Essentials certificate asset is missing')
    require('<image' in CERT and 'data:image/' in CERT, 'Essentials certificate should embed the original uploaded certificate image')
    require('preserveAspectRatio="xMidYMid meet"' in CERT, 'Certificate image must preserve its full aspect ratio')
    require('viewBox="0 0 1123 793"' in CERT, 'Essentials certificate should preserve the uploaded image dimensions')

    for class_name in [
        '.learning-card',
        '.learning-progress-step',
        '.learning-progress-dot',
        '.learning-progress-log',
        '.learning-lab',
        '.credential-certificate',
    ]:
        require(class_name in CSS, f'Missing learning styling: {class_name}')

    compact_css = CSS.replace(' ', '')
    require('object-fit:contain' in compact_css, 'Certificate preview must contain the full certificate without cropping')
    require('var(--border)' not in CSS, 'Learning CSS must only use portfolio design tokens')
    require('var(--text-soft)' not in CSS, 'Learning CSS must only use portfolio design tokens')
    print('PASS current n8n learning progress and certificate asset checks')


if __name__ == '__main__':
    run()
