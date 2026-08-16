# 사이트 팝업(PopUp) 기능 구현 계획서

- 작성일: 2026-08-16
- 대상 저장소: `thelovingmorechurch` (tlmchurch)
- 상태: **확정 — `feat/site-popup` 브랜치에서 구현 진행 중**

## 0. 확정 사항 (사용자 승인, 2026-08-16)

| # | 항목 | 결정 |
|---|---|---|
| 1 | 관리 목록 UI | 카드 목록이 아닌 **표(table)** 형태 + 행별 「삭제」 버튼 |
| 2 | PDF MIME | `storage.rules`에 `application/pdf` 허용 추가 |
| 3 | 팝업 관리 권한 | **전체 관리자**(super + sub 모두) 접근 가능 |
| 4 | 동시 활성 팝업 | **순차 노출** — 하나를 닫으면 다음 우선순위 팝업이 이어서 노출 |
| 5 | 모바일 | 팝업 기능 자체를 **비활성화**(렌더링 안 함) |

아래 §3~§9는 위 결정을 반영해 갱신되었다.

## 1. 배경 및 목표

현재 사이트는 공지사항을 "교회소식(News)" 게시판으로만 노출한다. 특정 기간에만 보여야 하는
긴급 공지·행사 안내·PDF 주보 등을 방문 즉시 시각적으로 알리는 수단이 없다. 이를 위해
**날짜 지정 노출 + 다중 콘텐츠 타입 + 위치/레이어 옵션을 갖춘 사이트 전역 팝업 기능**을
구현한다.

요구사항 원문 매핑:

| # | 요구사항 | 본 문서 섹션 |
|---|---|---|
| 1 | 날짜 지정 | §3 데이터 모델 (`startDate`/`endDate`) |
| 2 | 이미지/PDF/MD 자동 렌더링 | §4 콘텐츠 타입별 렌더링 전략 |
| 3 | 텍스트 에디터(기본 옵션 포함) | §4-C |
| 4 | 위치 옵션 + 레이어 우선순위 | §5 노출 위치·우선순위 |
| 5 | 현대적 디자인(최신 UX 리서치 반영) | §6 UX 설계 근거 |
| 6 | 관리자 진입 탭 위치 | §7 관리자 진입점 |

## 2. 기존 코드베이스와의 정합성 (조사 결과)

- **공용 콘텐츠 CRUD**: `src/lib/content-service.ts`의 `fetchCollection<T>()` / `saveDocument()` /
  `removeDocument()`를 그대로 재사용한다. 새 컬렉션 하나(`sitePopups`)만 추가하면 된다.
- **이미지 업로드**: `src/components/shared/MediaInputField.tsx` → `src/lib/storage-upload.ts`의
  `uploadMediaFile()`을 그대로 재사용. 최근 구현된 **업로드 전 자동 리사이즈+WebP 압축**이
  팝업 이미지에도 자동 적용된다 (추가 작업 불필요).
- **전역 모달 마운트 지점**: `App.tsx`가 `<LoginModal/>`, `<AdminManageModal/>`,
  `<ToastViewport/>`를 라우트와 무관하게 최상단에 상시 마운트하고 있다. 팝업도 이 자리에
  `<PopupRenderer/>`로 추가하면 **어느 페이지에서 접속하든 동일하게 노출**된다 — 페이지별
  구현이 필요 없다.
- **관리자 전역 액션 버튼 패턴**: `Header.tsx`가 super 관리자에게만 "관리자 관리" 버튼을
  노출하고, 클릭 시 `admin-store`의 `adminManageOpen` 플래그로 `AdminManageModal`을 연다.
  팝업 관리도 동일 패턴(`popupManageOpen`)을 그대로 따른다 — §7에서 상세.
