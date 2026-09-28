from pathlib import Path
from html import unescape


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
TEXT = unescape(HTML)
CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "script.js").read_text(encoding="utf-8")
HISTORY = (ROOT / "js" / "activity-history.js").read_text(encoding="utf-8")


def run():
    assert 'class="build-activity-layout"' in HTML
    assert 'id="activitySummary"' in HTML
    assert 'id="activityMonths"' in HTML
    assert 'class="activity-weekdays"' in HTML
    assert "Code, documentation, and automation repository updates." in TEXT
    assert "GitHub contribution activity" in TEXT
    assert 'class="automation-milestones"' in HTML
    assert "Automation Milestones" in TEXT
    assert HTML.count('class="milestone-item"') >= 5
    assert 'class="proof-stats"' in HTML
    assert HTML.count('class="bento-stat') == 4

    assert "buildActivityCalendar" in JS
    assert "formatActivitySummary" in JS
    assert "GITHUB_REPOSITORIES_API" in JS
    assert "fetchActivityRepositories" in JS
    assert "Promise.allSettled(repositories.map(fetchRepositoryCommits))" in JS
    assert "supplementalActivityByDay" in JS
    assert "api.github.com/users/${GITHUB_USERNAME}/repos" in JS
    assert "api.github.com/repos/${GITHUB_USERNAME}" in JS
    assert "GITHUB_ACTIVITY_REPOS" not in JS

    assert "supplementalContributionCount" in HISTORY
    assert "'2026-04-16': 6" in HISTORY
    assert "'2026-05-06': 2" in HISTORY
    assert "'2026-06-12': 7" in HISTORY

    for private_repo in ["kopi-bros-frontend", "kopi-bros-backend", "Sofhia", "KusinaNiBricia"]:
        assert private_repo not in HISTORY, f"Private repository name leaked into history: {private_repo}"

    assert "grid-template-rows:repeat(7,1fr)" in CSS.replace(" ", "")
    assert "grid-template-columns:28pxminmax(610px,1fr)" in CSS.replace(" ", "")
    assert ".automation-milestones{" in CSS
    print("PASS hybrid build activity with live public updates and private-history counts")


if __name__ == "__main__":
    run()
