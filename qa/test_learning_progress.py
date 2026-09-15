from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / 'js' / 'script.js').read_text(encoding='utf-8')
CSS = (ROOT / 'css' / 'learning.css').read_text(encoding='utf-8')


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def run():
    for text in [
        'CURRENTLY LEARNING / 2026',
        'AI Automation with n8n',
        '2 COURSES COMPLETED',
        'n8n Quickstart',
        'Essentials: Your First Workflows',
        'Certificate of Completion',
        'September 15, 2026',
        'Build an original AI automation',
        'assets/certificates/n8n-quickstart.svg',
        'assets/certificates/n8n-essentials-first-workflows.svg',
        'RECENTLY COMPLETED',
        'NEXT MILESTONE',
        'Workflow Automation',
        'AI Agent',
        'Portfolio-ready automations',
        'n8n Academy · 2 courses completed',
    ]:
        require(text in JS, f'Missing completed-course portfolio content: {text}')

    for stale_text in [
        'First course nearly complete',
        'Finish the first n8n course',
        'Finishing first course',
        'BUILDING AN AI AGENT',
        'Final exam and wrap up',
    ]:
        require(stale_text not in JS, f'Stale learning status remains: {stale_text}')

    require('data-route="systems"' in JS, 'Learning card should route to Systems')
    require('id="learning-lab"' in JS, 'Learning Lab section is missing')
    require('data-certificate="quickstart"' in JS, 'Quickstart credential card is missing')
    require('data-certificate="essentials-first-workflows"' in JS, 'Essentials credential card is missing')

    require((ROOT / 'assets/certificates/n8n-quickstart.svg').exists(), 'Quickstart certificate asset is missing')
    require((ROOT / 'assets/certificates/n8n-essentials-first-workflows.svg').exists(), 'Essentials certificate asset is missing')

    for class_name in [
        '.learning-card',
        '.learning-progress-step',
        '.learning-progress-dot',
        '.learning-progress-log',
        '.learning-lab',
        '.credential-certificate',
    ]:
        require(class_name in CSS, f'Missing completed-course styling: {class_name}')

    require('var(--border)' not in CSS, 'Learning CSS must only use portfolio design tokens')
    require('var(--text-soft)' not in CSS, 'Learning CSS must only use portfolio design tokens')
    print('PASS two completed n8n courses and credential portfolio checks')


if __name__ == '__main__':
    run()