- **접근성 인프라 무료 확보**: 프로젝트가 이미 쓰는 `@radix-ui/react-dialog` 기반
  `components/ui/dialog.tsx`는 포커스 트랩·`role="dialog"`/`aria-modal`·Escape 닫기·포커스
  복원을 기본 제공한다. 팝업도 새 오버레이를 직접 구현하지 않고 **이 Dialog를 재사용**하면
  §6에서 조사한 접근성 요구사항을 별도 구현 없이 충족한다.
- **HTML 새니타이즈 관행**: 뉴스(`newsPosts.contentHtml`)는 `DOMPurify`(client: `lib/sanitize.ts`,
  server: Cloud Function `sanitizeNewsOnWrite`)로 이중 새니타이즈한다. 팝업 텍스트는 §4-C에서
  보듯 **Markdown으로 저장**하고 `react-markdown`으로 렌더링할 계획이라, `dangerouslySetInnerHTML`
  자체를 안 쓰게 되어 이 클래스의 위험이 원천적으로 사라진다 (뉴스보다 더 안전한 설계).

## 3. 데이터 모델

### 3.1 Firestore 컬렉션: `sitePopups`

```ts
export interface SitePopup {
  id: string
  /** 관리자 목록에 표시되는 내부 식별용 이름. 방문자에게는 안 보임. */
  label: string
  enabled: boolean

  /** ISO date string (YYYY-MM-DD). 이 범위 안에서만 노출. */
  startDate: string
  endDate: string

  contentType: 'image' | 'pdf' | 'markdown'
  /** image/pdf일 때 Storage 다운로드 URL */
  mediaUrl?: string
  /** markdown일 때 본문 (react-markdown으로 렌더) */
  markdownBody?: string
  /** 팝업 상단 제목 (선택) */
  title?: string
  /** 클릭 시 이동할 링크 (선택, 이미지/PDF 썸네일에도 적용) */
  linkUrl?: string

  position: 'center' | 'top' | 'bottom-sheet' | 'corner-br' | 'corner-bl'
  /** 여러 팝업이 동시에 활성 기간일 때 표시 순서/레이어 우선순위. 숫자가 클수록 위. */
  priority: number

  /** "오늘 하루 보지 않기" 재노출 억제 기간(시간 단위). 0이면 매 방문마다 노출. */
  hideForHours: number

  createdAt: string
  updatedAt: string
}
```

### 3.2 Firestore Rules 추가안 (`firestore.rules`)

기존 컬렉션과 동일한 패턴(공개 읽기, 관리자만 쓰기)을 그대로 따른다.

```
match /sitePopups/{id} {
  allow read: if true;
  allow write: if isAdmin();
}
```

## 4. 콘텐츠 타입별 렌더링 전략

세 가지 타입 모두 **새 외부 의존성을 최소화**하는 방향으로 설계했다 (이번 세션에서 이미지
압축 기능을 붙일 때도 유지보수가 끊긴 라이브러리를 피하고 네이티브 API를 우선한 것과 같은
기준).

### 4-A. 이미지

기존 `MediaInputField`(imageOnly) + `uploadMediaFile()` 그대로 사용. 추가 구현 없음.
렌더링은 `<img>` + `linkUrl`이 있으면 `<a>`로 감싸는 정도.

### 4-B. PDF

**`<object type="application/pdf">` (네이티브 브라우저 뷰어) 채택, PDF.js 등 전용 라이브러리는
도입하지 않는다.** 데스크톱 Chrome/Edge/Safari/Firefox는 모두 PDF를 네이티브 렌더링한다.
모바일 브라우저 일부(구형 Android WebView 등)는 인라인 렌더링을 지원하지 않을 수 있으므로,
`<object>`의 폴백 콘텐츠로 "새 탭에서 PDF 열기" 링크 버튼을 함께 제공해 실패 시에도 접근
가능하게 한다. 업로드는 `MediaInputField`를 확장해 `accept="application/pdf"` 모드를 추가한다
(`storage.rules`가 이미 `image/.*`만 허용하므로, PDF 허용을 위해 **`storage.rules`에
`application/pdf` MIME 타입 추가 필요** — §9 오픈 이슈에 반영).

