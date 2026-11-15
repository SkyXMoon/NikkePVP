/**
 * A2 —— 取整（对齐 DoubleToLong 0x3F3AD00）
 *
 * 原生默认体（RVA 0x3F3AD00，非 hotfix 分支）：
 *   0x3F3ADEA call 0x195FD00      ; Math.Round(x, 5, MidpointRounding.ToEven)
 *   0x3F3ADF2 comisd xmm6, 0      ; 用**原始值**判正负
 *   0x3F3ADF8 movsd xmm1, +0.5    ; 正值（常量 RVA 0x7E64F38 = 0.5）
 *   0x3F3AE02 movsd xmm1, -0.5    ; 非正值（常量 RVA 0x7E64F80 = -0.5）
 *   0x3F3AE0A addsd xmm0, xmm1
 *   0x3F3AE10 cvttsd2si rcx, xmm0 ; 截断
 *
 * 即：**先舍到 5 位小数（中点取偶），再加 ±0.5 截断**。
 * 少掉前一步会在 1e-10 量级改变结果（例如 2.4999999999 应得 3，直接截断得 2）。
 *
 * 注意：Math.round(-4.5) = -4，而本函数给 -5；属性计算大量使用负值，不能换。
 */

/** 舍到 5 位小数，中点取偶（对应 Math.Round(x, 5, ToEven)） */
function round5ToEven(x) {
  const scaled = x * 1e5;
  const floor = Math.floor(scaled);
  const diff = scaled - floor;
  let n;
  if (diff > 0.5) n = floor + 1;
  else if (diff < 0.5) n = floor;
  else n = floor % 2 === 0 ? floor : floor + 1;
  return n / 1e5;
}

export function roundHalfUp(x) {
  if (!Number.isFinite(x)) {
    throw new RangeError(`roundHalfUp: 需要有限数值，收到 ${x}`);
  }
  const rounded = round5ToEven(x);
  // 原生返回 long，不存在 -0；JS 的 ceil(-0.5) 会得到 -0，需要归零
  const n = rounded > 0 ? Math.floor(rounded + 0.5) : Math.ceil(rounded - 0.5);
  return n + 0;
}

/** 截断取整（仅用于与客户端 cvttsd2si 行为对照的调试场景） */
export function truncate(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}
