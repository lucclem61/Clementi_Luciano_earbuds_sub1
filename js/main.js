(function initPage() {
  const root = document.documentElement;
  const model = document.querySelector(".model");
  const enterBtn = document.querySelector(".enter-fs");

  function setGradient(x, y) {
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
    setGradient(e.clientX, e.clientY);
  }
  function handleTouchMove(e) {
    const t = e.touches && e.touches[0];
    if (!t) {
      return;
    }
    setGradient(t.clientX, t.clientY);
  }
  function enterFullscreen() {
    if (model && model.requestFullscreen) {
      model.requestFullscreen();
    }
  }

  document.body.addEventListener("pointermove", handlePointerMove);
  document.body.addEventListener("touchmove", handleTouchMove, {
    passive: true,
  });
  if (enterBtn) {
    enterBtn.addEventListener("click", enterFullscreen);
  }
})();
