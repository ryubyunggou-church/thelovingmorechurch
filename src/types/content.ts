export type AdminRole = 'super' | 'sub'

export interface AdminDoc {
  uid: string
  email: string
  role: AdminRole
  invitedBy?: string
  createdAt: string
}

export interface HeroSlide {
  id: string
  mediaUrl: string
  /** image | mp4/webm file | youtube watch/embed/youtu.be URL */
  mediaType: 'image' | 'video' | 'youtube'
  tag: string
  title: string
  subtitle: string
  linkUrl?: string
  order: number
  isActive: boolean
}

export interface SiteSettings {
  id: string
  siteName: string
  slogan: string
  mottoLines: string[]
  footerText: string
  contact: {
    phone: string
    email: string
    address: string
  }
}

export interface PastorGreeting {
  id: string
  photoUrl: string
  message: string
  pastorName: string
  /** Pull-quote. 없으면 message 첫 문장 사용 */
  quote?: string
  updatedAt: string
}

/** 홈 밴드 — 연간 표어 (타이포) */
export interface AnnualMotto {
  id: string
  /** 비우면 현재 연도 표시 */
  year?: number
  motto: string
  scripture: string
  practices: string[]
  updatedAt: string
}

export interface AboutTab {
  id: string
  tabKey: 'church' | 'pastor' | 'staff'
  title: string
  content: string
}

/** /about 교회소개 탭 */
export interface AboutChurch {
  id: string
  heroImageUrl: string
  title: string
  body: string
  updatedAt: string
}

/** /about 담임목사소개 탭 */
export interface AboutPastor {
  id: string
  photoUrl: string
  name: string
  title: string
  education: string[]
  career: string[]
  notes: string
  updatedAt: string
}

export interface StaffMember {
  id: string
  name: string
  role: string
  photoUrl: string
  order: number
}

export interface WorshipScheduleItem {
  id: string
  name: string
  time: string
  note: string
  order: number
}

export interface EducationDepartment {
  id: string
  /** 삭제 불가 기본 부서는 'elementary'|'youth'|'youngadult', 관리자가 추가한 부서는 'custom_…' */
  deptKey: string
  name: string
  missionText: string
  image: string
  scheduleInfo: string
  /** 탭 정렬 순서. 기본 3부서는 1~3 고정, 추가 부서는 뒤에 이어붙음 */
  order: number
  /** 대상 연령·학년. 비우면 칩 숨김 */
  targetAge?: string
  /** 모임 장소. 비우면 칩 숨김 */
  place?: string
}

export interface MissionItem {
  id: string
  type: 'domestic' | 'overseas'
  name: string
  description: string
  order: number
  /** 지역·권역 라벨 */
  region?: string
  /** 대표 사진. 없으면 플레이스홀더 */
  image?: string
}

export interface NewsPost {
  id: string
  title: string
  contentHtml: string
  thumbnail: string
  authorUid: string
  createdAt: string
  isPublished: boolean
  viewCount?: number
}

/** 남경기노회 문서함 — 노회↔교회 문서 수발신 방향 */
export type PresbyteryDocDirection = 'inbound' | 'outbound'
export type PresbyteryDocFileType = 'pdf' | 'other'

export interface PresbyteryDocument {
  id: string
  title: string
  direction: PresbyteryDocDirection
  fileType: PresbyteryDocFileType
  fileUrl: string
  fileName: string
  uploadedBy: string
  uploadedAt: string
  /** 수신(inbound) 문서에만 의미 있음 */
  isRead: boolean
  note?: string
}

/** 오시는길 "오시는 방법" 경로 안내 아이콘 종류 */
export type RouteIconType = 'subway' | 'bus' | 'walk'

/**
 * 오시는길 경로 안내 항목. 지하철/버스처럼 교통 인프라별 고정 분류 대신
 * 범용 리스트로 모델링해, 이전(이사) 시에도 스키마 변경 없이 대응한다.
 */
export interface ContactRoute {
  id: string
  iconType: RouteIconType
  /** 예: "분당선·신분당선", "1303 (안양방면)" */
  title: string
  description: string
  order: number
}

export interface ContactInfo {
  id: string
  address: string
  phone: string
  fax: string
  email: string
  siteUrl: string
  /** 지도 캡처 이미지 (MVP — API 지도 임베드 대신 관리자가 업로드) */
  mapImageUrl: string
  /** 지도 이미지 클릭 시 이동할 외부 지도 링크. 선택 */
  mapLinkUrl?: string
  routes: ContactRoute[]
  /** 주차안내 사진. 최대 2장 */
  parkingPhotos: string[]
  /** 주차 요령 안내 문구. 한 줄 = 한 항목 */
  parkingNotices: string[]
}

export const SITE_NAME = '대한예수교장로회 사랑하는교회'
/** 브라우저 탭 타이틀 전용 축약 브랜딩 — 로고 alt·저작권 문구 등에는 쓰지 않는다 */
export const SITE_TITLE = '사랑하는교회|예장합동'

export const PARTNER_LINKS = [
  { label: '대한예수교장로회 총회', href: 'https://gapck.org' },
  { label: '남경기노회', href: 'http://남경기노회.kr' },
  { label: 'GMS 총회세계선교회', href: 'https://gms.kr' },
] as const

export type PopupPosition = 'top' | 'center' | 'center-left' | 'center-right'
export type PopupContentType = 'image' | 'pdf' | 'richtext'

export interface SitePopup {
  id: string
  /** 관리자 목록에 표시되는 내부 식별용 이름. 방문자에게는 안 보임. */
  label: string
  enabled: boolean

  /** ISO date string (YYYY-MM-DD). 이 범위 안에서만 노출. */
  startDate: string
  endDate: string

  contentType: PopupContentType
  /** image/pdf일 때 Storage 다운로드 URL */
  mediaUrl?: string
  /** richtext일 때 본문. WYSIWYG 에디터가 만든 HTML — 저장/조회 시 DOMPurify로 sanitize. */
  contentHtml?: string
  /** 팝업 상단 제목 (선택) */
  title?: string
  /** 클릭 시 이동할 링크 (선택) */
  linkUrl?: string

  position: PopupPosition
  /** 여러 팝업이 동시에 활성 기간일 때 순차 노출 순서. 숫자가 클수록 먼저 뜬다. */
  priority: number
  /** "오늘 하루 보지 않기" 재노출 억제 기간(시간 단위). 0이면 매 방문마다 노출. */
  hideForHours: number

  createdAt: string
  updatedAt: string
}

export const NAV_ITEMS = [
  { label: 'HOME', path: '/' },
  { label: '교회소개', path: '/about' },
  { label: '예배안내', path: '/worship' },
  { label: '교육부서', path: '/education' },
  { label: '선교사역', path: '/missions' },
  { label: '교회소식', path: '/news' },
  { label: '오시는길', path: '/contact' },
] as const
