# 대한예수교장로회 사랑하는교회 홈페이지

React + Vite + TypeScript + Firebase 기반 교회 공식 홈페이지.

- 기준 문서: `prd/The_사랑하는_교회_홈페이지_개발_PRD.md`
- 작업 체크리스트: `prd/todo.md`

## 스택

| 영역 | 기술 |
|------|------|
| 프론트 | React 19, Vite, TypeScript, Tailwind CSS v4, shadcn-style UI |
| 라우팅 | React Router (7 대메뉴 + 게시판 상세) |
| 백엔드 | Firebase Auth / Firestore / Storage / Hosting |
| SEO | react-helmet-async, sitemap.xml, robots.txt |
| 테스트 | Vitest + RTL, Playwright e2e |

## 시작하기

```bash
npm install
cp .env.example .env   # Firebase 웹 설정 입력
npm run dev
```

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입체크 + 프로덕션 빌드 |
| `npm test` | 단위 테스트 |
| `npm run e2e` | Playwright e2e (빌드 후) |
| `npx firebase deploy` | Hosting/Rules 배포 |

## 관리자

- 방문자 로그인/회원가입 없음
- 최고관리자 1 + 부관리자 최대 3 = 최대 4명
- 로그인 후 `admins/{uid}` 문서가 있을 때만 인라인 편집 모드 활성화
- 최초 super 시딩: `scripts/seed-super-admin.md`

## 공식 명칭

모든 노출 위치에서 **대한예수교장로회 사랑하는교회** 사용.
