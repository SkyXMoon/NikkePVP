/** 模拟层自带的 3×3/4×4 数学：Vector3 / Quaternion / Matrix4 的最小实现。
 *
 *  为什么不用 three：小程序那条纯数值链要打进分包，而 `import ... from 'three'`
 *  在打包器里会把整包 three.module.js 拖进来（实测 244KB / 358KB 的产物），
 *  tree-shaking 掉不掉——three 的入口文件不是纯 re-export。这里只实现
 *  `stage/shooting.js` 真正用到的那部分算子（射击几何：站位矩阵、碰撞盒朝向、
 *  lookAt 基、四元数旋转），产物里因此**一行 three 都没有**（`tests/three-free.test.js`
 *  打包后断言）。
 *
 *  算子是照 three 的同名实现逐句对齐的（同样的公式、同样的顺序、同样的 double
 *  中间值），不是为了「差不多能用」——浮点顺序换一处，射线与包盒子求交的
 *  `1e-12` 判据就可能翻面。`tests/math3.test.js` 用随机输入与 three 逐算子对拍，
 *  容差 1e-12，这条是「换掉 three 不改变结果」的证据，不是可选项。
 *
 *  只实现用到的方法。没实现的方法不写空壳：新写代码要是用到别的算子，应当在
 *  这里补一个带对拍用例的实现，而不是把 three 再引回来。
 */

export class Vector3 {
  constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }

  set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
  clone() { return new Vector3(this.x, this.y, this.z); }
  copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
  add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
  addScaledVector(v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; }
  sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }
  multiply(v) { this.x *= v.x; this.y *= v.y; this.z *= v.z; return this; }
  multiplyScalar(s) { this.x *= s; this.y *= s; this.z *= s; return this; }
  getComponent(index) { return [this.x, this.y, this.z][index]; }
  length() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
  lengthSq() { return this.x * this.x + this.y * this.y + this.z * this.z; }
  normalize() { return this.multiplyScalar(1 / (this.length() || 1)); }
  distanceTo(v) { return Math.sqrt(this.distanceToSquared(v)); }
  distanceToSquared(v) {
    const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }
  /** three 的 angleTo：先各自归一化再点积，clamp 到 [-1,1] 后取 acos。 */
  angleTo(v) {
    const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
    if (denominator === 0) return Math.PI / 2;
    const theta = this.dot(v) / denominator;
    return Math.acos(Math.max(-1, Math.min(1, theta)));
  }
  dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
  lerp(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    return this;
  }
  /** 与 three 一致：把四元数当旋转施加，用 q * v * q⁻¹ 的展开式（不构造矩阵）。 */
  applyQuaternion(q) {
    const { x, y, z } = this;
    const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
  }
  /** 与 three 一致：w 分量参与透视除法（仿射矩阵下 w 恒为 1）。 */
  applyMatrix4(m) {
    const { x, y, z } = this;
    const e = m.elements;
    const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
    this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
    this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
    this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
    return this;
  }
  toArray(target = [], offset = 0) {
    target[offset] = this.x; target[offset + 1] = this.y; target[offset + 2] = this.z;
    return target;
  }
}

export class Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) { this.x = x; this.y = y; this.z = z; this.w = w; }

  set(x, y, z, w) { this.x = x; this.y = y; this.z = z; this.w = w; return this; }
  clone() { return new Quaternion(this.x, this.y, this.z, this.w); }
  /** 共轭（单位四元数下等于逆）。three 的 `.invert()` 就是这个，非单位时才是共轭。 */
  invert() {
    this.x *= -1; this.y *= -1; this.z *= -1;
    return this;
  }
  /** 与 three 一致：this * q。 */
  multiply(q) {
    const { x, y, z, w } = this;
    const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
    this.x = x * qw + w * qx + y * qz - z * qy;
    this.y = y * qw + w * qy + z * qx - x * qz;
    this.z = z * qw + w * qz + x * qy - y * qx;
    this.w = w * qw - x * qx - y * qy - z * qz;
    return this;
  }
  normalize() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w) || 1;
    this.x /= length; this.y /= length; this.z /= length; this.w /= length;
    return this;
  }
  /** 与 three 一致的四分支 trace 算法；矩阵按列主序读。 */
  setFromRotationMatrix(m) {
    const te = m.elements;
    const m11 = te[0], m12 = te[4], m13 = te[8];
    const m21 = te[1], m22 = te[5], m23 = te[9];
    const m31 = te[2], m32 = te[6], m33 = te[10];
    const trace = m11 + m22 + m33;
    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1);
      this.w = 0.25 / s;
      this.x = (m32 - m23) * s;
      this.y = (m13 - m31) * s;
      this.z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      const s = 2 * Math.sqrt(1 + m11 - m22 - m33);
      this.w = (m32 - m23) / s;
      this.x = 0.25 * s;
      this.y = (m12 + m21) / s;
      this.z = (m13 + m31) / s;
    } else if (m22 > m33) {
      const s = 2 * Math.sqrt(1 + m22 - m11 - m33);
      this.w = (m13 - m31) / s;
      this.x = (m12 + m21) / s;
      this.y = 0.25 * s;
      this.z = (m23 + m32) / s;
    } else {
      const s = 2 * Math.sqrt(1 + m33 - m11 - m22);
      this.w = (m21 - m12) / s;
      this.x = (m13 + m31) / s;
      this.y = (m23 + m32) / s;
      this.z = 0.25 * s;
    }
    return this;
  }
}

