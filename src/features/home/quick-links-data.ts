import { PARTNER_LINKS } from '../../types/content'
import { seedContact, seedWorship } from '../../data/seed'

/** 홈 「찾아가기」 색인 — 주보 목차처럼 번호 매긴 5개 항목 */
export const indexItems = [
  {
    key: 'worship',
    label: '예배안내',
    href: '/worship',
    desc: '예배 시간과 안내',
    live: () => {
      const next = seedWorship[0]
      return next ? `다음 · ${next.name} ${next.time}` : '예배 일정 보기'
    },
    image: '/photos/church-exterior-1.webp',
  },
  {
    key: 'education',
    label: '교육부서',
    href: '/education',
    desc: '유치부부터 청년가족부까지',
    live: () => '다음세대 사역',
    image: '/photos/mission-cambodia.webp',
  },
  {
    key: 'missions',
    label: '선교사역',
    href: '/missions',
    desc: '국내·국외 선교 동역',
    live: () => '복음과 섬김',
    image: '/photos/mission-mongolia.webp',
  },
  {
    key: 'contact',
    label: '오시는길',
    href: '/contact',
    desc: seedContact.address,
    live: () => seedContact.phone,
    image: '/photos/directions-map.webp',
  },
  {
    key: 'news',
    label: '교회소식',
    href: '/news',
    desc: '공지와 최근 소식',
    live: () => '최신 소식 확인',
    image: '/photos/church-exterior-2.webp',
  },
] as const

export const partners = [
  {
    label: PARTNER_LINKS[0].label,
    href: PARTNER_LINKS[0].href,
    role: '교단 · 총회',
    logo: '/logo-image/총회-logo-투명.png',
  },
  {
    label: PARTNER_LINKS[1].label,
    href: PARTNER_LINKS[1].href,
    role: '지역 · 노회',
    logo: '/logo-image/남경기노회_logo_투명.png',
  },
  {
    label: PARTNER_LINKS[2].label,
    href: PARTNER_LINKS[2].href,
    role: '세계 · 선교',
    logo: '/logo-image/GMS-logo-투명.png',
  },
] as const

/** 기본 스포트라이트: 남경기노회(중앙, index 1) */
export const DEFAULT_PARTNER_FOCUS = 1
