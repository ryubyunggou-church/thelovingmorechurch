# 배포 계정 꼬임 복구 절차

이 컴퓨터에는 구글 계정이 여러 개(개인용 `najongchoon@gmail.com`, 교회용
`ryubyunggou@gmail.com`) 등록되어 있고, GitHub도 로그인 계정이 여러 번 바뀐
이력이 있다. `git push` / `firebase deploy`가 갑자기 403이나 "권한 없음"으로
막히는 건 대부분 **엉뚱한 계정으로 로그인되어 있어서**다. 아래는 2026-08-20에
실제로 겪은 문제와 해결 순서를 정리한 것.

## 왜 이런 일이 반복되는가

1. **브라우저에 이미 로그인된 계정이 자동으로 선택된다.** `gh auth login` /
   `firebase login`이 브라우저를 열면, 이미 로그인돼 있는 계정(보통 개인 계정)이
   기본으로 잡히기 쉽다. 명시적으로 "다른 계정 사용"을 누르지 않으면 원치 않는
   계정으로 인증이 끝나버린다.
2. **AI 에이전트가 실행하는 터미널에는 진짜 TTY가 없다.** `firebase login`,
   `firebase login:ci`, `gh auth login`처럼 대화형 입력이 필요한 명령은 에이전트의
   Bash 실행 환경에서 바로 완주되지 않는다("Cannot run login in non-interactive
   mode" 에러). **반드시 Terminal.app 등 실제 터미널에서 사람이 직접 실행**해야
   한다.
3. **로컬 저장 인증 정보는 계정별로 하나만 유지된다.** `~/.config/configstore/
   firebase-tools.json`, `gh`의 keyring 모두 마지막으로 로그인한 계정만 남는다 —
   여러 계정을 오가며 로그인하면 이전 로그인이 덮어써진다.

## GitHub push 403 — 복구 순서

```bash
gh auth status              # 어떤 계정이 활성인지, 토큰이 유효한지 확인
gh auth login -h github.com # 실제 터미널에서 직접 실행 (디바이스 코드 로그인)
gh auth setup-git           # gh 로그인 자격증명을 git이 쓰도록 연결
git push origin main
```

디바이스 코드 로그인은 터미널에 8자리 코드(`XXXX-XXXX`)가 뜨고, 그 코드를
`https://github.com/login/device`에 입력 → 저장소 쓰기 권한이 있는 계정
(`ryubyunggou-church`)으로 승인하면 끝난다. **한 번 성공하면 keyring에
영구 저장**되므로 이후 세션에서는 다시 할 필요가 없다 — `gh auth status`로
`ryubyunggou-church (keyring)`가 뜨면 정상.

## Firebase deploy — 계정 불일치 복구 순서

가장 흔한 증상: `firebase deploy` → `Failed to get Firebase project tlmchurch.
Please make sure the project exists and your account has permission`.

```bash
firebase login:list   # 현재 로그인된 계정 확인 — tlmchurch 소유 계정이 아니면 아래로
firebase logout
firebase login:ci     # 실제 터미널에서 직접 실행
```

1. `login:ci`가 출력하는 URL을 **새로**(이전 탭 재사용 금지) **시크릿 브라우저
   창**에서 연다 — 캐시된 세션 때문에 엉뚱한 계정으로 인증되는 걸 막기 위해서다.
2. 계정 선택 화면에서 목록을 클릭하지 말고 **"다른 계정 사용"**을 눌러
   `ryubyunggou@gmail.com`을 직접 타이핑해서 로그인한다.
3. 터미널에 최종적으로 `✔ Success! Use this token...` 과 함께 CI 토큰이
   출력되는 걸 확인한다 (브라우저의 "로그인 성공" 화면만으로는 실제 토큰
   교환이 끝났는지 알 수 없다 — 반드시 터미널 출력을 확인할 것).

이 토큰은 **임시방편**이다(`--token` 인증은 firebase-tools에서 deprecated).
**영구적인 해결책은 서비스 계정 키**를 발급받아 두는 것 — 방법은
`CONTRIBUTING.md`의 "배포" 섹션 참고. 서비스 계정 키를 쓰면 이 계정 꼬임
복구 과정 자체가 필요 없어진다.

## 이미 해결된 상태 (2026-08-20 기준)

- GitHub: `gh` keyring에 `ryubyunggou-church` 계정으로 영구 로그인됨.
- Firebase: `prd/tlmchurch-firebase-adminsdk-*.json` 서비스 계정 키 발급 완료,
  `GOOGLE_APPLICATION_CREDENTIALS`로 비대화형 배포 가능.

둘 다 다시 꼬였을 때만 위 복구 절차를 따르면 된다.
