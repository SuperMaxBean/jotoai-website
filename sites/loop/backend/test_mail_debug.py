"""Debug: test iframe interaction on mail.163.com."""
import asyncio
from browser.provider import PatchrightProvider
from browser.snapshot import SnapshotEngine


async def test():
    provider = PatchrightProvider()
    page = await provider.launch("mail_debug")

    await page.goto("https://mail.163.com")
    await asyncio.sleep(5)

    engine = SnapshotEngine()
    snap = await engine.capture(page)
    print(f"Nodes: {len(snap.nodes)}")
    print(snap.to_text())

    # Debug: Try to resolve and interact with ref 28 (email input in iframe)
    print("\n=== Debug: resolving ref 28 (email textbox) ===")
    try:
        loc = await engine.resolve(page, snap, 28)
        count = await loc.count()
        print(f"  Locator count: {count}")
        if count > 0:
            visible = await loc.is_visible()
            print(f"  Visible: {visible}")
            # Try typing
            await loc.click(timeout=3000)
            print("  Clicked OK")
            await loc.fill("tomi")
            print("  Filled 'tomi' OK")
            val = await loc.input_value()
            print(f"  Input value after fill: '{val}'")
    except Exception as e:
        print(f"  ERROR: {e}")

    # Debug: Try ref 29 (password input)
    print("\n=== Debug: resolving ref 29 (password textbox) ===")
    try:
        loc29 = await engine.resolve(page, snap, 29)
        count29 = await loc29.count()
        print(f"  Locator count: {count29}")
        if count29 > 0:
            visible29 = await loc29.is_visible()
            print(f"  Visible: {visible29}")
    except Exception as e:
        print(f"  ERROR: {e}")

    # Debug: Try ref 31 (login button)
    print("\n=== Debug: resolving ref 31 (login button) ===")
    try:
        loc31 = await engine.resolve(page, snap, 31)
        count31 = await loc31.count()
        print(f"  Locator count: {count31}")
        text31 = await loc31.text_content()
        print(f"  Text: '{text31}'")
    except Exception as e:
        print(f"  ERROR: {e}")

    # Debug: directly access iframe
    print("\n=== Debug: direct frame access ===")
    frames = page.frames
    print(f"  Total frames: {len(frames)}")
    for i, f in enumerate(frames):
        print(f"  Frame {i}: {f.url[:80]}")

    non_main = [f for f in frames if f != page.main_frame]
    if len(non_main) >= 3:
        login_frame = non_main[2]  # The 3rd non-main frame (index 2) based on snapshot
        print(f"\n  Login frame URL: {login_frame.url[:80]}")
        # Try to find input directly in the login frame
        inputs = await login_frame.query_selector_all("input")
        print(f"  Inputs in login frame: {len(inputs)}")
        for inp in inputs:
            name = await inp.get_attribute("name") or ""
            typ = await inp.get_attribute("type") or ""
            placeholder = await inp.get_attribute("placeholder") or ""
            print(f"    input name='{name}' type='{typ}' placeholder='{placeholder}'")

    await provider.close()
    print("\nDEBUG COMPLETE")


asyncio.run(test())
