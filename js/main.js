(function mainInit() {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  initModelViewer();
  initXraySlider();
  initExplodeAnimation();
})();

function initModelViewer() {
  const model = document.querySelector(".model");
  const enterButton = document.querySelector(".enter-fs");
  const hotspots = document.querySelectorAll(".Hotspot");

  if (!model) {
    return;
  }

  function handleEnterFullscreenClick() {
    if (model.requestFullscreen) {
      model.requestFullscreen();
    }
  }

  function handleHotspotEnter() {
    const infoBox = this.querySelector(".HotspotAnnotation");
    if (infoBox) {
      infoBox.style.visibility = "visible";
      infoBox.style.opacity = "1";
    }
  }

  function handleHotspotLeave() {
    const infoBox = this.querySelector(".HotspotAnnotation");
    if (infoBox) {
      infoBox.style.visibility = "hidden";
      infoBox.style.opacity = "0";
    }
  }

  if (enterButton) {
    enterButton.addEventListener("click", handleEnterFullscreenClick);
  }

  hotspots.forEach(function attachHotspotListeners(hotspot) {
    hotspot.addEventListener("mouseenter", handleHotspotEnter);
    hotspot.addEventListener("mouseleave", handleHotspotLeave);
  });
}

function initXraySlider() {
  const divisor = document.querySelector("#divisor");
  const slider = document.querySelector("#slider");

  if (!divisor || !slider) {
    return;
  }

  function handleSliderInput() {
    divisor.style.width = `${slider.value}%`;
  }

  function handleSliderInitialPosition() {
    slider.value = 50;
    divisor.style.width = "50%";
  }

  slider.addEventListener("input", handleSliderInput);
  window.addEventListener("load", handleSliderInitialPosition);
}

function initExplodeAnimation() {
  const canvas = document.querySelector("#explode-view");

  if (!canvas) {
    return;
  }
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  const context = canvas.getContext("2d");

  const internalWidth = 1200;
  const aspectRatio = 1080 / 1920;
  const internalHeight = internalWidth * aspectRatio;

  canvas.width = internalWidth;
  canvas.height = internalHeight;

  const frameCount = 149;
  const images = [];
  const buds = {
    frame: 0,
  };

  function loadFrames() {
    for (let index = 0; index < frameCount; index += 1) {
      const image = new Image();
      const frameNumber = (index + 1).toString().padStart(4, "0");
      image.src = `images/122542740_${frameNumber}.jpg`;
      images.push(image);
    }
  }

  function renderFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const currentImage = images[buds.frame];
    if (currentImage && currentImage.complete) {
      context.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    }
  }

  function startScrollAnimation() {
    gsap.to(buds, {
      frame: frameCount - 1,
      snap: "frame",
      scrollTrigger: {
        trigger: "#explode-section",
        pin: true,
        scrub: 1,
        start: "top top",
      },
      onUpdate: renderFrame,
    });
  }

  function handleFirstImageLoad() {
    renderFrame();
    startScrollAnimation();
  }

  loadFrames();
  images[0].addEventListener("load", handleFirstImageLoad);
}
