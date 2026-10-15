/* =========================================================
   Kyann personal site
   1. Settings you may edit: gallery photos, latest changes, Spotify
   2. Missing image fallbacks
   3. Side navigation
   4. Menus: color theme and language
   5. Experience road
   6. Gallery and lightbox
   7. Latest changes (newest first, "See more" for the older ones)
   8. Live clock
   9. Spotify (listening now)
   10. Live month (end of the road)
   11. Misc
   Texts come from js/i18n.js
   ========================================================= */

/* 1. Settings you may edit */

/* Gallery photos, shown in this order.
   date: optional, YYYY-MM-DD. It is written under the photo in the visitor's language.
   To add a photo: add a line here (the file can be a web link or a file in images/gallery/).
   Optional extras:
     title: { en: "Convoy at sunset", fr: "Convoi au coucher du soleil", de: "...", es: "...", it: "..." }
     category: "tmp", "drive" or "vtc"   (the filter buttons appear when there are two or more categories) */
const GALLERY = [
  { src: "https://i.ibb.co/GvPkBxCQ/ets2-20260929-235050-00.webp", date: "2026-09-29" },
  { src: "https://i.ibb.co/932GqqLX/ets2-20260713-204312-00.webp", date: "2026-07-13" },
  { src: "https://i.ibb.co/4wrFwsQp/ets2-20260629-215059-00.webp", date: "2026-06-29" },
  { src: "https://i.ibb.co/MxfNHbCb/ets2-20260614-184758-00.webp", date: "2026-06-14" },
  { src: "https://i.ibb.co/trM5MP7/ets2-20260823-170001-00.webp", date: "2026-08-23" },
  { src: "https://i.ibb.co/0Wnkrb1/ets2-20261007-012343-00.webp", date: "2026-10-07" },
  { src: "https://i.ibb.co/v46GfND0/2078B41.webp" },
  { src: "https://i.ibb.co/d4RKKxRj/ets2-20260828-200518-00.webp", date: "2026-08-28" },
  { src: "https://i.ibb.co/pBkFbc6B/ets2-20260702-145743-00.webp", date: "2026-07-02" },
  { src: "https://i.ibb.co/WvjSxQnr/ets2-20260526-112951-00.webp", date: "2026-05-26" },
  { src: "https://i.ibb.co/Pp44fzd/ets2-20260616-190802-00.webp", date: "2026-06-16" },
  { src: "https://i.ibb.co/Q3qndf63/ets2-20260827-215914-00.webp", date: "2026-08-27" },
  { src: "https://i.ibb.co/qMV4xz56/Screenshot-2026-08-30-231110.webp", date: "2026-08-30" },
  { src: "https://i.ibb.co/g0jDdhy/ets2-20260704-223048-00.webp", date: "2026-07-04" },
  { src: "https://i.ibb.co/PZMBsyTr/ets2-20260704-222144-00.webp", date: "2026-07-04" },
  { src: "https://i.ibb.co/1kqtMGf/image.png" },
  { src: "https://i.ibb.co/rf7gkJsb/image.png" },
  { src: "https://i.ibb.co/ds7SBkyj/image.png" },
  { src: "https://i.ibb.co/SXqwLs3s/image.png" },
  { src: "https://i.ibb.co/9m08gRs5/image.png" },
  { src: "https://i.ibb.co/vvXDPvrC/image.png" }
];

/* Latest changes. date: YYYY-MM-DD. key: text in js/i18n.js (or keys: [...] for several lines under one date).
   The list is sorted by date, newest first, so you can add entries in any order.
   The newest CHANGES_SHOWN entries are visible, the older ones appear with the "See more" button. */
const CHANGES_SHOWN = 3;
const CHANGES = [
  { date: "2026-10-14", keys: ["changes.moreButton", "changes.codeFix", "changes.aboutJastuk"] },
  { date: "2026-10-13", keys: ["changes.halloween", "changes.seeMore", "changes.spotify"] },
  { date: "2026-10-12", key: "changes.gallery" },
  { date: "2026-10-11", key: "changes.themes" },
  { date: "2026-10-10", key: "changes.languagesUpdate" }
];

