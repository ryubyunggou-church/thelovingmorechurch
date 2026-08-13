# The 사랑하는 교회 홈페이지 — 개발 TODO

- 기준 문서: `The_사랑하는_교회_홈페이지_개발_PRD.md` (v1.0, 2026-08-12)
- 진행 방식: Phase 0(사전 셋업) → Phase 1(MVP) → Phase 2(콘텐츠 확장+게시판) → Phase 3(SEO/성능/QA)
- 테스트 코드는 **회귀 시 영향이 크거나 PRD에서 "핵심"으로 명시한 지점에만** 표시했다. 나머지 UI 컴포넌트는 우선 동작 구현에 집중한다.
- 체크박스는 완료 시 `[x]`로 표시하며 갱신한다.
- **코드 구현 기준 갱신일: 2026-08-12** (로컬 빌드/단위/e2e 통과). Firebase 실배포·super 시딩·실콘텐츠 입력은 운영 작업으로 잔여.

---

## Phase 0 — 프로젝트 초기 셋업

### 0-1. 저장소 / 프로젝트 초기화
- [x] React + TypeScript (Vite) 프로젝트 생성
- [x] Tailwind CSS 설치 및 크림/베이지+테라코타 톤 팔레트 등록
- [x] shadcn-style 기본 컴포넌트(Button, Dialog, Toast, Tabs, Input) 추가
- [x] ESLint(oxlint) 설정
- [x] 폴더 구조: `src/{pages, components, features, lib, hooks, types, store, data}`
- [x] `CONTRIBUTING.md`에 파일당 250~300줄 분리 규칙 명시
- [ ] GitHub private 레포 push / `main`·`dev` 브랜치 전략 (원격 권한 필요)

### 0-2. 라우팅 스켈레톤
- [x] React Router 라우트: `/`, `/about`, `/worship`, `/education`, `/missions`, `/news`, `/news/:id`, `/contact`
- [x] 라우트별 lazy load + `<Suspense>`
- [x] 404 페이지

### 0-3. Firebase 프로젝트
- [x] `src/lib/firebase.ts` SDK 초기화 + `.env` / `.env.example`
- [x] `firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules`
- [ ] Firebase Emulator Suite 로컬 구성 (선택)
- [x] `.gitignore`에 `.env`·시크릿 제외

### 0-4. 테스트/CI 파이프라인
- [x] Vitest + React Testing Library
  - [x] **테스트**: App 스모크
- [x] Playwright e2e 스모크
- [ ] GitHub Actions CI (원격 연동 후)

---

## Phase 1 — MVP

### 1-1. 공통 레이아웃
- [x] `<PageShell>`, `<Header>`, `<Footer>`, `<Breadcrumb>`, `<BackToTop>`
- [x] 공식 명칭 "대한예수교장로회 사랑하는교회" 적용
- [x] 협력기관 3곳(총회/남경기노회/GMS) Footer + 홈 카드 일치
- [x] `<TabbedPage>` + URL 비변경 테스트
- [x] `<ListPage>`

### 1-2. Firebase 연동 + 보안 규칙
- [x] `admins` 스키마 / Security Rules 초안 파일
- [x] 콘텐츠 읽기 공개 / 쓰기 admin 전용 규칙
- [ ] Emulator rules unit test (`@firebase/rules-unit-testing`)
- [ ] 최고관리자 시딩 실행 (`scripts/seed-super-admin.md` 참고 — 콘솔 1회)

### 1-3. 관리자 인증 + 인라인 편집
- [x] 로그인 모달 (이메일/비밀번호)
- [x] `admins/{uid}` 확인 후 `isAdminMode` (Zustand)
- [x] 연필 아이콘 → 인라인/모달 편집
- [x] 저장 후 미리보기 → 게시 2단계 (게시판·Hero 등)
- [x] alert 금지 / Toast·Dialog

### 1-3-1. 부관리자
- [x] 관리자 관리 UI (super 전용)
- [x] Cloud Functions 스텁 (`functions/src/index.ts`: addSubAdmin/removeSubAdmin/sanitize)
- [ ] Functions 실배포 + Blaze 플랜 연동

### 1-4 ~ 1-6. 콘텐츠 / 홈 / 서브페이지
- [x] heroSlides, siteSettings(시드), worshipSchedule, contactInfo, pastorGreeting CRUD 훅업
- [x] 홈 5섹션 (Hero/인사말/소식/바로가기1/협력기관)
- [x] 서브페이지 placeholder 레이아웃 7메뉴

### 1-7 ~ 1-8
- [x] 반응형 클래스 (모바일 햄버거, 1열 카드)
- [ ] `firebase deploy` 실배포 (계정 로그인 필요)

---

## Phase 2 — 확장 + 게시판

- [x] aboutTabs / staffMembers / educationDepartments / missions 편집 UI
- [x] newsPosts 목록(페이지네이션) + 상세 + 작성 모달
- [x] 클라이언트 DOMPurify sanitize + 단위 테스트
- [x] Functions 서버 sanitize 훅 스텁
- [ ] reCAPTCHA (문의폼 추가 시)
- [ ] Placeholder → 실제 교회 콘텐츠 입력 (발주자)

---

## Phase 3 — SEO / 성능 / QA

- [x] react-helmet-async title/OG (`{페이지} | 대한예수교장로회 사랑하는교회`)
- [x] sitemap.xml / robots.txt
- [x] 라우트 코드 스플리팅 / 이미지 lazy / 빌드 manualChunks
- [x] Playwright e2e 스모크 (홈/소식/탭)
- [ ] vite-plugin-prerender 또는 react-snap (배포 파이프라인에 추가 가능)
- [ ] 실기기 모바일 QA / Lighthouse
- [ ] 커스텀 도메인 www.TLMC.kr
- [ ] 관리자 사용 가이드 최종본 + 프로덕션 인수

---

*이 문서는 PRD와 함께 관리한다.*
