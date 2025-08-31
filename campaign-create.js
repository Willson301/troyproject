let selectedCampaignType = "";
let selectedPlatforms = [];
let selectedMissions = [];

// 드래그앤드롭 기능
const imageUpload = document.getElementById("imageUpload");
const imageInput = document.getElementById("imageInput");

imageUpload.addEventListener("dragover", (e) => {
  e.preventDefault();
  imageUpload.classList.add("dragover");
});

imageUpload.addEventListener("dragleave", () => {
  imageUpload.classList.remove("dragover");
});

imageUpload.addEventListener("drop", (e) => {
  e.preventDefault();
  imageUpload.classList.remove("dragover");
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    imageInput.files = files;
    handleImageUpload(files[0]);
  }
});

function extractProductInfo() {
  const url = document.getElementById("productUrl").value;
  const extractBtn = document.querySelector(".extract-btn");
  const successMsg = document.getElementById("extractSuccess");

  if (!url) {
    alert("제품 URL을 먼저 입력해주세요.");
    return;
  }

  extractBtn.disabled = true;
  extractBtn.textContent = "추출 중...";

  setTimeout(() => {
    if (url.includes("coupang.com")) {
      const productTitle = extractTitleFromUrl(url);
      document.getElementById("productTitle").value = productTitle;
      document.getElementById("serviceName").value = productTitle;
      const brandName = extractBrandFromUrl(url);
      if (brandName) {
        document.getElementById("brandName").value = brandName;
      }
      successMsg.style.display = "block";
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 3000);
    } else {
      alert("쿠팡 제품 링크를 입력해주세요.");
    }
    extractBtn.disabled = false;
    extractBtn.textContent = "정보 추출";
  }, 1000);
}

function extractTitleFromUrl(url) {
  if (url.includes("coupang.com")) {
    return "버드하모니 퀵드라이 남자팬티 기능성 항균 남성드로즈 고탄력 사각팬티 3D 입체 오달 안감 10종 세트";
  }
  return "제품명을 추출할 수 없습니다";
}

function extractBrandFromUrl(url) {
  if (url.includes("coupang.com")) {
    return "버드하모니";
  }
  return "";
}

function handleImageUpload(file) {
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imageUpload.innerHTML = `<img src="${e.target.result}" class="uploaded-image" alt="업로드된 이미지"><div class="image-upload-hint">이미지가 성공적으로 업로드되었습니다</div>`;
    };
    reader.readAsDataURL(file);
  }
}

imageInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    handleImageUpload(file);
  }
});

function selectCampaignType(card, type) {
  document
    .querySelectorAll(".campaign-type-card")
    .forEach((c) => c.classList.remove("selected"));
  card.classList.add("selected");
  selectedCampaignType = type;
}

function selectPlatform(card, platform) {
  if (card.classList.contains("selected")) {
    card.classList.remove("selected");
    selectedPlatforms = selectedPlatforms.filter((p) => p !== platform);
  } else {
    card.classList.add("selected");
    selectedPlatforms.push(platform);
  }
}

function selectMission(card, mission) {
  if (card.classList.contains("selected")) {
    card.classList.remove("selected");
    selectedMissions = selectedMissions.filter((m) => m !== mission);
  } else {
    card.classList.add("selected");
    selectedMissions.push(mission);
  }
}

function saveDraft() {
  alert("임시저장되었습니다.");
}

document
  .getElementById("campaignForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    if (!selectedCampaignType) {
      alert("캠페인 방식을 선택해주세요.");
      return;
    }
    if (selectedPlatforms.length === 0) {
      alert("리뷰플랫폼을 하나 이상 선택해주세요.");
      return;
    }
    if (selectedMissions.length === 0) {
      alert("체험단미션을 하나 이상 선택해주세요.");
      return;
    }
    alert("캠페인이 성공적으로 등록되었습니다!");
    window.location.href = "admin-dashboard.html";
  });
