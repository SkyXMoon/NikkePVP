/** 角色表编码：把键名与枚举字符串收敛成一张字符串表。
 *
 *  产物只有**一种**格式，网站和小程序共用：
 *
 *      { "v": 1, "t": ["字符串0", "字符串1", ...], "c": { "<角色id>": <行> } }
 *
 *  行里的规则只有两条：字符串（含对象键名）一律写成 `#<表下标>`，数字/布尔/null
 *  原样保留，数组与对象结构不动。解码是它的逆过程，还原出与原始行 `deepEqual`
 *  的对象——所以下游（driver、calculator、图遍历）不需要知道编码存在。
 *
 *  为什么值得做：节点字节里键名占 69%、字符串枚举占 25%，数值只有 7%。同一份
 *  裁剪后角色表从 1.30MB 降到 0.77MB（cn）。
 *
 *  两种打包粒度，**同一套规则、同一个解码器**：
 *  - 小程序分包：`encodeDatabase(db)` → 一个区一份文档（`{v,t,c}`）。小程序不能
 *    为 169 个角色发 169 个请求，只能整包。
 *  - 网站：`encodePartition(db)` → 索引带整区字符串表（`{v,t}`），角色文件只带
 *    载荷（`{v,d}`）。打开 5 个角色只下载 5 份 ~3KB 的载荷，不必为了统一格式整表
 *    下发。字符串表不能放进每个角色文件——一个角色只有 5~6 个节点，摊不掉 53KB
 *    的表，实测中位数会从 96% 退化到 132%（小角色编码后反而更大）。
 *
 *  两个刻意的取舍：
 *  - 表按「首次出现顺序」建，不做字典序排序：排序会让产物与输入的迭代顺序解耦，
 *    但也会让 diff 变得不可读，而这张表本来就要整份重建。
 *  - 不压缩、不转二进制。传输层的 gzip 已经做得更好（cn 整表 gzip 后 88KB），
 *    这里要解决的是**包体**与小程序里没得选的文件体积。
 */
/** 编码标识，出现在产物顶层 `v` 上。读侧只认这一个值。 */
export const CODEC_VERSION = 1;

/** `#12` 是编码后的引用；解码侧用它区分引用与普通字符串。 */
const REF = /^#(\d+)$/;

function collectStrings(value, table) {
  if (typeof value === 'string') { table.add(value); return; }
  if (Array.isArray(value)) { for (const item of value) collectStrings(item, table); return; }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      table.add(key);
      collectStrings(item, table);
    }
  }
}

/** `{ id: 行 }` → `{ strings, index, rows }`，三种打包方式共用这一趟。 */
function build(db) {
  const table = new Set();
  for (const row of Object.values(db)) collectStrings(row, table);
  const strings = [...table];
  return { strings, index: new Map(strings.map((value, at) => [value, at])) };
}

function encodeValue(value, index) {
  if (typeof value === 'string') {
    const at = index.get(value);
    // 表是同一趟走出来的，取不到只可能是调用方把半截数据递进来了。
    if (at === undefined) throw new Error(`编码失败：字符串不在表内 ${value}`);
    return `#${at}`;
  }
  if (Array.isArray(value)) return value.map(item => encodeValue(item, index));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, item] of Object.entries(value)) out[`#${index.get(key)}`] = encodeValue(item, index);
    return out;
  }
  return value;
}

function decodeValue(value, table) {
  if (typeof value === 'string') {
    const match = REF.exec(value);
    if (!match) return value;
    const at = Number(match[1]);
    if (at >= table.length) throw new Error(`解码失败：字符串表越界 ${value}`);
    return table[at];
  }
  if (Array.isArray(value)) return value.map(item => decodeValue(item, table));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, item] of Object.entries(value)) {
      const match = REF.exec(key);
      out[match ? table[Number(match[1])] : key] = decodeValue(item, table);
    }
    return out;
  }
  return value;
}

/** 整区一份文档（小程序分包用法）。 */
export function encodeDatabase(db) {
  const { strings, index } = build(db);
  const chars = {};
  for (const [id, row] of Object.entries(db)) chars[id] = encodeValue(row, index);
  return JSON.stringify({ v: CODEC_VERSION, t: strings, c: chars });
}

/** 网站用法：`{ index, parts }`。
 *
 *  `index` 是 `{v,t}`（调用方补自己的 `characterFiles` 路径表），`parts[id]` 是
 *  该角色的 `{v,d}` 文本。两者必须成对发布——换了字符串表而角色文件没换，解出来
 *  的是别的字符串。
 */
export function encodePartition(db) {
  const { strings, index } = build(db);
  const parts = {};
  for (const [id, row] of Object.entries(db)) {
    parts[id] = JSON.stringify({ v: CODEC_VERSION, d: encodeValue(row, index) });
  }
  return { index: { v: CODEC_VERSION, t: strings }, parts };
}

/** 编码文本 / 已解析的文档 → `{id: 行}`。非编码文档（源码仓里的整表、开发页
 *  直接读的原始 JSON）原样返回，这样同一个加载器在源码态与发布态都能用。 */
export function decodeDatabase(doc) {
  const parsed = typeof doc === 'string' ? JSON.parse(doc) : doc;
  if (!parsed || parsed.v !== CODEC_VERSION || !Array.isArray(parsed.t)) return parsed;
  const out = {};
  for (const [id, row] of Object.entries(parsed.c ?? {})) out[id] = decodeValue(row, parsed.t);
  return out;
}

/** 单角色文档 → 行。三种形状都要认，因为发布态与源码态会同时出现在同一个加载器里：
 *  分区载荷 `{v,d}`（网站）、自包含整包 `{v,t,c}`（小程序产物被人直接引用时）、
 *  裸行（源码仓整表、旧缓存）。`table` 来自分区索引；自包含文档不需要它。 */
export function decodeCharacter(doc, table) {
  const parsed = typeof doc === 'string' ? JSON.parse(doc) : doc;
  if (!parsed || parsed.v !== CODEC_VERSION) return parsed;
  if (parsed.d !== undefined) {
    if (!Array.isArray(table)) throw new Error('解码失败：分区载荷缺少字符串表');
    return decodeValue(parsed.d, table);
  }
  return Object.values(decodeDatabase(parsed))[0];
}
