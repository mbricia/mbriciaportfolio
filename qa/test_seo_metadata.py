from pathlib import Path
import json
import re


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CANONICAL = "https://mbriciaportfolio.vercel.app/"
OG_IMAGE = CANONICAL + "assets/meta/og-preview.png"


def run():
    assert f'<link rel="canonical" href="{CANONICAL}" />' in HTML
    assert '<meta name="robots" content="index,follow,max-image-preview:large" />' in HTML

    for expected in [
        '<meta property="og:type" content="profile" />',
        f'<meta property="og:url" content="{CANONICAL}" />',
        '<meta property="og:site_name" content="Mark Jhollan Bricia Portfolio" />',
        '<meta property="og:locale" content="en_PH" />',
        f'<meta property="og:image" content="{OG_IMAGE}" />',
        '<meta property="og:image:width" content="1664" />',
        '<meta property="og:image:height" content="936" />',
        '<meta property="og:image:alt" content="Mark Jhollan Bricia developer portfolio preview" />',
        '<meta name="twitter:card" content="summary_large_image" />',
        '<meta name="twitter:title" content="Mark Jhollan Bricia — Software Developer" />',
        '<meta name="twitter:description" content="Software development, AI automation, API integrations, and practical IT solutions." />',
        f'<meta name="twitter:image" content="{OG_IMAGE}" />',
        '<meta name="twitter:image:alt" content="Mark Jhollan Bricia developer portfolio preview" />',
    ]:
        assert expected in HTML, f"Missing SEO/social metadata: {expected}"

    match = re.search(
        r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>',
        HTML,
        flags=re.S,
    )
    assert match, "ProfilePage JSON-LD is missing"
    data = json.loads(match.group(1))

    assert data["@context"] == "https://schema.org"
    assert data["@type"] == "ProfilePage"
    assert data["url"] == CANONICAL

    person = data["mainEntity"]
    assert person["@type"] == "Person"
    assert person["name"] == "Mark Jhollan Bricia"
    assert person["url"] == CANONICAL
    assert person["jobTitle"] == "Software Developer"
    assert person["image"] == CANONICAL + "assets/profile/mark-jhollan-720.png"
    assert person["sameAs"] == [
        "https://github.com/mbricia",
        "https://www.linkedin.com/in/mark-jhollan-bricia-a783a1182/",
    ]

    assert "makmakbricia@gmail.com" not in match.group(1), (
        "Structured data should not unnecessarily publish the contact email"
    )
    assert HTML.count('rel="canonical"') == 1
    assert HTML.count('type="application/ld+json"') == 1

    print("PASS canonical, social-card, and ProfilePage metadata")


if __name__ == "__main__":
    run()
