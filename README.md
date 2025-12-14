# year-end-review

개인모드와 협업모드 모두 지원하는 연말 회고 보드 앱입니다.  

## 기술 스택
- React.js + TypeScript on Vite
- PWA(Progressive Web App) build
- Kakaotalk share link integration
- Vercel: static web resources hosting
- Firebase: Pub/Sub Realtime Database

## 주요 기능

### 개인모드

- LocalStorage 활용 연도별 회고 보드 편집

### 협업모드

- 협업모드 만들기 통해 세션 생성 및 초대코드 발급
- 협업모드 참여하기 통해 초대코드 입력 후 동일 세션 접속
- 동일 세션 참여자 목록 조회
- Firebase Realtime Database 활용 동일 세션 참여자 동일 회고 보드 편집
- 마지막 참여자 탈출 시 세션 유지여부 확인

## UI/UX

- 상단 중앙 타이틀(예: `2025년 회고`)
- 테마 전환(☀️ / 🌙)
- 설정(☰) 드로어에서 모드 전환/협업 생성·참여/초대코드/나가기/닉네임 수정

---

## 프로젝트 실행 방법

### 1) 설치

```bash
npm install
```

### 2) 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 Firebase와 Kakao Developers 설정을 입력합니다.
(운영 환경은 웹 호스팅 설정 내 환경 변수를 사용합니다.)

예시:

```bash
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

VITE_KAKAO_JS_KEY=YOUR_KAKAO_JS_KEY
```

### 3) Firebase 콘솔 설정

- Authentication → Sign-in method → **Anonymous(익명)** 활성화
- Realtime Database 생성 및 데이터 구조
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
- Realtime Database Rules 설정
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

### 4) 개발 서버 실행

```bash
npm run dev
```

### 5) PWA build / preview

```bash
npm run build
npm run preview
```
