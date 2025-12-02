const HOTSPOT_URL = "https://swiftpixel.com/earbud/api/infoboxes";
const MATERIALS_URL = "https://swiftpixel.com/earbud/api/materials";

const hotspots = document.querySelectorAll(".Hotspot");
const modelElement = document.querySelector(".model");
const enterFullscreenButton = document.querySelector(".enter-fs");
const divisor = document.querySelector("#divisor");
const slider = document.querySelector("#slider");
const explodeCanvas = document.querySelector("#explode-view");
const loadingSpinner = document.querySelector("#ar-loading-spinner");
const statusMessage = document.querySelector("#ar-status-message");
const materialTemplate = document.querySelector("#material-template");
const materialList = document.querySelector("#material-list");
const arMedia = document.querySelector(".ar-media");

const fallbackHotspotData = [
  {
    heading: "Noise-cancelling microphones",
    text: "Noise-cancelling microphones and a rear copper shield are placed to detect outside noises and counter noise before it disturbs your experience.",
  },
  {
    heading: "Comfortable fit",
    text: "Three pairs of silicone tips create an acoustic seal that blocks outside audio and secures the earbuds in place.",
  },
  {
    heading: "360 audio",
    text: "Three hundred sixty degree audio places sound all around you while head tracking delivers an immersive listening experience.",
  },
];

function mainInit() {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  initModelViewer();
  initXraySlider();
  initExplodeAnimation();
  startLoadingSpinnerSequence();
  fetchHotspotData();
  fetchMaterialData();
}

function startLoadingSpinnerSequence() {
  if (!loadingSpinner || !statusMessage || !arMedia) {
    return;
  }

  arMedia.classList.add("is-loading");
  loadingSpinner.style.display = "flex";
  loadingSpinner.setAttribute("aria-hidden", "false");
  statusMessage.textContent = "Loading earbud details...";

  function hideSpinnerAfterDelay() {
    loadingSpinner.style.display = "none";
    loadingSpinner.setAttribute("aria-hidden", "true");
    statusMessage.textContent = "Hover over the hotspots to learn more.";
    arMedia.classList.remove("is-loading");
  }

  setTimeout(hideSpinnerAfterDelay, 6000);
}

function fetchHotspotData() {
  fetch(HOTSPOT_URL)
    .then(handleHotspotResponse)
    .then(handleHotspotJson)
    .catch(handleHotspotError);
}

function handleHotspotResponse(response) {
  if (!response.ok) {
    throw new Error("Hotspot response was not ok.");
  }
  return response.json();
}

function handleHotspotJson(data) {
  let usableData = [];

  if (Array.isArray(data)) {
    usableData = data;
  } else if (data && Array.isArray(data.infoboxes)) {
    usableData = data.infoboxes;
  } else {
    usableData = fallbackHotspotData;
  }

  renderHotspots(usableData);
}

function handleHotspotError(error) {
  console.error("Hotspot fetch error:", error);
  if (statusMessage) {
    statusMessage.textContent =
      "I could not load live hotspot data. I am showing default information instead.";
  }
  renderHotspots(fallbackHotspotData);
}

function renderHotspots(data) {
  if (!data || data.length === 0) {
    return;
  }

  const maxCount = Math.min(data.length, hotspots.length);

  for (let index = 0; index < maxCount; index += 1) {
    const hotspotId = `#hotspot-${index + 1}`;
    const annotation = document.querySelector(hotspotId);
    const hotspotInfo = data[index];

    if (!annotation || !hotspotInfo) {
      continue;
    }

    const titleValue =
      hotspotInfo.heading ||
      hotspotInfo.title ||
      hotspotInfo.name ||
      "Earbud detail";

    const textValue =
      hotspotInfo.text || hotspotInfo.description || hotspotInfo.body || "";

    annotation.innerHTML = "";

    const titleElement = document.createElement("strong");
    titleElement.textContent = titleValue;
    titleElement.style.display = "block";
    titleElement.style.color = "#000000";

    const textElement = document.createElement("span");
    textElement.textContent = textValue;
    textElement.style.display = "block";
    textElement.style.color = "#333333";

    annotation.appendChild(titleElement);
    annotation.appendChild(textElement);
  }
}

