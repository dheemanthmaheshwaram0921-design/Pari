/* ============================================================
   FOR PARI — Day 1 sequence
   Steps: hello -> start -> password -> interstitial -> (day 2 handoff)
   ============================================================ */

const CORRECT_PASSWORD = "06082008"; // digits only, DD MM YYYY

const steps = ["step-hello", "step-start", "step-password", "step-interstitial", "step-placeholder"];
let currentStepIndex = 0;

function getStepEl(id) { return document.getElementById(id); }

function goToStep(index) {
  const outgoing = getStepEl(steps[currentStepIndex]);
  const incoming = getStepEl(steps[index]);
  if (outgoing) outgoing.classList.remove("active");
  incoming.classList.add("active");
  currentStepIndex = index;
}

/* ---------- Desktop mode nudge ---------- */
(function initDesktopNudge() {
  const nudge = document.getElementById("desktopNudge");
  const dismiss = document.getElementById("dismissNudge");
  const isNarrow = window.matchMedia("(max-width: 600px)").matches;
  const isTouch = "ontouchstart" in window;
  if (isNarrow && isTouch) {
    setTimeout(() => nudge.classList.add("show"), 600);
  }
  dismiss.addEventListener("click", () => nudge.classList.remove("show"));
})();

/* ---------- Step 1: Hello There ---------- */
function buildHelloChars() {
  const el = document.getElementById("helloText");
  const text = "HELLO THERE";
  el.innerHTML = "";
  [...text].forEach((ch) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch === " " ? "\u00A0" : ch;
    el.appendChild(span);
  });
}

function playHello() {
  buildHelloChars();
  goToStep(0);
  const tl = gsap.timeline();
  tl.to(".hello-text .char", {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "back.out(1.8)",
    stagger: 0.045
  })
  .to(".hello-glass", { duration: 1.3 }) // hold
  .to(".hello-glass", { opacity: 0, y: -30, duration: 0.6, ease: "power2.in" })
  .call(() => playStart());
}

/* ---------- Step 2: Start ---------- */
function playStart() {
  goToStep(1);
  gsap.fromTo(".start-text",
    { opacity: 0, scale: 0.7 },
    { opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.7)" }
  );
}

