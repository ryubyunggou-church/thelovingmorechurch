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
import { SITE_NAME } from '../types/content'

export const seedSiteSettings: SiteSettings = {
  id: 'main',
  siteName: SITE_NAME,
  slogan: '옛 사람을 벗고 새사람을 입자',
  mottoLines: [
    '말씀으로 새롭게',
    '사랑으로 하나되어',
    '세상으로 보냄 받는 공동체',
  ],
  footerText: '그리스도의 사랑으로 이웃을 섬기는 교회',
  contact: {
    phone: '(02)453-7171',
    email: 'ryubyunggou@gmail.com',
    address: '02621 서울특별시 동대문구 전농로 20 (답십리동) 스타클래스 지상1층, 지하1층',
  },
}

export const seedHeroSlides: HeroSlide[] = [
  {
    id: 'hero-1',
    mediaUrl:
      'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    tag: '2026년 표어',
    title: '옛 사람을 벗고 새사람을 입자',
    subtitle: '에베소서 4:22-24 · 말씀으로 새롭게 되는 한 해',
    order: 1,
    isActive: true,
  },
  {
    id: 'hero-2',
    mediaUrl:
      'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    tag: '주일예배',
    title: '함께 예배하며 새 힘을 얻습니다',
    subtitle: '매주 주일 오전 11시 · 본당 예배',
    linkUrl: '/worship',
    order: 2,
    isActive: true,
  },
  {
    id: 'hero-3',
    mediaUrl:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    tag: '다음세대',
    title: '다음세대를 세우는 교회',
    subtitle: '유치부부터 청년가족부까지 · 말씀과 관계로 양육',
    linkUrl: '/education',
    order: 3,
    isActive: true,
  },
]

export const seedPastorGreeting: PastorGreeting = {
  id: 'main',
  photoUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
  pastorName: '유병구 목사',
  quote: '지친 마음은 주님께 내려놓고, 서로를 향해 따뜻한 위로와 격려를 건네는 믿음의 공동체가 되기를 소망합니다.',
  message:
    '사랑하는 교회 성도 여러분, 우리 주 예수 그리스도의 이름으로 평안의 인사를 드립니다. 삶의 무게와 예기치 못한 어려움 속에서도 주님의 은혜는 우리를 결코 떠나지 않으십니다. 지친 마음은 주님께 내려놓고, 서로를 향해 따뜻한 위로와 격려를 건네는 믿음의 공동체가 되기를 소망합니다. 우리 교회가 말씀 위에 굳게 서서 사랑으로 하나 되고, 기도로 서로를 붙들며, 복음의 기쁨을 삶으로 증거하는 교회가 되도록 함께 다짐합시다. 주님의 은혜와 평강이 여러분의 가정과 일터 위에 늘 충만하시기를 축복합니다.',
  updatedAt: new Date().toISOString(),
}

/** prd/images/2026년표어.png 내용 기준 시드 */
export const seedAnnualMotto: AnnualMotto = {
  id: 'main',
  year: undefined,
  motto: '옛 사람을 벗고 새사람을 입자!',
  scripture: '에베소서 4:22-24',
  practices: ['생각을 기도처럼!', '언행을 말씀처럼!', '이웃을 주님처럼!'],
  updatedAt: new Date().toISOString(),
}

export const seedWorship: WorshipScheduleItem[] = [
  { id: 'w1', name: '주일 오전예배', time: '오전 11:00', note: '본당', order: 1 },
  { id: 'w2', name: '주일 오후예배', time: '오후 2:00', note: '본당', order: 2 },
  { id: 'w3', name: '수요예배', time: '오후 7:30', note: '본당', order: 3 },
  { id: 'w4', name: '금요기도회', time: '오후 8:00', note: '본당', order: 4 },
  { id: 'w5', name: '새벽기도회', time: '오전 5:30', note: '월~토', order: 5 },
]

export const seedContact: ContactInfo = {
  id: 'main',
  address: '02621 서울특별시 동대문구 전농로 20 (답십리동) 스타클래스 지상1층, 지하1층',
  phone: '(02)453-7171',
  fax: '(02)453-7361',
  email: 'ryubyunggou@gmail.com',
  siteUrl: 'https://www.tlmc.kr',
  naverMapEmbedUrl:
    'https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EB%8F%99%EB%8C%80%EB%AC%B8%EA%B5%AC%20%EC%A0%84%EB%86%8D%EB%A1%9C%2020',
  routes: [
    {
      id: 'route-1',
      iconType: 'subway',
      title: '1호선·2호선',
      description: '신설동역 하차 → 도보 이동 (placeholder — 관리자 모드에서 실제 경로로 수정)',
      order: 1,
    },
    {
      id: 'route-2',
      iconType: 'bus',
      title: '간선버스',
      description: '전농로 인근 정류장 하차 (placeholder — 관리자 모드에서 실제 노선으로 수정)',
      order: 1,
    },
    {
      id: 'route-3',
      iconType: 'walk',
      title: '역에서 도보',
      description: '도보 약 10분 (placeholder — 관리자 모드에서 실제 경로로 수정)',
      order: 1,
    },
  ],
  parkingPhotos: [],
  parkingNotices: [
    '교회 주차장은 주일 예배 시간에 한해 이용 가능합니다. (placeholder)',
    '이중 주차 차량은 연락처를 남기고 기어를 중립에 두어 주세요. (placeholder)',
    '만차 시 인근 공영주차장 또는 대중교통을 이용해 주시기 바랍니다. (placeholder)',
  ],
}

