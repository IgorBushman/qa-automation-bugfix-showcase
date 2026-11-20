# QA Automation & Web Bugfix Showcase

Production-ready End-to-End (E2E) testing framework and real-world troubleshooting case logs for modern web applications (**Next.js, React, TypeScript, Node.js, Prisma, PostgreSQL**).

**Contact:** Igor Bushmakin (`garybushman52@gmail.com`) | **GitHub:** [@IgorBushman](https://github.com/IgorBushman)

---

## Automated Audit Coverage (`Playwright`)

This repository contains a reusable Playwright test suite designed to catch critical regressions before production deployment:

1. **Zero-Error Runtime Audit:** Captures uncaught JavaScript exceptions and `console.error` events across desktop and mobile viewports.
2. **Mobile Responsive Integrity:** Detects horizontal layout overflow on mobile devices (iPhone 13 / Mobile Safari).
3. **Internal Link & Routing Verification:** Crawls internal navigation paths to ensure zero `404` or `500` responses.
4. **API Payload & Validation Resilience:** Verifies backend endpoints return clean `4xx` validation errors instead of unhandled `500` server crashes.

---

## Production Bugfix Case Logs

### Case 01: Duplicate Form Submissions on High-Latency Networks
* **Symptom:** Rapid double-clicks on checkout/lead submission buttons triggered duplicate database records in PostgreSQL.
* **Root Cause:** Missing client-side pending state lock and lack of idempotency key validation on the API route.
* **Resolution:** Implemented `useTransition` / disabled lock during async requests plus backend deduplication checks, reducing duplicate entries to 0%.

### Case 02: Session Redirect Loop on Protected Dashboard Routes
* **Symptom:** Authenticated users experienced an infinite redirect loop between `/login` and `/dashboard` after token refresh.
* **Root Cause:** Middleware cookie check evaluated stale token headers before Next.js App Router hydration completed.
* **Resolution:** Synchronized server-side session validation with edge middleware rules and added Playwright E2E auth flow coverage.

### Case 03: Mobile Viewport Horizontal Overflow on Data Tables
* **Symptom:** Action buttons clipped off-screen on iOS Safari (390px width), blocking mobile conversions.
* **Root Cause:** Fixed pixel widths on container wrappers without responsive overflow handling.
* **Resolution:** Replaced fixed containers with responsive CSS Grid / `overflow-x-auto` wrappers and added automated viewport bounds checks in Playwright.

---

## Quick Start

```bash
npm install
npx playwright install
npx playwright test