document.getElementById("startBtn").addEventListener("click", () => {
  const overlay = document.getElementById("purpleOverlay");
  overlay.classList.add("show");
  const tl = gsap.timeline();
  tl.to(overlay, { opacity: 1, duration: 0.6, ease: "power2.out" })
    .to(".purple-text", { opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.2")
    .to(".purple-text", { duration: 1.0 }) // hold
    .to(overlay, { opacity: 0, duration: 0.7, ease: "power2.inOut" })
    .call(() => {
      overlay.classList.remove("show");
      playPassword();
    });
});

/* ---------- Step 3: Password ---------- */
function spawnSparkles() {
  const field = document.getElementById("sparkleField");
  field.innerHTML = "";
  const glyphs = ["✦", "✧", "⋆"];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.fontSize = (0.7 + Math.random() * 1.1) + "rem";
    s.style.animationDelay = (Math.random() * 3) + "s";
    field.appendChild(s);
  }
}

function playPassword() {
  goToStep(2);
  spawnSparkles();
  const card = document.getElementById("passwordCard");
  gsap.fromTo(card,
    { opacity: 0, scale: 0.4, y: 40 },
    { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "back.out(1.9)" }
  );
  setTimeout(() => document.getElementById("passwordInput").focus(), 500);
}

function normalizeDigits(str) {
  return str.replace(/\D/g, "");
}

function tryPassword() {
  const input = document.getElementById("passwordInput");
  const errorEl = document.getElementById("passwordError");
  const raw = normalizeDigits(input.value);

  if (raw === CORRECT_PASSWORD) {
    errorEl.classList.remove("show");
    unlockToInterstitial();
  } else {
    errorEl.classList.add("show");
    gsap.fromTo("#passwordCard", { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    input.value = "";
  }
}

document.getElementById("enterBtn").addEventListener("click", tryPassword);
document.getElementById("passwordInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryPassword();
});

function unlockToInterstitial() {
  const blur = document.getElementById("blurTransition");
  const tl = gsap.timeline();
  tl.to("#passwordCard", { opacity: 0, scale: 0.9, duration: 0.4, ease: "power2.in" })
    .to(blur, { backdropFilter: "blur(24px)", background: "rgba(255,255,255,0.4)", duration: 0.5, ease: "power2.inOut" }, 0)
    .call(() => {
      playInterstitial();
    })
    .to(blur, { backdropFilter: "blur(0px)", background: "rgba(255,255,255,0)", duration: 0.6, ease: "power2.out" });
}

/* ---------- Step 4: Pink cloud interstitial ---------- */
const EMOJI_SET = ["✨", "💗", "😍", "🥰", "😘", "🤩", "💘", "💝", "💖", "💗", "💓", "💞", "💕", "❤️", "🩷", "💋", "💫"];

function spawnClouds() {
  const field = document.getElementById("cloudField");
  field.innerHTML = "";
  const count = window.innerWidth < 500 ? 5 : 8;
  for (let i = 0; i < count; i++) {
    const cloud = document.createElement("div");
    cloud.className = "cloud";
    const size = 80 + Math.random() * 160;
    cloud.style.width = size + "px";
    cloud.style.height = size * 0.6 + "px";
    cloud.style.left = Math.random() * 100 + "%";
    cloud.style.top = Math.random() * 90 + "%";
    field.appendChild(cloud);
    gsap.to(cloud, {
      x: (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 80),
      duration: 8 + Math.random() * 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
}

let emojiSpawnInterval = null;
function spawnEmoji() {
  const field = document.getElementById("emojiField");
  const el = document.createElement("span");
  el.className = "floating-emoji";
  el.textContent = EMOJI_SET[Math.floor(Math.random() * EMOJI_SET.length)];
  const startX = Math.random() * 100;
  const size = 2 + Math.random() * 1.8;
  el.style.left = startX + "%";
  el.style.fontSize = size + "rem";
  field.appendChild(el);

  const duration = 5 + Math.random() * 4;
  const drift = (Math.random() - 0.5) * 120;

  gsap.timeline({ onComplete: () => el.remove() })
    .to(el, { opacity: 1, duration: 0.6 })
    .to(el, { y: -window.innerHeight * 1.2, x: drift, duration, ease: "power1.out" }, 0)
    .to(el, { opacity: 0, duration: 0.8 }, duration - 0.8);
}

function playInterstitial() {
  goToStep(3);
  spawnClouds();
  if (emojiSpawnInterval) clearInterval(emojiSpawnInterval);
  emojiSpawnInterval = setInterval(spawnEmoji, 380);
  for (let i = 0; i < 6; i++) setTimeout(spawnEmoji, i * 150);

  gsap.fromTo(".ready-text",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 1.2, delay: 0.8, ease: "power2.out" }
  );
}

document.getElementById("readyBtn").addEventListener("click", () => {
  if (emojiSpawnInterval) clearInterval(emojiSpawnInterval);
  const tl = gsap.timeline();
  tl.to("#step-interstitial", { opacity: 0, duration: 0.7, ease: "power2.inOut" })
    .call(() => {
      goToStep(4);
      // Hook point: Day 2 main section takes over from here.
    });
});

/* ---------- Ambient orb drift ---------- */
function animateOrbs() {
  document.querySelectorAll(".glow-orb").forEach((orb, i) => {
    gsap.to(orb, {
      x: (i % 2 === 0 ? 1 : -1) * (30 + Math.random() * 40),
      y: (i % 2 === 0 ? -1 : 1) * (20 + Math.random() * 30),
      duration: 10 + Math.random() * 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });
}

/* ---------- Pointer parallax on orbs ---------- */
function initParallax() {
  const layers = document.querySelectorAll(".orb-layer");
  const movers = Array.from(layers).map((layer) => ({
    layer,
    moveX: gsap.quickTo(layer, "x", { duration: 1, ease: "power2.out" }),
    moveY: gsap.quickTo(layer, "y", { duration: 1, ease: "power2.out" })
  }));

  function applyParallax(clientX, clientY) {
    const nx = (clientX / window.innerWidth - 0.5) * 2;
    const ny = (clientY / window.innerHeight - 0.5) * 2;
    movers.forEach(({ layer, moveX, moveY }) => {
      if (!layer.closest(".step")?.classList.contains("active")) return;
      moveX(nx * 22);
      moveY(ny * 22);
    });
  }

  window.addEventListener("pointermove", (e) => applyParallax(e.clientX, e.clientY));
  window.addEventListener("touchmove", (e) => {
    if (e.touches[0]) applyParallax(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
}

/* ---------- Boot ---------- */
window.addEventListener("DOMContentLoaded", () => {
  animateOrbs();
  initParallax();
  playHello();
});
