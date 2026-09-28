from pathlib import Path
from html import unescape


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
TEXT = unescape(HTML)
CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "script.js").read_text(encoding="utf-8")
HISTORY = (ROOT / "js" / "activity-history.js").read_text(encoding="utf-8")


def run():
    assert "Open to remote opportunities" not in TEXT
    assert 'class="availability"' not in HTML
    assert 'class="name-accent"' in HTML
    assert HTML.count('class="name-letter"') == 6
    assert "@keyframes letterLift" in CSS
    assert "@keyframes nameGlow" in CSS

    assert 'id="portfolioActivity"' in HTML
    assert 'id="activitySnapshot"' in HTML
    assert "activity snapshot through Sep 22, 2026" not in TEXT

    assert 'src="js/activity-history.js"' in HTML
    assert HTML.index('src="js/activity-history.js"') < HTML.index('src="js/activity-calendar.js"')
    assert "GITHUB_REPOSITORIES_API" in JS
    assert "GITHUB_ACTIVITY_API" in JS
    assert "fetchActivityRepositories" in JS
    assert "fetchRepositoryCommits" in JS
    assert "Promise.allSettled(repositories.map(fetchRepositoryCommits))" in JS
    assert "supplementalActivityByDay" in JS
    assert "renderActivity" in JS
    assert "activitySnapshot" in JS
    assert "GITHUB_ACTIVITY_REPOS" not in JS

    for date in ["2026-04-16", "2026-05-06", "2026-06-12"]:
        assert date in HISTORY, f"Missing sanitized historical date: {date}"

    for private_repo in ["kopi-bros-frontend", "kopi-bros-backend", "Sofhia", "KusinaNiBricia"]:
        assert private_repo not in HISTORY, f"Private repository name leaked into history: {private_repo}"

    print("PASS live public + sanitized historical activity and name animation checks")


if __name__ == "__main__":
    run()
