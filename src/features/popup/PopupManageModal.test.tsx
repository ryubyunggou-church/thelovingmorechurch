import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PopupManageModal } from './PopupManageModal'
import { useAdminStore } from '../../store/admin-store'
import type { SitePopup } from '../../types/content'

const getSitePopups = vi.fn()
const saveDocument = vi.fn().mockResolvedValue(undefined)
const removeDocument = vi.fn().mockResolvedValue(undefined)

vi.mock('../../lib/content-service', () => ({
  getSitePopups: (...args: unknown[]) => getSitePopups(...args),
  saveDocument: (...args: unknown[]) => saveDocument(...args),
  removeDocument: (...args: unknown[]) => removeDocument(...args),
}))

const popup: SitePopup = {
  id: 'popup-1',
  label: '여름성경학교 안내',
  enabled: true,
  startDate: '2026-08-01',
  endDate: '2026-08-31',
  contentType: 'richtext',
  contentHtml: '내용',
  position: 'center',
  priority: 1,
  hideForHours: 24,
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: '2026-08-01T00:00:00.000Z',
}

describe('PopupManageModal', () => {
  beforeEach(() => {
    getSitePopups.mockClear()
    saveDocument.mockClear()
    removeDocument.mockClear()
    getSitePopups.mockResolvedValue([popup])
    useAdminStore.setState({ popupManageOpen: true })
  })

  it('renders the popup list as a table row', async () => {
    render(<PopupManageModal />)

    await waitFor(() => expect(getSitePopups).toHaveBeenCalled())
    expect(await screen.findByText('여름성경학교 안내')).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('adds a blank disabled popup and reloads', async () => {
    const user = userEvent.setup()
    render(<PopupManageModal />)
    await waitFor(() => expect(getSitePopups).toHaveBeenCalledTimes(1))

    await user.click(screen.getByRole('button', { name: '새 팝업 추가' }))

    await waitFor(() =>
      expect(saveDocument).toHaveBeenCalledWith(
        'sitePopups',
        expect.any(String),
        expect.objectContaining({ label: '새 팝업', enabled: false }),
      ),
    )
    await waitFor(() => expect(getSitePopups).toHaveBeenCalledTimes(2))
  })

  it('requires a second click to delete a popup', async () => {
    const user = userEvent.setup()
    render(<PopupManageModal />)
    await screen.findByText('여름성경학교 안내')

    const deleteBtn = screen.getByRole('button', { name: /^삭제$/ })
    await user.click(deleteBtn)
    expect(removeDocument).not.toHaveBeenCalled()

    const confirmBtn = screen.getByRole('button', { name: /한 번 더 클릭/ })
    await user.click(confirmBtn)

    await waitFor(() => expect(removeDocument).toHaveBeenCalledWith('sitePopups', 'popup-1'))
  })

  it('opens the editor dialog for the clicked popup', async () => {
    const user = userEvent.setup()
    render(<PopupManageModal />)
    await screen.findByText('여름성경학교 안내')

    await user.click(screen.getByRole('button', { name: '편집' }))

    expect(screen.getByLabelText(/^팝업 이름/)).toHaveValue('여름성경학교 안내')
  })
})
