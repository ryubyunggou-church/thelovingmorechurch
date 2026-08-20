# Placeholder 기능/로직 현황 (2026-08-20 갱신 — 실데이터 반영 후)

## 0. 반영 내역 요약

| 항목 | 처리 |
|---|---|
| `seedStaff` (사역자 명단) | `사역자현황.txt` 기준 실명/직분으로 교체, s5(장로 김현수)·s6(피아노 김단비) 추가 |
| 사역자 프로필 사진 | `avatar-placeholder.svg` → `public/photos/placeholder.png`(`prd/images/placeholder.png` 복사본)로 교체 |
| `AboutStaffPanel.tsx` "사역자 추가" 기본 사진 | 동일하게 `/photos/placeholder.png`로 교체 |
| `seedContact.mapLinkUrl` | 빈 값 → 카카오맵 실제 링크(`Grok_New_session.txt` 출처)로 채움 |
| `seedMissions` m1(국내 이웃 섬김) 이미지 | Unsplash → `public/photos/mission-domestic-care.jpeg`(`prd/images/행복나눔.jpeg` 복사본)로 교체 |
| 오시는길 routes 3건 / 주차 안내 3건 | `(placeholder — …)` 라벨 제거, 문구는 유지 (실제 노선/주차 자료 없음) |
| `seedAboutTabs`(church) / `seedAboutChurch.body` | `(placeholder …)` 라벨 제거 |
| `seedAboutPastor` education/career/notes | `(placeholder)` 라벨 제거, `○○대학교` 등 미기재 항목은 유지 (실제 학력·경력 자료 없음) |
| `seedEducation` 4개 부서 `missionText` | 말미 `(placeholder — …)` 문장 제거 |
| `seedMissions` m1~m4 `description` | `(placeholder)` 라벨 제거 |

## 1. 대표사진 자동배정 로직 (풀 순환 배정) — 변경 없음, 유지

### 1-1. 사역(선교) 대표사진 — `src/lib/mission-list.ts`
- `missionPlaceholderImages`(`src/data/seed.ts`) 풀에서 `type`(국내/해외)별로 분리된 Unsplash 이미지 후보군 순환 배정
- 관리자 "사역 추가" 시 `createBlankMission()`이 신규 항목 `image`에 자동 배정
- `사역자현황.txt`에 매칭되는 확정 자료 없어 유지 결정

### 1-2. 교육부서 대표사진 — `src/lib/education-order.ts`
- `educationPlaceholderImages`(`src/data/seed.ts`) 풀 사용
- 4개 기본 부서(`seedEducation`)의 `image`와 풀의 URL이 `사역자현황.txt`에 기재된 값과 동일 — 이미 확정된 실사진 URL로 확인되어 유지
- 관리자 "부서 추가" 시 `createBlankEducationDept()`가 신규 부서 `image`에 자동 배정

### 1-3. 뉴스 썸네일 — `src/lib/news-thumbnail.ts`
- `newsPlaceholderImages`(`src/data/seed.ts`) 풀 사용, `Date.now()` 기준 순환 배정
- 매칭되는 확정 자료 없어 유지 결정

## 2. 남은 placeholder 이미지 애셋

- `public/photos/avatar-placeholder.svg`: 코드 참조 제거됨(미사용), 파일은 보존
- `public/photos/placeholder.png`: 사역자 프로필 사진 공용 기본값으로 사용 중 (`seedStaff` s2~s6, `AboutStaffPanel.addMember()`)

## 3. 남은 시드 콘텐츠 (실자료 부재로 문구 유지, 라벨만 제거)

- `seedAboutPastor.education` / `career`: `○○대학교`, `○○신학대학원`, `○○교회` 등 미기재 항목 — 담임목사 실제 학력/경력 자료 없음
- `seedContact.routes` 3건: 실제 버스 노선 번호·정류장명 등 확정 자료 없음
- `seedContact.parkingNotices` 3건: 실제 주차 운영 규정 확정 자료 없음
- `missionPlaceholderImages`, `newsPlaceholderImages` 풀: Unsplash 원격 URL 유지

## 4. 폼 입력 필드 placeholder 속성 (HTML `placeholder` attribute) — 변경 없음

UX 힌트 목적의 정상 기능이므로 유지. 전체 목록은 이전 버전 문서(git history) 참고.

## 5. 테스트 커버리지 — 변경 없음

- `src/lib/mission-list.test.ts`, `src/lib/education-order.test.ts`, `src/lib/news-thumbnail.test.ts`: 풀 순환 배정 검증, 본 작업으로 인한 영향 없음 (`npm test` 87 passed / 기존 무관 실패 1건(ResizeObserver, 사전 존재))
