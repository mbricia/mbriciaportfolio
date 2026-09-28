from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")


def run():
    hero_index = HTML.index('id="home"')
    tech_index = HTML.index('class="tech-carousel"')
    projects_index = HTML.index('id="projects"')
    proof_index = HTML.index('class="proof-section"')
    about_index = HTML.index('id="about"')

    assert hero_index < tech_index < projects_index < proof_index < about_index, (
        "Recruiter flow should be Hero → Tech Stack → Projects → Proof → About"
    )

    mobile_start = CSS.index("@media(max-width:900px)")
    mobile_end = CSS.index("@media(max-width:680px)")
    mobile_css = CSS[mobile_start:mobile_end]

    assert ".portrait-stage{order:-1" not in mobile_css, (
        "Portrait must not be reordered ahead of the hero copy on tablet/mobile"
    )
    assert ".hero-grid{grid-template-columns:1fr" in mobile_css, (
        "Hero should remain a single-column layout below 900px"
    )
    assert ".hero-copy{text-align:center" in mobile_css, (
        "Mobile/tablet hero copy should remain centered"
    )

    print("PASS recruiter-first section order and mobile hero hierarchy")


if __name__ == "__main__":
    run()
