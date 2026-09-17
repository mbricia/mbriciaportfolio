from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / 'js' / 'script.js').read_text(encoding='utf-8')
CSS = (ROOT / 'css' / 'learning.css').read_text(encoding='utf-8')
ESSENTIALS_CERT = (ROOT / 'assets' / 'certificates' / 'n8n-essentials-first-workflows.svg').read_text(encoding='utf-8')
INTEGRATIONS_CERT = (ROOT / 'assets' / 'certificates' / 'n8n-integrations-apis-connected-workflows.svg').read_text(encoding='utf-8')


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def run():
    for text in [
        'CURRENTLY LEARNING / 2026',
        'AI Automation with n8n',
        '4 CERTIFICATES EARNED',
        'Last updated · Sep 17, 2026',
        'n8n Quickstart',
        'Essentials: Your First Workflows',
        'Integrations: APIs & Connected Workflows',
        'In Practice: AI, Testing & Best Practices',
        'n8n Foundations Professional Certificate · Program completed',
        'NEXT MILESTONE',
        'Original AI Automation Project',
        'assets/certificates/n8n-quickstart.svg',
        'assets/certificates/n8n-essentials-first-workflows.svg',
        'assets/certificates/n8n-integrations-apis-connected-workflows.svg',
        'assets/certificates/n8n-in-practice-ai-testing-best-practices.webp',
    ]:
        require(text in JS, f'Missing final learning tracker content: {text}')

    for stale_text in [
        '3 CERTIFICATES EARNED',
        'n8n Academy · 3 certificates earned',
        'Latest completion · September 16, 2026',
        'NEXT COURSE · AI / TESTING / BEST PRACTICES',
        '04 / NEXT COURSE',
        'Upcoming program course focused on AI, testing, and stronger workflow practices.',
    ]:
        require(stale_text not in JS, f'Stale learning state remains: {stale_text}')

    require('data-route="systems"' in JS, 'Learning card should route to Systems')
    require('id="learning-lab"' in JS, 'Learning Lab section is missing')
    require('data-certificate="quickstart"' in JS, 'Quickstart credential card is missing')
    require('data-certificate="essentials-first-workflows"' in JS, 'Essentials credential card is missing')
    require('data-certificate="integrations-apis-connected-workflows"' in JS, 'Integrations credential card is missing')
    require('data-certificate="in-practice-ai-testing-best-practices"' in JS, 'In Practice credential card is missing')
    require('Awarded September 17, 2026.' in JS, 'In Practice certificate date should be shown')

    require((ROOT / 'assets/certificates/n8n-quickstart.svg').exists(), 'Quickstart certificate asset is missing')
    require((ROOT / 'assets/certificates/n8n-essentials-first-workflows.svg').exists(), 'Essentials certificate asset is missing')
    require((ROOT / 'assets/certificates/n8n-integrations-apis-connected-workflows.svg').exists(), 'Integrations certificate asset is missing')
    require((ROOT / 'assets/certificates/n8n-in-practice-ai-testing-best-practices.webp').exists(), 'In Practice certificate asset is missing')

    require('<image' in ESSENTIALS_CERT and 'data:image/' in ESSENTIALS_CERT, 'Essentials certificate should embed the original uploaded certificate image')
    require('preserveAspectRatio="xMidYMid meet"' in ESSENTIALS_CERT, 'Essentials certificate image must preserve its full aspect ratio')
    require('<image' in INTEGRATIONS_CERT and 'data:image/' in INTEGRATIONS_CERT, 'Integrations certificate should embed the original uploaded certificate image')
    require('preserveAspectRatio="xMidYMid meet"' in INTEGRATIONS_CERT, 'Integrations certificate image must preserve its full aspect ratio')

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
    print('PASS completed n8n Foundations program and four-certificate portfolio state')


if __name__ == '__main__':
    run()
