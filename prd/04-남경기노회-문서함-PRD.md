# 04. 남경기노회 문서함 PRD (관리자 전용)

- 버전: v1.0 (설계 확정 대기)
- 작성일: 2026-08-21
- 라우트: `/admin/nam-gyeonggi` (관리자 전용, 완전 비공개 페이지)
- 상위 문서: `The_사랑하는_교회_홈페이지_개발_PRD.md`
- 편집 UX 표준: `편집모달_UX표준_및_전면적용_계획.md`
- 관련 커밋: `9cef3e6`(남경기노회 협력기관 링크) — 기존 Footer 협력기관 링크와는 무관한 별도 신규 기능

---

## 0. 이번 배치에 포함된 항목

| 구분 | 내용 |
|------|------|
| 수정 | 브라우저 탭 타이틀을 `대한예수교장로회 사랑하는교회` → `사랑하는교회\|예장합동`으로 교체. **탭 타이틀에만 적용** — 로고 `alt`, Footer 저작권 문구, meta description, 시드 데이터의 `siteName` 등 사이트 내 다른 텍스트는 그대로 둔다 |
| 신규 | 관리자 전용 "남경기노회 문서함" 페이지 — 본 문서의 주 대상 |

---

## 1. 배경 및 목표

'사랑하는교회'는 '남경기노회'(외부 사이트 `남경기노회.kr`, 이 저장소와 무관한 별도 시스템) 소속 교회다. 남경기노회는 노회-교회 간 공문서를 클라우드로 주고받는 시스템을 **개발 계획 중**이며, 완성되면 모든 소속 교회 홈페이지에 동일한 인터페이스가 들어갈 예정이다. 사랑하는교회 사이트에 그 **표준 인터페이스의 파일럿(샘플) 구현**을 먼저 올린다.

**핵심 전제**: 남경기노회 쪽 실제 클라우드 인프라는 아직 없다. 따라서 이번 구현은 노회 시스템과 실시간으로 통신하지 않는다 — 사랑하는교회의 기존 Firebase 프로젝트(`tlmchurch`) 안에 데이터 구조와 UI를 만들어, 노회 인프라가 준비됐을 때 그대로(또는 최소 수정으로) 확장 연결할 수 있는 형태로 설계한다.

### 1.1 핵심 기능

1. **노회 → 교회 수신 문서함**: 노회가 보낸 문서를 테이블로 관리 — 뷰(PDF만) / 다운로드 / 출력 / 읽음·안읽음 상태
2. **교회 → 노회 발신**: 교회가 문서를 업로드해 "발송 기록"으로 남긴다

### 1.2 비범위 (이번 파일럿에서 하지 않는 것)

- 남경기노회.kr과의 실제 API/웹훅 연동 (노회 쪽 인프라 부재로 불가능 — 후속 과제)
- 교회가 업로드한 발신 문서가 실제로 노회 측에 자동 전달되는 것 (현재는 이 Firebase 프로젝트 안에 "발송 기록"으로만 남음)
- 발신 문서의 "노회가 읽었는지" 여부 추적 (알 수 없음 — 범위 밖)
- 다회원교회 대상 멀티테넌시 구조 (지금은 사랑하는교회 1곳만)

---

## 2. 진입점 / 라우팅 / 가드

- `Header.tsx` 관리자 툴바(데스크톱 137~166줄, 모바일 230~265줄)에 **`[남경기노회] [팝업 관리] [로그아웃]`** 순서로 버튼 추가. `isAdminMode` 기준 노출(최고·부관리자 모두, `팝업 관리`와 동일 레벨).
- `App.tsx`에 `<Route path="/admin/nam-gyeonggi" element={<NamGyeonggiDocsPage />} />` 신규 등록. **이 사이트 최초의 "완전 관리자 전용 페이지"** — URL을 직접 입력해 들어와도 관리자가 아니면 콘텐츠가 보이면 안 된다.
- 가드 방식: `NamGyeonggiDocsPage` 내부에서 `isAdminMode`가 아니면 `<Navigate to="/" replace />` (기존 코드베이스에 라우트 가드 컴포넌트가 없어 페이지 내부 조건부 리다이렉트로 처리 — 가장 단순하고 기존 패턴과 충돌 없음).
- 탭 타이틀: `<Seo title="남경기노회 문서함" path="/admin/nam-gyeonggi" />`

