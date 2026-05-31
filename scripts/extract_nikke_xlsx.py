import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path


NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
SOURCE_PATH = Path(r"F:\SkyXMoon\Downloads\NIKKE PVP 充能计算器 v2.3.20（更新20260516）.xlsx")
OUT_PATH = Path(r"E:\CodexWorkSpace\data.js")
JSON_OUT_PATH = Path(r"E:\CodexWorkSpace\nikke-data-extracted.json")
AVATAR_MAP_PATH = Path(r"E:\CodexWorkSpace\gamekee-avatar-map.json")
AVATAR_DIR = Path(r"E:\CodexWorkSpace\assets\avatars")
NIKKE_TOP_AVATAR_DIR = Path(r"E:\CodexWorkSpace\assets\avatars-nikke-top")
NIKKE_TOP_DATA_PATH = Path(r"E:\CodexWorkSpace\nikke-top-characters.json")
NIKKE_TOP_MATCHES_PATH = Path(r"E:\CodexWorkSpace\nikke-top-avatar-matches.json")

SHEETS = {
    "global_attack": "xl/worksheets/sheet5.xml",
    "global_defense": "xl/worksheets/sheet6.xml",
    "cn_stable": "xl/worksheets/sheet7.xml",
}

WEAPON_MAP = {
    "发射器": "RL",
    "狙击步枪": "SR",
    "霰弹枪": "SG",
    "步枪": "AR",
    "冲锋枪": "SMG",
    "机枪": "MG",
}

BURST_MAP = {
    "I": "B1",
    "II": "B2",
    "III": "B3",
    "Ⅰ": "B1",
    "Ⅱ": "B2",
    "Ⅲ": "B3",
}

RL_EXPLOSION_RANGE_OVERRIDES = {
    "A2": 2,
    "红莲:暗影": 0,
}

ATTACK_INTERVAL_FRAME_OVERRIDES = {
    "红莲:暗影": 46,
}

FIRST_FRAME_OVERRIDES = {
    "红莲:暗影": 23,
}

PROJECTILE_FLIGHT_FRAME_OVERRIDES = {
    "红莲:暗影": 5,
    "拉普拉斯 珍藏": 6,
}

TURN_FRAME_OVERRIDES = {
    "红莲:暗影": 0,
}

EXTRA_DAMAGE_OVERRIDES = {
    "A2": True,
    "诺雅": True,
    "海伦 珍藏": True,
    "拉普拉斯 珍藏": True,
    "杨": True,
    "神罚": True,
}

PENETRATION_OVERRIDES = {
    "哈兰": True,
}

DELAYED_EXTRA_HIT_OVERRIDES = {
    "哈兰": [{"delayFrames": 60, "segments": 1}],
}

FLAT_BURST_BONUS_OVERRIDES = {
    "海伦 珍藏": 14.31,
}

HIT_COUNT_EXTRA_EVENTS_OVERRIDES = {
    "红莲:暗影": [
        {"hit": 3, "segments": 1},
        {"hit": 6, "segments": 1},
    ],
}

DEFAULT_RL_FLIGHT_FRAMES = {
    "P1": 16,
    "P2": 16,
    "P3": 14,
    "P4": 14,
    "P5": 14,
}

CN_TOP_ID_OVERRIDES = {
    "009",  # Crown / 皇冠
    "013",  # Rapi: Red Hood / 拉毗:小红帽
}

AVATAR_NAME_ALIASES = {
    "克拉斯特": "克劳斯特",
    "芙萝拉": "芙罗拉",
    "诺薇尔": "诺薇儿",
    "米哈拉:灵魂锁链": "米哈拉：羁绊锁链",
    "索林:霜雪车票": "索林：霜之旅票",
    "艾达·王": "艾达",
    "吉儿·华伦泰": "吉儿",
    "零（一期）": "零",
    "零（二期）": "零（暂称）",
}

SR_CHARACTERS = {
    "阿妮斯",
    "贝洛塔",
    "德尔塔",
    "艾瑟儿",
    "姬野",
    "iDoll花",
    "iDoll海",
    "iDoll太阳",
    "米卡",
    "米哈拉",
    "N102",
    "尼恩",
    "尼夫",
    "帕斯卡",
    "拉姆",
    "拉毗",
}

R_CHARACTERS = {
    "产品08",
    "产品12",
    "产品23",
    "士兵E.G",
    "士兵F.A",
    "士兵O.W",
}


def frames_from_seconds(seconds):
    if seconds is None:
        return None
    return round(seconds * 60)


