---
name: 대한예수교장로회 사랑하는교회
description: 스테인드글라스·주보 색인·놋쇠 명패에서 끌어온 성소의 빛(Sanctuary Light) 시스템
colors:
  ink: "#17130f"
  ink-soft: "#221b15"
  ink-line: "#3d3428"
  ink-muted: "#c7bea9"
  paper: "#f1ede3"
  paper-dim: "#e7e1d2"
  paper-line: "#dad2be"
  paper-text: "#1c1712"
  paper-muted: "#5c5344"
  gold: "#c89b3c"
  gold-deep: "#93701f"
  wine: "#7c2f3a"
  wine-deep: "#5e2029"
typography:
  display:
    fontFamily: "Noto Serif KR, Georgia, serif"
    fontSize: "clamp(1.75rem, 3.5vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Noto Sans KR, Apple SD Gothic Neo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Noto Sans KR, Apple SD Gothic Neo, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.14em"
rounded:
  sm: "2px"
  md: "6px"
spacing:
  section-y: "4rem"
  section-y-lg: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.gold-deep}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
---

# Design System: 대한예수교장로회 사랑하는교회

## Overview

**Creative North Star: "성소의 빛 (Sanctuary Light)"**

이 리디자인은 이전 버전(크림 배경 + 테라코타 악센트 + 세리프 디스플레이)이 AI 생성
인터페이스가 가장 흔하게 수렴하는 팔레트 조합이라는 진단에서 시작했다. 대체 세계는 이
교회의 실제 물성에서 끌어왔다: 예배당의 짙은 어스름, 스테인드글라스의 절제된 보석색
조각, 주보(예배 순서지)의 번호 매긴 목차, 놋쇠 명패의 각인 타이포. 방문자를 설득해야
하는 면(홈 히어로, 협력기관)은 짙은 잉크 톤(ink)을 기본 서페이스로 커밋하고, 정독이
필요한 면(예배안내, 교회소식 본문)은 채도 낮은 회갈색 종이 톤(paper)을 쓴다 — 밝고
따뜻한 크림 하나로 전체를 덮지 않는다는 점이 이전 버전과의 핵심적 차이다.

카드+아이콘+텍스트의 반복 그리드(bento), 제목 위 킥커 라벨, 숫자 원형 배지, 방사형
블러 장식은 전부 제거했다. 대신 목차 번호(01/02/03), 헤어라인 구분선, 실제 교회 사진을
사용한다.

**Key Characteristics:**
- 짙은 잉크(다크) + 채도 낮은 종이(라이트)를 장면에 따라 나눠 쓰는 비대칭 톤 전략
- 골드(촛불빛) 단일 주 악센트 + 와인(스테인드글라스 가넷) 보조 악센트, 절제된 사용
- 아이콘 타일 카드 대신 번호 매긴 목차(색인) 레이아웃
- 실제 교회 사진(전경·선교지·지도) 우선, 스톡 사진은 워터마크·출처 확인 후 최소 사용
- 킥커 라벨·원형 배지·그라데이션 블러 장식 금지

## Colors

전체 팔레트는 스테인드글라스 조각처럼 절제되게 커밋한다 — 골드/와인은 면적을 넓게
차지하지 않고 룰선·숫자·라벨·CTA에만 등장한다.

### Primary
- **Ink** (`#17130f`): 헤더·푸터·히어로·협력기관 섹션의 기본 다크 서페이스. "예배당의 어스름".
- **Gold (Candlelight)** (`#c89b3c`): 유일한 주 악센트. CTA 버튼, 활성 탭 밑줄, 목차 번호,
  포커스 링. `gold-deep` (`#93701f`)는 밝은 배경 위 텍스트/링크용 저채도 변형.

### Secondary
- **Wine (Stained-glass Garnet)** (`#7c2f3a`): 삭제·경고 등 위험 동작에 한정. `wine-deep`
  (`#5e2029`)는 밝은 배경 위 텍스트용.

