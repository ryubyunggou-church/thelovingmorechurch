# 관리자 편집 모달 UX 표준 및 전면 적용 계획

- 작성일: 2026-08-13
- 기준 샘플: 홈 **Hero 슬라이드 편집** 모달 (`HeroSlider` → `HeroEditor`)
- 관련 컴포넌트:
  - `src/components/ui/form-field.tsx` — `FormField`
  - `src/components/shared/MediaInputField.tsx` — `MediaInputField`
  - `src/components/ui/dialog.tsx` — 공통 세로 스크롤
  - `src/components/shared/EditableBlock.tsx` — 인라인 편집 진입점

---

## 1. 한 줄 요약

Hero에서 검증한 **`FormField` + `MediaInputField` + 빈 미디어 폴백 + Dialog 스크롤**을 표준 계약으로 고정하고, 모든 관리자 편집 모달에 동일 적용한다. 새 UX를 페이지마다 재설계하지 않는다.

---

## 2. 재사용성 판단

| 부품 | 재사용 가능 여부 | 역할 |
|------|------------------|------|
| `FormField` | ✅ | 제목 + 안내글 **한 줄** + 입력 컨트롤 |
| `MediaInputField` | ✅ | 로컬 파일(폴더 아이콘) + URL(URL 아이콘) + Storage 업로드 |
| `DialogContent` 스크롤 | ✅ 전역 | `max-h: 90vh` + 내부 `overflow-y-auto` |
| Hero 에디터 폼 자체 | 샘플 | 필드 조합 예시 (복붙 후 도메인 필드만 교체) |

**결론:** 공통 부품은 재사용 가능 형태이며, 각 모달은 조립만 하면 된다.

---

## 3. UX 표준 (Source of Truth)

모든 편집 모달은 다음을 만족한다.

1. **텍스트 필드** → 반드시 `FormField`로 감싼다.  
   - `label` + 한 줄 `hint` (길면 truncate, hover 시 title로 전체 표시)  
   - 필수 값은 `required` + `*`
2. **미디어/파일 필드** → 반드시 `MediaInputField`  
   - 폴더 아이콘: 로컬 선택 → Firebase Storage `uploads/{folder}/`  
   - URL 아이콘: 경로 직접 입력  
   - 비우고 저장 시 **기존 URL 유지** (`defaultUrl` + 부모 `resolveMedia`)  
   - 사진 전용(인사말·썸네일 등)은 `accept="image/*"`, folder 분리, 유튜브 비권장
3. **모달 스크롤** → `DialogContent`에 맡긴다. 개별 `max-h` 중복 금지 권장.
4. **저장 UX** → alert 금지, 성공/실패 **toast**, 가능하면 「저장 후 미리보기 / 게시」 2단계.
5. **에러 메시지** → 원인 구분 가능한 문구 (권한, 빈 미디어, 업로드 실패 등).

---

## 4. 대상 모달 목록

| 우선순위 | 화면 | 파일 | 미디어 | 적용 내용 |
|----------|------|------|--------|-----------|
| 기준 | Hero | `features/hero/HeroSlider.tsx` | 이미지/mp4/유튜브 | ✅ 완료 (샘플) |
| P0 | 담임목사 인사말 | `features/home/PastorGreetingSection.tsx` | 사진 | FormField + MediaInputField |
| P0 | 예배안내 | `pages/WorshipPage.tsx` | 없음 | 행별 FormField |
| P0 | 오시는길 | `pages/ContactPage.tsx` | 지도 URL | FormField (지도는 URL 텍스트) |
| P1 | 교회소개 탭 | `pages/AboutPage.tsx` | 없음 | FormField + Textarea |
| P1 | 교육부서 | `pages/EducationPage.tsx` | 이미지 | FormField + MediaInputField |
| P1 | 선교사역 | `pages/MissionsPage.tsx` | 없음 | FormField |
| P2 | 교회소식 작성 | `pages/NewsPage.tsx` | 썸네일 | FormField + MediaInputField |
| P2 | 관리자 로그인 | `features/admin/LoginModal.tsx` | 없음 | FormField |
| P2 | 관리자 관리 | `features/admin/AdminManageModal.tsx` | 없음 | FormField |

---

## 5. 적용 계획 (실행 순서)

### Phase A — 계약 고정
- 본 문서 + 공통 컴포넌트 유지
- (선택) `allowYoutube` / `imageOnly` 등 MediaInputField 옵션

### Phase B — P0
1. 담임목사 인사말  
2. 예배안내  
3. 오시는길  

### Phase C — P1~P2
4. 교회소개 / 교육부서 / 선교사역  
5. 교회소식 / 로그인 / 관리자 관리  

### 완료 게이트
- `EditableBlock` / 뉴스·로그인 Dialog 내 raw placeholder-only Input 나열 제거
- `FormField` 미사용 편집 필드 없음 (grep 점검)
- `tsc` / 단위 테스트 통과

---

## 6. 작업 규칙

1. **한 모달 단위**로 수정·확인 (한 번에 전 파일 난사 지양하되, 본 작업에서는 일괄 적용 허용).
2. CRUD/저장 로직과 UI 폼을 섞어 새로 만들지 말고 **표준 부품만** 사용.
3. Storage 경로는 `uploads/{domain}/` (`hero`, `pastor`, `education`, `news` 등).
4. Firestore 일괄 마이그레이션 없음 — 빈 미디어는 런타임 폴백.

---

## 7. 적용 결과 (구현 반영)

| 모달 | 상태 |
|------|------|
| Hero | ✅ |
| 인사말 / 예배 / 오시는길 | ✅ (본 작업) |
| 교회소개 / 교육 / 선교 | ✅ (본 작업) |
| 소식 / 로그인 / 관리자 | ✅ (본 작업) |
| Dialog 세로 스크롤 | ✅ 공통 |

*본 문서는 Hero 샘플 확정 이후 전면 적용을 위해 작성·갱신한다.*
