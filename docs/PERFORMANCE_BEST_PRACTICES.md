# Performance Best Practices - Apex10

Quick reference guide for maintaining high performance while developing new features.

---

## Quick Rules

### 🚫 DON'T
- ❌ Use `while(true)` loops without safety limits
- ❌ Run expensive calculations on every render
- ❌ Set intervals below 100ms unless critical
- ❌ Block the main thread with synchronous heavy work
- ❌ Render 60 FPS animations for decorative elements
- ❌ Initialize heavy libraries synchronously on mount

### ✅ DO
- ✅ Use `useMemo` for expensive calculations
- ✅ Wrap non-urgent updates in `startTransition`
- ✅ Defer initialization with `requestIdleCallback`
- ✅ Set animation FPS to 30 for backgrounds
- ✅ Use intervals ≥ 200ms for visual updates
- ✅ Add safety limits to loops (max iterations)

---

## Code Patterns

### 1. Deferring Initialization

**Use Case:** Heavy component initialization (particles, animations, 3D graphics)

```typescript
useEffect(() => {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      // Heavy initialization here
      initHeavyLibrary();
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      initHeavyLibrary();
    }, 100);
  }
}, []);
```

---

### 2. Memoizing Expensive Calculations

**Use Case:** Price aggregations, statistics, data transformations

```typescript
import { useMemo } from 'react';

const expensiveResult = useMemo(() => {
  // Heavy calculation
  return prices.reduce((acc, price) => {
    return acc + calculateMetric(price);
  }, 0);
}, [prices]); // Only recalculate when prices change
```

---

### 3. Non-Urgent State Updates

**Use Case:** Live feeds, activity updates, stats counters

```typescript
import { startTransition } from 'react';

const updateActivityFeed = () => {
  startTransition(() => {
    setActivities(prev => [newActivity, ...prev]);
    setStats(prev => ({ ...prev, count: prev.count + 1 }));
  });
};
```

---

### 4. Interval Best Practices

**Use Case:** Periodic updates for charts, tickers, live data

```typescript
useEffect(() => {
  // ✅ GOOD: 200ms+ interval with startTransition
  const interval = setInterval(() => {
    startTransition(() => {
      updateData();
    });
  }, 200); // Minimum 200ms (5fps)

  return () => clearInterval(interval);
}, []);

// ❌ BAD: 50ms interval without transition
useEffect(() => {
  const interval = setInterval(() => {
    updateData(); // Blocks main thread 20 times per second!
  }, 50);
  return () => clearInterval(interval);
}, []);
```

---

### 5. Safe Loop Patterns

**Use Case:** Iterative calculations, level progression, data processing

```typescript
// ❌ BAD: Infinite loop risk
while (true) {
  if (condition) return result;
  iterate();
}

// ✅ GOOD: Bounded loop
const MAX_ITERATIONS = 100;
let iteration = 0;
while (iteration < MAX_ITERATIONS) {
  if (condition) return result;
  iteration++;
  iterate();
}
// Fallback if max reached
return defaultResult;
```

---

### 6. Animation FPS Limits

**Use Case:** Particle systems, background animations, decorative motion

```typescript
// ❌ BAD: 60 FPS for decorative background
const particleOptions = {
  fpsLimit: 60, // Too high for background
};

// ✅ GOOD: 30 FPS for smooth but efficient animation
const particleOptions = {
  fpsLimit: 30, // Still smooth, 50% less CPU
};
```

---

## Component Checklist

Before committing a new component, verify:

- [ ] No unbounded loops
- [ ] Expensive calculations are memoized
- [ ] Intervals are ≥ 200ms (unless critical)
- [ ] Heavy initialization is deferred
- [ ] Non-urgent updates use `startTransition`
- [ ] Animations target 30 FPS (not 60)
- [ ] Component lazy loads if > 50KB

---

## Measuring Performance

### Local Testing

