const NIKKE_CHARACTER_CORE_DATA_VERSION = "f296db87e594";
const NIKKE_CHARACTER_ASSETS_DATA_VERSION = "1cec03d35ecc";

globalThis.__NIKKE_CHARACTER_DATA_READY__ = import(`./modules/generated-character-core-data.js?v=${encodeURIComponent(NIKKE_CHARACTER_CORE_DATA_VERSION)}`)
  .then((module) => {
    globalThis.DATA_SOURCES = module.DATA_SOURCES;
    globalThis.CHARACTERS = module.CHARACTERS;
    return module;
  })
  .catch((error) => {
    console.error("character core data module failed", error);
    throw error;
  });

globalThis.__NIKKE_LOAD_CHARACTER_ASSETS__ = () => {
  if (!globalThis.__NIKKE_CHARACTER_ASSETS_READY__) {
    globalThis.__NIKKE_CHARACTER_ASSETS_READY__ = import(`./modules/generated-character-assets.js?v=${encodeURIComponent(NIKKE_CHARACTER_ASSETS_DATA_VERSION)}`)
      .then((module) => {
        globalThis.CHARACTER_ASSETS = module.CHARACTER_ASSETS;
        return module.CHARACTER_ASSETS;
      })
      .catch((error) => {
        console.error("character assets data module failed", error);
        throw error;
      });
  }
  return globalThis.__NIKKE_CHARACTER_ASSETS_READY__;
};
