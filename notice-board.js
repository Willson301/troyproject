
        function openNotice(id) {
            alert(`공지사항 ${id}번을 확인합니다. (상세 페이지는 준비 중입니다.)`);
        }

        // 페이지네이션
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (!this.disabled && !this.classList.contains('active')) {
                    document.querySelector('.page-btn.active').classList.remove('active');
                    this.classList.add('active');
                }
            });
        });
    