def build_timing(record):
    charge_frames = frames_from_seconds(record["chargeSeconds"])
    timing = {
        "chargeFrames": charge_frames,
        "firstFrame": None,
        "intervalFrames": None,
        "projectileFlightFrames": None,
        "projectileFlightFramesByPosition": None,
        "turnFrames": None,
    }

    if record["weapon"] == "SR":
        turn_frames = TURN_FRAME_OVERRIDES.get(record["name"], 16)
        timing["turnFrames"] = turn_frames
        timing["firstFrame"] = FIRST_FRAME_OVERRIDES.get(record["name"], charge_frames)
        timing["intervalFrames"] = ATTACK_INTERVAL_FRAME_OVERRIDES.get(
            record["name"],
            None if charge_frames is None else charge_frames + turn_frames,
        )
    elif record["weapon"] == "RL":
        turn_frames = TURN_FRAME_OVERRIDES.get(record["name"], 16)
        flight_override = PROJECTILE_FLIGHT_FRAME_OVERRIDES.get(record["name"])
        timing["turnFrames"] = turn_frames
        timing["projectileFlightFrames"] = flight_override
        timing["projectileFlightFramesByPosition"] = (
            {key: flight_override for key in DEFAULT_RL_FLIGHT_FRAMES}
            if flight_override is not None
            else DEFAULT_RL_FLIGHT_FRAMES
        )
        p1_flight = timing["projectileFlightFramesByPosition"]["P1"]
        timing["firstFrame"] = FIRST_FRAME_OVERRIDES.get(
            record["name"],
            None if charge_frames is None else charge_frames + p1_flight,
        )
        timing["intervalFrames"] = ATTACK_INTERVAL_FRAME_OVERRIDES.get(
            record["name"],
            None if charge_frames is None else charge_frames + turn_frames,
        )

    return timing


def cell_to_indexes(ref):
    match = re.match(r"([A-Z]+)(\d+)", ref)
    col = 0
    for char in match.group(1):
        col = col * 26 + ord(char) - 64
    return int(match.group(2)), col


def to_number(value):
    if value in ("", "/", None):
        return None
    try:
        return float(value)
    except ValueError:
        return None


def slugify(text):
    text = text.strip().lower()
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"[:：/()（）%]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text or "nikke"


def normalize_name(text):
    return re.sub(r"[\s:：·・<>《》〈〉（）()]+", "", str(text or "").strip()).lower()


def normalize_top_name(text):
    text = re.sub(r"\s+", "", str(text or ""))
    text = re.sub(r"[()（）\[\]【】<>《》〈〉:：·・]", "", text)
    return re.sub(r"[^0-9a-zA-Z\u4e00-\u9fff+]", "", text).lower()


def load_avatar_map():
    if not AVATAR_MAP_PATH.exists():
        return {}
    raw = json.loads(AVATAR_MAP_PATH.read_text(encoding="utf-8"))
    normalized = {}
    for name, url in raw.items():
        normalized[normalize_name(name)] = url
    return normalized


def load_nikke_top_regions():
    if not NIKKE_TOP_DATA_PATH.exists():
        return {
            "localIdToRegions": {},
            "nameToRegions": {},
            "localIdToCommon": {},
            "nameToCommon": {},
            "counts": {
                "nikkeTopChina": 0,
                "nikkeTopGlobal": 0,
                "nikkeTopMatched": 0,
                "nikkeTopCommon": 0,
            },
        }

    top_payload = json.loads(NIKKE_TOP_DATA_PATH.read_text(encoding="utf-8"))
    china_items = top_payload.get("china-nikkes", [])
    global_items = top_payload.get("global-nikkes", [])

    top_id_to_regions = {}
    top_id_to_common = {}
    name_to_regions = {}
    name_to_common = {}
    for region_key, region in (("global-nikkes", "global"), ("china-nikkes", "cn")):
        for item in top_payload.get(region_key, []):
            top_id = str(item["id"])
            top_id_to_regions.setdefault(top_id, set()).add(region)
            top_id_to_common[top_id] = top_id_to_common.get(top_id, False) or item.get("visible") is True
            for name in item.get("name", {}).values():
                key = normalize_top_name(name)
                if key:
                    name_to_regions.setdefault(key, set()).add(region)
                    name_to_common[key] = name_to_common.get(key, False) or item.get("visible") is True

    local_id_to_regions = {}
    local_id_to_common = {}
    if NIKKE_TOP_MATCHES_PATH.exists():
        matches = json.loads(NIKKE_TOP_MATCHES_PATH.read_text(encoding="utf-8"))
        for match in matches:
            top_id = str(match.get("topId", ""))
            regions = set(top_id_to_regions.get(top_id, {"global"}))
            if top_id in CN_TOP_ID_OVERRIDES:
                regions.add("cn")
            local_id_to_regions[int(match["id"])] = sorted(regions)
            local_id_to_common[int(match["id"])] = top_id_to_common.get(top_id, False)

    return {
        "localIdToRegions": local_id_to_regions,
        "nameToRegions": name_to_regions,
        "localIdToCommon": local_id_to_common,
        "nameToCommon": name_to_common,
        "counts": {
            "nikkeTopChina": len(china_items),
            "nikkeTopGlobal": len(global_items),
            "nikkeTopMatched": len(local_id_to_regions),
            "nikkeTopCommon": sum(1 for is_common in local_id_to_common.values() if is_common),
        },
    }


