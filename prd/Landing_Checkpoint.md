# Landing Checkpoint (랜딩 1차 마무리 점검)

- 작성일: 2026-08-13
- 목적: 교회소개 페이지 착수 전 **경량 점검·분리만** 수행 (대공사 리팩터 금지)

---

## 1. 완료한 코드 정리

| 작업 | 결과 |
|------|------|
| HeroSlider 분리 | `HeroSlider.tsx` + `HeroEditor.tsx` + `HeroMediaBackground.tsx` + `hero-slide-index.ts` |
| QuickLinks 분리 | `QuickLinks.tsx`(조합) + `QuickLinksBento.tsx` + `PartnerSpotlightRail.tsx` + `quick-links-data.ts` |
| 슬라이드 인덱스 테스트 | `HeroSlider.test.ts` → `hero-slide-index` import |
| `annualMotto` rules | `firestore.rules`에 공개 읽기 / admin 쓰기 포함 (배포는 운영 작업) |

---

## 2. 수동 스모크 체크리스트 (배포/로컬)

### 일반 접속
- [ ] 홈 로드: Hero · 인사말+표어 · 소식 · 바로가기 · 협력기관 · Footer
- [ ] Header 배너: `교회설립 제 N주년 'Since 2005 ~ {현재연도}'`
- [ ] Topbar에 **관리자 로그인 버튼 없음**
- [ ] Footer `Admin` 클릭 → 로그인 모달
- [ ] 푸터 배경: 웜 토프 (`#d8c4a8`, `.site-footer`)
- [ ] 협력기관: 기본 포커스 **남경기노회**, 호버 떨림 없음

### 관리자 모드
- [ ] 로그인 후 배너: 관리자 모드 안내
- [ ] Topbar: 로그아웃 (+ super면 관리자 관리)
- [ ] Footer `Admin` 숨김
- [ ] Hero 편집 저장/게시
- [ ] 인사말 편집 (인용구·사진·본문)
- [ ] 표어 편집 (연도·표어·구절·실천 3)
- [ ] 미디어: URL / 파일 업로드 (Storage rules 배포된 경우)

### 기술
- [ ] `npm run build` 통과
- [ ] `npm test` 통과
- [ ] (운영) `firebase deploy --only firestore:rules` — `annualMotto` 반영 여부

---

## 3. 시드 vs 실데이터 메모

| 항목 | 시드 | 비고 |
|------|------|------|
| 담임 사진 | Unsplash 플레이스홀더 | 실사진 교체 권장 |
| 인사말 문구 | 시드 문단 | 관리자 편집으로 교체 |
| 표어 | 2026년표어 내용 타이포 시드 | `annualMotto` 문서 없으면 시드 표시 |
| Hero 미디어 | Unsplash 등 | Firestore `heroSlides` 우선 |

---

## 4. 다음 단계

- 본 체크포인트 **완료 후** → **교회소개** 페이지 구현
- 전역 리팩터·디자인 재개편은 교회소개 범위에 섞지 않음

---

## 5. 검증 명령

```bash
npm test
npm run build
```
