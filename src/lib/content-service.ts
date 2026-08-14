import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  deleteDoc,
  where,
  limit,
  type DocumentData,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import {
  seedAboutChurch,
  seedAboutPastor,
  seedAboutTabs,
  seedContact,
  seedHeroSlides,
  seedMissions,
  seedNews,
  seedAnnualMotto,
  seedPastorGreeting,
  seedSiteSettings,
  seedStaff,
  seedWorship,
} from '../data/seed'
import type {
  AboutChurch,
  AboutPastor,
  AboutTab,
  AnnualMotto,
  ContactInfo,
  EducationDepartment,
  HeroSlide,
  MissionItem,
  NewsPost,
  PastorGreeting,
  SiteSettings,
  StaffMember,
  WorshipScheduleItem,
} from '../types/content'
import { sanitizeHtml } from './sanitize'
import { detectMediaType } from './media'
import { orderEducationDepartments } from './education-order'

async function fetchCollection<T>(
  name: string,
  mapFn: (id: string, data: DocumentData) => T,
  orderField?: string,
): Promise<T[] | null> {
  if (!db || !isFirebaseConfigured) return null
  try {
    const col = collection(db, name)
    const q = orderField ? query(col, orderBy(orderField, 'asc')) : col
    const snap = await getDocs(q)
    if (snap.empty) return null
    return snap.docs.map((d) => mapFn(d.id, d.data()))
  } catch {
    return null
  }
}

