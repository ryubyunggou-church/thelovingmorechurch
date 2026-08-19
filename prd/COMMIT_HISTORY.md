# Commit History

- 저장소: `https://github.com/ryubyunggou-church/thelovingmorechurch.git`
- 정렬: **최신 커밋이 위** (내림차순)
- 갱신: `git log --pretty=format:'%h|%ad|%s' --date=short` 기준으로 수동 또는 배포 시 동기화

---

| 해시 | 날짜 | 내용 |
|------|------|------|
| `3f995f8` | 2026-08-19 | fix(footer): 저작권 줄을 Quick Link 하단과 정렬 + 메타 색상 gold 통일 |
| `74c68f9` | 2026-08-19 | fix(footer): Quick Link 뱃지 중앙정렬 + 저작권·Email·Admin 좌측 이동 |
| `b0f6512` | 2026-08-19 | feat(footer): 바로가기 영역에 Quick Link 라운드 뱃지 추가 |
| `99ef8ad` | 2026-08-19 | fix(footer): 바로가기 6개 순서 — 1열 교회소개·예배·교육 / 2열 선교·소식·오시는길 |
| `99ccae8` | 2026-08-19 | fix(footer): 요청 레이아웃대로 2열·바로가기 5개만 유지 |
| `be491fa` | 2026-08-19 | feat(footer): 바로가기 링크 + 협력기관 로고 복구 |
| `4c19425` | 2026-08-18 | ci: main push 자동 Firebase 배포 비활성 — 수동(workflow_dispatch)만 허용 |
| `22321ca` | 2026-08-18 | merge: experiment/home-ui-ux-pro-max — HOME 시각 파일럿 (가독성·터치·협력기관 호버/파스텔) |
| `b52544d` | 2026-08-18 | feat(home): HOME ui-ux-pro-max 파일럿 — 가독성·터치·협력기관 호버 안정화 |
| `3c7dd7c` | 2026-08-16 | feat(admin): 로그인 이메일 기억하기 + 로그인 완료 시 페이지 상단 이동 |
| `4deffbf` | 2026-08-16 | docs: COMMIT_HISTORY에 팝업 기능 커밋 기록 |
| `e9bcc31` | 2026-08-16 | Merge feat/site-popup: 사이트 팝업 기능 (날짜지정/이미지·PDF·텍스트/위치·순차노출/모바일비활성화) |
| `70eb74d` | 2026-08-16 | fix(popup): 스택형 순차 노출 + 위치 옵션 개편 |
| `d140410` | 2026-08-16 | fix(popup): WYSIWYG 텍스트 에디터로 교체 + 팝업 디자인 개선 |
| `4291e8a` | 2026-08-16 | feat(popup): 사이트 팝업 기능 구현 — 날짜지정/이미지·PDF·마크다운/위치·순차노출/모바일비활성화 |
| `ed582cb` | 2026-08-16 | docs: COMMIT_HISTORY에 최근 10개 커밋 기록 |
| `f7b134f` | 2026-08-16 | feat(hero): Hero 슬라이드 관리 패널 추가 — 통합 편집/삭제/D&D 순서변경 |
| `7627e53` | 2026-08-15 | chore: assets-staging/ 로컬 전용으로 gitignore 처리 |
| `1089bef` | 2026-08-15 | Merge feat/image-upload-compression: 이미지 업로드 전 자동 리사이즈 + WebP 압축 |
| `b1d1448` | 2026-08-15 | feat(storage): 이미지 업로드 전 자동 리사이즈 + WebP 압축 |
| `4b47148` | 2026-08-15 | fix(worship,layout,education): 예배안내 안내문구 제거·탑바 폰트 확대·부서명 인라인 수정 |
| `e48ab29` | 2026-08-14 | perf(hosting): Firebase Storage SDK를 업로드 시점까지 지연 로드 |
| `c751184` | 2026-08-14 | chore(functions): Node 24 런타임 + firebase-functions/admin 최신화 |
| `9cef3e6` | 2026-08-14 | fix(home): 남경기노회 협력기관 링크 URL 갱신 |
| `f4e7dc8` | 2026-08-14 | ci: Firebase 자동배포 GitHub Actions 워크플로우 추가 |
| `a2b98ab` | 2026-08-14 | docs: COMMIT_HISTORY에 호버효과·스크롤 리셋 커밋 기록 |
| `74c67d5` | 2026-08-14 | fix(app): 라우트 이동 시 스크롤 위치 리셋 — 페이지 상단 잘림 방지 |
| `9ccb121` | 2026-08-14 | feat(contact): 주차안내 사진에 호버 애니메이션 + 블러 그림자 적용 |
| `8eae226` | 2026-08-14 | feat(contact,footer): 전화/이메일에 tel:/mailto: 링크 추가 |
| `700afbd` | 2026-08-14 | fix(contact): 연락처 카드 타이틀을 카드 내부로 이동해 지도 카드와 높이 정렬 |
| `8a86f57` | 2026-08-14 | fix(contact): 지도 embed 코드 대신 이미지 업로드로 전환 (MVP) |
| `d99575a` | 2026-08-14 | fix(contact): 지도 embed — 네이버 iframe 차단 대응, 카카오맵 코드 지원 |
| `65e41ca` | 2026-08-14 | fix(contact): 주소 입력 필드를 여러 줄(Textarea)로 변경 |
| `85ebfc6` | 2026-08-14 | feat(contact): 오시는길 2탭 개편 — 경로 안내·주차안내 (관리자 편집) |
| `de232a8` | 2026-08-14 | fix(contact): 연락처 카드 타이틀·대비 배경 추가, 중복 예배시간 섹션 제거 |
| `4d790fa` | 2026-08-14 | fix(news): newsPosts 복합 인덱스 배포 + 조용한 에러 폴백 방지 |
| `3c6ec15` | 2026-08-14 | feat(news): 상세페이지 수정·삭제 추가, 썸네일 자동 배정, 임시저장 제거 |
| `69693f3` | 2026-08-14 | feat(education,missions): 관리자 부서/사역 추가·삭제 및 대표사진 자동 배정 |
| `7b10437` | 2026-08-14 | feat(education,missions): 교육부서 4탭·선교사역 2탭 편집 UI 구현 |
| `09d91e9` | 2026-08-13 | docs: COMMIT_HISTORY에 예배안내 커밋 기록 |
| `bfa8ec2` | 2026-08-13 | feat(worship): 예배안내 편집 고도화 및 공개 스케줄 패널 |
| `24cbb13` | 2026-08-13 | feat(about): 교회소개 3탭 레이아웃·편집·시드 구현 |
| `dd36287` | 2026-08-13 | feat: 사랑하는교회 홈페이지 랜딩 1차 구현 |
