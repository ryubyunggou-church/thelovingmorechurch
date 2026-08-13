import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'

vi.mock('./lib/firebase', () => ({
  app: null,
  auth: null,
  db: null,
  storage: null,
  isFirebaseConfigured: false,
}))

// Avoid full App browser router + home hero timers for smoke test
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'

describe('App smoke', () => {
  it('renders chrome with official site name without crashing', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Header />
          <Footer />
        </MemoryRouter>
      </HelmetProvider>,
    )
    expect(screen.getAllByText(/대한예수교장로회 사랑하는교회/).length).toBeGreaterThan(0)
  })
})
