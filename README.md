# year-end-review

개인모드와 협업모드 모두 지원하는 연말 회고 보드 앱입니다.  

## Skills
- React.js + TypeScript on Vite
- PWA(Progressive Web App) build
- Kakaotalk share link integration
- Vercel: static web resources hosting
- Firebase: Pub/Sub Realtime Database

## Features

### 개인모드

- LocalStorage 활용 연도별 회고 보드 편집

### 협업모드

- 협업모드 만들기 통해 세션 생성 및 초대코드 발급
- 협업모드 참여하기 통해 초대코드 입력 후 동일 세션 접속
- 동일 세션 참여자 목록 조회
- Firebase Realtime Database 활용 동일 세션 참여자 동일 회고 보드 편집
- 마지막 참여자 탈출 시 세션 유지여부 확인

## UI/UX

- 홈 화면
![홈_밤_화면](https://github.com/user-attachments/assets/e06b6fc5-9a45-45b2-acb0-891feba376e4)
![홈_낮_화면](https://github.com/user-attachments/assets/3a51afe4-dea3-46bd-96a7-8d060eaeff3a)
- 개인모드 메뉴
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/71e0875f-da99-4cef-b37a-06d94baffceb" />
- 협업모드 메뉴
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/15941c6e-233c-4216-a00a-118438573ccc" />
- 협업모드 만들기
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/41bd2106-800a-476f-a31f-85420d71a13b" />
- 협업모드 참여하기 (공유 링크 통해 다이렉트 참여 가능함)

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