/* Spotify "listening now" card.
   A web page cannot read what you play on Spotify by itself, so the card asks a service for it:
   - discordId: your Discord ID, read through the free Lanyard service (api.lanyard.rest).
     It works once you have joined the Lanyard Discord server (discord.gg/lanyard), linked Spotify to
     your Discord account (Settings > Connections) and turned on "Display Spotify as your status".
   - endpoint: optional. The address of your own small Spotify service (see spotify-worker/LISEZMOI.txt).
     When it is filled in, it is used instead of Lanyard.
   If nothing is playing or the service does not answer, the card shows a link to your Spotify profile. */
const SPOTIFY = {
  profile: "https://open.spotify.com/user/31z7wwxk6rhnvkjrj4wmrf2bjq2m",
  discordId: "1343333598467461140",
  endpoint: "",
  refreshSeconds: 20
};

const { t, onChange, getLang, locale } = window.siteI18n;

/* 2. Missing image fallbacks */
function handleBrokenImage(img) {
  if (img.hasAttribute("data-hide-on-error")) {
    img.style.display = "none";
    return;
  }
  const parent = img.parentElement;
  img.remove();
  if (parent) parent.classList.add("is-missing");
}

document.querySelectorAll("img[data-fallback], img[data-hide-on-error]").forEach((img) => {
  img.addEventListener("error", () => handleBrokenImage(img));
  // The error may have fired before this script ran
  if (img.complete && img.naturalWidth === 0) handleBrokenImage(img);
});

