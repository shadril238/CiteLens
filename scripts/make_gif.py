"""
CiteLens demo GIF generator
Requires: pip install playwright pillow
          playwright install chromium
"""

import asyncio
from pathlib import Path
from PIL import Image
import io

from playwright.async_api import async_playwright

URL = "https://kishormorol.github.io/CiteLens/"
QUERY = "1706.03762"  # Attention Is All You Need
OUT_PATH = Path(__file__).parent.parent / "docs" / "demo.gif"
VIEWPORT = {"width": 1280, "height": 800}


async def take(page, frames: list, delay_ms: int = 80, repeat: int = 1):
    buf = await page.screenshot(type="png")
    img = Image.open(io.BytesIO(buf)).convert("RGBA")
    for _ in range(repeat):
        frames.append((img.copy(), delay_ms))


async def main():
    frames: list[tuple[Image.Image, int]] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport=VIEWPORT)

        # ── 1. Landing page ───────────────────────────────────────────────
        print("Loading site...")
        await page.goto(URL, wait_until="networkidle")
        await asyncio.sleep(1.5)
        await take(page, frames, delay_ms=150, repeat=8)  # hold ~1.2s

        # ── 2. Type the query ─────────────────────────────────────────────
        print("Typing query...")
        search_box = page.locator("textarea").first
        await search_box.click()
        for ch in QUERY:
            await search_box.type(ch, delay=100)
            await take(page, frames, delay_ms=100)

        await asyncio.sleep(0.4)
        await take(page, frames, delay_ms=120, repeat=4)

        # ── 3. Click Analyze button ───────────────────────────────────────
        print("Clicking Analyze...")
        analyze_btn = page.locator("button[type='submit']").first
        await analyze_btn.click()

        # Capture the loading spinner frames
        print("Waiting for results...")
        for _ in range(30):
            await take(page, frames, delay_ms=120)
            await asyncio.sleep(0.2)

        # Wait for ranked results to appear (tab label changes to "Ranked results (N)")
        try:
            await page.wait_for_selector("button:has-text('Ranked results')", timeout=30000)
            print("Results loaded!")
        except Exception:
            print("Timed out waiting for results, continuing anyway...")

        await asyncio.sleep(1)

        # ── 4. Hold results ───────────────────────────────────────────────
        print("Capturing results...")
        await take(page, frames, delay_ms=150, repeat=10)  # hold ~1.5s

        # ── 5. Scroll down through results ───────────────────────────────
        print("Scrolling...")
        for step in range(0, 1400, 60):
            await page.evaluate(f"window.scrollTo(0, {step})")
            await take(page, frames, delay_ms=50)
            await asyncio.sleep(0.03)

        await take(page, frames, delay_ms=150, repeat=10)

        # ── 6. Scroll back to top ─────────────────────────────────────────
        for step in range(1400, -1, -100):
            await page.evaluate(f"window.scrollTo(0, {step})")
            await take(page, frames, delay_ms=40)
        await asyncio.sleep(0.3)

        # ── 7. Click Timeline tab ─────────────────────────────────────────
        print("Switching to Timeline tab...")
        timeline_tab = page.locator("button:has-text('Timeline')").first
        if await timeline_tab.count() > 0:
            await timeline_tab.click()
            await asyncio.sleep(1.5)
            await take(page, frames, delay_ms=150, repeat=12)  # hold ~1.8s

        # ── 8. Click Network tab ──────────────────────────────────────────
        print("Switching to Network tab...")
        network_tab = page.locator("button:has-text('Network')").first
        if await network_tab.count() > 0:
            await network_tab.click()
            await asyncio.sleep(2.5)  # wait for graph to animate
            await take(page, frames, delay_ms=150, repeat=12)  # hold ~1.8s

        await browser.close()

    # ── Build GIF ─────────────────────────────────────────────────────────
    print(f"Building GIF from {len(frames)} frames...")
    images = [fr.convert("P", palette=Image.ADAPTIVE, colors=256) for fr, _ in frames]
    durations = [d for _, d in frames]

    images[0].save(
        OUT_PATH,
        save_all=True,
        append_images=images[1:],
        optimize=False,
        duration=durations,
        loop=0,
    )
    size_mb = OUT_PATH.stat().st_size / 1_048_576
    print(f"Saved: {OUT_PATH}  ({size_mb:.1f} MB)")


if __name__ == "__main__":
    asyncio.run(main())
