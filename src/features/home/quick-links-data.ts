import { BookOpen, CalendarDays, Globe2, MapPin, Newspaper } from 'lucide-react'
import { PARTNER_LINKS } from '../../types/content'
import { seedContact, seedWorship } from '../../data/seed'

export const bentoItems = [
  {
    key: 'worship',
    label: '예배안내',
    href: '/worship',
    desc: '예배 시간과 안내',
    icon: CalendarDays,
    span: 'md:col-span-4 md:row-span-2',
    featured: true,
    live: () => {
      const next = seedWorship[0]
      return next ? `다음 · ${next.name} ${next.time}` : '예배 일정 보기'
    },
    image:
      'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    key: 'education',
    label: '교육부서',
    href: '/education',
    desc: '유치부부터 청년가족부까지',
    icon: BookOpen,
    span: 'md:col-span-2',
    featured: false,
    live: () => '다음세대 사역',
    image:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
  },
  {
    key: 'missions',
    label: '선교사역',
    href: '/missions',
    desc: '국내·국외 선교 동역',
    icon: Globe2,
    span: 'md:col-span-2',
    featured: false,
    live: () => '복음과 섬김',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
  },
  {
    key: 'contact',
    label: '오시는길',
    href: '/contact',
    desc: seedContact.address,
    icon: MapPin,
    span: 'md:col-span-3',
    featured: false,
    live: () => seedContact.phone,
    image:
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    key: 'news',
    label: '교회소식',
    href: '/news',
    desc: '공지와 최근 소식',
    icon: Newspaper,
    span: 'md:col-span-3',
    featured: false,
    live: () => '최신 소식 확인',
    image:
      'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1000&q=80',
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
