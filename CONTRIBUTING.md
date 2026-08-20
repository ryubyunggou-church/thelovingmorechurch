# Contributing — The 사랑하는 교회 홈페이지

## 코드 규칙

- 단일 파일 **250~300줄 초과 시 분리**를 검토한다.
- 컴포넌트/로직은 기능 단위로 분해: `src/pages`, `src/components`, `src/features`, `lib`, `hooks`, `types`.
- `alert` 금지 — Modal / Toast만 사용.
- 공식 명칭은 항상 **대한예수교장로회 사랑하는교회**.

## 시크릿

- `.env` / 비밀번호 / 서비스 계정 키는 커밋하지 않는다.
- `prd/github-firebase-info.txt`는 로컬 참고용이며 **원격 저장소에 올리지 말 것**.
- `prd/*firebase-adminsdk*.json`(Firebase 서비스 계정 키)도 로컬 전용 — `.gitignore`에
  `**/*firebase-adminsdk*.json` 패턴으로 이미 제외되어 있다. 발급 방법은 아래 "배포" 참고.
- `prd/github-pat.txt`(GitHub fine-grained PAT)도 로컬 전용 — `.gitignore`에
  `prd/github-pat*.txt` 패턴으로 제외되어 있다. 발급/연결 방법은
  `prd/DEPLOY_ACCOUNT_RECOVERY.md` 참고.

## 테스트

```bash
npm test          # Vitest 단위 테스트
npm run build     # 타입체크 + 프로덕션 빌드
npm run e2e       # Playwright (빌드 후 preview 기준)
```

## 배포

Firebase CLI 로그인은 브라우저 세션에 남은 다른 구글 계정과 자주 꼬인다(계정 혼선 복구는
`prd/DEPLOY_ACCOUNT_RECOVERY.md` 참고). **서비스 계정 키**를 쓰면 이 문제를 아예 피할 수 있다.

**1) 최초 1회 — 서비스 계정 키 발급**

1. https://console.firebase.google.com/project/tlmchurch/settings/serviceaccounts/adminsdk 접속
   (`ryubyunggou@gmail.com`으로 로그인)
2. "새 비공개 키 생성" → JSON 다운로드 → `prd/` 폴더로 이동 (파일명에 `firebase-adminsdk` 포함되면
   자동으로 git에서 제외됨)

**2) 배포**

```bash
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/prd/<발급받은-firebase-adminsdk-키파일>.json"

npm run build
npx firebase deploy --only hosting,firestore:rules,storage
# Functions (Blaze 플랜 필요)
cd functions && npm i && npm run build && cd .. && npx firebase deploy --only functions
```

`GOOGLE_APPLICATION_CREDENTIALS`가 설정되어 있으면 `firebase login` 없이도 배포된다.
