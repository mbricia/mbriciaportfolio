from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'index.html').read_text(encoding='utf-8')
JS = (ROOT / 'js' / 'script.js').read_text(encoding='utf-8')


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def position(text):
    p = HTML.find(text)
    require(p >= 0, f'Missing required text: {text}')
    return p



def test_overview_profile_portrait():
    overview_start = HTML.index('data-view="overview"')
    work_start = HTML.index('data-view="work"')
    overview = HTML[overview_start:work_start]
    hero_start = overview.index('class="hero-panel panel"')
    stack_start = overview.index('class="overview-stack"')
    hero = overview[hero_start:stack_start]
    require('class="hero-portrait"' in hero, 'Portrait must sit inside the main hero beside the name')
    require('assets/profile/mark-jhollan.png' in hero, 'Overview hero portrait asset is missing')
    require('alt="Professional portrait of Mark Jhollan Bricia"' in hero, 'Overview portrait needs a descriptive alt text')
    require('class="profile-panel panel"' not in overview, 'Separate profile card should be removed from the right column')
    require('class="principle-panel panel"' in overview, 'Engineering principle panel should remain in the right column')
    require((ROOT / 'assets/profile/mark-jhollan.png').exists(), 'Profile portrait file is missing')

def test_recruiter_structure():
    require('data-view="kopi-app"' in HTML, 'Dedicated Kopi Brews case-study view is missing')
    require("'kopi-app'" in JS or '"kopi-app"' in JS, 'kopi-app route is not registered in JavaScript')
    require('data-view="capstone"' in HTML, 'Legacy capstone route must remain')
    require('Software Systems' in HTML, 'Work view must group software systems')
    require('Shipped Web Products' in HTML, 'Work view must group shipped web products')
    work_start = HTML.index('data-view="work"')
    kopi_start = HTML.index('data-view="kopi-app"')
    work = HTML[work_start:kopi_start]
    require(work.find('Kopi Brews Operations App') < work.find('POS + Kitchen Display'), 'Kopi Brews should be presented before Eleventh28 in Work')
    require(work.find('POS + Kitchen Display') < work.find('AVENLO SaaS'), 'Eleventh28 should appear before AVENLO product cards in Work')


def test_recruiter_scan_content():
    overview_start = HTML.index('data-view="overview"')
    work_start = HTML.index('data-view="work"')
    overview = HTML[overview_start:work_start]
    for text in [
        'Developer · IT Problem Solver · Digital Builder',
        'BS Information Technology',
        'Software Engineering',
        'JavaScript',
        'React',
        'Firebase',
        'C#',
        'OPEN TO OPPORTUNITIES',
        'View selected work',
        'Contact',
    ]:
        require(text in overview, f'Overview is missing recruiter-scan item: {text}')



def test_kopi_case_study_evidence():
    start = HTML.index('data-view="kopi-app"')
    end = HTML.index('<!-- CAPSTONE -->')
    section = HTML[start:end]
    for text in [
        'Administrator',
        'Cashier',
        'Customer',
        'orders',
        'inventory',
        'sales insights',
        'loyalty',
        'waste',
        'Firestore',
        'real-time',
        'Private prototype',
        'not publicly released',
    ]:
        require(text.lower() in section.lower(), f'Kopi case study is missing evidence: {text}')
    require('assets/projects/kopi-' in section, 'Kopi case study must include extracted project screenshot assets')


def test_avenlo_product_proof():
    start = HTML.index('Shipped Web Products')
    end = HTML.index('<!-- KOPI BREWS APP -->')
    section = HTML[start:end]
    expected = [
        ('AVENLO SaaS', 'assets/projects/avenlo-saas.png', 'https://avenlo-saas.netlify.app/'),
        ('AVENLO Café', 'assets/projects/avenlo-cafe.png', 'https://avenlo-cafe.netlify.app/'),
        ('AVENLO Portfolio', 'assets/projects/avenlo-family.png', 'https://avenlo-portfolio.netlify.app/'),
    ]
    for name, image, url in expected:
        require(name in section, f'Missing AVENLO product: {name}')
        require(image in section, f'Missing AVENLO product preview: {image}')
        require(url in section, f'Missing AVENLO live demo: {url}')
    require(section.count('STATIC WEB PRODUCT') >= 3, 'Each AVENLO item should be labeled as a static web product')