def get_nikke_top_regions(record_id, attack, top_regions):
    matched_regions = top_regions["localIdToRegions"].get(record_id)
    if matched_regions:
        return ["global"] + (["cn"] if "cn" in matched_regions else [])

    name_regions = set()
    for key in (normalize_top_name(attack["name"]), normalize_top_name(attack["enName"])):
        name_regions.update(top_regions["nameToRegions"].get(key, set()))

    return ["global"] + (["cn"] if "cn" in name_regions else [])


def get_nikke_top_common(record_id, attack, top_regions):
    matched_common = top_regions["localIdToCommon"].get(record_id)
    if matched_common is not None:
        return matched_common

    for key in (normalize_top_name(attack["name"]), normalize_top_name(attack["enName"])):
        if key in top_regions["nameToCommon"]:
            return top_regions["nameToCommon"][key]

    return False


def find_avatar_url(name, avatar_map):
    clean_name = re.sub(r"\s*\d+(?:\.\d+)?%\s*$", "", str(name))
    no_parenthetical = re.sub(r"[（(].*?[）)]", "", clean_name)
    alias = AVATAR_NAME_ALIASES.get(str(name)) or AVATAR_NAME_ALIASES.get(clean_name)
    keys = [normalize_name(name), normalize_name(clean_name), normalize_name(no_parenthetical)]
    if alias:
        keys.append(normalize_name(alias))
    if str(name).endswith(" 珍藏"):
        keys.append(normalize_name(str(name).replace(" 珍藏", "")))
    keys.append(normalize_name(clean_name.replace(":", "：")))
    for key in keys:
        if key in avatar_map:
            return avatar_map[key]
    return ""


def avatar_extension(url):
    match = re.search(r"\.(png|jpg|jpeg|webp|jfif)(?:$|\?)", url, re.IGNORECASE)
    return "." + match.group(1).lower().replace("jpeg", "jpg") if match else ".png"


def find_local_avatar_path(record_id, avatar_url):
    nikke_top_avatar = NIKKE_TOP_AVATAR_DIR / f"{record_id}.png"
    if nikke_top_avatar.exists() and nikke_top_avatar.stat().st_size > 0:
        return nikke_top_avatar.relative_to(Path(r"E:\CodexWorkSpace")).as_posix()

    if not avatar_url:
        return ""
    expected = AVATAR_DIR / f"{record_id}{avatar_extension(avatar_url)}"
    if expected.exists():
        return expected.relative_to(Path(r"E:\CodexWorkSpace")).as_posix()
    for candidate in AVATAR_DIR.glob(f"{record_id}.*"):
        if candidate.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp", ".jfif"):
            return candidate.relative_to(Path(r"E:\CodexWorkSpace")).as_posix()
    return ""


def get_rarity(name):
    if name in R_CHARACTERS:
        return "R"
    if name in SR_CHARACTERS:
        return "SR"
    return "SSR"


def load_shared_strings(zip_file):
    if "xl/sharedStrings.xml" not in zip_file.namelist():
        return []
    root = ET.fromstring(zip_file.read("xl/sharedStrings.xml"))
    return ["".join((t.text or "") for t in si.iter(NS + "t")) for si in root.findall(NS + "si")]


def read_sheet(zip_file, shared_strings, path):
    root = ET.fromstring(zip_file.read(path))
    cells = {}
    max_row = 0
    max_col = 0
    for cell in root.iter(NS + "c"):
        row, col = cell_to_indexes(cell.attrib["r"])
        max_row = max(max_row, row)
        max_col = max(max_col, col)
        value_node = cell.find(NS + "v")
        value = "" if value_node is None else (value_node.text or "")
        if cell.attrib.get("t") == "s" and value.isdigit():
            value = shared_strings[int(value)]
        cells[(row, col)] = value

    rows = []
    for row in range(1, max_row + 1):
        rows.append([cells.get((row, col), "") for col in range(1, max_col + 1)])
    return rows