/* 3. Side navigation: mark the section on screen */
(function initDock() {
  const links = [...document.querySelectorAll(".dock a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => {
        const active = a.getAttribute("href") === "#" + entry.target.id;
        if (active) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -45% 0px" });

  sections.forEach((s) => observer.observe(s));
})();

/* 4. Menus: color theme and language.
   Colors are defined in css/style.css (section 1). The theme choice is saved in the browser. */
const menus = [];

function createMenu(toggle, menu) {
  function open() {
    menus.forEach((m) => m.close(false));
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
  }
  function close(returnFocus) {
    if (menu.hidden) return;
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener("click", () => (menu.hidden ? open() : close(false)));
  const api = { open, close, toggle, menu };
  menus.push(api);
  return api;
}

// Click outside or Escape closes the open menu
document.addEventListener("click", (e) => {
  menus.forEach((m) => {
    if (!m.menu.hidden && !m.menu.contains(e.target) && !m.toggle.contains(e.target)) m.close(false);
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const opened = menus.find((m) => !m.menu.hidden);
  if (opened) opened.close(true);
});

(function initLanguageMenu() {
  const toggle = document.getElementById("lang-toggle");
  const menu = document.getElementById("lang-menu");
  if (!toggle || !menu) return;
  const picker = createMenu(toggle, menu);
  // The language itself is changed by js/i18n.js. Here the menu just closes.
  menu.querySelectorAll(".lang-opt").forEach((option) => option.addEventListener("click", () => picker.close(true)));
})();

(function initTheme() {
  const THEME_KEY = "kyann-site-theme";
  const NAMES = ["black", "white", "pink", "navy", "forest", "violet", "halloween"];

  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const menu = document.getElementById("theme-menu");
  if (!toggle || !menu) return;
  createMenu(toggle, menu);

  const options = [...menu.querySelectorAll("[data-theme-option]")];
  const metaColor = document.querySelector('meta[name="theme-color"]');
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The <head> script sets data-festive during the Halloween period (see index.html)
  const festive = root.getAttribute("data-festive") === "halloween";
  const halloweenOption = options.find((o) => o.dataset.themeOption === "halloween");
  if (halloweenOption) halloweenOption.hidden = !festive;

  function current() {
    const name = root.getAttribute("data-theme");
    return NAMES.includes(name) ? name : "black";
  }

  function sync() {
    options.forEach((o) => o.setAttribute("aria-pressed", o.dataset.themeOption === current() ? "true" : "false"));
    // Browser bar color follows the page background
    if (metaColor && window.getComputedStyle) {
      const ink = getComputedStyle(root).getPropertyValue("--ink").trim();
      if (ink) metaColor.setAttribute("content", ink);
    }
  }

  function setTheme(name) {
    if (!NAMES.includes(name) || name === current()) return;
    if (name === "halloween" && !festive) return;
    if (!reduceMotion) {
      root.classList.add("theme-fade");
      setTimeout(() => root.classList.remove("theme-fade"), 450);
    }
    root.setAttribute("data-theme", name);
    try { localStorage.setItem(THEME_KEY, name); } catch (e) { /* ignore */ }
    sync();
  }

  options.forEach((o) => o.addEventListener("click", () => setTheme(o.dataset.themeOption)));

  sync();
  window.siteTheme = { setTheme, current, festive };
})();

/* 5. Experience road: the truck follows the scroll */
(function initRoad() {
  const road = document.getElementById("road");
  if (!road) return;

  const stops = [...road.querySelectorAll(".stop")];
  let waiting = false;

  function update() {
    waiting = false;
    const rect = road.getBoundingClientRect();
    const target = window.innerHeight * 0.55;
    const progress = Math.min(1, Math.max(0, (target - rect.top) / rect.height));
    road.style.setProperty("--p", progress.toFixed(4));

    stops.forEach((stop) => {
      const node = stop.querySelector(".node").getBoundingClientRect();
      stop.classList.toggle("passed", node.top + node.height / 2 < target);
    });

    // The truck turns green when it reaches the last stop (the current month)
    road.classList.toggle("is-arrived", stops[stops.length - 1].classList.contains("passed"));
  }

  function request() {
    if (!waiting) {
      waiting = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  update();

  // Open and close a stop
  road.querySelectorAll(".stop-head").forEach((button) => {
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", open ? "false" : "true");
      // Recompute while the card grows or shrinks
      const body = button.nextElementSibling;
      if (body) body.addEventListener("transitionend", request, { once: true });
      request();
    });
  });

  // Logos and text change the page height: update when everything is loaded
  window.addEventListener("load", request);
})();

/* 6. Gallery and lightbox (zoom with buttons, mouse wheel, pinch and double-click; drag to move) */
(function initGallery() {
  const grid = document.getElementById("gallery-grid");
  const chips = [...document.querySelectorAll(".chip")];
  const filtersEl = document.getElementById("gallery-filters");
  const introEl = document.getElementById("gallery-intro");
  const emptyEl = document.getElementById("gallery-empty");
  const box = document.getElementById("lightbox");
  const stage = document.getElementById("lb-stage");
  const caption = document.getElementById("lb-caption");
  const levelEl = document.getElementById("lb-zoom-level");
  const originalEl = document.getElementById("lb-original");
  const fullscreenBtn = document.getElementById("lb-fullscreen");
  const zoomInBtn = document.getElementById("lb-zoom-in");
  const zoomOutBtn = document.getElementById("lb-zoom-out");
  if (!grid || !box) return;

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MIN = 1, MAX = 6;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  // No photo yet: hide the intro, the filters and the grid, show a short message
  if (GALLERY.length === 0) {
    [introEl, filtersEl, grid].forEach((el) => { if (el) el.hidden = true; });
    if (emptyEl) emptyEl.hidden = false;
    return;
  }

  GALLERY.forEach((photo, i) => { photo.n = i + 1; });

  // Filter buttons only make sense when photos have two or more categories
  const categories = new Set(GALLERY.map((p) => p.category).filter(Boolean));
  if (categories.size < 2 && filtersEl) filtersEl.hidden = true;

  function parse(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  function dateText(photo) {
    return new Intl.DateTimeFormat(locale(), { day: "numeric", month: "long", year: "numeric" }).format(parse(photo.date));
  }
  // Full title (alt text and viewer) and short caption (under the photo)
  function titleOf(photo) {
    if (photo.title) return photo.title[getLang()] || photo.title.en || "";
    if (photo.date) return t("gallery.shot", { date: dateText(photo) });
    return t("gallery.photoN", { n: photo.n });
  }
  function captionOf(photo) {
    if (photo.title) return titleOf(photo);
    return photo.date ? dateText(photo) : "";
  }

  const FIRST = 6; // photos shown at first, the rest appears with the "See more" button
  const moreWrap = document.getElementById("gallery-more-wrap");
  const moreBtn = document.getElementById("gallery-more");

  let filter = "all";
  let visible = GALLERY.slice();
  let expanded = false;
  let current = 0;

  function updateMore() {
    const hasMore = visible.length > FIRST;
    if (moreWrap) moreWrap.hidden = !hasMore;
    if (moreBtn) {
      moreBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
      moreBtn.textContent = t(expanded ? "ui.less" : "ui.more");
    }
  }

  // revealFrom: index of the first photo that should fade in (the ones just revealed)
  function render(revealFrom) {
    visible = filter === "all" ? GALLERY.slice() : GALLERY.filter((p) => p.category === filter);
    grid.innerHTML = "";
    const shown = expanded ? visible : visible.slice(0, FIRST);

    shown.forEach((photo, index) => {
      const title = titleOf(photo);

      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile" + (revealFrom !== undefined && index >= revealFrom ? " is-new" : "");
      if (photo.category) tile.dataset.cat = photo.category;
      tile.setAttribute("aria-label", t("gallery.open", { title }));

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = title;
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.addEventListener("error", () => {
        img.remove();
        tile.classList.add("is-missing");
      });
      tile.append(img);

      const text = captionOf(photo);
      if (text) {
        const cap = document.createElement("span");
        cap.className = "tile-caption";
        cap.textContent = text;
        tile.append(cap);
      }

      tile.addEventListener("click", () => open(index));
      grid.append(tile);
    });

    updateMore();
  }

  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      expanded = !expanded;
      render(expanded ? FIRST : undefined);
      // Back to the first photos: scroll up so the visitor does not end up lost at the bottom
      if (!expanded) document.getElementById("gallery").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }

  /* ----- Viewer: zoom and pan ----- */
  let scale = 1, tx = 0, ty = 0;

  const imageEl = () => stage.querySelector("img");

  function bounds() {
    const im = imageEl();
    if (!im) return { x: 0, y: 0 };
    return {
      x: Math.max(0, (im.offsetWidth * scale - stage.clientWidth) / 2),
      y: Math.max(0, (im.offsetHeight * scale - stage.clientHeight) / 2)
    };
  }

  function apply(animate) {
    const im = imageEl();
    const b = bounds();
    tx = clamp(tx, -b.x, b.x);
    ty = clamp(ty, -b.y, b.y);
    if (im) {
      im.style.transition = animate && !reduceMotion ? "transform 0.2s ease" : "none";
      im.style.transform = "translate(" + tx + "px, " + ty + "px) scale(" + scale + ")";
    }
    levelEl.textContent = Math.round(scale * 100) + "%";
    stage.classList.toggle("is-zoomed", scale > 1);
    zoomInBtn.disabled = scale >= MAX;
    zoomOutBtn.disabled = scale <= MIN;
  }

  // Zoom around a point of the screen, so that point stays under the finger or cursor
  function zoomTo(next, clientX, clientY, animate) {
    next = clamp(next, MIN, MAX);
    const rect = stage.getBoundingClientRect();
    const px = clientX - (rect.left + rect.width / 2);
    const py = clientY - (rect.top + rect.height / 2);
    const k = next / scale;
    tx = px - (px - tx) * k;
    ty = py - (py - ty) * k;
    scale = next;
    if (scale === 1) { tx = 0; ty = 0; }
    apply(animate);
  }

  function zoomFromCenter(factor) {
    const rect = stage.getBoundingClientRect();
    zoomTo(scale * factor, rect.left + rect.width / 2, rect.top + rect.height / 2, true);
  }

  function resetZoom(animate) {
    scale = 1; tx = 0; ty = 0;
    apply(animate);
  }

  function show(index) {
    current = (index + visible.length) % visible.length;
    const photo = visible[current];
    const title = titleOf(photo);
    stage.innerHTML = "";
    scale = 1; tx = 0; ty = 0;

    const img = document.createElement("img");
    img.className = "lb-img";
    img.alt = title;
    img.draggable = false;
    img.referrerPolicy = "no-referrer";
    img.addEventListener("load", () => apply(false));
    img.addEventListener("error", () => {
      stage.innerHTML = "";
      const missing = document.createElement("div");
      missing.className = "lb-missing";
      missing.textContent = t("lb.missing");
      stage.append(missing);
    });
    img.src = photo.src;
    stage.append(img);

    originalEl.href = photo.src;
    const extra = photo.title && photo.date ? "  ·  " + dateText(photo) : "";
    caption.textContent = title + extra + "  (" + (current + 1) + " / " + visible.length + ")";
    apply(false);

    // Load the neighbours in advance so that next and previous feel instant
    [current - 1, current + 1].forEach((i) => {
      const near = visible[(i + visible.length) % visible.length];
      if (near && near !== photo) new Image().src = near.src;
    });
  }

  function open(index) {
    show(index);
    if (typeof box.showModal === "function") box.showModal();
    apply(false);
  }

  function close() {
    if (box.open) box.close();
  }

  box.addEventListener("close", () => {
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
  });

  document.getElementById("lb-close").addEventListener("click", close);
  document.getElementById("lb-prev").addEventListener("click", () => show(current - 1));
  document.getElementById("lb-next").addEventListener("click", () => show(current + 1));
  zoomInBtn.addEventListener("click", () => zoomFromCenter(1.5));
  zoomOutBtn.addEventListener("click", () => zoomFromCenter(1 / 1.5));
  document.getElementById("lb-zoom-reset").addEventListener("click", () => resetZoom(true));
  window.addEventListener("resize", () => { if (box.open) apply(false); });

  // Full screen (hidden where the browser does not support it, for example iPhone)
  if (!document.fullscreenEnabled || !box.requestFullscreen) {
    fullscreenBtn.hidden = true;
  } else {
    fullscreenBtn.addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else box.requestFullscreen().catch(() => {});
    });
    document.addEventListener("fullscreenchange", () => {
      fullscreenBtn.setAttribute("aria-pressed", document.fullscreenElement ? "true" : "false");
      if (box.open) apply(false);
    });
  }

  // Mouse wheel and trackpad pinch
  stage.addEventListener("wheel", (e) => {
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018));
    zoomTo(scale * factor, e.clientX, e.clientY, false);
  }, { passive: false });

  // Double-click (mouse) zooms in or back out
  stage.addEventListener("dblclick", (e) => {
    if (e.target !== imageEl()) return;
    if (scale > 1) resetZoom(true);
    else zoomTo(2.5, e.clientX, e.clientY, true);
  });

  // Pointer gestures: drag to move, two fingers to pinch, swipe to change photo, double-tap
  const pointers = new Map();
  let drag = null, pinch = null, suppressClick = false, lastTap = null;

  stage.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    suppressClick = false;

    if (pointers.size === 1) {
      drag = { x: e.clientX, y: e.clientY, tx, ty, moved: false };
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale, midX: (a.x + b.x) / 2, midY: (a.y + b.y) / 2 };
      drag = null;
      suppressClick = true;
    }
  });

  stage.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2 && pinch) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
      tx += midX - pinch.midX;
      ty += midY - pinch.midY;
      pinch.midX = midX; pinch.midY = midY;
      zoomTo(pinch.scale * (dist / pinch.dist), midX, midY, false);
      return;
    }

    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        drag.moved = true;
        suppressClick = true;
      }
      if (scale > 1) {
        stage.classList.add("is-dragging");
        tx = drag.tx + dx;
        ty = drag.ty + dy;
        apply(false);
      }
    }
  });

  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    stage.classList.remove("is-dragging");

    if (pointers.size < 2) pinch = null;
    if (!drag) return;

    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    const finished = drag;
    drag = null;

    // Swipe left or right when the photo is not zoomed
    if (scale === 1 && finished.moved && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      show(current + (dx < 0 ? 1 : -1));
      return;
    }

    // Double-tap on a touch screen
    if (e.pointerType !== "mouse" && !finished.moved && e.target === imageEl()) {
      const now = Date.now();
      if (lastTap && now - lastTap.time < 320 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 30) {
        lastTap = null;
        if (scale > 1) resetZoom(true);
        else zoomTo(2.5, e.clientX, e.clientY, true);
      } else {
        lastTap = { time: now, x: e.clientX, y: e.clientY };
      }
    }
  }
  stage.addEventListener("pointerup", endPointer);
  stage.addEventListener("pointercancel", endPointer);

  // A click on the dark area around the photo closes the viewer
  stage.addEventListener("click", (e) => {
    if (suppressClick) { suppressClick = false; return; }
    if (e.target === stage) close();
  });
  box.addEventListener("click", (e) => { if (e.target === box) close(); });

  // Keyboard: arrows, + and -, 0
  box.addEventListener("keydown", (e) => {
    if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomFromCenter(1.5); }
    else if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomFromCenter(1 / 1.5); }
    else if (e.key === "0") { e.preventDefault(); resetZoom(true); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const dir = e.key === "ArrowLeft" ? -1 : 1;
      if (scale > 1) { tx -= dir * 80; apply(false); } else show(current + dir);
    } else if ((e.key === "ArrowUp" || e.key === "ArrowDown") && scale > 1) {
      e.preventDefault();
      ty += e.key === "ArrowUp" ? 80 : -80;
      apply(false);
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filter = chip.dataset.filter;
      expanded = false;
      chips.forEach((c) => {
        const on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      render();
    });
  });

  // New language: redraw titles, keep the filter and the open photo
  onChange(() => {
    render();
    if (box.open) {
      const keepScale = scale, keepX = tx, keepY = ty;
      show(current);
      scale = keepScale; tx = keepX; ty = keepY;
      apply(false);
    }
  });

  render();
  window.siteViewer = { open, show, zoomTo, zoomFromCenter, resetZoom, getState: () => ({ scale, tx, ty, current }) };
})();

