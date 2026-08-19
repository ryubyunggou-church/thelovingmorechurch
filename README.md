# 대한예수교장로회 사랑하는교회 홈페이지

React + Vite + TypeScript + Firebase 기반 교회 공식 홈페이지. 방문자 회원가입 없이 최고관리자
1명 + 부관리자 최대 3명이 사이트 전체를 인라인 편집하는 구조입니다.

- 기준 문서: `prd/The_사랑하는_교회_홈페이지_개발_PRD.md`
- 작업 체크리스트: `prd/todo.md`
- 커밋 이력(수동 동기화): `prd/COMMIT_HISTORY.md`
- 기능 구현 계획서: `prd/documents/`

## 저장소 & 배포 정보

| 항목 | 값 |
|---|---|
| GitHub 저장소 | https://github.com/ryubyunggou-church/thelovingmorechurch |
| 기본 브랜치 | `main` |
| Firebase 프로젝트 ID | `tlmchurch` |
| Firebase 콘솔 | https://console.firebase.google.com/project/tlmchurch/overview |
| Hosting 배포 주소 | https://tlmchurch.web.app |
| CI/CD | 배포는 **수동** (`npx firebase deploy` 또는 Actions `workflow_dispatch`). PR 미리보기 채널 워크플로우는 유지 (`.github/workflows/`) |

## 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React 19, Vite, TypeScript, Tailwind CSS v4 |
| UI 컴포넌트 | Radix UI(Dialog/Tabs/Dropdown/Toast/Tooltip 등) 기반 shadcn 스타일 커스텀 컴포넌트 |
| 라우팅 | React Router 7 (HOME/교회소개/예배안내/교육부서/선교사역/교회소식/오시는길 7개 대메뉴 + 상세 라우트) |
| 상태 관리 | Zustand (관리자 세션·토스트·모달 오픈 상태) |
| 리치 텍스트 에디터 | Tiptap (WYSIWYG, 팝업 콘텐츠 입력용, 관리자 전용 지연 로드) |
| 백엔드 | Firebase Auth / Firestore / Storage / Hosting / Cloud Functions (2세대) |
| HTML Sanitize | DOMPurify — 클라이언트(`lib/sanitize.ts`) + 서버(Cloud Function `sanitizeNewsOnWrite`) 이중 처리 |
| 이미지 최적화 | 업로드 전 브라우저 Canvas API로 자동 리사이즈 + WebP 재인코딩 (외부 의존성 없음, `lib/image-compress.ts`) |
| SEO | react-helmet-async, `public/sitemap.xml`, `public/robots.txt` |
| 테스트 | Vitest + React Testing Library(단위/컴포넌트), Playwright(e2e) |
| Lint | oxlint |
| CI/CD | GitHub Actions (`google-github-actions/auth` + `FirebaseExtended/action-hosting-deploy`) |

## 주요 기능

- **HOME**: Hero 슬라이드 캐러셀 — 관리자 모드에서 "관리로 이동" 진입 시 목록형 관리 패널에서
  슬라이드 추가/편집/삭제 및 드래그 앤 드롭 순서변경 가능. 하단 협력기관은 호버/선택 카드만
  확대되며 카드별 진한 파스텔 플레이트(총회·노회·GMS)로 선택 상태를 구분한다.
  (HOME 시각 파일럿 기록: `prd/experiments/home-ui-ux-pro-max.md`)
- **Footer**: 2열 — 연락처 | 바로가기 5개(예배안내·교육부서·선교사역·오시는길·교회소식, 2열 배열). 링크 호버 언더바는 Topbar와 동일.
- **교회소개 / 예배안내 / 교육부서 / 선교사역 / 오시는길**: 탭 기반 페이지, 관리자 모드에서
  각 섹션 인라인 편집(연필 아이콘) 또는 별도 관리 탭(부서·사역 추가/삭제/이름 수정)으로 운영.
- **교회소식**: 게시판형 뉴스 — 작성/수정/삭제, 리치텍스트(HTML) 본문, 목록 카드 썸네일 자동
  배정.
- **사이트 팝업**: 날짜 지정 노출(시작일~종료일), 콘텐츠 타입(이미지/PDF/일반 텍스트-WYSIWYG),
  노출 위치(상단/중앙/중앙좌/중앙우) 및 우선순위, 여러 팝업 활성 시 스택형 순차 노출(뒤 팝업
  블러 미리보기), 모바일에서는 비노출. Header의 "팝업 관리" 버튼(전체 관리자)에서 표 형태로
  CRUD.
