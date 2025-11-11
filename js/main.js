(function initEarbudsPage() {
  const gsapRef = window.gsap;

  const hotspots = document.querySelectorAll(".Hotspot");
  const infoBoxes = [
    {
      title: "Noise-cancelling microphones",
      text: "Noise-cancelling microphones and a rear copper shield are optimally placed to quickly detect outside noises, working together to counter noise before it disturbs your experience.",
      Image: "images/nameofimage.jpg",
    },
    {
      title: "Comfortable fit",
      text: "Three pairs of ultra comfortable silicone tips are included. The tips create an acoustic seal that blocks outside audio and secures the earbuds in place.",
      Image: "images/nameofimage.jpg",
    },
    {
      title: "360 AUDIO",
      text: "360 Audio places sound all around you, while Dolby Head Tracking™ technology delivers an incredible three-dimensional listening experience.",
      Image: "images/nameofimage.jpg",
    },
    {
      title: "Ultra Fast Charging",
      text: "Charge your earbuds in 30 minutes or less with our hyper charging technology.",
      Image: "images/nameofimage.jpg",
    },
  ];

  function loadInfo() {
    infoBoxes.forEach(function attachInfo(infoBox, index) {
      const selected = document.querySelector(`#hotspot-${index + 1}`);
      if (!selected) {
        return;
      }

      const titleElement = document.createElement("h2");
      titleElement.textContent = infoBox.title;

      const textElement = document.createElement("p");
      textElement.textContent = infoBox.text;

      const imageElement = document.createElement("img");
      imageElement.src = "";
      imageElement.alt = "";

      selected.appendChild(titleElement);
      selected.appendChild(textElement);
    });
  }

  function showInfo() {
    const selected = document.querySelector(`#${this.slot}`);
    if (gsapRef) {
      gsapRef.to(selected, { duration: 1, autoAlpha: 1 });
    }
  }

  function hideInfo() {
    const selected = document.querySelector(`#${this.slot}`);
    if (gsapRef) {
      gsapRef.to(selected, { duration: 1, autoAlpha: 0 });
    }
  }

  function attachHotspotListeners(hotspot) {
    hotspot.addEventListener("mouseenter", showInfo);
    hotspot.addEventListener("mouseleave", hideInfo);
  }

  loadInfo();
  hotspots.forEach(attachHotspotListeners);

  const root = document.documentElement;

  function setGradientFromPoint(x, y) {
    const vw = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const vh = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    const px = Math.max(0, Math.min((x / vw) * 100, 100));
    const py = Math.max(0, Math.min((y / vh) * 100, 100));
    root.style.setProperty("--gx", px + "%");
    root.style.setProperty("--gy", py + "%");
  }

  function handlePointerMove(e) {
    setGradientFromPoint(e.clientX, e.clientY);
  }

  function handleTouchMove(e) {
    const t = e.touches && e.touches[0];
    if (!t) {
      return;
    }
    setGradientFromPoint(t.clientX, t.clientY);
  }

  document.body.addEventListener("pointermove", handlePointerMove);
  document.body.addEventListener("touchmove", handleTouchMove, {
    passive: true,
  });

  const enterBtn = document.querySelector("#enter-fullscreen");
  const exitBtn = document.querySelector("#exit-fullscreen");
  const model = document.querySelector("#model");

  function enterFullscreen() {
    if (model && model.requestFullscreen) {
      model.requestFullscreen();
    }
  }

  function exitFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  function handleFsChange() {
    const isFs = Boolean(document.fullscreenElement);
    if (exitBtn) {
      exitBtn.setAttribute("aria-hidden", isFs ? "false" : "true");
    }
  }

  if (enterBtn) {
    enterBtn.addEventListener("click", enterFullscreen);
  }
  if (exitBtn) {
    exitBtn.addEventListener("click", exitFullscreen);
  }
  document.addEventListener("fullscreenchange", handleFsChange);
})();