async function fetchDoc<T>(
  name: string,
  id: string,
  mapFn: (id: string, data: DocumentData) => T,
): Promise<T | null> {
  if (!db || !isFirebaseConfigured) return null
  try {
    const snap = await getDoc(doc(db, name, id))
    if (!snap.exists()) return null
    return mapFn(snap.id, snap.data())
  } catch {
    return null
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const remote = await fetchCollection<HeroSlide>(
    'heroSlides',
    (id, d) => {
      const mediaUrl = String(d.mediaUrl ?? d.imageUrl ?? '').trim()
      const stored = d.mediaType as HeroSlide['mediaType'] | undefined
      return {
        id,
        mediaUrl,
        // URL 기준 판별 우선 (잘못 저장된 mediaType:youtube 로 이미지가 안 보이던 문제 방지)
        mediaType: detectMediaType(mediaUrl) === 'image' && stored === 'video'
          ? 'video'
          : detectMediaType(mediaUrl),
        tag: String(d.tag ?? ''),
        title: String(d.title ?? ''),
        subtitle: String(d.subtitle ?? ''),
        linkUrl: d.linkUrl ? String(d.linkUrl) : undefined,
        order: Number(d.order ?? 0),
        isActive: d.isActive === false ? false : true,
      }
    },
    'order',
  )

  const active = (remote ?? []).filter((s) => s.isActive).sort((a, b) => a.order - b.order)

  // Firestore에 문서는 있으나 미디어 URL이 비어 있으면 시드 이미지로 폴백
  if (active.length === 0) {
    return seedHeroSlides.filter((s) => s.isActive).sort((a, b) => a.order - b.order)
  }

  const withMedia = active.map((s, i) => {
    if (s.mediaUrl) return s
    const fallback = seedHeroSlides[i % seedHeroSlides.length]!
    return {
      ...s,
      mediaUrl: fallback.mediaUrl,
      mediaType: fallback.mediaType,
    }
  })

  return withMedia
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return (
    (await fetchDoc<SiteSettings>('siteSettings', 'main', (id, d) => ({
      id,
      siteName: String(d.siteName ?? seedSiteSettings.siteName),
      slogan: String(d.slogan ?? ''),
      mottoLines: Array.isArray(d.mottoLines) ? d.mottoLines.map(String) : [],
      footerText: String(d.footerText ?? ''),
      contact: {
        phone: String(d.contact?.phone ?? ''),
        email: String(d.contact?.email ?? ''),
        address: String(d.contact?.address ?? ''),
      },
    }))) ?? seedSiteSettings
  )
}

export async function getPastorGreeting(): Promise<PastorGreeting> {
  return (
    (await fetchDoc<PastorGreeting>('pastorGreeting', 'main', (id, d) => ({
      id,
      photoUrl: String(d.photoUrl ?? ''),
      message: String(d.message ?? ''),
      pastorName: String(d.pastorName ?? '담임목사'),
      quote: d.quote != null ? String(d.quote) : undefined,
      updatedAt: String(d.updatedAt ?? ''),
    }))) ?? seedPastorGreeting
  )
}

export async function getAnnualMotto(): Promise<AnnualMotto> {
  return (
    (await fetchDoc<AnnualMotto>('annualMotto', 'main', (id, d) => {
      const practices = Array.isArray(d.practices)
        ? d.practices.map(String)
        : seedAnnualMotto.practices
      return {
        id,
        year: d.year != null && d.year !== '' ? Number(d.year) : undefined,
        motto: String(d.motto ?? seedAnnualMotto.motto),
        scripture: String(d.scripture ?? seedAnnualMotto.scripture),
        practices:
          practices.length >= 3 ? practices.slice(0, 3) : [...practices, ...seedAnnualMotto.practices].slice(0, 3),
        updatedAt: String(d.updatedAt ?? ''),
      }
    })) ?? seedAnnualMotto
  )
}

/** 본문에서 pull-quote용 첫 문장 추출 */
export function extractFirstSentence(text: string): string {
  const t = text.trim()
  if (!t) return ''
  const m = t.match(/^[\s\S]+?[.。!?！？\n]/)
  return (m?.[0] ?? t).trim()
}

export async function getWorshipSchedule(): Promise<WorshipScheduleItem[]> {
  const remote = await fetchCollection<WorshipScheduleItem>(
    'worshipSchedule',
    (id, d) => ({
      id,
      name: String(d.name ?? ''),
      time: String(d.time ?? ''),
      note: String(d.note ?? ''),
      order: Number(d.order ?? 0),
    }),
    'order',
  )
  return (remote ?? seedWorship).sort((a, b) => a.order - b.order)
}

export async function getContactInfo(): Promise<ContactInfo> {
  return (
    (await fetchDoc<ContactInfo>('contactInfo', 'main', (id, d) => ({
      id,
      address: String(d.address ?? ''),
      phone: String(d.phone ?? ''),
      fax: String(d.fax ?? ''),
      email: String(d.email ?? ''),
      siteUrl: String(d.siteUrl ?? ''),
      naverMapEmbedUrl: String(d.naverMapEmbedUrl ?? d.mapEmbedUrl ?? ''),
    }))) ?? seedContact
  )
}

export async function getAboutTabs(): Promise<AboutTab[]> {
  return (
    (await fetchCollection<AboutTab>('aboutTabs', (id, d) => ({
      id,
      tabKey: d.tabKey as AboutTab['tabKey'],
      title: String(d.title ?? ''),
      content: String(d.content ?? ''),
    }))) ?? seedAboutTabs
  )
}

export async function getAboutChurch(): Promise<AboutChurch> {
  return (
    (await fetchDoc<AboutChurch>('aboutChurch', 'main', (id, d) => ({
      id,
      heroImageUrl: String(d.heroImageUrl ?? seedAboutChurch.heroImageUrl),
      title: String(d.title ?? seedAboutChurch.title),
      body: String(d.body ?? seedAboutChurch.body),
      updatedAt: String(d.updatedAt ?? ''),
    }))) ?? seedAboutChurch
  )
}

export async function getAboutPastor(): Promise<AboutPastor> {
  return (
    (await fetchDoc<AboutPastor>('aboutPastor', 'main', (id, d) => {
      const education = Array.isArray(d.education)
        ? d.education.map(String)
        : seedAboutPastor.education
      const career = Array.isArray(d.career) ? d.career.map(String) : seedAboutPastor.career
      return {
        id,
        photoUrl: String(d.photoUrl ?? seedAboutPastor.photoUrl),
        name: String(d.name ?? seedAboutPastor.name),
        title: String(d.title ?? seedAboutPastor.title),
        education,
        career,
        notes: String(d.notes ?? ''),
        updatedAt: String(d.updatedAt ?? ''),
      }
    })) ?? seedAboutPastor
  )
}

/** Textarea 줄 단위 → 배열 (빈 줄 제거) */
export function linesToList(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function listToLines(list: string[]): string {
  return list.join('\n')
}

export async function getStaffMembers(): Promise<StaffMember[]> {
  const remote = await fetchCollection<StaffMember>(
    'staffMembers',
    (id, d) => ({
      id,
      name: String(d.name ?? ''),
      role: String(d.role ?? ''),
      photoUrl: String(d.photoUrl ?? ''),
      order: Number(d.order ?? 0),
    }),
    'order',
  )
  return (remote ?? seedStaff).sort((a, b) => a.order - b.order)
}

export async function getEducationDepartments(): Promise<EducationDepartment[]> {
  const remote = await fetchCollection<EducationDepartment>('educationDepartments', (id, d) => ({
    id,
    deptKey: String(d.deptKey ?? ''),
    name: String(d.name ?? ''),
    missionText: String(d.missionText ?? ''),
    image: String(d.image ?? ''),
    scheduleInfo: d.scheduleInfo == null ? '' : String(d.scheduleInfo),
    order: Number(d.order ?? 0),
    targetAge: d.targetAge == null ? undefined : String(d.targetAge),
    place: d.place == null ? undefined : String(d.place),
  }))
  return orderEducationDepartments(remote ?? [])
}

export async function getMissions(): Promise<MissionItem[]> {
  const remote = await fetchCollection<MissionItem>(
    'missions',
    (id, d) => ({
      id,
      type: d.type as MissionItem['type'],
      name: String(d.name ?? ''),
      description: String(d.description ?? ''),
      order: Number(d.order ?? 0),
      region: String(d.region ?? ''),
      image: String(d.image ?? ''),
    }),
    'order',
  )
  return (remote ?? seedMissions).sort((a, b) => a.order - b.order)
}

export async function getNewsPosts(opts?: {
  publishedOnly?: boolean
  pageSize?: number
}): Promise<NewsPost[]> {
  const publishedOnly = opts?.publishedOnly ?? true
  if (db && isFirebaseConfigured) {
    try {
      const col = collection(db, 'newsPosts')
      const q = publishedOnly
        ? query(col, where('isPublished', '==', true), orderBy('createdAt', 'desc'), limit(opts?.pageSize ?? 50))
        : query(col, orderBy('createdAt', 'desc'), limit(opts?.pageSize ?? 50))
      const snap = await getDocs(q)
      if (!snap.empty) {
        return snap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            title: String(data.title ?? ''),
            contentHtml: sanitizeHtml(String(data.contentHtml ?? '')),
            thumbnail: String(data.thumbnail ?? ''),
            authorUid: String(data.authorUid ?? ''),
            createdAt: String(data.createdAt ?? ''),
            isPublished: Boolean(data.isPublished),
            viewCount: Number(data.viewCount ?? 0),
          } satisfies NewsPost
        })
      }
    } catch {
      // fall through to seed
    }
  }
  const list = seedNews.filter((n) => (publishedOnly ? n.isPublished : true))
  return list.slice(0, opts?.pageSize ?? list.length)
}

