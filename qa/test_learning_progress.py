from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / 'js' / 'script.js').read_text(encoding='utf-8')
CSS = (ROOT / 'css' / 'learning.css').read_text(encoding='utf-8')


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def run():
    require('CURRENTLY LEARNING / 2026' in JS, 'Overview learning card is missing')
    require('AI Automation with n8n' in JS, 'Current learning topic is missing')
    require('data-route="systems"' in JS, 'Learning card should route to Systems')
    require('id="learning-lab"' in JS, 'Learning Lab section is missing')
    require('Workflow Automation' in JS, 'Learning Lab should describe workflow automation')
    require('APIs' in JS, 'Learning Lab should include API learning')
    require('Course workflows → original builds' in JS, 'Learning Lab should distinguish guided learning from independent work')
    require('Portfolio-ready automations' in JS, 'Learning Lab should show the next proof milestone')
    require('.learning-card' in CSS, 'Learning card styles are missing')
    require('.learning-lab' in CSS, 'Learning Lab styles are missing')
    require('var(--border)' not in CSS, 'Learning CSS must only use portfolio design tokens')
    require('var(--text-soft)' not in CSS, 'Learning CSS must only use portfolio design tokens')
    print('PASS current learning progress portfolio checks')


if __name__ == '__main__':
    run()
