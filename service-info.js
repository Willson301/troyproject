document.querySelectorAll(".service-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const service = this.getAttribute("data-service");
    document
      .querySelectorAll(".service-btn")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    document.querySelectorAll(".service-section").forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById(service).classList.add("active");
    document.querySelector(".service-content").scrollTop = 0;
  });
});
