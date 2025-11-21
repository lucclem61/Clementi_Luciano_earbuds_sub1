(function initPage() {
  const root = document.documentElement;
  const model = document.querySelector(".model");
  const enterBtn = document.querySelector(".enter-fs");
  const hotspots = document.querySelectorAll(".Hotspot");
  const slots = ["hotspot-1", "hotspot-2", "hotspot-3"];
  let clickAssignIndex = 0;

  // I move the background glow with the pointer
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

  // utils
  function v3(vec) {
    return `${vec.x}m ${vec.y}m ${vec.z}m`;
  }
  function hitAt(u, v) {
    const rect = model.getBoundingClientRect();
    const x = rect.width * u;
    const y = rect.height * v;
    return model.positionAndNormalFromPoint(x, y);
  }

  // I retry until I get 3 valid hits (handles render timing / large scale)
  function placeHotspotsWithRetry() {
    let attempts = 0;
    const maxAttempts = 60; // ~1s at 60fps

    function tryOnce() {
      attempts += 1;
      const hits = [];
      const probes = [
        [0.5, 0.5], // center
        [0.7, 0.55], // right-mid
        [0.3, 0.55], // left-mid
        [0.5, 0.35], // upper-mid (fallbacks)
        [0.5, 0.7],
      ];
      for (let i = 0; i < probes.length && hits.length < 3; i += 1) {
        const h = hitAt(probes[i][0], probes[i][1]);
        if (h) {
          hits.push(h);
        }
      }
      if (hits.length >= 3) {
        for (let i = 0; i < 3; i += 1) {
          const btn = document.querySelector(`[slot="${slots[i]}"]`);
          if (!btn) {
            continue;
          }
          btn.setAttribute("data-position", v3(hits[i].position));
          btn.setAttribute("data-normal", v3(hits[i].normal));
        }
        return; // success
      }
      if (attempts < maxAttempts) {
        requestAnimationFrame(tryOnce);
      }
    }
    requestAnimationFrame(tryOnce);
  }

  // allow click reassignment (1st click -> 1, 2nd -> 2, 3rd -> 3)
  function handleModelClick(e) {
    if (clickAssignIndex > 2) {
      return;
    }
    const rect = model.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hit = model.positionAndNormalFromPoint(x, y);
    if (!hit) {
      return;
    }
    const btn = document.querySelector(`[slot="${slots[clickAssignIndex]}"]`);
    if (!btn) {
      return;
    }
    btn.setAttribute("data-position", v3(hit.position));
    btn.setAttribute("data-normal", v3(hit.normal));
    clickAssignIndex += 1;
  }

  function handleHotspotEnter() {
    const box = this.querySelector(".HotspotAnnotation");
    if (box) {
      box.style.visibility = "visible";
      box.style.opacity = "1";
    }
  }
  function handleHotspotLeave() {
    const box = this.querySelector(".HotspotAnnotation");
    if (box) {
      box.style.visibility = "hidden";
      box.style.opacity = "0";
    }
  }

  // listeners
  document.body.addEventListener("pointermove", handlePointerMove);
  document.body.addEventListener("touchmove", handleTouchMove, {
    passive: true,
  });
  if (enterBtn) {
    enterBtn.addEventListener("click", enterFullscreen);
  }
  if (model) {
    model.addEventListener("load", placeHotspotsWithRetry);
    model.addEventListener("click", handleModelClick);
  }
  hotspots.forEach(function attach(h) {
    h.addEventListener("mouseenter", handleHotspotEnter);
    h.addEventListener("mouseleave", handleHotspotLeave);
  });
})();
