# Troy 광고주센터 - HTML 버전

## 📁 파일 구성
```
troy-project/
├── index.html           - 로그인 페이지 (메인)
├── dashboard.html       - 대시보드 페이지 (관리자/고객사)
├── agency-clients.html  - 대행사 클라이언트 관리
├── agency-folders.html  - 대행사 폴더 관리
├── schedule.html        - 스케줄 관리 (캘린더/목록 뷰)
├── campaign-create.html - 새 캠페인 등록
├── my-info.html         - 마이페이지 (정보/카드 관리)
├── troy.html           - 백업용 원본 로그인
└── README.md           - 이 파일
```

## 🚀 실행 방법

### 방법 1: 파일 직접 열기 (가장 간단)
- `index.html` 파일을 더블클릭해서 브라우저에서 열기

### 방법 2: 로컬 서버 실행 (권장)
```bash
# Python이 설치된 경우
cd troy-project
python -m http.server 8000
# 브라우저에서 http://localhost:8000 접속

# 또는 Node.js가 설치된 경우
npx http-server
# 브라우저에서 http://localhost:8080 접속
```

### 방법 3: VSCode Live Server
1. Visual Studio Code 설치
2. Live Server 확장 설치
3. `index.html` 우클릭 → "Open with Live Server"

## 🔑 테스트 계정

| 역할 | 이메일 | 비밀번호 | 권한 |
|------|--------|----------|------|
| 관리자 | admin301@troy.com | admin301 | 전체 시스템 관리 |
| 대행사 | agent301@troy.com | agent301 | 클라이언트 관리 |
| 고객사 | c301@troy.com | c301 | 캠페인 관리 |

## 📋 주요 기능

### 로그인 페이지 (index.html)
- ✅ 반응형 디자인
- ✅ 애니메이션 효과
- ✅ 테스트 계정 로그인
- ✅ 로딩 스피너
- ✅ 사용자 검증

### 대시보드 (dashboard.html)
- ✅ 역할별 사이드바 메뉴
- ✅ 예치금 잔액 표시
- ✅ 캠페인 통계 카드
- ✅ 캠페인 목록 표시
- ✅ 검색 기능
- ✅ 새 캠페인 등록 연결

### 대행사 클라이언트 관리 (agency-clients.html)
- ✅ 클라이언트 목록 표시
- ✅ 클라이언트 추가/수정 모달
- ✅ 검색 및 상태별 필터링
- ✅ 클라이언트별 통계 (캠페인, 매출, 전환율)
- ✅ 이메일 연락 기능

### 스케줄 관리 (schedule.html)  
- ✅ 캘린더 뷰 / 목록 뷰 전환
- ✅ 월별 네비게이션
- ✅ 일정 유형별 색상 구분
- ✅ 일정 상세 정보 표시
- ✅ 반응형 캘린더 그리드

### 캠페인 생성 (campaign-create.html)
- ✅ 단계별 폼 구성
- ✅ 실시간 미리보기
- ✅ 이미지 드래그&드롭 업로드
- ✅ 폼 유효성 검증
- ✅ 임시저장 기능

### 대행사 폴더 관리 (agency-folders.html)
- ✅ 클라이언트별 폴더 관리
- ✅ 폴더 생성/수정/삭제
- ✅ 폴더별 통계 (진행중/완료/총예산)
- ✅ 카드 형태 UI

### 마이페이지 (my-info.html)
- ✅ 계정 정보 표시
- ✅ 예치금 관리 (충전/내역)
- ✅ 결제 카드 관리
- ✅ 역할별 정보 표시

## 🔧 기술 스택
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **스타일링**: CSS Grid, Flexbox
- **저장소**: LocalStorage
- **반응형**: CSS Media Queries

## 🎯 사용 시나리오

1. **로그인**: `index.html`에서 테스트 계정으로 로그인
2. **자동 이동**: 로그인 성공 시 `dashboard.html`로 자동 이동
3. **대시보드**: 역할별 메뉴와 캠페인 목록 확인
4. **검색**: 캠페인 검색 기능 테스트
5. **로그아웃**: 사이드바 또는 헤더에서 로그아웃

## 📝 개발 참고사항

### 데이터 저장
- 사용자 정보: `localStorage.currentUser`
- 예치금 정보: `localStorage.depositBalance`

### 파일 구조
- **단일 파일 시스템**: 각 페이지가 독립적인 HTML 파일
- **CSS 내장**: 스타일이 각 HTML 내부에 포함
- **JavaScript 내장**: 기능이 각 HTML 내부에 포함

### 확장 가능성
- 추가 페이지 생성 시 동일한 구조 유지
- localStorage 기반 데이터 관리
- 역할별 접근 권한 제어

## 🌟 특징
- **서버 불필요**: 순수 HTML/CSS/JS로 구현
- **반응형**: 모바일/태블릿/데스크톱 지원
- **역할 관리**: 관리자/대행사/고객사별 메뉴
- **실시간 업데이트**: LocalStorage 기반 상태 관리

## 📞 문의사항
추가 기능이나 수정사항이 있으시면 언제든 연락주세요!

---
© 2025 Troy Advertising Platform. All rights reserved.