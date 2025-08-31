
      // 로그인 버튼 클릭 시
      document.querySelector(".btn").addEventListener("click", function () {
        const userId = document.getElementById("bizId").value;
        const password = document.getElementById("password").value;

        if (!userId || !password) {
          alert("아이디와 비밀번호를 입력해주세요.");
          return;
        }

        // 각 유형별 로그인 처리
        if (userId === "admin" && password === "1234") {
          alert("관리자 로그인 성공!");
          setTimeout(
            () => window.location.replace("admin-dashboard.html"),
            500
          );
        } else if (userId === "agency" && password === "1234") {
          alert("대행사 로그인 성공!");
          setTimeout(
            () => window.location.replace("agency-dashboard.html"),
            500
          );
        } else if (userId === "customer" && password === "1234") {
          alert("고객 로그인 성공!");
          setTimeout(
            () => window.location.replace("customer-dashboard.html"),
            500
          );
        } else if (userId === "partner" && password === "1234") {
          alert("파트너 로그인 성공!");
          setTimeout(
            () => window.location.replace("partner-dashboard.html"),
            500
          );
        } else {
          alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
      });
    