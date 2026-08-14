import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { NewsDetailPage } from './NewsDetailPage'
import { useAdminStore } from '../store/admin-store'
import type { NewsPost } from '../types/content'

const post: NewsPost = {
  id: 'n1',
  title: '테스트 소식',
  contentHtml: '<p>본문</p>',
  thumbnail: 'https://example.com/thumb.jpg',
  authorUid: 'seed',
  createdAt: '2026-01-05T00:00:00.000Z',
  isPublished: true,
  viewCount: 0,
}

const getNewsPost = vi.fn().mockResolvedValue(post)
const saveDocument = vi.fn().mockResolvedValue(undefined)
const removeDocument = vi.fn().mockResolvedValue(undefined)

vi.mock('../lib/content-service', () => ({
  getNewsPost: (...args: unknown[]) => getNewsPost(...args),
  saveDocument: (...args: unknown[]) => saveDocument(...args),
  removeDocument: (...args: unknown[]) => removeDocument(...args),
}))

const navigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => navigate }
})

function renderDetail() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/news/n1']}>
        <Routes>
          <Route path="/news/:id" element={<NewsDetailPage />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('NewsDetailPage admin controls', () => {
  afterEach(() => {
    useAdminStore.setState({ isAdminMode: false })
    navigate.mockClear()
    saveDocument.mockClear()
    removeDocument.mockClear()
  })

  it('only shows "목록으로" for regular visitors', async () => {
    renderDetail()
    await waitFor(() => expect(screen.getByText('테스트 소식')).toBeInTheDocument())
    expect(screen.getByRole('link', { name: '목록으로' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '수정' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^삭제$/ })).not.toBeInTheDocument()
  })

  it('shows 수정/삭제 buttons for admins and requires two clicks to delete', async () => {
    useAdminStore.setState({ isAdminMode: true })
    const user = userEvent.setup()
    renderDetail()
    await waitFor(() => expect(screen.getByText('테스트 소식')).toBeInTheDocument())

    expect(screen.getByRole('button', { name: '수정' })).toBeInTheDocument()
    const deleteBtn = screen.getByRole('button', { name: /^삭제$/ })
    await user.click(deleteBtn)
    expect(removeDocument).not.toHaveBeenCalled()
    const confirmBtn = screen.getByRole('button', { name: /한 번 더 클릭하면 삭제됩니다/ })

    await user.click(confirmBtn)
    await waitFor(() => expect(removeDocument).toHaveBeenCalledWith('newsPosts', 'n1'))
    expect(navigate).toHaveBeenCalledWith('/news')
  })

  it('opens an edit dialog prefilled with the post, and saves with isPublished: true', async () => {
    useAdminStore.setState({ isAdminMode: true })
    const user = userEvent.setup()
    renderDetail()
    await waitFor(() => expect(screen.getByText('테스트 소식')).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: '수정' }))
    const titleInput = await screen.findByDisplayValue('테스트 소식')
    expect(titleInput).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '저장' }))
    await waitFor(() =>
      expect(saveDocument).toHaveBeenCalledWith(
        'newsPosts',
        'n1',
        expect.objectContaining({ title: '테스트 소식', isPublished: true }),
      ),
    )
  })
})
