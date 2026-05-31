import json
import re
import time
import urllib.error
import urllib.request
from pathlib import Path


ROOT = Path(r"E:\CodexWorkSpace")
DATA_PATH = ROOT / "nikke-data-extracted.json"
OUT_DIR = ROOT / "assets" / "avatars"


def avatar_extension(url):
    match = re.search(r"\.(png|jpg|jpeg|webp|jfif)(?:$|\?)", url, re.IGNORECASE)
    return "." + match.group(1).lower().replace("jpeg", "jpg") if match else ".png"


def main():
    payload = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    ok = 0
    skipped = 0
    failed = []

    opener = urllib.request.build_opener()
    opener.addheaders = [
        ("User-Agent", "Mozilla/5.0"),
        ("Referer", "https://www.gamekee.com/nikke/second/64581"),
    ]

    for character in payload["characters"]:
        url = character.get("avatarSourceUrl") or character.get("avatarUrl") or ""
        if not url.startswith("http"):
            skipped += 1
            continue

        target = OUT_DIR / f"{character['id']}{avatar_extension(url)}"
        if target.exists() and target.stat().st_size > 0:
            skipped += 1
            continue

        try:
            with opener.open(url, timeout=20) as response:
                data = response.read()
            if len(data) < 512:
                raise RuntimeError(f"response too small: {len(data)} bytes")
            target.write_bytes(data)
            ok += 1
            time.sleep(0.03)
        except (urllib.error.URLError, TimeoutError, RuntimeError, OSError) as exc:
            failed.append({"id": character["id"], "name": character["name"], "url": url, "error": str(exc)})

    print(json.dumps({"downloaded": ok, "skipped": skipped, "failed": failed}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