### 4-C. Markdown (텍스트 에디터 겸용)

**`@uiw/react-md-editor`(4.6KB gzip, textarea 기반, CodeMirror/Monaco 등 무거운 에디터
의존성 없음) 도입을 제안한다.** 이 라이브러리 하나로 요구사항 2번(MD 자동 렌더링)과 3번(기본
옵션 포함 텍스트 에디터)을 동시에 만족한다:

- 관리자 입력: 볼드/이탤릭/링크/제목/목록 등 **기본 툴바 버튼 포함** 에디터 + 실시간 미리보기.
  이 편집 UI는 관리자만 접근하므로 번들 크기를 이유로 기능을 아끼지 않고, `PopupEditor.tsx`에서
  동적 import(`import('@uiw/react-md-editor')`)로 불러와 **일반 방문자 번들에는 포함되지
  않도록** 한다 (Storage SDK를 지연 로드한 것과 같은 원칙).
- 방문자 렌더링(공개 사이트)은 `@uiw/react-md-editor`의 내장 미리보기 엔진을 그대로 쓰지
  **않고**, 별도로 **`react-markdown` + `remark-gfm`만** 사용한다. 이유: `@uiw/react-md-editor`가
  내부적으로 쓰는 미리보기 패키지(`@uiw/react-markdown-preview`)는 `rehype-raw`를 포함해
  마크다운 안에 섞인 **원본 HTML을 그대로 실행**한다 (관리자 입력 미리보기 용도로는 편리하지만,
  방문자에게 나가는 최종 렌더링에 그대로 쓰면 XSS 표면이 다시 열린다). `react-markdown`은
  `rehype-raw`를 추가하지 않는 한 마크다운에 섞인 HTML을 **텍스트로 이스케이프**하는 게
  기본값이라, 이 기본 동작만으로 안전하다 — `dangerouslySetInnerHTML`도, DOMPurify도
  필요 없다.
- 뉴스 에디터(`NewsEditorForm.tsx`)의 "raw HTML을 textarea에 직접 입력" 방식과는 다른
  접근이라, 두 에디터의 UX가 갈리는 점은 감수한다 — 뉴스는 기존 사용 패턴을 건드리지 않고,
  팝업만 새 표준으로 시작한다.

## 5. 노출 위치·우선순위 로직

- `position` 5종(중앙/상단/하단시트/우하단 코너/좌하단 코너)은 **데스크톱에서만** 의미를
  가진다 — §5-A 참고. 팝업 자체가 모바일에서 렌더링되지 않으므로 `bottom-sheet` 옵션은 현재
  실질적으로 쓰이지 않지만, 추후 모바일을 다시 켤 가능성을 대비해 타입에는 남겨둔다.
- 여러 팝업이 동시에 활성 기간(`startDate`~`endDate`)에 걸쳐 있을 수 있음. **한 번에 하나만
  화면에 띄우되(팝업 스팸 방지), 닫으면 다음 우선순위 팝업이 바로 이어서 뜨는 "순차 노출"**로
  확정했다 (§0-4). `PopupRenderer`는 활성 팝업들을 `priority` 내림차순(동률이면 `updatedAt`
  최신순)으로 정렬한 큐를 만들고, 방문자가 하나를 닫을 때마다 큐의 다음 항목을 즉시 표시한다.
  큐를 모두 소진하면(=`hideForHours` 내 다시 안 봄) 더 이상 아무것도 뜨지 않는다.
- 코너 팝업(`corner-br`/`corner-bl`)은 다른 UI(뒤로가기 버튼 `BackToTop` 등)와 겹치지 않도록
  z-index와 위치를 조정 필요 — 구현 시 `BackToTop.tsx` 위치 확인.

