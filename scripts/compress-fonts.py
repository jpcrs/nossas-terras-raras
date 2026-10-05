"""Losslessly compress the vendored fonts; requires fonttools[woff].

Run: python scripts/compress-fonts.py
Original TTFs and their OFL licenses remain alongside the web fonts.
"""
from pathlib import Path
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1] / "dist/assets/fonts"
before = after = 0
for source in sorted(root.glob("font-*.ttf")):
    target = source.with_suffix(".woff2")
    original = TTFont(source, recalcTimestamp=False)
    original.flavor = "woff2"
    original.save(target)
    compressed = TTFont(target)
    assert original.getBestCmap() == compressed.getBestCmap()
    assert original["hmtx"].metrics == compressed["hmtx"].metrics
    assert original["hhea"].ascent == compressed["hhea"].ascent
    assert original["hhea"].descent == compressed["hhea"].descent
    assert original["hhea"].lineGap == compressed["hhea"].lineGap
    before += source.stat().st_size
    after += target.stat().st_size
print(f"Fonts: {before:,} → {after:,} bytes ({1-after/before:.1%} smaller).")