- **관리자 시스템**: Firebase Auth 이메일/비밀번호 로그인, Firestore `admins/{uid}` 문서
  존재 시에만 관리자 모드 활성화. 로그인 이메일 기억하기(localStorage), 로그인 완료 시 자동
  페이지 상단 스크롤. 최고관리자만 부관리자(최대 3명) 초대/해제 가능.
- **이미지 업로드 파이프라인**: 모든 관리자 업로드 모달이 공용 `uploadMediaFile()`을 거치므로,
  업로드 직전 자동 리사이즈(긴 변 1600px)·WebP 압축이 전역 적용됨. GIF·SVG는 원본 유지.

## 폴더 구조

```
src/
  pages/          라우트별 페이지 (HomePage, AboutPage, WorshipPage, ...)
  features/       도메인별 UI + 편집 로직 (hero, education, missions, news, popup, admin, ...)
  components/     공용 UI(ui/*, shared/*)·레이아웃(layout/*)
  lib/            Firebase 연동, 콘텐츠 CRUD(content-service.ts), 순수 로직(*-list.ts 등)
  store/          Zustand 스토어 (admin-store.ts)
  hooks/          커스텀 훅
  types/          도메인 타입 (content.ts)
functions/        Cloud Functions (Node 24, TypeScript) — sanitizeNewsOnWrite, addSubAdmin 등
prd/              기획/계획 문서, 커밋 이력
scripts/          운영 스크립트 문서 (super admin 시딩 절차 등)
```

## 시작하기

```bash
npm install
cp .env.example .env   # Firebase 웹 설정 값 입력 (Firebase 콘솔 > 프로젝트 설정 > 웹 앱)
npm run dev
```

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (Vite) |
| `npm run build` | 타입체크(`tsc -b`) + 프로덕션 빌드 |
| `npm run lint` | oxlint |
| `npm test` | Vitest 단위/컴포넌트 테스트 |
| `npm run test:watch` | Vitest watch 모드 |
| `npm run e2e` | 빌드 후 Playwright e2e |
| `npx firebase deploy` | Hosting/Rules/Functions 배포 (아래 배포 섹션 참고) |

## 배포

**수동 배포만 사용** — `main` push 시 자동 배포는 비활성입니다. Hosting/Rules 등은 로컬에서
직접 배포하거나, GitHub Actions의 `Deploy to Firebase (manual)` 워크플로우를
`workflow_dispatch`로 실행합니다. PR을 열면 Hosting 미리보기 채널은 기존처럼 생성될 수
있습니다(시크릿 `FIREBASE_SERVICE_ACCOUNT` 필요).

**로컬 수동 배포**

```bash
npm run build
npx firebase deploy --only hosting --project tlmchurch

# Rules / Storage까지 함께
npx firebase deploy --only hosting,firestore:rules,firestore:indexes,storage --project tlmchurch

# Functions — Blaze(종량제) 요금제 전환 필요
cd functions && npm install && npm run build && cd ..
npx firebase deploy --only functions --project tlmchurch
```

## 관리자

- 방문자 로그인/회원가입 없음.
- 최고관리자 1 + 부관리자 최대 3 = 최대 4명.
- 로그인 후 Firestore `admins/{uid}` 문서가 있을 때만 인라인 편집 모드 활성화 (문서 ID는 Firebase
  Auth UID와 동일해야 함).
- 최초 super 관리자 시딩 절차: `scripts/seed-super-admin.md` 참고.
- Header 우측 버튼: "관리자 관리"(super 전용, 부관리자 초대/해제) · "팝업 관리"(전체 관리자).

## 환경 변수

`.env`는 커밋하지 않습니다(`.gitignore` 처리됨). `.env.example`을 복사해 아래 값을 채우세요 —
Firebase 콘솔 > 프로젝트 설정 > 일반 > 내 앱(웹)에서 확인 가능합니다.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=tlmchurch.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tlmchurch
VITE_FIREBASE_STORAGE_BUCKET=tlmchurch.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=842957606460
VITE_FIREBASE_APP_ID=
```

`apiKey` 등 위 값들은 Firebase 웹 SDK 설정으로 공개되어도 안전합니다(실제 보안은 Firestore/
Storage Rules가 담당). 반면 서비스 계정 JSON 키, `prd/github-firebase-info.txt`(계정 비밀번호
등 로컬 참고 메모)는 절대 커밋/공유하지 않습니다.

## 공식 명칭

모든 노출 위치에서 **대한예수교장로회 사랑하는교회** 사용.
