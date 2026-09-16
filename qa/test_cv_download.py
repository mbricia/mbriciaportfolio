from pathlib import Path
import base64

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / 'js' / 'script.js').read_text(encoding='utf-8')
DATA = ROOT / 'assets' / 'cv' / 'Mark-Jhollan-Bricia-CV.base64.txt'


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def run():
    require(DATA.exists(), 'Updated CV data asset is missing')
    raw = base64.b64decode(DATA.read_text(encoding='utf-8').strip())
    require(raw.startswith(b'%PDF-'), 'Updated CV data is not a PDF')
    require(b'Freelance Technical' in raw or b'Independent Developer' in raw, 'Updated CV should contain the freelance development section')
    require('mountCvDownload' in JS, 'CV download mount is missing')
    require('Mark-Jhollan-Bricia-CV.base64.txt' in JS, 'CV download should use the updated CV data asset')
    require("a[href=\"Mark-Jhollan-Bricia-CV.pdf\"]" in JS, 'Existing CV buttons should be intercepted')
    print('PASS updated CV download wiring checks')


if __name__ == '__main__':
    run()