/* 7. Latest changes: dates are written in the visitor's language. The newest entries show first. */
(function initChanges() {
  const list = document.getElementById("changes-list");
  const moreWrap = document.getElementById("changes-more-wrap");
  const moreBtn = document.getElementById("changes-more");
  if (!list) return;

  let expanded = false;
  const sorted = CHANGES.slice().sort((a, b) => b.date.localeCompare(a.date));

  function parse(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function render() {
    const format = new Intl.DateTimeFormat(locale(), { day: "numeric", month: "long", year: "numeric" });
    list.innerHTML = "";

    (expanded ? sorted : sorted.slice(0, CHANGES_SHOWN)).forEach((change) => {
      const item = document.createElement("li");
      const time = document.createElement("time");
      time.dateTime = change.date;
      time.textContent = format.format(parse(change.date));

      const keys = change.keys || [change.key];
      let text;
      if (keys.length > 1) {
        text = document.createElement("ul");
        text.className = "change-items";
        keys.forEach((key) => {
          const line = document.createElement("li");
          line.textContent = t(key);
          text.append(line);
        });
      } else {
        text = document.createElement("span");
        text.textContent = t(keys[0]);
      }
      item.append(time, text);
      list.append(item);
    });

    if (moreWrap) moreWrap.hidden = sorted.length <= CHANGES_SHOWN;
    if (moreBtn) {
      moreBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
      moreBtn.textContent = t(expanded ? "ui.less" : "ui.more");
    }
  }

  if (moreBtn) moreBtn.addEventListener("click", () => { expanded = !expanded; render(); });

  render();
  onChange(render);
})();

/* 8. Live clock (top left): time of the visitor, with the date in the site language */
(function initClock() {
  const box = document.getElementById("clock");
  if (!box) return;

  const els = {
    hm: document.getElementById("clock-hm"),
    sec: document.getElementById("clock-sec"),
    tz: document.getElementById("clock-tz"),
    long: document.getElementById("clock-date-long"),
    short: document.getElementById("clock-date-short")
  };

  const pad = (n) => String(n).padStart(2, "0");
  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  let formats = null;
  function buildFormats() {
    const loc = locale();
    formats = {
      long: new Intl.DateTimeFormat(loc, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      short: new Intl.DateTimeFormat(loc, { weekday: "short", day: "numeric", month: "short" }),
      zone: new Intl.DateTimeFormat(loc, { timeZoneName: "short" })
    };
  }

  function tick() {
    const now = new Date();
    els.hm.textContent = pad(now.getHours()) + ":" + pad(now.getMinutes());
    els.sec.textContent = ":" + pad(now.getSeconds());

    const zone = formats.zone.formatToParts(now).find((part) => part.type === "timeZoneName");
    els.tz.textContent = zone ? zone.value : "";
    els.long.textContent = capitalize(formats.long.format(now));
    els.short.textContent = capitalize(formats.short.format(now));
  }

  buildFormats();
  tick();
  // Start on the next full second, then update every second
  setTimeout(() => {
    tick();
    setInterval(tick, 1000);
  }, 1000 - (Date.now() % 1000));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });
  onChange(() => { buildFormats(); tick(); });
  window.siteClock = { tick };
})();

