# Experiment: HOME landing — ui-ux-pro-max 파일럿

- **Branch:** `experiment/home-ui-ux-pro-max` → **merged to `main`** (2026-08-18)
- **Scope:** HOME 랜딩만 (시각·상호작용 품질). IA·라우트·Firebase·인라인 CMS 로직 유지.
- **Source of Truth:** `DESIGN.md` (성소의 빛) 우선. 스킬 출력은 권고로만 사용.
- **Skill dials:** variance 3 / motion 3 / density 4
- **Date:** 2026-08-18
- **Status:** 파일럿 수용 → main 병합·Hosting 배포

## 스킬 출력 중 의도적 미적용

| 스킬 제안 | 미적용 이유 |
|-----------|-------------|
| Primary `#7C3AED` 보라 팔레트 | Sanctuary Light(ink/paper/gold/wine)와 충돌. 교회 물성 기반 브랜드 유지. |
| Atkinson Hyperlegible 폰트 | Noto Serif KR + Noto Sans KR 브랜드 커밋 유지. |
| Hero + Testimonials + CTA 섹션 재배치 | IA/콘텐츠 구조 변경 금지(시각만 범위). |
| Bento / 화려한 모션 | DESIGN.md에서 이미 금지·절제. |

채택한 스킬 축: **Minimalism & Swiss** (여백·대비·기하), **터치 44px**, **본문 ≥16px**, **캐러셀 pause on hover/focus**, **hover 200ms대**, **Flat (불필요 섀도 제거)**.

---

## 변경 목록 (넘버링)

### C01 — Hero 자동재생: hover/focus 시 일시정지
- **파일:** `src/features/hero/HeroSlider.tsx`
- **무엇을:** 마우스 호버·포커스 시 자동 슬라이드 정지. `prefers-reduced-motion`에서도 자동재생 중단.
- **왜:** ui-ux-pro-max landing/carousel a11y — pause on focus/hover/reduced-motion.
- **Before → After:** 관리자 모드에서만 정지 → 방문자가 읽거나 조작할 때도 정지.

### C02 — Hero 컨트롤 터치 영역 44×44
- **파일:** `HeroSlider.tsx`
- **무엇을:** 이전/다음·도트 인디케이터를 `h-11 w-11` 히트 영역으로 확대 (시각 필은 기존 얇은 라인 유지).
- **왜:** UX Touch Target (web 44px 권고) + 고령 방문자 탭 정확도.
- **Before → After:** 아이콘/3px 바만 클릭 가능 → 44px 히트 박스.

### C03 — Hero 부제 가독성 (모바일 16px+)
- **파일:** `HeroSlider.tsx`
- **무엇을:** 부제 `text-sm` → `text-base leading-relaxed` (sm 이상은 `text-lg` 유지).
- **왜:** Readable Font Size — 본문형 카피 최소 16px.
- **Before → After:** 모바일 ~14px → 16px.

### C04 — Hero CTA·관리 버튼 피드백
- **파일:** `HeroSlider.tsx`
- **무엇을:** `cursor-pointer`, `duration-200`, CTA `min-h-11`, 관리 버튼 터치 영역 확대.
- **왜:** Hover States + Touch Friendly checklist.
- **Before → After:** 즉각/불명확한 hover → 200ms 색·간격 전이 + 큰 히트 영역.

### C05 — Hero 모션 절제 + 스크린리더 위치 안내
- **파일:** `HeroSlider.tsx`
- **무엇을:** 카피 등장 `duration-700/translate-y-4` → `duration-500/translate-y-3`. `aria-live`로 슬라이드 위치 안내. carousel role 라벨.
- **왜:** Subtle motion dial + landing carousel announce slide position.
- **Before → After:** 더 큰 슬라이드 인 → 짧은 fade-up + 라이브 리전.

### C06 — 인사말 본문 16px
- **파일:** `src/features/home/PastorGreetingSection.tsx`
- **무엇을:** 본문 `text-sm` / `sm:text-[15px]` → `text-base`.
- **왜:** 정독 카피 가독성 (고령 교인 비중).
- **Before → After:** 14–15px → 16px.

### C07 — 표어 구절·실천 목록 16px + 행간
- **파일:** `src/features/home/AnnualMottoSection.tsx`
- **무엇을:** scripture/practices `text-sm` → `text-base`, `space-y-3` → `space-y-3.5`.
- **왜:** Readable body + Swiss spacing consistency.
- **Before → After:** 작은 목록 본문 → 본문 스케일.