export const seedAboutTabs: AboutTab[] = [
  {
    id: 'about-church',
    tabKey: 'church',
    title: '교회소개',
    content:
      '대한예수교장로회 사랑하는교회는 예수 그리스도의 십자가 복음을 중심으로, 예배·교육·선교·교제를 통해 하나님의 나라를 이 땅에 이루고자 합니다. (placeholder 콘텐츠 — 관리자 인라인 편집으로 교체)',
  },
  {
    id: 'about-pastor',
    tabKey: 'pastor',
    title: '담임목사소개',
    content:
      '담임목사 인사 및 약력 자리입니다. 실제 사진과 소개글은 관리자 모드에서 입력해 주세요.',
  },
  {
    id: 'about-staff',
    tabKey: 'staff',
    title: '사역자소개',
    content: '사역자 목록은 아래 카드에서 확인하실 수 있습니다.',
  },
]

/** /about 교회소개 — 전경 + 본문 placeholder */
export const seedAboutChurch: AboutChurch = {
  id: 'main',
  heroImageUrl:
    'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1600&q=80',
  title: '교회소개',
  body: `대한예수교장로회 사랑하는교회는 예수 그리스도의 십자가 복음을 중심으로, 예배·교육·선교·교제를 통해 하나님의 나라를 이 땅에 이루고자 합니다.

말씀 위에 굳게 서서 세대를 아우르는 공동체를 세우며, 이웃과 열방을 향해 열린 교회로 걸어갑니다.

(placeholder — 관리자 모드에서 교회전경 사진과 소개글을 수정할 수 있습니다.)`,
  updatedAt: new Date().toISOString(),
}

/** /about 담임목사소개 — 인물 + 학력/경력 placeholder */
export const seedAboutPastor: AboutPastor = {
  id: 'main',
  photoUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  name: '유병구 목사',
  title: '담임목사',
  education: [
    '○○대학교 신학과 졸업 (placeholder)',
    '○○신학대학원 M.Div. (placeholder)',
  ],
  career: [
    '○○교회 부목사 사역 (placeholder)',
    '대한예수교장로회 사랑하는교회 담임 (현재)',
  ],
  notes:
    '성도와 함께 말씀과 기도로 성장하는 공동체를 소망합니다. (placeholder — 관리자 편집으로 교체)',
  updatedAt: new Date().toISOString(),
}

export const seedStaff: StaffMember[] = [
  {
    id: 's1',
    name: '유병구',
    role: '담임목사',
    photoUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    order: 1,
  },
  {
    id: 's2',
    name: '이○○',
    role: '부목사',
    photoUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    order: 2,
  },
  {
    id: 's3',
    name: '박○○',
    role: '전도사',
    photoUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
    order: 3,
  },
  {
    id: 's4',
    name: '최○○',
    role: '교육전도사',
    photoUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    order: 4,
  },
]

/**
 * 관리자가 "부서 추가"로 새 부서를 만들 때 순환 배정되는 대표사진 후보군.
 * 실시간 키워드 검색 대신, 앱 내 다른 곳에서 이미 쓰고 있는 검증된 커뮤니티/사역 테마 사진을 재사용한다.
 */
export const educationPlaceholderImages: string[] = [
  'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
]

