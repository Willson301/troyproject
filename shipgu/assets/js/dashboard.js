// 대시보드 전용 JavaScript

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 로그인 확인
    if (!UserManager.requireLogin()) return;
    
    // 사용자 정보 표시
    initializeUserInfo();
    
    // 회원 타입 스위처 초기화
    initializeMemberSwitcher();
    
    // QR코드 결제시스템을 기본으로 표시
    showQRPaymentSystem();
    console.log('QR코드 결제시스템이 기본으로 표시됩니다');
});

// 사용자 정보 초기화
function initializeUserInfo() {
    const currentUser = UserManager.getCurrentUser();
    
    // 사용자명 표시
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = currentUser.name || '사용자';
    }
    
    // 회원 유형 표시
    const userTypeEl = document.getElementById('userType');
    if (userTypeEl) {
        const typeMap = {
            individual: '개인회원',
            business: '사업자회원',  
            corporation: '법인회원',
            admin: '관리자'
        };
        userTypeEl.textContent = typeMap[currentUser.memberType] || '일반회원';
    }
}

// 회원 타입 스위처 초기화
function initializeMemberSwitcher() {
    const switcher = document.getElementById('memberTypeSwitcher');
    if (!switcher) return;
    
    const currentUser = UserManager.getCurrentUser();
    
    // 현재 회원 타입으로 선택 설정
    switcher.value = currentUser.memberType || 'individual';
    
    // 변경 이벤트 리스너 추가
    switcher.addEventListener('change', function() {
        switchMemberType(this.value);
    });
}

// 회원 타입 전환
function switchMemberType(newMemberType) {
    const currentUser = UserManager.getCurrentUser();
    
    // 회원 타입별 테스트 데이터
    const memberData = {
        individual: {
            name: '홍길동',
            memberType: 'individual',
            email: 'user@shipgu.com'
        },
        business: {
            name: '김사업',
            memberType: 'business',
            email: 'business@shipgu.com'
        },
        corporation: {
            name: '법인대표',
            memberType: 'corporation',
            email: 'corporation@shipgu.com',
            isVerified: true
        },
        admin: {
            name: '관리자',
            memberType: 'admin',
            email: 'admin@shipgu.com',
            role: 'admin',
            isVerified: true
        }
    };
    
    // 새로운 사용자 정보 생성
    const newUserData = {
        ...currentUser,
        ...memberData[newMemberType],
        loginTime: new Date().toISOString()
    };
    
    // localStorage 업데이트
    localStorage.setItem('currentUser', JSON.stringify(newUserData));
    
    // UI 업데이트
    initializeUserInfo();
    
    console.log(`회원 타입이 ${newMemberType}로 변경되었습니다.`);
}

// iframe 관리 함수들
function showQRPaymentSystem() {
    const embedded1688 = document.getElementById('embedded1688');
    const iframe = document.getElementById('embed1688Iframe');
    const title = document.getElementById('embeddedTitle');
    
    if (!embedded1688 || !iframe || !title) return;
    
    // iframe을 QR코드 결제시스템으로 변경
    iframe.src = '../qr-payment-system.html';
    title.innerHTML = '💳 QR코드 결제시스템';
    
    // 닫기 버튼 설정
    setupCloseButton();
    
    embedded1688.style.display = 'block';
    console.log('QR코드 결제시스템이 iframe에 표시됩니다');
}

function show1688Solution() {
    const embedded1688 = document.getElementById('embedded1688');
    const iframe = document.getElementById('embed1688Iframe');
    const title = document.getElementById('embeddedTitle');
    
    if (!embedded1688 || !iframe || !title) return;
    
    // iframe을 1688로 변경
    iframe.src = 'https://www.1688.com';
    title.innerHTML = '🛒 1688 솔루션';
    
    // 닫기 버튼 설정
    setupCloseButton();
    
    embedded1688.style.display = 'block';
    console.log('1688 솔루션이 iframe에 표시됩니다');
}

function showTradeRemittanceSystem() {
    // 팝업만 표시하고 확인 버튼으로 닫기만 가능
    showTradeRemittanceModal();
}

// 무역송금 모달 표시
function showTradeRemittanceModal() {
    const modal = document.getElementById('tradeRemittanceModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    }
}

// 무역송금 모달 닫기
function closeTradeRemittanceModal() {
    const modal = document.getElementById('tradeRemittanceModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // 스크롤 복원
    }
}


// 닫기 버튼 설정
function setupCloseButton() {
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.onclick = close1688;
    }
}

// iframe 닫기
function close1688() {
    const embedded1688 = document.getElementById('embedded1688');
    if (embedded1688) {
        embedded1688.style.display = 'none';
    }
    console.log('임베드 영역이 숨겨졌습니다');
}

// 서비스 선택 다이얼로그
function showServiceSelection() {
    const services = [
        { name: '1688솔루션', desc: '수수료 없는 1688 직접 구매 (자동 표시됨)' },
        { name: 'QR코드 결제시스템', desc: '알리페이/위챗페이/웨이디엔/계좌이체', action: 'showQRPaymentSystem' },
        { name: '무역송금(T/T)', desc: '법인회원 송금시스템', url: '../trade-remittance-system.html' }
    ];
    
    let message = '📋 서비스를 선택해주세요:\n\n';
    services.forEach((service, index) => {
        message += `${index + 1}. ${service.name}\n   ${service.desc}\n\n`;
    });
    
    const choice = prompt(message + '선택하실 번호를 입력해주세요 (1-3):');
    
    if (choice) {
        const selectedIndex = parseInt(choice) - 1;
        const selectedService = services[selectedIndex];
        
        if (selectedService) {
            if (selectedService.url) {
                window.open(selectedService.url, '_blank');
            } else if (selectedService.action === 'showQRPaymentSystem') {
                showQRPaymentSystem();
            } else if (selectedService.name === '1688솔루션') {
                NotificationManager.info('1688 솔루션은 이미 대시보드에 표시되어 있습니다!');
            }
        }
    }
}