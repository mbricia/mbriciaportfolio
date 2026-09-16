from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / 'js' / 'script.js').read_text(encoding='utf-8')


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def run():
    expected = [
        '2020–2023',
        'Professional programming',
        'Quadrant Information Services',
        '2023–Present',
        'Freelance Technical & Development Work',
        'students and local clients',
        'development, debugging, troubleshooting, and practical project implementation',
        '2026',
        'Independent products & automation',
        'AVENLO web products',
        'AI automation learning',
    ]
    for text in expected:
        require(text in JS, f'Missing experience timeline content: {text}')

    require('mountProfessionalTimeline' in JS, 'Professional timeline mount is missing')
    require("[data-view=\"about\"] .timeline-card" in JS, 'About timeline target is missing')
    print('PASS professional experience timeline content checks')


if __name__ == '__main__':
    run()
