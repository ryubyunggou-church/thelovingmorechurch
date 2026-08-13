import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TabbedPage } from './TabbedPage'

describe('TabbedPage', () => {
  it('switches panels by state without changing URL', async () => {
    const user = userEvent.setup()
    const before = window.location.pathname

    render(
      <TabbedPage
        tabs={[
          { key: 'a', label: '교회소개', content: <p>교회 본문</p> },
          { key: 'b', label: '담임목사소개', content: <p>목사 본문</p> },
        ]}
      />,
    )

    expect(screen.getByText('교회 본문')).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: '담임목사소개' }))
    expect(screen.getByText('목사 본문')).toBeInTheDocument()
    expect(window.location.pathname).toBe(before)
  })
})
