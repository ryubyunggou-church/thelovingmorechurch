import type {
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

export const seedStaff: StaffMember[] = [
  {
    id: 's1',
    name: '김○○',
    role: '담임목사',
    photoUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    order: 1,
  },
  {
    id: 's2',
    name: '이○○',
    role: '부목사',
    photoUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    order: 2,
  },
  {
    id: 's3',
    name: '박○○',
    role: '전도사',
    photoUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    order: 3,
  },
]

export const seedEducation: EducationDepartment[] = [
  {
    id: 'e1',
    deptKey: 'kindergarten',
    name: '유치부',
    missionText: '말씀과 놀이로 하나님을 알아가는 어린이 공동체',
    image:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
    scheduleInfo: '주일 오전 11:00',
  },
  {
    id: 'e2',
    deptKey: 'elementary',
    name: '유초등부',
    missionText: '성경 이야기와 교제를 통해 믿음의 뿌리를 세웁니다',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    scheduleInfo: '주일 오전 11:00',
  },
  {
    id: 'e3',
    deptKey: 'youth',
    name: '중고등부',
    missionText: '청소년의 고민과 꿈을 말씀으로 품는 사역',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    scheduleInfo: '주일 오전 11:00 · 금요 모임',
  },
  {
    id: 'e4',
    deptKey: 'youngadult',
    name: '청년가족부',
    missionText: '청년과 가정이 함께 성장하는 예배와 교제',
    image:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    scheduleInfo: '주일 오후 · 주중 소그룹',
  },
]

export const seedMissions: MissionItem[] = [
  {
    id: 'm1',
    type: 'domestic',
    name: '국내 이웃 섬김',
    description: '지역 사회 나눔과 돌봄 사역 (placeholder)',
    order: 1,
  },
  {
    id: 'm2',
    type: 'domestic',
    name: '국내 미자립 교회 후원',
    description: '동역 교회 지원 및 기도 네트워크 (placeholder)',
    order: 2,
  },
  {
    id: 'm3',
    type: 'overseas',
    name: '해외 선교지 A',
    description: '선교사 파송 및 후원 사역 소개 (placeholder)',
    order: 1,
  },
  {
    id: 'm4',
    type: 'overseas',
    name: '해외 선교지 B',
    description: '단기 선교 및 중보 기도 사역 (placeholder)',
    order: 2,
  },
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