---

## 3. 데이터 모델

### 3.1 Firestore — `presbyteryDocuments` 컬렉션 (신규)

| 필드 | 타입 | 설명 |
|------|------|------|
| `title` | string | 문서 제목 |
| `direction` | `'inbound' \| 'outbound'` | 수신(노회→교회) / 발신(교회→노회) |
| `fileType` | `'pdf' \| 'other'` | PDF만 인앱 뷰 가능, 그 외는 다운로드 전용 |
| `fileUrl` | string | Storage 다운로드 URL |
| `fileName` | string | 원본 파일명 (다운로드 시 표시) |
| `uploadedBy` | string | 등록한 관리자 이메일/uid |
| `uploadedAt` | string (ISO) | 등록 일시 |
| `isRead` | boolean | **수신 문서에만 의미 있음.** 최고·부관리자 누구든 열람(PDF 뷰) 또는 다운로드하면 `true` |
| `note` | string (선택) | 비고 |

- 정렬: `uploadedAt desc`
- `saveDocument('presbyteryDocuments', id, data)` / `removeDocument('presbyteryDocuments', id)` — 기존 범용 CRUD 그대로 재사용
- 신규 조회 함수 `getPresbyteryDocuments(opts?: { direction?, pageSize? })`를 `content-service.ts`에 `getNewsPosts`와 동일 패턴으로 추가

### 3.2 Storage 경로 — **공개 `uploads/` 아님, 신규 비공개 경로**

> ⚠️ 중요: 기존 `uploadMediaFile()`은 `uploads/{folder}/...`에 저장하고, `storage.rules`상 `uploads/**`는 **`allow read: if true`(전체 공개)**다. 노회 공문은 기밀성이 있으므로 이 경로를 그대로 쓰면 안 된다.

- 신규 경로: `presbytery-docs/{direction}/{timestamp}_{safeFileName}`
- 신규 업로드 함수 `uploadPresbyteryDocument(file, direction)`를 `storage-upload.ts`에 추가 (기존 `uploadMediaFile`과 분리 — 아래 6절 참고)
- 허용 형식(안): `application/pdf`, `.hwp`, `.doc`/`.docx`, `.xls`/`.xlsx`, 이미지(스캔본 대비). 최대 용량은 공문 특성상 기존 15MB보다 넉넉하게 **20MB** 제안
- 다운로드 URL은 Storage 보안 규칙으로 관리자만 접근하도록 막되(3.3 참고), 클라이언트에는 `getDownloadURL()` 토큰 URL을 그대로 노출하는 기존 패턴을 유지 (Firebase Storage 다운로드 토큰 URL은 URL을 아는 사람은 접근 가능한 구조이므로, "정말" 완전한 기밀은 아님 — 필요시 Cloud Functions 프록시로 강화하는 건 후속 과제로 남김)

### 3.3 보안 규칙 변경

**`firestore.rules`** — 이 프로젝트 최초로 "완전 비공개"(공개 read 없음) 컬렉션:

```
match /presbyteryDocuments/{id} {
  allow read, write: if isAdmin();
}
```

**`storage.rules`** — `uploads/**`와 별도의 새 비공개 경로:

```
match /presbytery-docs/{allPaths=**} {
  allow read, write: if isAdmin()
    && request.resource.size < 20 * 1024 * 1024;
  // 실제 content-type 화이트리스트는 배포 시 구체 MIME 목록으로 확정
}
```

---

## 4. 화면 설계

### 4.1 목록/테이블

```
[ 남경기노회 문서함 ]
[ 검색창 ] [ 구분: 전체|수신|발신 ▾ ] [ + 문서 등록 ]
─────────────────────────────────────────────
구분   제목            등록일       등록자     읽음상태   액션
수신   2026년 3월 공문   03/10       관리자A    ● 안읽음   [뷰][다운로드][출력]
발신   재정보고서        03/12       관리자B    —         [다운로드]
─────────────────────────────────────────────
[ 페이지네이션 ]
```

