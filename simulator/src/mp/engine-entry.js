/** 小程序「引擎分包」的打包入口：只暴露页面要用到的那一层。
 *
 *  这里导出的东西必须**全部**落在净数值链里（`tests/three-free.test.js` 会真打一次
 *  包断言产物中没有 three）。页面侧不要再自己去 import `src/**` 的其它文件——那会
 *  绕过这道断言，也绕过分包体积的统计。
 *
 *  数据入口只给 `decodeDatabase`：小程序一次性把整个分区的编码角色表 require 进来，
 *  与网站按角色拉 `{v,d}` 是同一套编码规则（`src/core/db-codec.js`）。
 */
export { createChargeEngine } from '../calculator/charge-engine.js';
export { toRunnerConfig } from '../core/data.js';
export { mergeNativeData } from '../stage/native-data.js';
export { addCnShootingProfiles } from '../stage/cn-roster.js';
export { decodeDatabase, decodeCharacter, encodeDatabase } from '../core/db-codec.js';
export { setMuzzleBakeTable, bakeMuzzles, muzzleBakeGaps, muzzleBakeCount } from '../stage/muzzle-table.js';
