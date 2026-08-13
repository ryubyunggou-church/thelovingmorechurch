/** 한국어 주제 조사(은/는) 및 예배 안내 자연어 문장 생성 */

export function hasBatchim(word: string): boolean {
  const hangul = [...word.trim()].filter((ch) => /[가-힣]/.test(ch))
  const last = hangul[hangul.length - 1]
  if (!last) return false
  const code = last.charCodeAt(0)
  if (code < 0xac00 || code > 0xd7a3) return false
  return (code - 0xac00) % 28 !== 0
}

export function topicParticle(word: string): '은' | '는' {
  return hasBatchim(word) ? '은' : '는'
}

/**
 * 비고가 장소가 아니라 일정(요일 범위 등)인지 판별.
 * 예: 월~토, 월-금, 매일, 주중, 평일
 */
export function isScheduleNote(note: string): boolean {
  const n = note.trim()
  if (!n) return false
  if (/매일|주중|평일|매주/.test(n)) return true
  // 월~토, 월-토, 월～토 등
  if (/[월화수목금토일]\s*[~～~\-–—]\s*[월화수목금토일]/.test(n)) return true
  return false
}

export interface WorshipSummaryInput {
  name: string
  time: string
  note: string
}

/**
 * "주일 오전예배는 오전 11:00에 본당에서 드립니다." 형태.
 * 비고가 일정형이면 "새벽기도회는 월~토 오전 5:30에 드립니다."
 */
export function formatWorshipSummary(item: WorshipSummaryInput): string {
  const name = item.name.trim() || '예배'
  const particle = topicParticle(name)
  const time = item.time.trim()
  const note = item.note.trim()
  const schedule = note ? isScheduleNote(note) : false

  if (time && note) {
    if (schedule) {
      return `${name}${particle} ${note} ${time}에 드립니다.`
    }
    // 이미 "~에서"로 끝나면 조사 중복 방지
    if (/에서\s*$/.test(note)) {
      return `${name}${particle} ${time}에 ${note} 드립니다.`
    }
    return `${name}${particle} ${time}에 ${note}에서 드립니다.`
  }

  if (time) {
    return `${name}${particle} ${time}에 드립니다.`
  }

  if (note) {
    if (schedule) {
      return `${name}${particle} ${note} 진행합니다.`
    }
    if (/에서\s*$/.test(note)) {
      return `${name}${particle} ${note} 드립니다.`
    }
    return `${name}${particle} ${note}에서 드립니다.`
  }

  return `${name} 안내입니다.`
}