- 필터: 구분(수신/발신/전체) + 제목 키워드 검색 — 클라이언트 사이드 필터링(교회소식 페이지와 동일하게 우선 로드 후 필터, 문서량이 많아지면 서버 쿼리로 전환)
- 페이지네이션: `PAGE_SIZE = 10` 안(교회소식은 6 — 문서는 표 형태라 더 많이 보여줘도 무방, 협의 가능)
- 읽음상태 컬럼은 `direction === 'inbound'`일 때만 표시, 발신 문서는 `—`

### 4.2 문서 등록 모달

- "+ 문서 등록" 클릭 → Dialog (기존 `Dialog`/`DialogContent` 패턴)
- 필드: 구분(수신/발신 라디오·세그먼트) → `FormField` 제목 → 파일 업로드(신규 `PresbyteryFileField` 컴포넌트, `MediaInputField`와 톤은 맞추되 `uploadPresbyteryDocument` 호출) → 비고(선택)
- 저장 시 `fileType`은 업로드 파일의 MIME으로 자동 판별(`application/pdf` → `'pdf'`, 나머지 → `'other'`)
- 등록 권한: 모든 관리자(최고·부관리자)

### 4.3 PDF 뷰어

- 테이블 행의 [뷰] 클릭 → Dialog 안에 PDF 임베드 — 사이트 팝업 기능의 `PopupPdfBody`(`<object type="application/pdf">` + 새 탭 폴백 링크) 패턴 재사용
- Dialog가 열리는 시점(= 관리자가 실제로 내용을 확인한 시점)에 `isRead: true`로 Firestore 갱신. 이미 읽음이면 재갱신 생략
- PDF가 아닌 문서는 [뷰] 버튼 자체를 숨기고 [다운로드]만 노출

### 4.4 다운로드 / 출력

- **다운로드**: `<a href={fileUrl} download={fileName}>` — 클릭 시 `isRead: true` 갱신(수신 문서 한정, PDF 뷰로 이미 읽음 처리됐으면 중복 갱신 스킵)
- **출력**: 커스텀 인쇄 로직 없이 PDF를 새 탭(`target="_blank"`)으로 열어 브라우저 자체 인쇄 기능에 위임. PDF 외 문서는 [출력] 버튼 비노출

---

## 5. 읽음 처리 로직 요약

| 트리거 | 대상 | 결과 |
|--------|------|------|
| PDF [뷰] Dialog 오픈 | 수신 문서 | `isRead = true` |
| [다운로드] 클릭 | 수신 문서(PDF 여부 무관) | `isRead = true` |
| 위 두 액션 | 발신 문서 | 해당 없음 — `isRead` 필드 자체를 UI에 노출하지 않음 |

Firestore를 그대로 "클라우드"로 사용하므로 "로컬에서 읽음 → 클라우드도 즉시 읽음" 요구사항은 별도 동기화 로직 없이 필드 갱신 하나로 충족된다.

---

## 6. 구현 메모 — 기존 코드 재사용 vs 신규

| 요소 | 기존 재사용 | 신규 필요 |
|------|------------|-----------|
| CRUD | `saveDocument` / `removeDocument` | `getPresbyteryDocuments()` (조회) |
| PDF 뷰 | `PopupPdfBody`의 `<object>` 패턴 | Dialog 래핑 + 읽음 갱신 훅 |
| 업로드 UI 톤 | `FormField`, `Dialog` | `PresbyteryFileField` (파일 종류 무관 첨부), `uploadPresbyteryDocument()` |
| 테이블/페이지네이션/검색 | `NewsPage`의 페이지네이션(`getPageNumbers`) 패턴 | 구분 필터 + 키워드 검색 로직 |
| 라우트 가드 | 없음(신규 패턴) | `isAdminMode` 아니면 리다이렉트 |

### ⚠️ 참고: 기존 코드에서 발견한 별개 이슈

`MediaInputField`의 `pdfOnly` 모드는 내부적으로 `uploadMediaFile()`을 호출하는데, `uploadMediaFile()`이 쓰는 `isAllowedHeroMedia()`는 이미지/mp4/webm만 허용하고 **PDF를 허용 목록에서 빠뜨린 것으로 보입니다** — 사이트 팝업의 PDF 업로드 기능이 실제로는 "허용 형식: 이미지 또는 영상" 에러로 막힐 가능성이 있습니다. 이번 작업 범위는 아니지만, 확인 후 별도로 고쳐드릴지 알려주세요. (이번 신규 기능은 어차피 별도의 `uploadPresbyteryDocument()`를 새로 만들기 때문에 이 버그와 무관하게 동작합니다.)