### Neutral
- **Paper (Bulletin Stock)** (`#f1ede3`): 정독형 콘텐츠(예배안내, 교회소식, 오시는길)의
  기본 배경. 채도를 낮춘 회갈색 종이 톤 — 이전 버전의 크림(#faf6f0)과 의도적으로 구분.
- **Paper Dim** (`#e7e1d2`): paper 위 패널/스트라이프 구분용 미세 톤.
- **Paper Line** (`#dad2be`): paper 위 헤어라인 보더·구분선.
- **Paper Text** (`#1c1712`) / **Paper Muted** (`#5c5344`): paper 위 본문/보조 텍스트.
- **Ink Line** (`#3d3428`): ink 위 헤어라인 보더.
- **Ink Muted** (`#c7bea9`): ink 위 보조 텍스트.

### Named Rules
**The Two-Ground Rule.** 방문자를 설득/환영하는 면(히어로, 협력기관, 헤더, 푸터)은
ink를 기본 서페이스로 쓰고, 과업 수행형 정독 콘텐츠는 paper를 쓴다. 한 페이지 안에서
두 톤을 그러데이션 없이 섹션 단위로 전환한다.

**The One-Accent Rule.** 골드는 화면의 10% 미만에만 등장한다 — 룰선, 숫자, CTA, 활성
상태 표시자뿐. 카드 배경이나 넓은 면을 채우지 않는다.

## Typography

**Display Font:** Noto Serif KR (Georgia 폴백)
**Body/UI Font:** Noto Sans KR (Apple SD Gothic Neo, system-ui 폴백)

**Character:** 디스플레이는 크고 절제된 세리프로 확신 있게 커밋하고(1.75rem~3.75rem,
weight 600), 본문/UI는 차분한 산세리프로 가독성을 우선한다. 라벨·목차 번호는 좁은
크기에 넓은 트래킹(0.14em)을 줘 "인쇄물 색인"의 느낌을 낸다.

### Hierarchy
- **Display** (weight 600, `clamp(1.75rem, 3.5vw, 3.75rem)`, line-height 1.15): 히어로
  헤드라인, 페이지 타이틀(PageShell h1).
- **Title** (weight 600, 1.25–1.75rem, Noto Serif KR): 섹션 헤딩(h2), 카드 제목.
- **Body** (weight 400, 0.875–0.9375rem, line-height 1.6, Noto Sans KR): 본문, 목록.
- **Label / Index Numeral** (weight 600, 0.6875–0.75rem, letter-spacing 0.14em,
  `.index-num` 유틸리티로 tabular-nums 적용): 목차 번호, 카테고리 라벨.

### Named Rules
**The No-Kicker Rule.** 제목 위에 작은 라벨(eyebrow/kicker)을 얹지 않는다 — 제목 자체가
무게를 지닌다. `index-num` 라벨은 목차/카테고리 맥락에서만 쓰고, 제목의 장식으로 쓰지
않는다.

## Layout

`max-w-6xl`(72rem) 컨테이너, 좌우 패딩 `px-4 sm:px-6`. 섹션 세로 리듬은 `py-16
sm:py-24`(홈 섹션)로 넉넉하게 — 제목 위 여백이 아래 여백보다 크다. 카드 그리드
(뉴스·사역·사역자)는 균일 3열 대신 콘텐츠 성격에 따라 2/3/4열을 섞어 쓰고, 홈 하단
"찾아가기"는 그리드가 아닌 번호 매긴 세로 목록(색인)으로 구성한다. 모바일은 전부 1열
스택, 탭은 가로 스크롤 없이 줄바꿈.

## Elevation & Depth

그림자를 쓰지 않는다. 깊이는 헤어라인 보더(`border-paper-line` / `border-ink-line`)와
톤 대비(ink ↔ paper 섹션 전환)로 표현한다. 유일한 예외는 모달(Dialog)의
`shadow-2xl`과 팝업의 `shadow-xl` — 실제 오버레이 레이어를 배경과 분리하기 위한
구조적 용도에 한정.

### Named Rules
**The Flat-By-Default Rule.** 카드·리스트·이미지는 평면이다. `shadow-sm`류의 장식적
소프트 섀도를 카드에 두르지 않는다 — 헤어라인 보더가 경계를 대신한다.

## Shapes

모서리 반경은 거의 0에 가깝게 절제한다 — 버튼/입력은 `rounded-sm`(2px), 다이얼로그만
소폭의 `rounded-sm`~`rounded-xl` 범위. 사진·카드는 각진 사각형(no rounding)을 기본으로
하여 "인쇄물"의 느낌을 유지한다. 예외는 의도적으로 고른 곳에만 둔다: 로고 마크는 원형,
협력기관 로고 플레이트(`PartnerSpotlightRail`)는 `rounded-[30px]`의 부드러운 사각형,
슬라이드 인디케이터는 필(pill) 형태.

## Components

### Buttons
- **Shape:** `rounded-sm`(2px), `tracking-wide`.
- **Primary:** 배경 gold, 텍스트 ink → hover 시 배경 gold-deep, 텍스트 paper.
- **Secondary:** 배경 ink, 텍스트 paper → hover ink-soft.
- **Outline:** 보더 paper-line, hover 시 보더 gold-deep/50 + 배경 paper-dim.
- **Ghost / Link:** 배경 없음, 텍스트 gold-deep, hover underline.

### Tabs
- **Style:** 언더라인 인덱스 바 — `border-b border-paper-line` 컨테이너, 활성 탭은
  `border-b-2 border-gold text-paper-text`. 세그먼트 필(pill)이 아니다.

### Cards / Panels
- **Corner Style:** 각짐(no radius) 또는 최소.
- **Background:** paper 또는 paper-dim.
- **Border:** `border-paper-line` 헤어라인, 카드 사이는 보더보다 `divide-paper-line`
  구분선을 우선.
- **Shadow:** 없음(Elevation 참고).

### Inputs / Fields
- **Style:** `border-paper-line`, 배경 paper, `rounded-sm`.
- **Focus:** `ring-2 ring-gold/40`.

### Index List (Signature Component)
홈 "찾아가기"(`QuickIndex`)와 예배 시간표(`WorshipScheduleList`)가 공유하는 시그니처
패턴: 좌측에 `index-num`(01, 02…) 세리프 숫자, 실제 사진 스와치(색인일 때만),
타이포 위계, 우측 화살표/시간. `divide-paper-line`로 구분된 세로 리스트이며 아이콘
타일 그리드를 쓰지 않는다.

### Navigation
헤더는 ink 배경 고정 바. 데스크톱 내비는 소문자가 아닌 원문 라벨 + 좁은 트래킹
(0.06em), 활성 상태는 필 배경이 아닌 하단 골드 언더라인. 모바일은 ink 배경 드롭다운,
활성 항목만 `bg-ink-soft text-gold`.

## Do's and Don'ts

### Do:
- **Do** 방문자용(Persuade) 섹션은 ink를 기본으로, 정독형 콘텐츠는 paper를 기본으로
  커밋한다.
- **Do** 목차 번호(`index-num`, tabular-nums)로 리스트 항목을 센다 — 원형 배지가 아니다.
- **Do** 실제 교회 사진을 쓰되, 사용 전 워터마크·출처를 육안으로 확인한다(스톡 사이트
  워터마크가 있으면 즉시 폐기).
- **Do** 헤어라인 보더(`paper-line` / `ink-line`)로 카드·구역을 구분한다.

### Don't:
- **Don't** 카드에 소프트 드롭섀도(`shadow-sm`/`shadow-md`)를 두르지 않는다 — 보더로
  대체한다.
- **Don't** 제목 위에 킥커/eyebrow 라벨을 얹지 않는다.
- **Don't** 아이콘+제목+텍스트의 균일 카드 그리드(bento)를 새 섹션에 재도입하지 않는다.
- **Don't** 사진을 대신해 방사형 그라데이션 블러 장식을 쓰지 않는다.
- **Don't** 실사용 로고(파트너 기관 등)에 `brightness-0 invert` 같은 단색화 필터를
  걸지 않는다 — 밝은 플레이트(`bg-paper`) 배경 위에 원본 색상 그대로 올린다.
