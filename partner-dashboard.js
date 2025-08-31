// TROY 로고 클릭 시 홈으로 이동 (로그인 상태 유지)
function goToHome() {
    // 이미 로그인된 상태이므로 현재 대시보드 유지
    // 아무 동작 없음
}

// 공지사항 페이지로 이동
function showNoticeBoard() {
    window.location.href = 'notice-board.html';
}

// 서비스 소개 페이지로 이동
function showServiceInfo() {
    window.location.href = 'service-info.html';
}

// 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    // 로그아웃 기능
    document.querySelector('.logout').addEventListener('click', function() {
        if (confirm('로그아웃하시겠습니까?')) {
            window.location.href = 'index.html';
        }
    });

    // 새 파트너십 등록 버튼
    document.querySelector('.new-campaign-btn').addEventListener('click', function() {
        alert('새로운 파트너십 등록 기능은 준비 중입니다.');
    });

    // 메뉴 아이템 클릭 이벤트
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 액션 버튼 클릭 이벤트
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('이 기능은 준비 중입니다.');
        });
    });

    // 채팅 상담 버튼
    document.querySelector('.chat-button').addEventListener('click', function() {
        alert('채팅 상담 기능은 준비 중입니다.');
    });
});
