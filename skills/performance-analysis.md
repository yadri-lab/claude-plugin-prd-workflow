---
name: performance-analysis
description: Performance profiling, optimization, and benchmarking
category: Optimization
---

# Performance Analysis Skill

Provides expertise in analyzing, profiling, and optimizing application performance including bundle size, runtime performance, and load times.

## 1. Frontend Performance Metrics

### Core Web Vitals

**LCP (Largest Contentful Paint)**: <2.5s (good)
- Time until largest content element renders
- **Optimize**: Lazy load images, optimize fonts, reduce JS

**FID (First Input Delay)**: <100ms (good)
- Time from user interaction to browser response
- **Optimize**: Reduce JS execution, use web workers

**CLS (Cumulative Layout Shift)**: <0.1 (good)
- Visual stability (elements don't jump around)
- **Optimize**: Reserve space for images, avoid dynamic content

**TTFB (Time to First Byte)**: <800ms (good)
- Server response time
- **Optimize**: CDN, caching, faster backend

**FCP (First Contentful Paint)**: <1.8s (good)
- Time until first DOM content renders

---

## 2. Performance Profiling Tools

### Chrome DevTools Performance Tab

**How to Profile**:
1. Open DevTools (F12)
2. Navigate to Performance tab
3. Click Record (●)
4. Perform actions to profile
5. Stop recording
6. Analyze timeline

**What to Look For**:
- **Long tasks** (>50ms) - blocks main thread
- **Layout shifts** - CLS issues
- **Excessive rendering** - DOM thrashing
- **Memory leaks** - heap size growing

---

### React DevTools Profiler

**Component Render Time**:
```tsx
import { Profiler } from 'react';

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>

function onRenderCallback(
  id, // "MyComponent"
  phase, // "mount" or "update"
  actualDuration, // Time spent rendering
  baseDuration, // Estimated time without memoization
  startTime,
  commitTime
) {
  console.log(`${id} took ${actualDuration}ms`);
}
```

---

### Lighthouse

**Run Lighthouse**:
```bash
# CLI
npm install -g lighthouse
lighthouse https://example.com --view

# Or use Chrome DevTools → Lighthouse tab
```

**Lighthouse Score Breakdown**:
- **Performance** (0-100): Load speed, interactivity
- **Accessibility** (0-100): A11y compliance
- **Best Practices** (0-100): Security, HTTPS
- **SEO** (0-100): Search engine optimization

**Target**: >90 for all metrics

---

## 3. Bundle Size Optimization

### Analyze Bundle

**webpack-bundle-analyzer**:
```bash
npm install --save-dev webpack-bundle-analyzer

# In webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

plugins: [
  new BundleAnalyzerPlugin()
]

# Run build
npm run build
```

**Visualizes**:
- Package sizes (treemap)
- Gzipped sizes
- Duplicate dependencies

---

### Code Splitting

**Route-based splitting** (Next.js):
```tsx
// pages/about.tsx automatically code-split
export default function About() {
  return <div>About Page</div>;
}
```

**Component-based splitting**:
```tsx
import { lazy, Suspense } from 'react';

// ❌ Eager load (always in bundle)
import HeavyComponent from './HeavyComponent';

// ✅ Lazy load (separate chunk)
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**Dynamic imports**:
```tsx
// Load library only when needed
async function handleExport() {
  const XLSX = await import('xlsx');
  XLSX.writeFile(data, 'export.xlsx');
}
```

---

### Tree-Shaking

**Optimize imports**:
```typescript
// ❌ Imports entire library
import _ from 'lodash';

// ✅ Tree-shakeable (lodash-es)
import { debounce } from 'lodash-es';

// ✅ Best (single function)
import debounce from 'lodash/debounce';
```

**package.json sideEffects**:
```json
{
  "sideEffects": false  // Enables tree-shaking
}

// Or specify files with side effects
{
  "sideEffects": ["*.css", "*.scss"]
}
```

---

### Image Optimization

**Next.js Image component**:
```tsx
import Image from 'next/image';

// ❌ Regular img tag
<img src="/hero.jpg" alt="Hero" />

// ✅ Optimized (lazy load, responsive, WebP)
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // For LCP image
  placeholder="blur"
/>
```

**Image formats**:
- **WebP**: 25-35% smaller than JPEG
- **AVIF**: 50% smaller than JPEG (cutting edge)
- **SVG**: For icons/logos (infinitely scalable)

**Compress images**:
```bash
npm install -g sharp-cli

# Resize and compress
sharp -i input.jpg -o output.jpg --resize 800 --quality 80

# Convert to WebP
sharp -i input.jpg -o output.webp --quality 80
```

---

## 4. Runtime Performance Optimization

### React Performance

**useMemo** (expensive calculations):
```tsx
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);  // Only recalculate when data changes
```

**useCallback** (prevent function recreation):
```tsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);  // Function stable unless id changes
```

**React.memo** (prevent unnecessary renders):
```tsx
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
}, (prevProps, nextProps) => {
  // Return true if should NOT re-render
  return prevProps.data === nextProps.data;
});
```

**Virtual scrolling** (long lists):
```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={10000}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>Row {index}</div>
  )}
</FixedSizeList>
```

---

### Debouncing & Throttling

**Debounce** (wait for user to stop typing):
```typescript
import { debounce } from 'lodash-es';

const debouncedSearch = debounce((query: string) => {
  fetchResults(query);
}, 300);  // Wait 300ms after last keystroke

