# Contributing — The 사랑하는 교회 홈페이지

## 코드 규칙

- 단일 파일 **250~300줄 초과 시 분리**를 검토한다.
- 컴포넌트/로직은 기능 단위로 분해: `src/pages`, `src/components`, `src/features`, `lib`, `hooks`, `types`.
- `alert` 금지 — Modal / Toast만 사용.
- 공식 명칭은 항상 **대한예수교장로회 사랑하는교회**.

## 시크릿

- `.env` / 비밀번호 / 서비스 계정 키는 커밋하지 않는다.
- `prd/github-firebase-info.txt`는 로컬 참고용이며 **원격 저장소에 올리지 말 것**.

## 테스트

```bash
npm test          # Vitest 단위 테스트
npm run build     # 타입체크 + 프로덕션 빌드
npm run e2e       # Playwright (빌드 후 preview 기준)
```

## 배포

```bash
npm run build
npx firebase deploy --only hosting,firestore:rules,storage
# Functions (Blaze 플랜 필요)
cd functions && npm i && npm run build && cd .. && npx firebase deploy --only functions
```
