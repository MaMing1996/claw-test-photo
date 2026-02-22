# Architecture (MVP)

## 1. Domain Model

```ts
type Photo = {
  id: string;
  path: string;
  capturedAt: string; // ISO
  country: string;    // e.g. "Germany" | "Unknown"
};
```

## 2. Grouping Rules

### Time Group
- `day`: key = `YYYY-MM-DD`
- `month`: key = `YYYY-MM`
- `year`: key = `YYYY`

Each group:
- `photos`: 全部照片（按 capturedAt desc）
- `cover`: `photos.slice(0, 3)`（最新三张）

### Location Group
- key = `country`
- `country` 缺失时使用 `Unknown`
- 组内照片按 `capturedAt desc`

## 3. Module Split

- `src/domain/photo.js`
  - 数据结构与标准化（时间、国家兜底）
- `src/domain/grouping.js`
  - `groupByDay/photos`
  - `groupByMonth/photos`
  - `groupByYear/photos`
  - `groupByCountry/photos`

## 4. API Draft (future)

- `GET /groups/time?granularity=day|month|year`
- `GET /groups/location`
- `GET /groups/:type/:key/photos`

## 5. Non-functional

- 时间统一使用 ISO + 本地时区展示
- 对 10k 照片规模，分组查询目标 < 200ms（缓存后）
