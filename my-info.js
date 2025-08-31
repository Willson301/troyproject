document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".btn-charge")?.addEventListener("click", function () {
    document.getElementById("depositModal").style.display = "flex";
  });
  document
    .querySelector(".modal-close")
    ?.addEventListener("click", function () {
      document.getElementById("depositModal").style.display = "none";
    });
  document
    .getElementById("depositModal")
    ?.addEventListener("click", function (e) {
      if (e.target === this) this.style.display = "none";
    });
  document
    .querySelector(".modal-close-account")
    ?.addEventListener("click", function () {
      document.getElementById("accountModal").style.display = "none";
    });
  document
    .getElementById("accountModal")
    ?.addEventListener("click", function (e) {
      if (e.target === this) this.style.display = "none";
    });

  document.querySelectorAll(".amount-option").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".amount-option")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      const input = document.getElementById("customAmount");
      if (input) input.value = this.dataset.amount;
      updateTotalAmount();
    });
  });

  document
    .getElementById("customAmount")
    ?.addEventListener("input", updateTotalAmount);
  document
    .getElementById("taxInvoiceCheck")
    ?.addEventListener("change", updateTotalAmount);
  document.getElementById("confirmBtn")?.addEventListener("click", function () {
    document.getElementById("depositModal").style.display = "none";
    document.getElementById("accountModal").style.display = "flex";
    document.getElementById("finalAmount").textContent =
      document.getElementById("totalAmount").textContent;
    document.getElementById("depositAmount").textContent =
      document.getElementById("totalAmount").textContent;
  });

  document
    .getElementById("copyAllInfo")
    ?.addEventListener("click", function () {
      const finalAmount = document.getElementById("finalAmount").textContent;
      const bank = document.getElementById("bankName").value;
      const account = document.getElementById("accountNumber").value;
      const holder = document.getElementById("accountHolder").value;
      const text = `입금은행: ${bank}\n계좌번호: ${account}\n예금주: ${holder}\n입금금액: ${finalAmount}`;
      navigator.clipboard
        .writeText(text)
        .then(() => alert("정보가 복사되었습니다."));
    });

  document
    .querySelector(".back-btn-step")
    ?.addEventListener("click", function () {
      document.getElementById("accountModal").style.display = "none";
      document.getElementById("depositModal").style.display = "flex";
    });

  document
    .querySelector(".complete-btn")
    ?.addEventListener("click", function () {
      document.getElementById("accountModal").style.display = "none";
      alert("입금 확인이 완료되었습니다.");
    });
});

function updateTotalAmount() {
  const base =
    parseInt(document.getElementById("customAmount")?.value || "0", 10) || 0;
  const checked = document.getElementById("taxInvoiceCheck")?.checked;
  const tax = checked ? Math.round(base * 0.1) : 0;
  const total = base + tax;
  const taxRow = document.getElementById("taxRow");
  if (taxRow) taxRow.style.display = checked ? "flex" : "none";
  const baseEl = document.getElementById("baseAmount");
  const taxEl = document.getElementById("taxAmount");
  const totalEl = document.getElementById("totalAmount");
  if (baseEl) baseEl.textContent = `${base.toLocaleString()}원`;
  if (taxEl) taxEl.textContent = `${tax.toLocaleString()}원`;
  if (totalEl) totalEl.textContent = `${total.toLocaleString()}원`;
}