def test_live_links_preserved():
    for url in [
        'https://avenlo-saas.netlify.app/',
        'https://avenlo-cafe.netlify.app/',
        'https://avenlo-portfolio.netlify.app/',
    ]:
        require(url in HTML, f'Missing live demo URL: {url}')



def test_document_integrity():
    ids = re.findall(r'\bid="([^"]+)"', HTML)
    dupes = sorted({i for i in ids if ids.count(i) > 1})
    require(not dupes, f'Duplicate HTML ids: {dupes}')

    img_tags = re.findall(r'<img\b[^>]*>', HTML, flags=re.I)
    require(img_tags, 'Expected project images in portfolio')
    for tag in img_tags:
        require(re.search(r'\balt="[^"]*"', tag, flags=re.I) is not None, f'Image missing alt attribute: {tag}')
        m = re.search(r'\bsrc="([^"]+)"', tag, flags=re.I)
        require(m is not None, f'Image missing src: {tag}')
        src = m.group(1)
        if not re.match(r'^[a-z]+://', src):
            require((ROOT / src).exists(), f'Missing local image asset: {src}')

    local_links = re.findall(r'(?:src|href)="((?!https?:|#|mailto:|tel:)[^"]+)"', HTML)
    for rel in local_links:
        require((ROOT / rel).exists(), f'Missing local referenced file: {rel}')

    css = (ROOT / 'css' / 'style.css').read_text(encoding='utf-8')
    require(css.count('{') == css.count('}'), 'CSS braces are unbalanced')


def test_recruiter_content_integrity():
    lower = HTML.lower()
    require('team capstone' in lower, 'Eleventh28 must remain labeled as a team capstone')
    require('private prototype' in lower, 'Kopi Brews must remain labeled as a private prototype')
    require('not publicly released' in lower, 'Kopi Brews public-release status must be explicit')
    require('98%' not in HTML and '99%' not in HTML, 'Portfolio must not present fake skill percentages')
    for url in re.findall(r'href="(https?://[^"]+)"', HTML):
        require(url.startswith('https://'), f'External link should use HTTPS: {url}')


def test_theme_toggle():
    css = (ROOT / 'css' / 'style.css').read_text(encoding='utf-8')
    require('id="themeToggle"' in HTML, 'Topbar theme toggle is missing')
    require('aria-label="Switch color theme"' in HTML, 'Theme toggle needs an accessible label')
    require('portfolio-theme' in HTML, 'Initial theme bootstrap must read the saved theme')
    require('prefers-color-scheme: light' in HTML, 'Initial theme bootstrap must respect system light preference')
    require('themeToggle' in JS, 'Theme toggle behavior is missing from JavaScript')
    require('localStorage.setItem' in JS and 'portfolio-theme' in JS, 'Theme preference must persist in localStorage')
    require('data-theme' in JS or 'dataset.theme' in JS, 'Theme behavior must set the document theme')
    require('html[data-theme="light"]' in css, 'Light theme CSS palette is missing')
    require('color-scheme:light' in css.replace(' ', ''), 'Light theme should expose the correct browser color scheme')


def test_theme_css_serialization():
    css = (ROOT / 'css' / 'style.css').read_text(encoding='utf-8')
    marker = 'THEME SWITCHER'
    require(marker in css, 'Theme stylesheet block is missing')
    theme = css[css.index(marker):]
    require('\\n' not in theme, 'Theme CSS contains literal \\n escape sequences instead of real line breaks')
    require('html[data-theme="light"]' in theme, 'Light-theme selector is missing')
    require('--bg:#f3f6f8' in theme, 'Light-theme palette variables are missing')

def run():
    tests = [test_overview_profile_portrait, test_recruiter_structure, test_recruiter_scan_content, test_kopi_case_study_evidence, test_avenlo_product_proof, test_live_links_preserved, test_document_integrity, test_recruiter_content_integrity, test_theme_toggle, test_theme_css_serialization]
    for test in tests:
        test()
        print(f'PASS {test.__name__}')
    print(f'PASS {len(tests)} recruiter-first structural tests')


if __name__ == '__main__':
    run()
