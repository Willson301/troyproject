
      (function () {
        const form = document.querySelector(".form");
        const idInput = document.getElementById("bizId");
        const pwInput = document.getElementById("password");

        function routeByRole(userId, password) {
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
        }

        function handleSubmit(e) {
          if (e) e.preventDefault();
          routeByRole(
            (idInput.value || "").trim(),
            (pwInput.value || "").trim()
          );
        }

        // 폼 제출 이벤트 (엔터키 지원)
        form.addEventListener("submit", handleSubmit);

        // 로그인 버튼 클릭 이벤트
        document.querySelector(".btn").addEventListener("click", handleSubmit);

        // 엔터키 이벤트 추가
        idInput.addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            pwInput.focus();
          }
        });

        pwInput.addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            handleSubmit();
          }
        });
      })();
    