---

## 7. 인수 기준

1. 일반 사용자(비로그인/`isAdminMode=false`)는 `/admin/nam-gyeonggi`에 직접 접근해도 콘텐츠를 볼 수 없다(홈으로 리다이렉트).
2. 관리자 툴바에 `남경기노회` 버튼이 `팝업 관리` 왼쪽에 노출된다(데스크톱/모바일 모두).
3. 관리자는 수신/발신 문서를 등록할 수 있고, PDF는 인앱 뷰가, 그 외 형식은 다운로드만 동작한다.
4. PDF 뷰 오픈 또는 다운로드 시 수신 문서의 읽음상태가 즉시 `읽음`으로 바뀌고 새로고침해도 유지된다.
5. 구분 필터·키워드 검색·페이지네이션이 정상 동작한다.
6. `presbyteryDocuments`/`presbytery-docs` 모두 비관리자에게는 Firestore/Storage 규칙 레벨에서 완전히 차단된다(직접 SDK 호출 시도로 검증).
7. 브라우저 탭 타이틀이 전 페이지에서 `사랑하는교회|예장합동` 계열로 바뀌고, 로고 alt·Footer 저작권 문구는 기존 그대로다.
8. `npm run lint` / `npx tsc -b` / `npm test` / `npm run build` 통과.

---

## 8. 작업 계획

1. 새 브랜치 생성 (예: `feature/nam-gyeonggi-docs`)
2. 탭 타이틀 수정 (`index.html`, `Seo.tsx`) — 별도 커밋
3. Firestore/Storage 규칙 추가 + 배포
4. `content-service.ts` / `storage-upload.ts` 확장
5. `NamGyeonggiDocsPage` + 테이블/필터/페이지네이션 + 등록 모달 + PDF 뷰어
6. `Header.tsx` 버튼 + `App.tsx` 라우트
7. 코드 리뷰 → 테스트/빌드 → main으로 PR 또는 병합 방식 확인 후 진행

---

## 9. 운영 노트 — Storage 버킷 CORS (2026-08-21 추가)

다운로드 버튼을 "확인 모달 → 실제 fetch+blob으로 디바이스에 저장" 방식으로 구현하려면
**`fetch()`가 `firebasestorage.googleapis.com`에 대해 성공해야 한다.** `<img src>`나 직접
URL 이동은 CORS 검증이 필요 없어 버킷에 CORS 설정이 없어도 동작하지만, `fetch()`는
브라우저가 CORS 모드로 요청을 보내고 서버가 이를 제대로 처리하지 못하면 실패한다
(이 프로젝트에서는 CORS 헤더 부재가 아니라 **503 응답**으로 나타났다 — `curl`로는
`Access-Control-Allow-Origin: *`가 보였지만 실제 브라우저 `fetch()`는 503을 받았음).

**해결**: `gsutil cors set` 또는 `firebase-admin`의 `bucket.setMetadata({ cors })`로
버킷에 CORS를 설정해야 한다. `firebase deploy`(Firestore/Storage 규칙 배포)는 이
버킷 레벨 CORS 설정을 건드리지 않는다 — **별도로, 한 번만** 적용하면 되고 배포마다
반복할 필요는 없다(버킷 메타데이터는 영구적으로 유지됨).

- 설정 파일: `storage-cors.json` (저장소 루트)
- 재적용 방법(계정 꼬임 등으로 다시 필요할 경우):
  ```js
  const { initializeApp, cert } = require('firebase-admin/app')
  const { getStorage } = require('firebase-admin/storage')
  const serviceAccount = require('../prd/tlmchurch-firebase-adminsdk-fbsvc-3660696d5b.json')
  initializeApp({ credential: cert(serviceAccount), storageBucket: 'tlmchurch.firebasestorage.app' })
  const cors = require('../storage-cors.json')
  getStorage().bucket().setMetadata({ cors })
  ```
- 새 배포 도메인(예: 커스텀 도메인)을 추가하면 `storage-cors.json`의 `origin` 배열에도 추가하고 재적용해야 한다.