/* 9. Spotify: what is playing right now (see SPOTIFY at the top of this file) */
(function initSpotify() {
  const card = document.getElementById("spotify-card");
  if (!card) return;

  const els = {
    img: document.getElementById("spotify-img"),
    icon: document.getElementById("spotify-art-icon"),
    status: document.getElementById("spotify-status"),
    song: document.getElementById("spotify-song"),
    artist: document.getElementById("spotify-artist"),
    progress: document.getElementById("spotify-progress"),
    bar: document.getElementById("spotify-bar"),
    link: document.getElementById("spotify-link")
  };

  let track = null;      // what is playing, or null
  let busy = false;
  let timer = null;
  let tick = null;
  let lastForced = 0;    // last time we asked early because a song ended

  // Keep only what is safe to show: short text, https pictures, plain Spotify ids
  const clean = (value, max) => (typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "");
  function safeImage(url) {
    try { return new URL(url).protocol === "https:" ? url : ""; } catch (e) { return ""; }
  }
  const safeId = (id) => (typeof id === "string" && /^[A-Za-z0-9]{10,30}$/.test(id) ? id : "");

  // Answer of the Lanyard service (reads your Discord status)
  function fromLanyard(json) {
    const data = json && json.success && json.data;
    if (!data || !data.listening_to_spotify || !data.spotify) return null;
    const sp = data.spotify;
    const stamps = sp.timestamps || {};
    return {
      title: clean(sp.song, 120),
      artist: clean((sp.artist || "").split(";").map((a) => a.trim()).filter(Boolean).join(", "), 160),
      art: safeImage(sp.album_art_url),
      id: safeId(sp.track_id),
      start: Number(stamps.start) || 0,
      end: Number(stamps.end) || 0
    };
  }

  // Answer of your own service: { isPlaying, title, artist, albumArt, trackId, progressMs, durationMs }
  function fromEndpoint(json) {
    if (!json || !json.isPlaying) return null;
    const start = Date.now() - (Number(json.progressMs) || 0);
    return {
      title: clean(json.title, 120),
      artist: clean(json.artist, 160),
      art: safeImage(json.albumArt),
      id: safeId(json.trackId),
      start,
      end: json.durationMs ? start + Number(json.durationMs) : 0
    };
  }

  async function fetchTrack() {
    let json;
    if (SPOTIFY.endpoint) {
      const res = await fetch(SPOTIFY.endpoint, { cache: "no-store" });
      json = await res.json();
      return fromEndpoint(json);
    }
    if (SPOTIFY.discordId) {
      const res = await fetch("https://api.lanyard.rest/v1/users/" + encodeURIComponent(SPOTIFY.discordId), { cache: "no-store" });
      json = await res.json();
      return fromLanyard(json);
    }
    return null;
  }

  // A song whose end time passed long ago is old news (paused or closed): do not keep showing it
  const isStale = () => Boolean(track && track.end && Date.now() > track.end + 30000);

  function render() {
    const playing = Boolean(track && track.title) && !isStale();
    card.dataset.state = playing ? "playing" : "idle";
    els.status.textContent = t(playing ? "spotify.now" : "spotify.idle");

    els.song.hidden = !playing;
    els.artist.hidden = !playing || !track.artist;
    els.progress.hidden = !playing || !(track && track.start && track.end > track.start);
    els.song.textContent = playing ? track.title : "";
    els.artist.textContent = playing ? track.artist : "";
    if (playing) els.song.title = track.title;

    const showArt = playing && track.art;
    els.img.hidden = !showArt;
    els.icon.hidden = Boolean(showArt);
    if (showArt) {
      if (els.img.getAttribute("src") !== track.art) els.img.src = track.art;
      els.img.alt = t("spotify.cover");
    } else {
      els.img.removeAttribute("src");
    }

    // The link goes to the track when we know it, to the profile otherwise
    const trackUrl = playing && track.id ? "https://open.spotify.com/track/" + track.id : "";
    els.link.href = trackUrl || SPOTIFY.profile;
    els.link.textContent = t(trackUrl ? "spotify.open" : "spotify.profile");
    updateBar();
  }

  // The progress bar moves by itself between two refreshes
  function updateBar() {
    if (els.progress.hidden || !track) return;
    const ratio = (Date.now() - track.start) / (track.end - track.start);
    els.bar.style.width = Math.min(100, Math.max(0, ratio * 100)).toFixed(1) + "%";
    // The song is over: ask for the next one now (at most once every 10 seconds)
    if (ratio >= 1.02 && Date.now() - lastForced > 10000) {
      lastForced = Date.now();
      refresh();
    }
    if (isStale()) render();
  }

  async function refresh() {
    if (busy) return;
    busy = true;
    try {
      track = await fetchTrack();
    } catch (e) {
      track = null; // service unavailable: show the idle card
    }
    busy = false;
    render();
  }

  function start() {
    stop();
    refresh();
    timer = setInterval(refresh, Math.max(10, SPOTIFY.refreshSeconds) * 1000);
    tick = setInterval(updateBar, 1000);
  }
  function stop() { clearInterval(timer); clearInterval(tick); }

  // Pause the checks while the tab is hidden
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  onChange(render);

  render();
  start();
  window.siteSpotify = { refresh, render, getTrack: () => track, fromLanyard, fromEndpoint };
})();

/* 10. Live month at the end of the road: always the current month, in the site language */
(function initLiveMonth() {
  const el = document.getElementById("live-month");
  if (!el) return;

  function render() {
    const now = new Date();
    const text = new Intl.DateTimeFormat(locale(), { month: "long", year: "numeric" }).format(now);
    el.textContent = text.charAt(0).toUpperCase() + text.slice(1);
    el.setAttribute("datetime", now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0"));
  }

  render();
  onChange(render);
  setInterval(render, 60 * 60 * 1000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
  window.siteLiveMonth = { render };
})();

/* 11. Misc */
document.getElementById("to-top")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
