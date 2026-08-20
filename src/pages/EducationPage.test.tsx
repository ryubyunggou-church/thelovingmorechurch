import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { EducationPage } from './EducationPage'
import { useAdminStore } from '../store/admin-store'

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <EducationPage />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('EducationPage admin-only manage tab', () => {
  afterEach(() => {
    useAdminStore.setState({ isAdminMode: false })
  })

  it('hides the manage tab for regular visitors', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByRole('tab', { name: '유초등부' })).toBeInTheDocument())
    expect(screen.queryByRole('tab', { name: '부서추가/삭제' })).not.toBeInTheDocument()
  })

  it('appends the manage tab as the last tab in admin mode', async () => {
    useAdminStore.setState({ isAdminMode: true })
    renderPage()
    await waitFor(() => expect(screen.getByRole('tab', { name: '유초등부' })).toBeInTheDocument())
    const tabs = screen.getAllByRole('tab')
    expect(tabs.at(-1)).toHaveTextContent('부서추가/삭제')
  })
})
