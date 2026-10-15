/* =========================================================
   Hero intro: typewriter effect + greeting by local time
   1. Settings (edit here)
   2. Time of day
   3. Typewriter
   4. Playing the intro
   5. Language and clock updates
   ========================================================= */
(function () {
  "use strict";

  const { t, onChange } = window.siteI18n;

  /* 1. Settings */
  const TYPE_SPEED = 55;     // milliseconds per letter when typing
  const ERASE_SPEED = 28;    // milliseconds per letter when erasing
  const PAUSE_BETWEEN = 1700; // pause before the first phrase is erased
  const CLOCK_CHECK = 30000; // check the time every 30 seconds

  // The headline types the first phrase, erases it, then types the second one.
  const WELCOME_KEYS = ["hero.welcome1", "hero.welcome2"];

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const els = {
    welcome: document.getElementById("typed-welcome"),
    greeting: document.getElementById("typed-greeting"),
    cursorWelcome: document.getElementById("cursor-welcome"),
    cursorGreeting: document.getElementById("cursor-greeting"),
    sizerWelcome: document.getElementById("sizer-welcome"),
    sizerGreeting: document.getElementById("sizer-greeting"),
    srGreeting: document.getElementById("sr-greeting")
  };
  if (!els.welcome || !els.greeting) return;

  /* 2. Time of day
     05:00 to 19:59 -> day message. 20:00 to 04:59 -> evening message. */
  function greetingKey(date) {
    const hour = (date || new Date()).getHours();
    return hour >= 5 && hour < 20 ? "hero.greetDay" : "hero.greetNight";
  }

  /* 3. Typewriter */
  let run = 0;           // each new animation gets a new number, so old ones stop
  let status = "idle";   // idle, running, done
  let greetKey = greetingKey();

  // Split into letters without cutting emojis in half
  function letters(text) {
    if (window.Intl && Intl.Segmenter) {
      return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), (s) => s.segment);
    }
    return Array.from(text);
  }

  // Resolves to false when a newer animation has started
  function wait(ms, id) {
    return new Promise((resolve) => setTimeout(() => resolve(id === run), ms));
  }

  async function typeText(el, text, id) {
    const chars = letters(text);
    for (let i = 1; i <= chars.length; i++) {
      el.textContent = chars.slice(0, i).join("");
      if (!(await wait(TYPE_SPEED + Math.random() * 35, id))) return false;
    }
    return true;
  }

  async function eraseText(el, id) {
    const chars = letters(el.textContent);
    for (let i = chars.length - 1; i >= 0; i--) {
      el.textContent = chars.slice(0, i).join("");
      if (!(await wait(ERASE_SPEED, id))) return false;
    }
    return true;
  }

  function showCursor(which) {
    els.cursorWelcome.classList.toggle("is-hidden", which !== "welcome");
    els.cursorGreeting.classList.toggle("is-hidden", which !== "greeting");
  }

  // Invisible copies of the longest phrases keep the layout from jumping while typing
  function longest(keys) {
    return keys.map((k) => t(k)).sort((a, b) => b.length - a.length)[0];
  }
  function updateSizers() {
    els.sizerWelcome.textContent = longest(WELCOME_KEYS);
    els.sizerGreeting.textContent = longest(["hero.greetDay", "hero.greetNight"]);
  }

  function updateScreenReaderText() {
    els.srGreeting.textContent = t(greetKey);
  }

  /* 4. Playing the intro */
  function showFinalText() {
    greetKey = greetingKey();
    els.welcome.textContent = t(WELCOME_KEYS[WELCOME_KEYS.length - 1]);
    els.greeting.textContent = t(greetKey);
    showCursor("greeting");
    updateSizers();
    updateScreenReaderText();
    status = "done";
  }

  async function play() {
    if (reduceMotion) { showFinalText(); return; }

    const id = ++run;
    status = "running";
    updateSizers();
    els.welcome.textContent = "";
    els.greeting.textContent = "";
    showCursor("welcome");

    for (let i = 0; i < WELCOME_KEYS.length; i++) {
      if (!(await typeText(els.welcome, t(WELCOME_KEYS[i]), id))) return;
      if (i < WELCOME_KEYS.length - 1) {
        if (!(await wait(PAUSE_BETWEEN, id))) return;
        if (!(await eraseText(els.welcome, id))) return;
        if (!(await wait(250, id))) return;
      }
    }

    // Now the greeting. The cursor moves to the second line.
    showCursor("greeting");
    greetKey = greetingKey();
    updateScreenReaderText();
    if (!(await wait(350, id))) return;
    if (!(await typeText(els.greeting, t(greetKey), id))) return;
    status = "done";
  }

  // The hour changed from day to evening (or the reverse): swap the greeting
  async function refreshGreeting() {
    const next = greetingKey();
    if (status !== "done" || next === greetKey) return;

    greetKey = next;
    updateScreenReaderText();
    if (reduceMotion) { els.greeting.textContent = t(greetKey); return; }

    const id = ++run;
    status = "running";
    if (!(await eraseText(els.greeting, id))) return;
    if (!(await wait(200, id))) return;
    if (!(await typeText(els.greeting, t(greetKey), id))) return;
    status = "done";
  }

  /* 5. Language and clock updates */
  onChange(() => {
    // Finished: swap the texts at once. Still typing: start again in the new language.
    if (status === "done") showFinalText();
    else play();
  });

  setInterval(refreshGreeting, CLOCK_CHECK);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshGreeting();
  });

  // For tests and for you in the browser console: siteHero.greetingKey(new Date(2026, 0, 1, 21))
  window.siteHero = { greetingKey, getStatus: () => status };

  play();
})();