```bash
# Build production bundle
npm run build

# Preview production build
npm run preview

# Run Lighthouse
npx lighthouse http://localhost:4173 --view
```

### DevTools Performance Tab

1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click Record (Ctrl+E)
4. Reload page
5. Stop recording
6. Look for:
   - **Long Tasks** (yellow/red bars > 50ms)
   - **Total Blocking Time** (should be < 200ms)
   - **Main thread activity** (should have idle gaps)

---

## Common Performance Issues

### Issue: High TBT on Mobile

**Symptoms:**
- Mobile TBT > 200ms
- Users report laggy interactions
- Lighthouse mobile score < 90

**Solutions:**
1. Reduce interval frequencies
2. Defer heavy components to idle time
3. Use `startTransition` for updates
4. Consider lazy loading on mobile only

```typescript
const isMobile = window.innerWidth < 768;

return (
  <>
    {!isMobile && <HeavyParticleBackground />}
    <CoreContent />
  </>
);
```

---

### Issue: Component Causing Frame Drops

**Symptoms:**
- Animations stutter
- Scroll feels janky
- FPS drops below 30

**Solutions:**
1. Reduce animation complexity
2. Use CSS transforms instead of layout properties
3. Enable `will-change` for animated elements
4. Reduce particle count

```typescript
// ✅ GOOD: Transform-based animation (GPU accelerated)
<motion.div
  animate={{ transform: 'translateX(100px)' }}
/>

// ❌ BAD: Layout-based animation (CPU intensive)
<motion.div
  animate={{ left: '100px' }}
/>
```

---

### Issue: Initial Load is Slow

**Symptoms:**
- FCP > 1.8s desktop / 4s mobile
- LCP > 2.5s desktop / 4s mobile
- Users see blank screen

**Solutions:**
1. Lazy load routes
2. Code split large dependencies
3. Defer non-critical scripts
4. Preload critical assets

```typescript
// ✅ GOOD: Lazy loaded route
const Dashboard = lazy(() => import('./pages/Dashboard'));

// ❌ BAD: All routes imported eagerly
import Dashboard from './pages/Dashboard';
```

---

## React Query Optimization

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false, // Prevent background refetches
      // Mobile: increase staleTime
      ...(isMobile && { staleTime: 60 * 1000 }),
    },
  },
});
```

---

## Browser Compatibility

All performance patterns include fallbacks:

| Feature | Chrome | Firefox | Safari | Fallback |
|---------|--------|---------|--------|----------|
| `requestIdleCallback` | 47+ | 55+ | 16.4+ | `setTimeout(..., 0)` |
| `startTransition` | React 18+ | React 18+ | React 18+ | N/A (React feature) |
| `useMemo` | All | All | All | N/A (React feature) |

---

## Performance Budget

Maintain these targets for all new features:

| Metric | Desktop | Mobile | Critical? |
|--------|---------|--------|-----------|
| TBT | < 200ms | < 200ms | ✅ Yes |
| FCP | < 1.8s | < 3.0s | ✅ Yes |
| LCP | < 2.5s | < 4.0s | ✅ Yes |
| CLS | < 0.1 | < 0.1 | ✅ Yes |
| Bundle Size | < 500KB | < 500KB | ⚠️ Watch |
| Lighthouse Score | > 90 | > 80 | ⚠️ Watch |

---

## Tools

- **Lighthouse:** Chrome DevTools → Lighthouse tab
- **WebPageTest:** https://webpagetest.org
- **React DevTools Profiler:** Measure component render times
- **Chrome Performance Tab:** Record and analyze main thread activity
- **Bundle Analyzer:** `npm run build -- --analyze`

---

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [React 18 Concurrent Features](https://react.dev/blog/2022/03/29/react-v18)
- [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [Lighthouse Scoring](https://web.dev/performance-scoring/)

---

**Last Updated:** 2026-01-29
**Maintained By:** Development Team
