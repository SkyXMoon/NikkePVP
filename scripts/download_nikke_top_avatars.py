import json
import re
import time
import urllib.error
import urllib.request
from pathlib import Path


ROOT = Path(r"E:\CodexWorkSpace")
NIKKE_TOP_DATA = ROOT / "nikke-top-characters.json"
LOCAL_DATA = ROOT / "nikke-data-extracted.json"
OUT_DIR = ROOT / "assets" / "avatars-nikke-top"


ALIASES = {
    "海伦珍藏": "海伦+",
    "红莲暗影": "红莲暗影",
    "白雪公主重型武装": "白雪公主重型武装",
    "白雪公主纯真年代": "白雪公主纯真时代",
    "索林霜雪车票": "索林霜之旅票",
    "德雷克珍藏": "德雷克+",
    "艾可希雅珍藏": "艾可希雅+",
    "普琳玛珍藏": "普琳玛+",
    "桑迪珍藏": "桑迪+",
    "波莉珍藏": "波莉+",
    "贝伊珍藏": "贝伊+",
    "茨瓦伊珍藏": "茨瓦伊+",
    "牡丹珍藏": "牡丹+",
    "米尔克珍藏": "米尔克+",
    "迪塞尔珍藏": "迪塞尔+",
    "毒蛇珍藏": "毒蛇+",
    "拉普拉斯珍藏": "拉普拉斯+",
    "尤莉亚珍藏": "尤莉亚+",
    "普丽瓦蒂珍藏": "普丽瓦蒂+",
    "米兰达珍藏": "米兰达+",
    "托比珍藏": "托比+",
    "产品23": "产品23",
    "产品08": "产品08",
    "产品12": "产品12",
    "士兵FA": "士兵FA",
    "士兵EG": "士兵EG",
    "士兵OW": "士兵OW",
    "iDoll花": "iDoll花",
    "iDoll海": "iDoll海",
    "iDoll太阳": "iDoll太阳",
    "艾瑟儿": "艾瑟尔",
    "克拉斯特": "克劳斯特",
    "芙萝拉": "芙罗拉",
    "诺薇尔": "诺薇儿",
    "米哈拉灵魂锁链": "米哈拉羁绊锁链",
    "零二期": "零暂称",
    "零一期": "零",
    "艾达王": "艾达",
    "吉儿华伦泰": "吉儿",
    "布丽德静默轨道": "布丽德",
    "吉萝婷寒冬杀手": "吉萝婷冬日杀手",
    "沃纶姆": "沃伦姆",
    "德尔塔怪盗忍者": "德尔塔",
    "E.H.": "EH",
    "爱蜜莉雅2149": "爱蜜莉雅",
}


def normalize_name(text):
    text = str(text or "")
    text = text.replace("：", ":").replace("·", "")
    text = re.sub(r"\s+", "", text)
    text = re.sub(r"[+＋]", "+", text)
    text = re.sub(r"[（(].*?[）)]", "", text)
    text = re.sub(r"\d+(?:\.\d+)?%$", "", text)
    return re.sub(r"[^0-9a-zA-Z\u4e00-\u9fff+]", "", text)


def top_avatar_url(item):
    en = item["name"]["en"].replace(":", "")
    en = re.sub(r"\s+", "_", en)
    return f"https://nikke.top/characters/{en}_{item['id']}.png"


def main():
    top_payload = json.loads(NIKKE_TOP_DATA.read_text(encoding="utf-8"))
    top_items = []
    for items in top_payload.values():
        top_items.extend(items)
    local_items = json.loads(LOCAL_DATA.read_text(encoding="utf-8"))["characters"]
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    top_by_name = {}
    for item in top_items:
        zh = item["name"].get("zh", "")
        top_by_name[normalize_name(zh)] = item
        en = item["name"].get("en", "")
        top_by_name[normalize_name(en)] = item

    opener = urllib.request.build_opener()
    opener.addheaders = [
        ("User-Agent", "Mozilla/5.0"),
        ("Referer", "https://nikke.top/"),
    ]

    downloaded = 0
    skipped = 0
    matched = []
    missing = []
    failed = []

    for local in local_items:
        key = normalize_name(local["name"])
        key = ALIASES.get(key, key)
        top_item = top_by_name.get(key)
        if not top_item:
            missing.append(local["name"])
            continue

        url = top_avatar_url(top_item)
        target = OUT_DIR / f"{local['id']}.png"
        matched.append({"id": local["id"], "name": local["name"], "topId": top_item["id"], "url": url})
        if target.exists() and target.stat().st_size > 0:
            skipped += 1
            continue
        try:
            with opener.open(url, timeout=5) as response:
                data = response.read()
            if len(data) < 512:
                raise RuntimeError(f"response too small: {len(data)} bytes")
            target.write_bytes(data)
            downloaded += 1
            time.sleep(0.03)
        except (urllib.error.URLError, TimeoutError, RuntimeError, OSError) as exc:
            failed.append({"id": local["id"], "name": local["name"], "url": url, "error": str(exc)})

    (ROOT / "nikke-top-avatar-matches.json").write_text(json.dumps(matched, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({
        "topCharacters": len(top_items),
        "matched": len(matched),
        "downloaded": downloaded,
        "skipped": skipped,
        "missing": missing,
        "failed": failed,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