### 5-A. 모바일 비활성화

`(max-width: 767px)` 뷰포트(Tailwind `md` 미만, 기존 `usePrefersReducedMotion` 훅과 동일한
`matchMedia` 패턴으로 `useIsMobileViewport` 훅을 신설)에서는 `PopupRenderer`가 아예 아무것도
렌더링하지 않는다. 관리자 화면(`PopupManageModal`/`PopupEditor`)은 모바일에서도 정상 동작 —
비활성화 대상은 **방문자에게 노출되는 팝업 그 자체**뿐이다.

## 6. UX 설계 근거 (2026년 리서치 반영)

웹 검색으로 확인한 현재(2026년) 팝업/모달 UX 권장사항을 다음과 같이 반영한다.

1. **노출 트리거**: 첫 페이지 방문 즉시 노출보다 "약간의 지연 후 노출"이 권장되나, 공지성
   팝업의 목적상 **즉시 노출 + 부드러운 진입 애니메이션**으로 절충한다 (교회 공지는 프로모션
   팝업과 목적이 달라 전환율 최적화형 지연 트리거가 불필요).
2. **닫기 동작**: 닫기 버튼을 항상 명확히 노출, 배경 클릭(light dismiss)과 Escape 키 모두
   지원 — Radix Dialog 기본 동작으로 이미 충족.
3. **문구**: 관리자 입력 가이드에 "제목 6~10단어, 본문 2줄 이내 권장" 힌트 텍스트를 넣어
   과도하게 긴 팝업을 방지한다.
4. **재노출 억제**: `hideForHours` 필드 + 방문자 로컬(`localStorage`, 팝업 id별 마지막 닫은
   시각 저장)로 "오늘 하루 보지 않기" 구현. 서버 상태 없이 클라이언트에서만 처리(로그인 불필요
   사이트 특성상 적절).
5. **접근성**: §2에서 확인한 대로 기존 `Dialog` 컴포넌트 재사용으로 포커스 트랩·ARIA 속성·
   포커스 복원을 별도 구현 없이 확보.