export async function getNewsPost(id: string): Promise<NewsPost | null> {
  if (db && isFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, 'newsPosts', id))
      if (snap.exists()) {
        const data = snap.data()
        return {
          id: snap.id,
          title: String(data.title ?? ''),
          contentHtml: sanitizeHtml(String(data.contentHtml ?? '')),
          thumbnail: String(data.thumbnail ?? ''),
          authorUid: String(data.authorUid ?? ''),
          createdAt: String(data.createdAt ?? ''),
          isPublished: Boolean(data.isPublished),
          viewCount: Number(data.viewCount ?? 0),
        }
      }
    } catch {
      // fall through
    }
  }
  return seedNews.find((n) => n.id === id) ?? null
}

export async function saveDocument(
  collectionName: string,
  id: string,
  data: Record<string, unknown>,
): Promise<void> {
  if (!db) throw new Error('Firebase가 설정되지 않았습니다.')
  const payload = { ...data }
  if (typeof payload.contentHtml === 'string') {
    payload.contentHtml = sanitizeHtml(payload.contentHtml)
  }
  await setDoc(doc(db, collectionName, id), payload, { merge: true })
}

export async function removeDocument(collectionName: string, id: string): Promise<void> {
  if (!db) throw new Error('Firebase가 설정되지 않았습니다.')
  await deleteDoc(doc(db, collectionName, id))
}
