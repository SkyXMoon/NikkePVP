/** CN SpotRandom(seed) -> System.Random(seed), verified in GameAssembly.dll.
 * Native constructor 0x1976FA0: 56 entries, MSEED=161803398, four mixing
 * passes; InternalSample 0x1976A20 advances the two subtractive indices.
 */
const MBIG = 2147483647;

export class SpotRandom {
  constructor(seed) {
    if (!Number.isInteger(seed) || seed < -2147483648 || seed > MBIG)
      throw new RangeError('SpotRandom requires an int32 seed');
    this.seed = seed;
    this.values = new Int32Array(56);
    let mj = (161803398 - (seed === -2147483648 ? MBIG : Math.abs(seed))) | 0;
    this.values[55] = mj;
    let mk = 1;
    for (let i = 1; i < 55; i++) {
      const ii = (21 * i) % 55;
      this.values[ii] = mk;
      mk = (mj - mk) | 0;
      if (mk < 0) mk += MBIG;
      mj = this.values[ii];
    }
    for (let pass = 0; pass < 4; pass++) {
      for (let i = 1; i < 56; i++) {
        this.values[i] = (this.values[i] - this.values[1 + (i + 30) % 55]) | 0;
        if (this.values[i] < 0) this.values[i] += MBIG;
      }
    }
    this.nextIndex = 0;
    this.nextPartner = 21;
  }

  next() {
    if (++this.nextIndex >= 56) this.nextIndex = 1;
    if (++this.nextPartner >= 56) this.nextPartner = 1;
    let value = (this.values[this.nextIndex] - this.values[this.nextPartner]) | 0;
    if (value === MBIG) value--;
    if (value < 0) value += MBIG;
    this.values[this.nextIndex] = value;
    return value;
  }

  nextDouble() {
    return this.next() * (1 / MBIG);
  }
}