Sources:
- [Mobile Popup Best Practices for 2026: UX, SEO, and Conversion Rules](https://www.poptin.com/blog/mobile-popup-best-practices/)
- [Popup UI: Best Practices & Design Inspiration For 2026](https://www.eleken.co/blog-posts/popup-ui)
- [Popups: 10 Problematic Trends and Alternatives - NN/G](https://www.nngroup.com/articles/popups/)
- [How to Build Accessible Modals with Focus Traps (2026 Guide) | UXPin](https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/)
- [Modals, Dialogs, and Accessibility | DubBot](https://dubbot.com/dubblog/2026/modals-dialogs-and-accessibility.html)
- [@uiw/react-md-editor - npm](https://www.npmjs.com/package/@uiw/react-md-editor)

## 7. 관리자 진입점 위치

팝업은 Hero/교육부서처럼 특정 페이지에 속한 콘텐츠가 아니라 **사이트 전역 설정**이다. 따라서
페이지 내 관리 패널(교육부서 방식)이 아니라, **`Header.tsx`의 "관리자 관리" 버튼 옆에 "팝업
관리" 버튼을 나란히 배치**한다 — 이유:

- 이미 같은 성격(전역·페이지 무관)의 "관리자 관리" 버튼이 이 자리에 있어 **일관성**이 있다.
- 관리자가 어느 페이지에 있든 헤더에서 바로 접근 가능 — 팝업은 "지금 당장 공지를 걸어야
  하는" 긴급성이 있는 기능이라 진입 동선이 짧아야 한다.
- 데스크톱 nav(super 관리자만 노출)와 모바일 메뉴(`open` 상태의 드롭다운) 양쪽에 동일하게
  추가 — 기존 "관리자 관리" 항목의 반응형 처리 그대로 복제.

권한: **전체 관리자(super + sub) 접근 가능**으로 확정 (§0-3). 현재 "관리자 관리" 버튼은
super 전용이지만, 팝업은 admins 컬렉션 자체를 다루는 기능이 아니라 콘텐츠 성격이 강해
`isAdmin()` 기준으로 노출한다 — 헤더 버튼 조건도 `admin?.role === 'super'` 체크 없이
`isAdminMode`만으로 노출.

## 8. 컴포넌트/파일 구조 계획

```
src/
  types/content.ts                     # SitePopup 타입 추가
  lib/
    popup-service.ts                   # getSitePopups/getActivePopup 등 조회 헬퍼
    popup-visibility.ts                # hideForHours + localStorage 억제 로직 (순수함수, 단위테스트)
  store/admin-store.ts                 # popupManageOpen / setPopupManageOpen 추가
  components/layout/Header.tsx         # "팝업 관리" 버튼 추가 (데스크톱+모바일)
  features/popup/
    PopupManageModal.tsx               # 목록 CRUD 모달 — 표(table) 형태, 행별 편집/삭제
    PopupEditor.tsx                    # 개별 팝업 편집 폼 (날짜/타입/위치/우선순위/에디터)
    PopupRenderer.tsx                  # 방문자용 렌더러 — App.tsx에 전역 마운트, 모바일 비활성화
    popup-position.ts                  # position → Tailwind 클래스 매핑 (순수함수)
  hooks/useIsMobileViewport.ts         # (max-width: 767px) matchMedia 훅
  App.tsx                              # <PopupManageModal/>, <PopupRenderer/> 추가
firestore.rules                        # sitePopups 컬렉션 규칙 추가
storage.rules                          # application/pdf MIME 허용 추가
```

## 9. 단계별 구현 순서 (제안)

1. **데이터 계층**: 타입 정의, `firestore.rules`/`storage.rules` 갱신·배포, `popup-service.ts`.
2. **관리자 CRUD**: `PopupManageModal` + `PopupEditor` (교육부서 관리 패턴 재사용: 목록 추가/삭제
   + 개별 편집 다이얼로그 — Hero 슬라이드 관리 때 확립한 "편집 진입점을 목록에서 명시적으로
   분리" 원칙 그대로 적용).
3. **Markdown 에디터 도입**: `@uiw/react-md-editor` 설치 후 `PopupEditor`에 연결.
4. **방문자 렌더러**: `PopupRenderer` — 활성 팝업 계산(§5) + position별 레이아웃 +
   `hideForHours` 로컬 억제 + Dialog 재사용.
5. **PDF 업로드 지원**: `MediaInputField`에 PDF accept 모드 추가.
6. **헤더 진입점 연결**: "팝업 관리" 버튼.
7. **테스트**: `popup-visibility.test.ts`(순수함수), `PopupManageModal.test.tsx`(교육부서/Hero
   패턴과 동일한 add/delete/edit 시나리오).
8. **검증 및 배포**: lint/test/build → Firestore rules·Storage rules·Hosting 배포.

## 10. 오픈 이슈 / 확인 필요 사항

§0에서 아래 항목들이 모두 확정되어 더 이상 오픈 이슈가 아니다:

- ~~PDF MIME 허용~~ → 확정, `storage.rules`에 `application/pdf` 추가.
- ~~팝업 관리 권한 범위~~ → 확정, 전체 관리자.
- ~~동시 활성 팝업 처리 방식~~ → 확정, 순차 노출.
- ~~모바일 대응~~ → 확정, 팝업 자체 비활성화(별도 모바일 레이아웃 불필요해짐).

남은 이슈:

- **모바일 비활성화 기준선**: `(max-width: 767px)` — Tailwind `md` 브레이크포인트와 동일 기준.
  태블릿 세로모드(768px 부근)는 데스크톱 취급된다. 실사용 데이터 없이 임의 설정한 값이라
  운영 중 조정 가능성 있음.
