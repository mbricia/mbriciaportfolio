from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / ".github" / "workflows" / "qa.yml"


def run():
    assert WORKFLOW.exists(), "GitHub Actions QA workflow is missing"
    text = WORKFLOW.read_text(encoding="utf-8")

    for required in [
        "name: Portfolio QA",
        "push:",
        "pull_request:",
        "workflow_dispatch:",
        "branches:",
        "- main",
        "permissions:",
        "contents: read",
        "runs-on: ubuntu-latest",
        "timeout-minutes: 5",
        "actions/checkout@v7",
        "actions/setup-python@v7",
        'python-version: "3.12"',
        "actions/setup-node@v7",
        'node-version: "22"',
        "for test_file in qa/test_*.py",
        'python "$test_file"',
    ]:
        assert required in text, f"QA workflow missing: {required}"

    assert "pip install" not in text, "Current QA should not require dependency installation"
    assert "npm install" not in text, "Current QA should not require npm installation"
    assert "secrets." not in text, "QA workflow should not require repository secrets"

    print("PASS GitHub Actions QA workflow configuration")


if __name__ == "__main__":
    run()
