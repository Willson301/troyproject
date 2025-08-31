// 캠페인 데이터 초기화 및 통계 계산
function updateStatistics() {
  const campaigns = document.querySelectorAll('.campaign-item');
  const stats = {
    total: campaigns.length,
    scheduled: 0,
    progress: 0,
    completed: 0
  };

  campaigns.forEach(campaign => {
    const status = campaign.getAttribute('data-status');
    if (stats.hasOwnProperty(status)) {
      stats[status]++;
    }
  });

  // 통계 카드 업데이트
  document.getElementById('total-count').textContent = stats.total;
  document.getElementById('scheduled-count').textContent = stats.scheduled;
  document.getElementById('progress-count').textContent = stats.progress;
  document.getElementById('completed-count').textContent = stats.completed;
}

// 필터링 기능
function filterCampaigns(status) {
  const campaigns = document.querySelectorAll('.campaign-item');
  
  campaigns.forEach(campaign => {
    if (status === 'all' || campaign.getAttribute('data-status') === status) {
      campaign.style.display = 'grid';
    } else {
      campaign.style.display = 'none';
    }
  });

  // 활성 상태 카드 표시
  document.querySelectorAll('.stat-card').forEach(card => {
    card.classList.remove('active');
  });
  document.querySelector(`[data-status="${status}"]`).classList.add('active');
}

// TROY 로고 클릭 시 홈으로 이동 (로그인 상태 유지)
function goToHome() {
  // 이미 로그인된 상태이므로 현재 대시보드 유지
  // 아무 동작 없음
}

// 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
  // 통계 초기화
  updateStatistics();

  // 통계 카드 클릭 이벤트
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', function() {
      const status = this.getAttribute('data-status');
      filterCampaigns(status);
    });
  });

  // 로그아웃 기능
  document.querySelector('.logout').addEventListener('click', function() {
    if (confirm('로그아웃하시겠습니까?')) {
      window.location.href = 'index.html';
    }
  });

  // 새 캠페인 등록 버튼
  document.querySelector('.new-campaign-btn').addEventListener('click', function() {
    alert('새로운 캠페인 등록 기능은 준비 중입니다.');
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

  // 삭제 버튼 클릭 이벤트
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (confirm('정말 삭제하시겠습니까?')) {
        alert('삭제 기능은 준비 중입니다.');
      }
    });
  });

  // 검색 기능
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const resetBtn = document.getElementById('reset-btn');

  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      const query = searchInput.value.toLowerCase();
      searchCampaigns(query);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      searchInput.value = '';
      filterCampaigns('all');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = this.value.toLowerCase();
        searchCampaigns(query);
      }
    });
  }

  // 기본으로 전체 보기
  filterCampaigns('all');
});

// 검색 기능
function searchCampaigns(query) {
  const campaigns = document.querySelectorAll('.campaign-item');
  
  campaigns.forEach(campaign => {
    const title = campaign.querySelector('h3').textContent.toLowerCase();
    const id = campaign.querySelector('.campaign-id').textContent.toLowerCase();
    
    if (title.includes(query) || id.includes(query)) {
      campaign.style.display = 'grid';
    } else {
      campaign.style.display = 'none';
    }
  });
}
