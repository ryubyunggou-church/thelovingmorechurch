import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { ContactPage } from './ContactPage'

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('ContactPage tabs', () => {
  it('shows directions content (contact card + map) on the default tab', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('교회 연락처')).toBeInTheDocument())
    expect(screen.getByRole('tab', { name: '오시는 방법' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getAllByText(/전농로/).length).toBeGreaterThan(0)
  })

  it('switches to the 주차안내 tab and shows the parking section', async () => {
    const user = userEvent.setup()
    renderPage()
    await waitFor(() => expect(screen.getByText('교회 연락처')).toBeInTheDocument())

    await user.click(screen.getByRole('tab', { name: '주차안내' }))

    expect(screen.getByText('교회 주차장 이용 시 주차 요령')).toBeInTheDocument()
    expect(screen.queryByText('교회 연락처')).not.toBeInTheDocument()
  })

  it('groups seeded routes under 지하철로 오실 때 / 버스로 오실 때 / 도보로 오실 때', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('지하철로 오실 때')).toBeInTheDocument())
    expect(screen.getByText('버스로 오실 때')).toBeInTheDocument()
    expect(screen.getByText('도보로 오실 때')).toBeInTheDocument()
  })
})
