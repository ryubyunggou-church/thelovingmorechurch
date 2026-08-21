import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom has no matchMedia impl — polyfill for usePrefersReducedMotion etc.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  })
}

// jsdom has no IntersectionObserver impl — polyfill for useInViewOnce (Reveal) etc.
if (!('IntersectionObserver' in window)) {
  class MockIntersectionObserver {
    readonly root: Element | Document | null = null
    readonly rootMargin: string = ''
    readonly scrollMargin: string = ''
    readonly thresholds: ReadonlyArray<number> = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  // @ts-expect-error jsdom test polyfill
  window.IntersectionObserver = MockIntersectionObserver
}

// jsdom has no ResizeObserver impl — polyfill for Header.tsx height measurement etc.
if (!('ResizeObserver' in window)) {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error jsdom test polyfill
  window.ResizeObserver = MockResizeObserver
}

afterEach(() => {
  cleanup()
})
