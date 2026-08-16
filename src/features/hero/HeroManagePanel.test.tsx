import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HeroManagePanel } from './HeroManagePanel'
import type { HeroSlide } from '../../types/content'

function makeDataTransfer() {
  return { effectAllowed: '', dropEffect: '', setData: vi.fn(), getData: vi.fn() }
}

const saveDocument = vi.fn().mockResolvedValue(undefined)
const removeDocument = vi.fn().mockResolvedValue(undefined)

vi.mock('../../lib/content-service', () => ({
  saveDocument: (...args: unknown[]) => saveDocument(...args),
  removeDocument: (...args: unknown[]) => removeDocument(...args),
}))

const slides: HeroSlide[] = [
  {
    id: 'hero-1',
    mediaUrl: '',
    mediaType: 'image',
    tag: '',
    title: '슬라이드 A',
    subtitle: '',
    order: 1,
    isActive: true,
  },
  {
    id: 'hero-2',
    mediaUrl: '',
    mediaType: 'image',
    tag: '',
    title: '슬라이드 B',
    subtitle: '',
    order: 2,
    isActive: true,
  },
]

describe('HeroManagePanel', () => {
  it('adds a blank slide with the next order and reloads', async () => {
    const user = userEvent.setup()
    const onUpdated = vi.fn()
    render(<HeroManagePanel slides={slides} onUpdated={onUpdated} />)

    await user.click(screen.getByRole('button', { name: '새 슬라이드 추가' }))

    await waitFor(() =>
      expect(saveDocument).toHaveBeenCalledWith(
        'heroSlides',
        expect.any(String),
        expect.objectContaining({ title: '새 슬라이드', order: 3 }),
      ),
    )
    expect(onUpdated).toHaveBeenCalled()
  })

  it('requires a second click to delete a slide', async () => {
    const user = userEvent.setup()
    const onUpdated = vi.fn()
    render(<HeroManagePanel slides={slides} onUpdated={onUpdated} />)

    const deleteButtons = screen.getAllByRole('button', { name: /^삭제$/ })
    await user.click(deleteButtons[0]!)
    expect(removeDocument).not.toHaveBeenCalled()

    const confirmBtn = screen.getByRole('button', { name: /한 번 더 클릭하면 삭제됩니다/ })
    await user.click(confirmBtn)

    await waitFor(() => expect(removeDocument).toHaveBeenCalledWith('heroSlides', 'hero-1'))
    expect(onUpdated).toHaveBeenCalled()
  })

  it('blocks deleting the last remaining slide', async () => {
    removeDocument.mockClear()
    const user = userEvent.setup()
    render(<HeroManagePanel slides={[slides[0]!]} onUpdated={() => {}} />)

    await user.click(screen.getByRole('button', { name: /^삭제$/ }))

    expect(removeDocument).not.toHaveBeenCalled()
  })

  it('opens the edit dialog for the clicked slide regardless of list order', async () => {
    const user = userEvent.setup()
    render(<HeroManagePanel slides={slides} onUpdated={() => {}} />)

    const editButtons = screen.getAllByRole('button', { name: '편집' })
    await user.click(editButtons[1]!) // 슬라이드 B

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText(/^제목/)).toHaveValue('슬라이드 B')
  })

  it('drags a slide to a new position and persists the swapped order with a toast', async () => {
    saveDocument.mockClear()
    const onUpdated = vi.fn()
    render(<HeroManagePanel slides={slides} onUpdated={onUpdated} />)

    const handles = screen.getAllByLabelText('드래그하여 순서 변경')
    const rows = screen.getAllByRole('listitem')
    const dt = makeDataTransfer()

    fireEvent.dragStart(handles[0]!, { dataTransfer: dt })
    fireEvent.dragOver(rows[1]!, { dataTransfer: dt })
    fireEvent.drop(rows[1]!, { dataTransfer: dt })

    await waitFor(() => {
      expect(saveDocument).toHaveBeenCalledWith('heroSlides', 'hero-2', { order: 1 })
      expect(saveDocument).toHaveBeenCalledWith('heroSlides', 'hero-1', { order: 2 })
    })
    expect(onUpdated).toHaveBeenCalled()
  })
})