export const seedEducation: EducationDepartment[] = [
  {
    id: 'e1',
    deptKey: 'kindergarten',
    name: '유치부',
    missionText: `말씀과 놀이로 하나님을 처음 만나는 어린이 공동체입니다.

찬양·성경이야기·교제를 통해 주님의 사랑을 몸으로 익히고, 가정과 함께 믿음의 첫걸음을 돕습니다.

(placeholder — 관리자 모드에서 사진과 소개글을 수정할 수 있습니다.)`,
    image:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80',
    scheduleInfo: '주일 오전 11:00',
    targetAge: '만 3~7세',
    place: '유치부실',
    order: 1,
  },
  {
    id: 'e2',
    deptKey: 'elementary',
    name: '유초등부',
    missionText: `성경 이야기와 교제를 통해 믿음의 뿌리를 세우는 초등 공동체입니다.

말씀 암송과 소그룹으로 친구와 함께 예수님을 알아가며, 예배하는 아이로 자라도록 동행합니다.

(placeholder — 관리자 모드에서 사진과 소개글을 수정할 수 있습니다.)`,
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    scheduleInfo: '주일 오전 11:00',
    targetAge: '초등 1~6학년',
    place: '유초등부실',
    order: 2,
  },
  {
    id: 'e3',
    deptKey: 'youth',
    name: '중고등부',
    missionText: `청소년의 고민과 꿈을 말씀으로 품는 사역입니다.

주일 예배와 금요 모임에서 또래와 멘토가 함께 기도하고, 세상에서 그리스도인으로 서는 연습을 합니다.

(placeholder — 관리자 모드에서 사진과 소개글을 수정할 수 있습니다.)`,
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    scheduleInfo: '주일 오전 11:00 · 금요 모임',
    targetAge: '중·고등학생',
    place: '중고등부실',
    order: 3,
  },
  {
    id: 'e4',
    deptKey: 'youngadult',
    name: '청년가족부',
    missionText: `청년과 가정이 함께 성장하는 예배와 교제입니다.

말씀 나눔과 주중 소그룹으로 서로를 붙들고, 일터와 가정에서 복음을 살아내는 공동체를 꿈꿉니다.

(placeholder — 관리자 모드에서 사진과 소개글을 수정할 수 있습니다.)`,
    image:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    scheduleInfo: '주일 오후 · 주중 소그룹',
    targetAge: '청년·가정',
    place: '본당 / 소그룹',
    order: 4,
  },
]

/**
 * 관리자가 "사역 추가"로 새 사역을 만들 때 타입별로 순환 배정되는 대표사진 후보군.
 * 국내/해외는 사진 톤이 뚜렷이 달라 하나로 합치지 않고 타입별 풀을 따로 둔다.
 */
export const missionPlaceholderImages: Record<'domestic' | 'overseas', string[]> = {
  domestic: [
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
  ],
  overseas: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
  ],
}

export const seedMissions: MissionItem[] = [
  {
    id: 'm1',
    type: 'domestic',
    name: '국내 이웃 섬김',
    description:
      '동대문구 인근 이웃과 함께하는 나눔·돌봄 사역입니다. 필요를 나누고 기도로 동행합니다. (placeholder)',
    order: 1,
    region: '서울 동대문구',
    image:
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'm2',
    type: 'domestic',
    name: '국내 미자립 교회 후원',
    description:
      '동역 교회를 후원하고 기도 네트워크로 연결하는 사역입니다. (placeholder)',
    order: 2,
    region: '국내 동역',
    image:
      'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'm3',
    type: 'overseas',
    name: '해외 선교지 A',
    description:
      '파송 선교사와 현지 사역을 후원하고 중보하는 선교지입니다. (placeholder)',
    order: 1,
    region: '동남아시아',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'm4',
    type: 'overseas',
    name: '해외 선교지 B',
    description: '단기 선교와 중보 기도로 함께하는 선교지입니다. (placeholder)',
    order: 2,
    region: '중앙아시아',
    image:
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
  },
]

/**
 * 관리자가 "새 글 작성" 시 Date.now() 기준으로 순환 배정되는 썸네일 후보군.
 * 뉴스는 부서/사역처럼 고정 카테고리가 없어 시각 기준으로만 순환한다.
 */
export const newsPlaceholderImages: string[] = [
  'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
]

export const seedNews: NewsPost[] = [
  {
    id: 'n1',
    title: '2026년 표어 선포 예배 안내',
    contentHtml:
      '<p>새해 표어 <strong>옛 사람을 벗고 새사람을 입자</strong>를 선포하는 예배가 진행됩니다.</p>',
    thumbnail:
      'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=600&q=80',
    authorUid: 'seed',
    createdAt: '2026-01-05T00:00:00.000Z',
    isPublished: true,
    viewCount: 42,
  },
  {
    id: 'n2',
    title: '다음세대 여름성경학교 모집',
    contentHtml: '<p>유치부·유초등부 여름성경학교 신청을 받습니다.</p>',
    thumbnail:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80',
    authorUid: 'seed',
    createdAt: '2026-02-10T00:00:00.000Z',
    isPublished: true,
    viewCount: 28,
  },
  {
    id: 'n3',
    title: '선교 헌신 주일 안내',
    contentHtml: '<p>국내·국외 선교 사역을 위한 헌신 주일을 드립니다.</p>',
    thumbnail:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
    authorUid: 'seed',
    createdAt: '2026-03-01T00:00:00.000Z',
    isPublished: true,
    viewCount: 19,
  },
]
