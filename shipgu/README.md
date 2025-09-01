# SHIPGU - 글로벌 소싱 플랫폼

무역송금 T/T와 QR코드 결제시스템을 제공하는 종합 소싱 플랫폼입니다.

## 📁 프로젝트 구조

```
shipgu/
├── assets/                     # 정적 자원
│   ├── css/                   # 스타일시트
│   │   ├── common.css        # 공통 스타일
│   │   └── dashboard.css     # 대시보드 전용 스타일
│   ├── js/                   # JavaScript 파일
│   │   ├── common.js         # 공통 유틸리티
│   │   └── dashboard.js      # 대시보드 로직
│   └── images/               # 이미지 파일
├── pages/                    # HTML 페이지
│   ├── dashboard.html        # 메인 대시보드
│   └── login.html           # 로그인 페이지
├── backup/                   # 백업 파일
├── database/                 # 데이터베이스 스키마
│   └── qr-payment-schema.sql # PostgreSQL 스키마
├── qr-payment-system.html    # QR코드 결제시스템
├── trade-remittance-system.html # 무역송금 T/T 시스템
├── admin.html               # 관리자 페이지
└── index.html              # 홈페이지
```

## 🚀 주요 기능

### 1. QR코드 결제시스템
- **지원 결제수단**: 알리페이, 위챗페이, 웨이디엔, 계좌이체
- **실시간 채팅**: AI 결제 어시스턴트
- **결제 현황 관리**: 실시간 결제 진행 상황 추적

### 2. 무역송금 T/T 시스템
- **접근 권한**: 법인회원 전용
- **서류 작성**: 표준 무역송금 신청서 양식
- **기능**: 미리보기, 발행하기, 파일저장
- **필수 정보**: 회사명, 사업자등록번호, 송금금액, 수취인 정보 등

### 3. 1688솔루션
- **iframe 연동**: 1688 사이트 직접 접근
- **수수료 무료**: 직접 구매 지원

## 👥 회원 유형

### 개인회원 (`individual`)
- QR코드 결제시스템 이용 가능
- 1688솔루션 이용 가능

### 사업자회원 (`business`)
- QR코드 결제시스템 이용 가능
- 1688솔루션 이용 가능

### 법인회원 (`corporation`)
- 모든 서비스 이용 가능
- **무역송금 T/T 전용 접근 권한**

## 🧪 테스트 계정

```
👤 개인회원: user@shipgu.com / 12345678
🏢 사업자회원: business@shipgu.com / 12345678
🏛️ 법인회원: corporation@shipgu.com / 12345678
```

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Font**: Pretendard
- **Database**: PostgreSQL 12+
- **Storage**: LocalStorage (개발용)

## 📋 코드 구조

### JavaScript 모듈

#### `common.js`
- **UserManager**: 사용자 인증 및 권한 관리
- **Utils**: 유틸리티 함수 (통화 포맷, 날짜 포맷, 파일 다운로드)
- **FormValidator**: 폼 검증 함수
- **LoadingManager**: 로딩 상태 관리
- **NotificationManager**: 알림 관리

#### `dashboard.js`
- iframe 관리 (QR결제, 1688, 무역송금)
- 사용자 정보 표시
- 서비스 접근 권한 제어

### CSS 모듈

#### `common.css`
- 전역 리셋 및 공통 스타일
- 버튼, 폼, 카드 컴포넌트
- 로딩 스피너, 테스트 계정 스타일

#### `dashboard.css`
- 대시보드 레이아웃 (사이드바, 메인 컨텐츠)
- 서비스 카드 그리드
- iframe 임베드 영역
- 반응형 디자인

## 🔧 개발 가이드

### 새로운 페이지 추가
1. `pages/` 폴더에 HTML 파일 생성
2. 공통 CSS/JS 파일 링크 추가
3. 필요시 전용 CSS/JS 파일 작성

### 새로운 서비스 추가
1. HTML 파일을 루트에 생성
2. `dashboard.js`에 함수 추가
3. 권한 체크 로직 구현

## 📄 라이선스

SHIPGU © 2024. All rights reserved.