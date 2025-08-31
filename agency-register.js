
      document
        .getElementById("agency-register-form")
        .addEventListener("submit", function (e) {
          e.preventDefault();
          const pw = document.getElementById("agencyPw").value;
          const pw2 = document.getElementById("agencyPw2").value;
          if (pw !== pw2) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
          }
          alert("광고대행사 가입이 완료되었습니다. 메인으로 이동합니다.");
          window.location.href = "index.html";
        });
    