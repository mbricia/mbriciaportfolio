from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class Node:
    def __init__(self, tag="", attrs=None):
        self.tag = tag
        self.attrs = dict(attrs or [])
        self.children = []
        self.text_parts = []

    @property
    def classes(self):
        return set(self.attrs.get("class", "").split())

    def text(self):
        parts = list(self.text_parts)
        for child in self.children:
            parts.append(child.text())
        return " ".join(" ".join(parts).split())

    def descendants(self):
        for child in self.children:
            yield child
            yield from child.descendants()


class TreeParser(HTMLParser):
    VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}

    def __init__(self):
        super().__init__()
        self.root = Node("root")
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in self.VOID_TAGS:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        if data.strip():
            self.stack[-1].text_parts.append(data.strip())


def find_all(node, *, tag=None, class_name=None):
    candidates = [node, *node.descendants()]
    return [
        candidate
        for candidate in candidates
        if (tag is None or candidate.tag == tag)
        and (class_name is None or class_name in candidate.classes)
    ]


def run():
    parser = TreeParser()
    parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))

    cards = find_all(parser.root, tag="article", class_name="project-card")
    assert len(cards) == 6, f"Expected 6 project cards, found {len(cards)}"

    for card in cards:
        title = find_all(card, tag="h3")[0].text()
        summaries = [child for child in card.children if child.tag == "p"]
        assert len(summaries) == 1, f"{title} should have one concise summary"
        assert len(summaries[0].text()) <= 105, f"{title} summary is too long for a preview card"
        assert not find_all(card, class_name="project-tags"), f"{title} duplicates the tech stack from its case study"

        proof = find_all(card, class_name="project-proof-line")
        assert len(proof) == 1, f"{title} should keep one compact proof signal"
        assert len(proof[0].text()) <= 42, f"{title} proof signal is too dense"

    automation_projects = {"recruitment", "lead-qualification", "inventory"}
    for project_key in automation_projects:
        matching_cards = [
            card
            for card in cards
            if any(node.attrs.get("data-project") == project_key for node in card.descendants())
        ]
        assert len(matching_cards) == 1, f"Missing automation card: {project_key}"
        assert find_all(matching_cards[0], class_name="automation-preview"), (
            f"{project_key} should use the shared dark automation preview"
        )

    print("PASS concise, consistent project overview cards")


if __name__ == "__main__":
    run()
