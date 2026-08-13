import { describe, expect, it } from 'vitest'
import {
  formatWorshipSummary,
  hasBatchim,
  isScheduleNote,
  topicParticle,
} from './worship-summary'

describe('hasBatchim / topicParticle', () => {
  it('받침 없으면 는', () => {
    expect(hasBatchim('예배')).toBe(false)
    expect(topicParticle('주일 오전예배')).toBe('는')
    expect(topicParticle('기도회')).toBe('는')
  })

  it('받침 있으면 은', () => {
    expect(hasBatchim('예배실')).toBe(true)
    expect(topicParticle('새벽 예배실')).toBe('은')
  })
})

describe('isScheduleNote', () => {
  it('요일 범위·주중을 일정으로 본다', () => {
    expect(isScheduleNote('월~토')).toBe(true)
    expect(isScheduleNote('월-금')).toBe(true)
    expect(isScheduleNote('매일')).toBe(true)
    expect(isScheduleNote('주중')).toBe(true)
  })

  it('장소는 일정이 아니다', () => {
    expect(isScheduleNote('본당')).toBe(false)
    expect(isScheduleNote('지하1층')).toBe(false)
  })
})

describe('formatWorshipSummary', () => {
  it('장소형 자연어', () => {
    expect(
      formatWorshipSummary({
        name: '주일 오전예배',
        time: '오전 11:00',
        note: '본당',
      }),
    ).toBe('주일 오전예배는 오전 11:00에 본당에서 드립니다.')
  })

  it('일정형 자연어', () => {
    expect(
      formatWorshipSummary({
        name: '새벽기도회',
        time: '오전 5:30',
        note: '월~토',
      }),
    ).toBe('새벽기도회는 월~토 오전 5:30에 드립니다.')
  })

  it('시간만', () => {
    expect(
      formatWorshipSummary({ name: '수요예배', time: '오후 7:30', note: '' }),
    ).toBe('수요예배는 오후 7:30에 드립니다.')
  })
})
