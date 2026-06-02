# Cloudflare Workers 部署说明

本项目已增加 Cloudflare Workers 部署结构：

- `wrangler.toml`：Worker、静态资源和可选 KV/D1/R2 绑定配置。
- `src/worker.js`：Worker API 入口。
- `scripts/prepare-cloudflare.mjs`：生成部署目录 `.worker-build/`。
- `.worker-build/public/`：部署用静态资源目录，不提交到 Git。
- `.worker-build/generated/data.mjs`：由 `data.js` 生成的 Worker 私有数据模块，不提交到 Git。

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

当前前端仍兼容原本的本地计算模式。`/api/calculate` 已预留，但完整计算逻辑还需要继续从前端迁移到 Worker，迁移完成后才能真正隐藏充能计算逻辑和完整角色数据。