function fetchMaterialData() {
  if (!materialTemplate || !materialList) {
    return;
  }

  fetch(MATERIALS_URL)
    .then(handleMaterialResponse)
    .then(handleMaterialJson)
    .catch(handleMaterialError);
}

function handleMaterialResponse(response) {
  if (!response.ok) {
    throw new Error("Materials response was not ok.");
  }
  return response.json();
}

function handleMaterialJson(data) {
  if (!Array.isArray(data)) {
    return;
  }

  renderMaterials(data);
}

function handleMaterialError(error) {
  console.error("Materials fetch error:", error);
}

function renderMaterials(data) {
  materialList.innerHTML = "";

  data.forEach(handleSingleMaterial);
}

function handleSingleMaterial(item) {
  const clone = materialTemplate.content.cloneNode(true);
  const headingElement = clone.querySelector(".material-heading");
  const descriptionElement = clone.querySelector(".material-description");

  if (headingElement) {
    headingElement.textContent = item.heading || "Material";
  }

  if (descriptionElement) {
    descriptionElement.textContent = item.description || "";
  }

  materialList.appendChild(clone);
}

function initModelViewer() {
  if (!modelElement) {
    return;
  }

  if (enterFullscreenButton) {
    enterFullscreenButton.addEventListener("click", handleEnterFullscreenClick);
  }

  hotspots.forEach(attachHotspotListeners);
}

function handleEnterFullscreenClick() {
  if (modelElement && modelElement.requestFullscreen) {
    modelElement.requestFullscreen();
  }
}

function attachHotspotListeners(hotspot) {
  hotspot.addEventListener("mouseenter", handleHotspotEnter);
  hotspot.addEventListener("mouseleave", handleHotspotLeave);
}

function handleHotspotEnter() {
  const infoBox = this.querySelector(".HotspotAnnotation");
  if (!infoBox) {
    return;
  }
  infoBox.style.visibility = "visible";
  infoBox.style.opacity = "1";
}

function handleHotspotLeave() {
  const infoBox = this.querySelector(".HotspotAnnotation");
  if (!infoBox) {
    return;
  }
  infoBox.style.visibility = "hidden";
  infoBox.style.opacity = "0";
}

function initXraySlider() {
  if (!divisor || !slider) {
    return;
  }

  slider.addEventListener("input", handleSliderInput);
  window.addEventListener("load", handleSliderInitialPosition);
}

function handleSliderInput() {
  divisor.style.width = `${slider.value}%`;
}

function handleSliderInitialPosition() {
  slider.value = "50";
  divisor.style.width = "50%";
}

function initExplodeAnimation() {
  if (!explodeCanvas) {
    return;
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  const context = explodeCanvas.getContext("2d");
  const internalWidth = 1200;
  const aspectRatio = 1080 / 1920;
  const internalHeight = internalWidth * aspectRatio;

  explodeCanvas.width = internalWidth;
  explodeCanvas.height = internalHeight;

  const frameCount = 149;
  const images = [];
  const buds = { frame: 0 };

  function loadFrames() {
    for (let index = 0; index < frameCount; index += 1) {
      const image = new Image();
      const frameNumber = (index + 1).toString().padStart(4, "0");
      image.src = `images/122542740_${frameNumber}.jpg`;
      images.push(image);
    }
  }

  function renderFrame() {
    context.clearRect(0, 0, explodeCanvas.width, explodeCanvas.height);
    const currentImage = images[buds.frame];
    if (currentImage && currentImage.complete) {
      context.drawImage(
        currentImage,
        0,
        0,
        explodeCanvas.width,
        explodeCanvas.height
      );
    }
  }

  function startScrollAnimation() {
    gsap.to(buds, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: "#explode-section",
        start: "top top",
        end: "+=1500",
        scrub: true,
        pin: true,
      },
      onUpdate: renderFrame,
    });

    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  }

  function handleFirstImageLoad() {
    renderFrame();
    startScrollAnimation();
  }

  loadFrames();
  images[0].addEventListener("load", handleFirstImageLoad);
}

mainInit();
