# 최고관리자 시딩 (1회)

Firebase Console 또는 Admin SDK로 다음을 수행한다.

1. Authentication → 이메일/비밀번호 사용자 생성  
   - 이메일: `ryubyunggou@gmail.com`
2. Firestore `admins/{uid}` 문서 생성:

```json
{
  "email": "ryubyunggou@gmail.com",
  "role": "super",
  "createdAt": "2026-08-12T00:00:00.000Z"
}
```

3. `firestore.rules` 배포 후 로그인 테스트.

> 클라이언트 UI로는 super 계정을 생성하지 않는다 (부트스트랩 전용).