def row_to_record(row, source_key):
    if not row or not row[0] or row[0] in ("0", "NIKKE"):
        return None

    weapon_cn = row[5] if len(row) > 5 else ""
    weapon = WEAPON_MAP.get(weapon_cn)
    coefficient = to_number(row[11] if len(row) > 11 else "")
    if not weapon or coefficient is None:
        return None

    two_rl_value = to_number(row[12] if len(row) > 12 else "")
    two_rl_hits = to_number(row[13] if len(row) > 13 else "")

    if weapon == "SG":
        burst_gen = coefficient * 10 * 100
    else:
        burst_gen = coefficient * 100

    return {
        "name": str(row[0]).strip(),
        "enName": str(row[0]).strip(),
        "weapon": weapon,
        "weaponCn": weapon_cn,
        "burstGen": round(burst_gen, 6),
        "burstCoefficient": coefficient,
        "burstStage": BURST_MAP.get(str(row[1]).strip(), str(row[1]).strip()),
        "classType": row[2] if len(row) > 2 else "",
        "element": row[3] if len(row) > 3 else "",
        "company": row[4] if len(row) > 4 else "",
        "weaponDamage": to_number(row[6] if len(row) > 6 else ""),
        "magazine": to_number(row[7] if len(row) > 7 else ""),
        "reloadSeconds": to_number(row[8] if len(row) > 8 else ""),
        "chargeSeconds": to_number(row[9] if len(row) > 9 else ""),
        "maxCharge": to_number(row[10] if len(row) > 10 else ""),
        "scenario": {
            "twoRl": two_rl_value,
            "twoRlHits": two_rl_hits,
            "fiveSg": to_number(row[14] if len(row) > 14 else ""),
            "fiveSgHits": to_number(row[15] if len(row) > 15 else ""),
            "threeRl": to_number(row[16] if len(row) > 16 else ""),
            "threeRlHits": to_number(row[17] if len(row) > 17 else ""),
            "sevenSg": to_number(row[18] if len(row) > 18 else ""),
            "fourRl": to_number(row[19] if len(row) > 19 else ""),
            "fiveRl": to_number(row[20] if len(row) > 20 else ""),
            "oneRl": to_number(row[25] if len(row) > 25 else ""),
            "oneRlHits": to_number(row[26] if len(row) > 26 else ""),
            "threeSg": to_number(row[27] if len(row) > 27 else ""),
            "threeSgHits": to_number(row[28] if len(row) > 28 else ""),
        },
        "attackTargetRule": row[21] if len(row) > 21 else "",
        "defenseTargetRule": row[22] if len(row) > 22 else "",
        "sourceSheet": source_key,
    }


