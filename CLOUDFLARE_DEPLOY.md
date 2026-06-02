# Cloudflare Workers 部署说明

本项目使用 Cloudflare Workers Static Assets 部署静态前端：

- `wrangler.toml`：Worker、静态资源和可选 KV/D1/R2 绑定配置。
- `src/worker.js`：Worker API 入口。
- `scripts/prepare-cloudflare.mjs`：生成部署目录 `.worker-build/`。
- `.worker-build/public/`：部署用静态资源目录，不提交到 Git。
- `.worker-build/generated/data.mjs`：由 `data.js` 生成的 Worker API 数据模块，不提交到 Git。

## 安装依赖

```powershell
npm install
```

## 本地运行

```powershell
npm run cf:dev
```

## 部署

```powershell
npm run cf:deploy
```

## 可选绑定

如需使用 KV/D1/R2，先创建资源，再把 ID 填入 `wrangler.toml` 中对应的注释区域。

```powershell
npx wrangler kv namespace create NIKKE_CACHE
npx wrangler d1 create nikke-pvp-charge
npx wrangler r2 bucket create nikke-pvp-assets
```

## 当前 API

- `GET /api/health`
- `GET /api/characters`
- `GET /api/characters?full=1`
- `POST /api/calculate`

当前前端默认使用本地浏览器计算，Cloudflare 主要负责静态资源托管。`/api/calculate` 仍保留为可选 Worker API，暂不被前端调用。

注意：由于采用静态前端计算，`data.js` 和计算逻辑会随页面公开加载。这适合公开工具站，但不用于隐藏数据或算法。
