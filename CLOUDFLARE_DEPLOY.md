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

当前前端在 Cloudflare/HTTP 环境会调用 `/api/calculate` 获取权威计算结果；`file://` 本地打开时仍保留前端本地计算作为开发兜底。

注意：前端为了角色列表、筛选和详情显示，仍会请求 `/api/characters?full=1`。如果要进一步隐藏完整角色数据，需要继续把角色列表改成公开摘要数据，并将详情/充能组成也通过 API 按需返回。
