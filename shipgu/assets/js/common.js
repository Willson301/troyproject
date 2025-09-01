// SHIPGU 공통 JavaScript 함수들

// 사용자 정보 관리
const UserManager = {
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser') || '{}');
    },
    
    setCurrentUser(userData) {
        localStorage.setItem('currentUser', JSON.stringify(userData));
    },
    
    clearCurrentUser() {
        localStorage.removeItem('currentUser');
    },
    
    isLoggedIn() {
        const user = this.getCurrentUser();
        return !!(user && user.email);
    },
    
    isCorporation() {
        const user = this.getCurrentUser();
        return user && user.memberType === 'corporation';
    },
    
    requireLogin() {
        if (!this.isLoggedIn()) {
            alert('로그인이 필요합니다.');
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },
    
    requireCorporation() {
        if (!this.isCorporation()) {
            alert('무역송금 T/T는 해외물품대금 지급증빙자료로써, 사업자회원중 업태에 \'해외 구매대행업\' / 법인 회원만 이용하실 수 있습니다.');
            return false;
        }
        return true;
    }
};

// 유틸리티 함수들
const Utils = {
    formatCurrency(amount) {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(amount);
    },
    
    formatDate(date) {
        return new Date(date).toLocaleDateString('ko-KR');
    },
    
    formatDateTime(date) {
        return new Date(date).toLocaleString('ko-KR');
    },
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    downloadFile(content, filename, contentType = 'text/html') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// 폼 검증 함수들
const FormValidator = {
    isEmpty(value) {
        return !value || value.trim() === '';
    },
    
    isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    isBusinessNumber(number) {
        const businessRegex = /^\d{3}-\d{2}-\d{5}$/;
        return businessRegex.test(number);
    },
    
    validateRequired(fields) {
        for (const [key, value] of Object.entries(fields)) {
            if (this.isEmpty(value)) {
                alert(`${key} 항목을 입력해주세요.`);
                return false;
            }
        }
        return true;
    }
};

// 로딩 상태 관리
const LoadingManager = {
    show(element, text = '처리 중...') {
        if (!element) return;
        element.disabled = true;
        element.innerHTML = `<div class="loading-spinner"></div>${text}`;
    },
    
    hide(element, originalText) {
        if (!element) return;
        element.disabled = false;
        element.innerHTML = originalText;
    }
};

// 알림 관리
const NotificationManager = {
    success(message) {
        alert(`✅ ${message}`);
    },
    
    error(message) {
        alert(`❌ ${message}`);
    },
    
    warning(message) {
        alert(`⚠️ ${message}`);
    },
    
    info(message) {
        alert(`ℹ️ ${message}`);
    }
};