export class Matrix4 {
  constructor() {
    // 列主序，与 three 一致。
    this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  /** 与 three 一致：参数按**行主序**传入，内部按列主序存。 */
  set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
    const te = this.elements;
    te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
    te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
    te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
    te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;
    return this;
  }
  copy(m) { this.elements = [...m.elements]; return this; }
  determinant() {
    const te = this.elements;
    const n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
    const n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
    const n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
    const n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
    return (
      n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) +
      n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) +
      n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) +
      n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31)
    );
  }
  /** 与 three 一致：位置取第 4 列，缩放取三列长度（行列式为负时 x 取负），
   *  余下去掉缩放后转四元数。 */
  decompose(position, quaternion, scale) {
    const te = this.elements;
    // 用 sqrt(平方和) 而不是 Math.hypot：hypot 内部按指数缩放，末位与 three 的
    // length() 可能差 1 ULP，这里要的是逐位一致。
    let sx = Math.sqrt(te[0] * te[0] + te[1] * te[1] + te[2] * te[2]);
    const sy = Math.sqrt(te[4] * te[4] + te[5] * te[5] + te[6] * te[6]);
    const sz = Math.sqrt(te[8] * te[8] + te[9] * te[9] + te[10] * te[10]);
    if (this.determinant() < 0) sx = -sx;
    position.x = te[12]; position.y = te[13]; position.z = te[14];
    const m = new Matrix4();
    m.elements = [...te];
    const invSX = 1 / sx, invSY = 1 / sy, invSZ = 1 / sz;
    m.elements[0] *= invSX; m.elements[1] *= invSX; m.elements[2] *= invSX;
    m.elements[4] *= invSY; m.elements[5] *= invSY; m.elements[6] *= invSY;
    m.elements[8] *= invSZ; m.elements[9] *= invSZ; m.elements[10] *= invSZ;
    quaternion.setFromRotationMatrix(m);
    scale.x = sx; scale.y = sy; scale.z = sz;
    return this;
  }
  /** 与 three 一致（相机约定：+Z 指向 eye→target 的反方向）。
   *  退化分支照抄 three：eye 与 target 重合时 z 置 (0,0,1)；up 与 z 平行时把 z
   *  微扰 1e-4 再重算 x。少这两条，垂直方向的枪口基就会得到零向量。 */
  lookAt(eye, target, up) {
    const te = this.elements;
    let zx = eye.x - target.x, zy = eye.y - target.y, zz = eye.z - target.z;
    if (zx * zx + zy * zy + zz * zz === 0) zz = 1;
    let len = Math.sqrt(zx * zx + zy * zy + zz * zz) || 1;
    zx /= len; zy /= len; zz /= len;
    let x0 = up.y * zz - up.z * zy;
    let x1 = up.z * zx - up.x * zz;
    let x2 = up.x * zy - up.y * zx;
    if (x0 * x0 + x1 * x1 + x2 * x2 === 0) {
      if (Math.abs(up.z) === 1) zx += 0.0001; else zz += 0.0001;
      len = Math.sqrt(zx * zx + zy * zy + zz * zz) || 1;
      zx /= len; zy /= len; zz /= len;
      x0 = up.y * zz - up.z * zy;
      x1 = up.z * zx - up.x * zz;
      x2 = up.x * zy - up.y * zx;
    }
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2) || 1;
    x0 /= len; x1 /= len; x2 /= len;
    const y0 = zy * x2 - zz * x1;
    const y1 = zz * x0 - zx * x2;
    const y2 = zx * x1 - zy * x0;
    te[0] = x0; te[4] = y0; te[8] = zx;
    te[1] = x1; te[5] = y1; te[9] = zy;
    te[2] = x2; te[6] = y2; te[10] = zz;
    return this;
  }
}
