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
        'RECENTLY COMPLETED',
        'CURRENT FOCUS',
        'NEXT MILESTONE',
        'Last updated · Sep 2026',
        'Started n8n fundamentals',
        'Built guided course workflow',
        'Workflow Automation',
        'APIs',
        'Course workflows → original builds',
        'Portfolio-ready automations',
    ]:
        require(text in JS, f'Missing learning tracker content: {text}')

    require('data-route="systems"' in JS, 'Learning card should route to Systems')
    require('id="learning-lab"' in JS, 'Learning Lab section is missing')

    for class_name in [
        '.learning-card',
        '.learning-progress-step',
        '.learning-progress-dot',
        '.learning-progress-log',
        '.learning-lab',
    ]:
        require(class_name in CSS, f'Missing learning tracker styling: {class_name}')

    require('var(--border)' not in CSS, 'Learning CSS must only use portfolio design tokens')
    require('var(--text-soft)' not in CSS, 'Learning CSS must only use portfolio design tokens')
    print('PASS active learning tracker portfolio checks')


if __name__ == '__main__':
    run()
