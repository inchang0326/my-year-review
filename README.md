# year-end-review

개인 회고(로컬 저장)와 협업 회고(실시간 동기화)를 모두 지원하는 연말 회고 보드 앱입니다.  
개인 모드는 브라우저 LocalStorage에 저장되고, 협업 모드는 Firebase Realtime Database를 통해 **세션(초대코드) 단위로** 실시간 공유됩니다.

## 주요 기능

### 개인모드 (LocalStorage)

- 연도별 회고 보드 작성/삭제
- 브라우저에 자동 저장(새로고침/재방문 유지)
- 닉네임 설정(작성자명)

### 협업모드 (Firebase Realtime Database)

- “협업모드 만들기”로 세션 생성(초대코드 발급)
- “협업모드 참여”로 초대코드 입력 후 동일 보드 접속
- 참여자 목록 표시(세션 collaborators)
- 작성/삭제가 실시간으로 동기화(onValue 기반)
- 마지막 참여자가 나갈 때 세션 삭제 여부 확인(confirm)

### UI/UX

- 상단 중앙 타이틀(예: `2025년 회고`)
- 테마 전환(☀️ / 🌙)
- 설정(☰) 드로어에서 모드 전환/협업 생성·참여/초대코드/나가기/닉네임 수정

---

## 기술 스택

- React + TypeScript
- (빌드 도구) Vite(일반적으로 사용되는 구성)
- Firebase
  - Authentication: 익명 로그인(사용자 uid 발급)
  - Realtime Database: 세션/아이템/참여자 저장 및 실시간 동기화

---

## 프로젝트 실행 방법

### 1) 설치

```bash
npm install
```

### 2) 환경변수 설정

프로젝트 루트에 `.env` 파일을 만들고 Firebase 설정을 입력합니다.  
(Vite 사용 시 보통 `VITE_` 접두사를 사용합니다.)

예시:

```bash
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

> 실제 키 이름은 `src/utils/firebase.ts`(또는 유사 파일)에서 읽는 환경변수 명칭에 맞춰주세요.

### 3) Firebase 콘솔 설정

Firebase Console에서 아래를 설정합니다.

- Authentication → Sign-in method → **Anonymous(익명)** 활성화
- Realtime Database 생성
- Realtime Database Rules 설정(예시는 아래 참고)

### 4) 개발 서버 실행

```bash
npm run dev
```

### 5) 빌드 / 프리뷰

```bash
npm run build
npm run preview
```

---

## Realtime Database 데이터 구조(권장)

```text
sessions/
  {sessionId}/
    id: string
    creatorId: string
    creatorName: string
    year: number
    createdAt: number
    expiresAt: number
    items/
      {itemId}/
        id: string
        category: "start" | "stop" | "continue"
        content: string
        createdAt: number
        createdBy: string
    collaborators/
      {uid}/
        userId: string
        name: string
        joinedAt: number
        color: string
```

---

## Realtime Database Rules 예시

아래는 “세션/아이템/참여자”를 다루기 위한 기본 예시입니다.  
운영 환경에서는 인증/권한을 더 엄격히 하길 권장합니다.

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": true,
        ".write": true,
        "items": {
          "$itemId": {
            ".read": true,
            ".write": true,
            ".validate": "newData.hasChildren(['id', 'category', 'content', 'createdAt', 'createdBy'])"
          }
        },
        "collaborators": {
          ".read": true,
          ".write": true
        }
      }
    }
  }
}
```

---

## 사용 방법

### 개인모드

1. 설정(☰) 열기
2. 닉네임 “수정 → 확인”
3. 개인모드에서 카드 추가/삭제
   - 개인 모드 데이터는 내 브라우저에만 저장됩니다.

### 협업모드 만들기

1. 설정(☰) 열기
2. 닉네임 “수정 → 확인”
3. `협업모드 만들기` 선택
4. 초대코드 모달에서 복사 후 공유

### 협업모드 참여

1. 설정(☰) 열기
2. `협업모드 참여` 선택 후 초대코드 입력

### 나가기 / 세션 삭제

- 협업 중 `나가기` 선택
- 마지막 참여자라면 “세션 삭제 여부”를 확인받고, 선택에 따라 세션을 유지하거나 삭제합니다.

---

## 폴더 구조(예시)

```text
src/
  components/
    Header.tsx
    SettingsDrawer.tsx
    InviteModal.tsx
    JoinModal.tsx
    ReviewBoard.tsx
    ...
  hooks/
    useFirebase.ts
    useLocalStorage.ts
  utils/
    firebase.ts
    constants.ts
  styles/
    globals.css
  types/
    index.ts (또는 types.ts)
```