### C08 — 인사말·표어 밴드 열 간격
- **파일:** `src/features/home/GreetingMottoBand.tsx`
- **무엇을:** `gap-10/md:gap-14` → `gap-12/md:gap-16`.
- **왜:** density dial(여백) + DESIGN section rhythm.
- **Before → After:** 약간 더 넉넉한 2열 호흡.

### C09 — 교회소식 호버·링크 품질
- **파일:** `src/features/home/NewsPreview.tsx`
- **무엇을:** 더보기/카드 `duration-200`, 이미지 scale 1.03→1.02·500ms→200ms, 헤더 `sm:mb-12`, 더보기 `min-h-11`.
- **왜:** Subtle hover 200–250ms (Swiss style) + touch target.
- **Before → After:** 느린 큰 줌 → 짧은 미세 피드백.

### C10 — 찾아가기 색인 대비·본문 크기
- **파일:** `src/features/home/QuickIndex.tsx`
- **무엇을:** 번호색 `paper-line` → `paper-muted` (idle 대비↑). live 라인 `text-xs` → `text-sm`. 호버 전이 200ms. 행 `min-h-14`.
- **왜:** Color Contrast + Readable Font Size. 번호가 보더색이라 거의 안 보이던 문제 완화.
- **Before → After:** 저대비 번호/작은 live → 읽히는 색인.

### C11 — 협력기관: 플랫·탭 우선·터치 확대
- **파일:** `src/features/home/PartnerSpotlightRail.tsx`
- **무엇을:**
  - active `shadow-xl` 제거 (DESIGN Flat-By-Default; 모달/팝업만 섀도 허용).
  - inactive `opacity-55/scale-90` → `opacity-75/scale-95`, 라벨 opacity 40→70.
  - 선택 점 버튼 44×44 히트 영역.
  - 안내 문구를 hover-only가 아니라 **탭/점 선택** 중심으로 수정.
  - 모션 duration 300→200, translate 완화.
- **왜:** Flat rule + Hover vs Tap (터치에서 hover 의존 금지) + Touch Target + Excessive Motion 완화.
- **Before → After:** 호버 중심·강한 스케일/섀도 → 탭 가능·대비 유지·평면.

### C12 — 협력기관 호버: 선택 카드만 확대 (이웃 동시 모션 제거)
- **파일:** `src/features/home/PartnerSpotlightRail.tsx`
- **무엇을:**
  - 모든 카드 플레이트 높이·패딩·로고 `max-height` 고정.
  - inactive `scale-95`/opacity 축소 제거 → 기본 `scale-100` 유지.
  - active만 `scale-[1.06]` + 골드 보더 (transform만 애니메이션).
  - `items-end` → `items-start`로 높이 변화 시 그리드 출렁임 차단.
- **왜:** 호버 이동 시 이전·다음·나머지 카드가 동시에 축소/확대되어 화면이 불안정해 보임.
- **Before → After:** 전환마다 다수 카드 리플로우 → 호버된 카드만 부드럽게 확대, 나머지는 정지.

### C13 — 협력기관 안내 문구 삭제
- **파일:** `PartnerSpotlightRail.tsx`
- **무엇을:** 「로고를 탭하거나…」 보조 문구 제거.
- **왜:** 제목만으로 충분, 섹션 상단 군더더기 제거.

### C14 — 협력기관 호버 플레이트 카드별 진한 파스텔
- **파일:** `PartnerSpotlightRail.tsx`, `quick-links-data.ts`
- **무엇을:** 호버/선택 시 플레이트 배경을 카드별로 구분 — 총회 `#c4b5d4`(라일락), 노회 `#a8c0a8`(세이지), GMS `#d4b59a`(살구). 비활성은 paper 유지.
- **왜:** 선택 상태 가독성 + 로고(보라/흑/파랑) 대비를 해치지 않는 진한 파스텔.
- **Before → After:** 공통 paper → 카드별 파스텔 하이라이트.

---

## 성공 기준 (파일럿)

1. Sanctuary Light 톤(ink/paper/gold)이 더 선명·일관된가 — **의도: 유지·강화**
2. 고령 방문자 가독성이 나빠지지 않았는가 — **의도: 본문 16px↑로 개선**
3. 관리자 연필/Hero 관리 UI가 깨지지 않았는가 — **의도: 레이아웃만 손댐, CMS 로직 무변경**

## 검증 체크리스트

- [x] Desktop HOME 스크롤·히어로 조작
- [x] Mobile(≈375) HOME 터치 영역·가독성
- [x] Hero hover 시 자동재생 정지
- [x] 협력기관 탭/클릭 (호버 없이도 선택 가능) + 선택 카드만 scale + 파스텔
- [x] 단위 테스트 통과 (`npm test` — 88/88)