// Usage
<input onChange={(e) => debouncedSearch(e.target.value)} />
```

**Throttle** (limit frequency):
```typescript
import { throttle } from 'lodash-es';

const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 100);  // Execute at most once per 100ms

window.addEventListener('scroll', throttledScroll);
```

---

### Web Workers

**Offload heavy computation**:
```typescript
// worker.ts
self.addEventListener('message', (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
});

// main.ts
const worker = new Worker('/worker.js');

worker.postMessage(data);

worker.addEventListener('message', (e) => {
  console.log('Result:', e.data);
});
```

---

## 5. Network Optimization

### Caching Strategies

**HTTP Cache Headers**:
```
Cache-Control: public, max-age=31536000, immutable  # Static assets
Cache-Control: no-cache  # HTML (always revalidate)
```

**Service Worker (PWA)**:
```javascript
// Cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

---

### Compression

**Enable gzip/brotli** (server config):
```nginx
# nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;

# Brotli (better than gzip)
brotli on;
brotli_types text/plain text/css application/json application/javascript;
```

**Check compression**:
```bash
curl -H "Accept-Encoding: gzip" -I https://example.com

# Response headers:
# Content-Encoding: gzip
```

---

### Resource Hints

**Preconnect** (DNS + TLS handshake):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
```

**Prefetch** (load resource for next page):
```html
<link rel="prefetch" href="/next-page.js">
```

**Preload** (load critical resource):
```html
<link rel="preload" href="/critical.css" as="style">
```

---

## 6. Database Performance

### Query Optimization

**Explain plan**:
```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'test@example.com';

-- Look for:
-- Seq Scan (bad) → Add index
-- Index Scan (good)
```

**Add indexes**:
```sql
-- Single column
CREATE INDEX idx_users_email ON users(email);

-- Composite index
CREATE INDEX idx_users_created_email ON users(created_at, email);
```

**N+1 query problem**:
```typescript
// ❌ N+1 queries (1 + 100 queries)
const posts = await Post.findAll();
for (const post of posts) {
  const author = await User.findByPk(post.authorId);  // N queries
}

// ✅ Eager loading (2 queries)
const posts = await Post.findAll({
  include: [User]  // JOIN
});
```

---

### Connection Pooling

**Configure pool**:
```typescript
const pool = new Pool({
  max: 20,  // Max connections
  min: 5,   // Min connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

## 7. Benchmarking

### JavaScript Benchmarking

**console.time**:
```typescript
console.time('calculation');
const result = expensiveCalculation();
console.timeEnd('calculation');
// Output: calculation: 123.456ms
```

**performance.now** (high precision):
```typescript
const start = performance.now();
expensiveCalculation();
const end = performance.now();
console.log(`Took ${end - start}ms`);
```

**Benchmark.js**:
```javascript
import Benchmark from 'benchmark';

const suite = new Benchmark.Suite();

suite
  .add('RegExp test', () => {
    /o/.test('Hello World!');
  })
  .add('String indexOf', () => {
    'Hello World!'.indexOf('o') > -1;
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
```

---

### Load Testing

**Artillery** (HTTP load testing):
```bash
npm install -g artillery

# config.yml
cat > load-test.yml <<EOF
config:
  target: 'https://api.example.com'
  phases:
    - duration: 60
      arrivalRate: 10  # 10 requests/sec
scenarios:
  - name: "Get users"
    flow:
      - get:
          url: "/users"
EOF

# Run test
artillery run load-test.yml
```

**k6** (Modern load testing):
```javascript
// load-test.js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 100,  // Virtual users
  duration: '30s',
};

export default function() {
  let res = http.get('https://api.example.com/users');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

```bash
k6 run load-test.js
```

---

## 8. Performance Budget

**Define budgets** (Lighthouse CI):
```json
// budget.json
[
  {
    "path": "/*",
    "timings": [
      {
        "metric": "first-contentful-paint",
        "budget": 2000
      },
      {
        "metric": "interactive",
        "budget": 5000
      }
    ],
    "resourceSizes": [
      {
        "resourceType": "script",
        "budget": 300  // 300 KB
      },
      {
        "resourceType": "total",
        "budget": 1000  // 1 MB
      }
    ]
  }
]
```

**Enforce in CI**:
```yaml
# GitHub Actions
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun --budget-path=budget.json
```

---

## 9. Monitoring

### Real User Monitoring (RUM)

**Web Vitals**:
```typescript
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics(metric) {
  fetch('/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

**Sentry Performance**:
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: '...',
  tracesSampleRate: 0.1,  // 10% of transactions
});
```

---

## 10. Performance Checklist

**Frontend**:
- [ ] Core Web Vitals >90
- [ ] Lighthouse score >90
- [ ] Bundle size <300 KB gzipped
- [ ] Images optimized (WebP, lazy load)
- [ ] Code splitting implemented
- [ ] Tree-shaking enabled
- [ ] Critical CSS inlined
- [ ] Fonts preloaded

**Backend**:
- [ ] Database queries indexed
- [ ] N+1 queries eliminated
- [ ] Connection pooling configured
- [ ] Caching strategy (Redis)
- [ ] Response compression (gzip/brotli)
- [ ] CDN for static assets

**Monitoring**:
- [ ] RUM tracking (Web Vitals)
- [ ] Error tracking (Sentry)
- [ ] Performance budgets enforced
- [ ] Load testing (p95 < 500ms)

---

## Related

- Commands: `/quality-check` (includes perf checks)
- Agents: `quality-assurance`, `devops-engineer`
- Skills: `code-quality`
