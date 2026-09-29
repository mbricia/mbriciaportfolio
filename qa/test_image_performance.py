from pathlib import Path
import re
import struct


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")


def png_dimensions(path):
    data = path.read_bytes()
    assert data[:8] == b"\x89PNG\r\n\x1a\n"
    width, height = struct.unpack(">II", data[16:24])
    return width, height


def run():
    tags = re.findall(r"<img\b[^>]*>", HTML, flags=re.I)
    assert tags, "Portfolio should contain images"

    for tag in tags:
        assert re.search(r'\bwidth="\d+"', tag), f"Image missing intrinsic width: {tag}"
        assert re.search(r'\bheight="\d+"', tag), f"Image missing intrinsic height: {tag}"
        assert 'decoding="async"' in tag, f"Image missing async decoding: {tag}"

    hero = next(tag for tag in tags if 'assets/profile/mark-jhollan-720.png' in tag)
    assert 'loading="eager"' in hero
    assert 'fetchpriority="high"' in hero
    assert 'width="720"' in hero and 'height="702"' in hero

    below_fold = [
        tag for tag in tags
        if 'assets/tech/' not in tag and 'assets/profile/mark-jhollan-720.png' not in tag
    ]
    assert below_fold
    for tag in below_fold:
        assert 'loading="lazy"' in tag, f"Below-fold image should lazy-load: {tag}"

    original = ROOT / "assets" / "profile" / "mark-jhollan.png"
    optimized = ROOT / "assets" / "profile" / "mark-jhollan-720.png"
    assert original.exists()
    assert optimized.exists()
    assert png_dimensions(original) == (900, 878)
    assert png_dimensions(optimized) == (720, 702)
    assert optimized.stat().st_size < original.stat().st_size * 0.75, (
        "Optimized portrait should be at least 25% smaller than the source"
    )

    assert 'src="assets/profile/mark-jhollan.png"' not in HTML
    print("PASS image loading, dimensions, and portrait optimization")


if __name__ == "__main__":
    run()
