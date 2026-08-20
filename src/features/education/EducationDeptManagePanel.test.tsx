import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EducationDeptManagePanel } from './EducationDeptManagePanel'
import type { EducationDepartment } from '../../types/content'

const saveDocument = vi.fn().mockResolvedValue(undefined)
const removeDocument = vi.fn().mockResolvedValue(undefined)

vi.mock('../../lib/content-service', () => ({
  saveDocument: (...args: unknown[]) => saveDocument(...args),
  removeDocument: (...args: unknown[]) => removeDocument(...args),
}))

const depts: EducationDepartment[] = [
  {
    id: 'd1',
    deptKey: 'elementary',
    name: '유초등부',
    missionText: '',
    image: '',
    scheduleInfo: '',
    order: 1,
  },
  {
    id: 'd2',
    deptKey: 'custom_1',
    name: '신규부서',
    missionText: '',
    image: '',
    scheduleInfo: '',
    order: 5,
  },
]

describe('EducationDeptManagePanel', () => {
  it('marks default departments as non-deletable and custom ones as deletable', () => {
    render(<EducationDeptManagePanel depts={depts} onUpdated={() => {}} />)
    expect(screen.getByText('삭제 불가')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^삭제$/ })).toBeInTheDocument()
  })

  it('adds a blank department with the next order and reloads', async () => {
    const user = userEvent.setup()
    const onUpdated = vi.fn()
    render(<EducationDeptManagePanel depts={depts} onUpdated={onUpdated} />)

    await user.click(screen.getByRole('button', { name: '새 부서 추가' }))

    await waitFor(() =>
      expect(saveDocument).toHaveBeenCalledWith(
        'educationDepartments',
        expect.any(String),
        expect.objectContaining({ name: '새 부서', order: 6 }),
      ),
    )
    expect(onUpdated).toHaveBeenCalled()
  })

  it('requires a second click to delete a custom department, and blocks default ones', async () => {
    const user = userEvent.setup()
    const onUpdated = vi.fn()
    render(<EducationDeptManagePanel depts={depts} onUpdated={onUpdated} />)

    const deleteBtn = screen.getByRole('button', { name: /^삭제$/ })
    await user.click(deleteBtn)
    expect(removeDocument).not.toHaveBeenCalled()
    const confirmBtn = screen.getByRole('button', { name: /한 번 더 클릭하면 삭제됩니다/ })

    await user.click(confirmBtn)
    await waitFor(() => expect(removeDocument).toHaveBeenCalledWith('educationDepartments', 'd2'))
    expect(onUpdated).toHaveBeenCalled()
  })

  it('allows renaming a default department inline', async () => {
    const user = userEvent.setup()
    const onUpdated = vi.fn()
    render(<EducationDeptManagePanel depts={depts} onUpdated={onUpdated} />)

    await user.click(screen.getByRole('button', { name: /유초등부/ }))
    const input = screen.getByRole('textbox', { name: /유초등부 부서명 수정/ })
    await user.clear(input)
    await user.type(input, '유아부')
    await user.click(screen.getByRole('button', { name: '저장' }))

    await waitFor(() =>
      expect(saveDocument).toHaveBeenCalledWith('educationDepartments', 'd1', { name: '유아부' }),
    )
    expect(onUpdated).toHaveBeenCalled()
  })

  it('cancels inline rename without saving', async () => {
    saveDocument.mockClear()
    const user = userEvent.setup()
    render(<EducationDeptManagePanel depts={depts} onUpdated={() => {}} />)

    await user.click(screen.getByRole('button', { name: /유초등부/ }))
    const input = screen.getByRole('textbox', { name: /유초등부 부서명 수정/ })
    await user.type(input, '변경중')
    await user.click(screen.getByRole('button', { name: '취소' }))

    expect(saveDocument).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /유초등부/ })).toBeInTheDocument()
  })
})