def merge_records(global_attack, global_defense, cn_stable, avatar_map, top_regions):
    defense_by_key = {
        (item["name"], item["weapon"], item["company"]): item for item in global_defense
    }

    records = []
    seen_slugs = {}
    for idx, attack in enumerate(global_attack, start=1):
        key = (attack["name"], attack["weapon"], attack["company"])
        defense = defense_by_key.get(key)
        base_slug = slugify(attack["name"])
        seen_slugs[base_slug] = seen_slugs.get(base_slug, 0) + 1
        slug = base_slug if seen_slugs[base_slug] == 1 else f"{base_slug}-{seen_slugs[base_slug]}"
        timing = build_timing(attack)
        avatar_url = find_avatar_url(attack["name"], avatar_map)
        local_avatar_path = find_local_avatar_path(idx, avatar_url)

        record = {
            "id": idx,
            "slug": slug,
            "name": attack["name"],
            "enName": attack["enName"],
            "rarity": get_rarity(attack["name"]),
            "avatarUrl": local_avatar_path or avatar_url,
            "avatarSourceUrl": avatar_url,
            "isCommon": get_nikke_top_common(idx, attack, top_regions),
            "weapon": attack["weapon"],
            "weaponCn": attack["weaponCn"],
            "burstGen": attack["burstGen"],
            "burstCoefficient": attack["burstCoefficient"],
        "chargeSpeedPercent": 0,
        "rlExplosionRange": RL_EXPLOSION_RANGE_OVERRIDES.get(attack["name"], 1 if attack["weapon"] == "RL" else None),
        "firstFrameOverride": FIRST_FRAME_OVERRIDES.get(attack["name"]),
        "attackIntervalFrames": ATTACK_INTERVAL_FRAME_OVERRIDES.get(attack["name"]),
        "projectileFlightFrames": PROJECTILE_FLIGHT_FRAME_OVERRIDES.get(attack["name"]),
        "turnFrames": TURN_FRAME_OVERRIDES.get(attack["name"]),
            "timing": timing,
        "hasPenetration": PENETRATION_OVERRIDES.get(attack["name"], False),
            "hasExtraDamage": EXTRA_DAMAGE_OVERRIDES.get(attack["name"], False),
            "delayedExtraHits": DELAYED_EXTRA_HIT_OVERRIDES.get(attack["name"], []),
            "hitCountExtraEvents": HIT_COUNT_EXTRA_EVENTS_OVERRIDES.get(attack["name"], []),
            "flatBurstBonus": FLAT_BURST_BONUS_OVERRIDES.get(attack["name"], 0),
            "company": attack["company"],
            "burstStage": attack["burstStage"],
            "classType": attack["classType"],
            "element": attack["element"],
            "regions": get_nikke_top_regions(idx, attack, top_regions),
            "stats": {
                "weaponDamage": attack["weaponDamage"],
                "magazine": attack["magazine"],
                "reloadSeconds": attack["reloadSeconds"],
                "chargeSeconds": attack["chargeSeconds"],
                "maxCharge": attack["maxCharge"],
            },
            "scenario": {
                "attack": attack["scenario"],
                "defense": defense["scenario"] if defense else None,
            },
            "targetRule": {
                "attack": attack["attackTargetRule"],
                "defense": attack["defenseTargetRule"],
            },
            "notes": (
                f"{attack['weaponCn']}；系数 {attack['burstCoefficient']}"
                + (
                    f"；RL爆炸范围 {RL_EXPLOSION_RANGE_OVERRIDES.get(attack['name'], 1)}"
                    if attack["weapon"] == "RL"
                    else ""
                )
                + (
                    "；额外造成"
                    if EXTRA_DAMAGE_OVERRIDES.get(attack["name"], False)
                    else ""
                )
                + (
                    "；穿透"
                    if PENETRATION_OVERRIDES.get(attack["name"], False)
                    else ""
                )
                + (
                    "；1秒后追加隔壁伤害"
                    if attack["name"] in DELAYED_EXTRA_HIT_OVERRIDES
                    else ""
                )
                + (
                    "；攻击次数触发额外伤害"
                    if attack["name"] in HIT_COUNT_EXTRA_EVENTS_OVERRIDES
                    else ""
                )
                + (
                    f"；固定爆裂补充 {FLAT_BURST_BONUS_OVERRIDES[attack['name']]}"
                    if attack["name"] in FLAT_BURST_BONUS_OVERRIDES
                    else ""
                )
            ),
            "source": "NIKKE PVP 充能计算器 v2.3.20（更新20260516）.xlsx",
        }
        records.append(record)
    return records


def main():
    source = Path(sys.argv[1]) if len(sys.argv) > 1 else SOURCE_PATH
    with zipfile.ZipFile(source) as zip_file:
        shared = load_shared_strings(zip_file)
        parsed = {}
        for key, path in SHEETS.items():
            rows = read_sheet(zip_file, shared, path)
            parsed[key] = [
                record
                for record in (row_to_record(row, key) for row in rows[1:])
                if record is not None
            ]

    avatar_map = load_avatar_map()
    top_regions = load_nikke_top_regions()
    characters = merge_records(parsed["global_attack"], parsed["global_defense"], parsed["cn_stable"], avatar_map, top_regions)
    payload = {
        "source": str(source),
        "counts": {
            "globalAttack": len(parsed["global_attack"]),
            "globalDefense": len(parsed["global_defense"]),
            "cnStable": len(parsed["cn_stable"]),
            **top_regions["counts"],
            "characters": len(characters),
            "cnTagged": sum(1 for item in characters if "cn" in item["regions"]),
        },
        "characters": characters,
    }

    JSON_OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    js = (
        "const DATA_SOURCES = {\n"
        "  XLSX: \"NIKKE PVP 充能计算器 v2.3.20（更新20260516）.xlsx\",\n"
        "};\n\n"
        f"const CHARACTERS = {json.dumps(characters, ensure_ascii=False, indent=2)};\n"
    )
    OUT_PATH.write_text(js, encoding="utf-8")
    print(json.dumps(payload["counts"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
