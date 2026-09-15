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
        'COURSE COMPLETED',
        'n8n Quickstart',
        'Certificate of Completion',
        'September 15, 2026',
        'Build an original AI automation',
        'assets/certificates/n8n-quickstart.svg',
        'RECENTLY COMPLETED',
        'NEXT MILESTONE',
        'Workflow Automation',
        'AI Agent',
        'Portfolio-ready automations',
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
    require('credential-certificate' in JS, 'Credentials certificate card is missing')

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
    print('PASS completed n8n course and credential portfolio checks')


if __name__ == '__main__':
    run()
