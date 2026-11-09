/* =========================================================
   Deepam Oils — site script
   ---------------------------------------------------------
   EDIT THESE FIRST: business details, products & prices.
   ========================================================= */
const CONFIG = {
  // WhatsApp number in international format, digits only (91 = India). <-- REPLACE
  whatsapp: "919740715686",
  phoneDisplay: "+91 97407 15686",
  proprietor: "Kiran Kumar P N",
  place: "Bagepalli",
  address: "Bagepalli, Chikkaballapur District, Karnataka",
  currency: "₹",

  // ---- Realistic hero video (optional) ----------------------------------
  // Put the AI-generated clips in /assets. If the files are missing, the site
  // automatically falls back to the drawn (SVG) animation.
  heroVideo: {
    playIntro: false,                      // false = open straight on the lit diya (flame loop), no pouring intro
    desktop: "assets/hero-desktop.mp4",   // 16:9 intro clip (only used when playIntro is true; kept in _source/)
    desktopLoop: "assets/hero-desktop-loop.mp4?v=2", // "living flame" loop — the homepage video
    loopStartAt: 1.5,                      // where in the loop the clip's last frame matches (seamless hand-off)
    mobile: null,                          // 9:16 portrait clip — later. Until then phones show the desktop clip as a top band
    flameAt: 4.6,                          // second in the clip when the flame ignites
    // where the flame sits in the frame (0–1 from left / from top)
    flameDesktop: { x: 0.685, y: 0.30 },
    flameMobile: { x: 0.62, y: 0.30 },
  },
};

// Prices are placeholders — replace with real ones.
const PRODUCTS = [
  {
    id: "pancha",
    name: "Panchadeepam Oil",
    image: "assets/products/panchadeepam.jpg",
    desc: "The traditional blend of five sacred oils — gingelly, castor, neem, coconut & iluppai — for daily pooja.",
    color: "#d99a2b",
    shape: "bottle",
    tag: "Bestseller",
    sizes: [ { label: "500 ml", price: 149 }, { label: "1 L", price: 279 }, { label: "5 L", price: 1299 } ],
  },
  {
    id: "gingelly",
    name: "Gingelly Deepam Oil",
    image: "assets/products/gingelly.jpg",
    desc: "Pure sesame oil — the most auspicious oil for the lamp, with a warm, steady flame.",
    color: "#b8741f",
    shape: "bottle",
    sizes: [ { label: "500 ml", price: 169 }, { label: "1 L", price: 319 }, { label: "5 L", price: 1499 } ],
  },
  {
    id: "castor",
    name: "Castor Lamp Oil",
    image: "assets/products/castor.jpg",
    desc: "Thick, slow-burning castor oil — ideal for long-lasting temple and festival lamps.",
    color: "#e4c25a",
    shape: "bottle",
    sizes: [ { label: "500 ml", price: 139 }, { label: "1 L", price: 259 }, { label: "5 L", price: 1199 } ],
  },
  {
    id: "ghee",
    name: "Cow Ghee Deepam",
    image: "assets/products/ghee.jpg",
    desc: "Pure cow ghee for special prayers, homams and auspicious occasions.",
    color: "#f2c95c",
    shape: "jar",
    tag: "Premium",
    sizes: [ { label: "200 g", price: 199 }, { label: "500 g", price: 459 }, { label: "1 kg", price: 879 } ],
  },
];

/* ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = (n) => CONFIG.currency + Number(n).toLocaleString("en-IN");
const hasGSAP = typeof window.gsap !== "undefined";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;

function store(key, val) {
  try {
    if (val === undefined) return JSON.parse(localStorage.getItem(key));
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) { return null; }
}
function sessionFlag(key, set) {
  try {
    if (set) sessionStorage.setItem(key, "1");
    return sessionStorage.getItem(key) === "1";
  } catch (e) { return false; }
}

function waLink(text) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
}
function openWA(text) {
  window.open(waLink(text), "_blank", "noopener");
}

/* ---------------------------------------------------------
   Product bottle art (inline SVG, tinted per product)
   --------------------------------------------------------- */
const BOTTLE_PATH = "M-14 -100 L14 -100 L14 -66 C16 -52 42 -50 42 -26 L42 86 C42 94 36 100 28 100 L-28 100 C-36 100 -42 94 -42 86 L-42 -26 C-42 -50 -16 -52 -14 -66 Z";
const JAR_PATH = "M-40 -46 L40 -46 C46 -46 48 -38 48 -28 L48 82 C48 93 40 100 28 100 L-28 100 C-40 100 -48 93 -48 82 L-48 -28 C-48 -38 -46 -46 -40 -46 Z";

function productArt(p) {
  // real photo when available (placeholders now — replace files in assets/products/)
  if (p.image) return `<img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async" />`;
  const isJar = p.shape === "jar";
  const path = isJar ? JAR_PATH : BOTTLE_PATH;
  const cap = isJar
    ? `<rect x="-44" y="-70" width="88" height="26" rx="6" fill="url(#gCapP)"/>`
    : `<rect x="-17" y="-112" width="34" height="14" rx="3" fill="url(#gCapP)"/>`;
  return `
  <svg viewBox="-56 -116 112 226" aria-hidden="true">
    <path d="${path}" fill="currentColor"/>
    <path d="${path}" fill="url(#gShadeP)"/>
    <path d="M-31 ${isJar ? -30 : -18} L-31 82" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>
    ${cap}
    <rect x="-36" y="4" width="72" height="62" rx="5" fill="#f4e7cf"/>
    <rect x="-32" y="8" width="64" height="54" rx="3" fill="none" stroke="#7b1f14" stroke-width="1"/>
    <text x="0" y="47" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="9.5" letter-spacing="2.4" fill="#3a2414">DEEPAM</text>
    <text x="0" y="57" text-anchor="middle" font-family="Manrope, sans-serif" font-size="4.6" letter-spacing="1" fill="#7a6650">${isJar ? "PURE COW GHEE" : "PURE LAMP OIL"}</text>
  </svg>`;
}

function injectSharedDefs() {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("width", "0");
  s.setAttribute("height", "0");
  s.setAttribute("aria-hidden", "true");
  s.style.position = "absolute";
  s.innerHTML = `
    <defs>
      <linearGradient id="gShadeP" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#000" stop-opacity=".55"/>
        <stop offset=".28" stop-color="#000" stop-opacity="0"/>
        <stop offset=".5" stop-color="#fff" stop-opacity=".28"/>
        <stop offset=".78" stop-color="#000" stop-opacity=".05"/>
        <stop offset="1" stop-color="#000" stop-opacity=".6"/>
      </linearGradient>
      <linearGradient id="gCapP" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f7dc98"/><stop offset="1" stop-color="#9a6526"/>
      </linearGradient>
    </defs>`;
  document.body.prepend(s);
}

/* ---------------------------------------------------------
   Products grid
   --------------------------------------------------------- */
const selection = {}; // id -> { size, qty }

function renderProducts() {
  const grid = $("#productGrid");
  grid.innerHTML = PRODUCTS.map((p) => {
    selection[p.id] = { size: Math.min(1, p.sizes.length - 1), qty: 1 };
    const sel = selection[p.id];
    return `
    <article class="product" data-id="${p.id}" style="--oil:${p.color}">
      ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
      <div class="product-visual">${productArt(p)}</div>
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <div class="sizes" role="group" aria-label="Size">
        ${p.sizes.map((s, i) => `<button type="button" class="size${i === sel.size ? " active" : ""}" data-size="${i}">${s.label}</button>`).join("")}
      </div>
      <div class="price-row">
        <span class="price">${money(p.sizes[sel.size].price)}</span>
        <div class="qty" aria-label="Quantity">
          <button type="button" data-step="-1" aria-label="Decrease">−</button>
          <span class="qty-val">1</span>
          <button type="button" data-step="1" aria-label="Increase">+</button>
        </div>
      </div>
      <button type="button" class="btn btn-gold add-btn">Add to order</button>
      <button type="button" class="quick-wa">or order this now on WhatsApp →</button>
    </article>`;
  }).join("");

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".product");
    if (!card) return;
    const p = PRODUCTS.find((x) => x.id === card.dataset.id);
    const sel = selection[p.id];

    const sizeBtn = e.target.closest(".size");
    if (sizeBtn) {
      sel.size = +sizeBtn.dataset.size;
      $$(".size", card).forEach((b) => b.classList.toggle("active", b === sizeBtn));
      $(".price", card).textContent = money(p.sizes[sel.size].price);
      return;
    }
    const step = e.target.closest("[data-step]");
    if (step) {
      sel.qty = Math.max(1, Math.min(99, sel.qty + +step.dataset.step));
      $(".qty-val", card).textContent = sel.qty;
      return;
    }
    if (e.target.closest(".add-btn")) {
      addToCart(p.id, sel.size, sel.qty);
      flyToCart(card);
      return;
    }
    if (e.target.closest(".quick-wa")) {
      const s = p.sizes[sel.size];
      openWA(`Hi Deepam Oils! 🪔\nI'd like to order:\n\n• ${p.name} (${s.label}) × ${sel.qty} = ${money(s.price * sel.qty)}\n\nPlease confirm availability and delivery. 🙏`);
    }
  });

  // subtle 3D tilt on hover devices
  if (canHover && hasGSAP && !reduceMotion) {
    $$(".product").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotationY: px * 7, rotationX: -py * 7, transformPerspective: 900, duration: 0.5, ease: "power2.out" });
      });
      card.addEventListener("pointerleave", () => gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.8, ease: "power3.out" }));
    });
  }
}

/* ---------------------------------------------------------
   Cart + WhatsApp order
   --------------------------------------------------------- */
const CART_KEY = "deepam_cart_v1";
let cart = (store(CART_KEY) || []).filter((it) => PRODUCTS.some((p) => p.id === it.id && p.sizes[it.size]));

function saveCart() { store(CART_KEY, cart); }
function addToCart(id, size, qty) {
  const found = cart.find((it) => it.id === id && it.size === size);
  if (found) found.qty = Math.min(99, found.qty + qty);
  else cart.push({ id, size, qty });
  saveCart();
  renderCart();
  const p = PRODUCTS.find((x) => x.id === id);
  toast(`Added ${p.name} (${p.sizes[size].label})`);
  const pill = $("#cartOpen");
  pill.classList.remove("bump"); void pill.offsetWidth; pill.classList.add("bump");
}
function cartLines() {
  return cart.map((it) => {
    const p = PRODUCTS.find((x) => x.id === it.id);
    const s = p.sizes[it.size];
    return { ...it, p, s, sub: s.price * it.qty };
  });
}
function renderCart() {
  const lines = cartLines();
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const total = lines.reduce((a, l) => a + l.sub, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  $("#cartEmpty").style.display = lines.length ? "none" : "block";
  $("#sendOrder").disabled = !lines.length;
  $("#cartList").innerHTML = lines.map((l, i) => `
    <li class="cart-item" data-i="${i}" style="color:${l.p.color}">
      ${productArt(l.p)}
      <div><h4 style="color:var(--cream)">${l.p.name}</h4><small>${l.s.label} · ${money(l.s.price)}</small></div>
      <div class="right">
        <b style="color:var(--cream)">${money(l.sub)}</b>
        <div class="qty" style="color:var(--cream)">
          <button type="button" data-cstep="-1" aria-label="Decrease">−</button>
          <span>${l.qty}</span>
          <button type="button" data-cstep="1" aria-label="Increase">+</button>
        </div>
      </div>
    </li>`).join("");
}
function buildOrderMessage() {
  const lines = cartLines();
  const total = lines.reduce((a, l) => a + l.sub, 0);
  const f = new FormData($("#cartForm"));
  const name = (f.get("name") || "").trim();
  const address = (f.get("address") || "").trim();
  const note = (f.get("note") || "").trim();
  const out = ["🪔 *New order — Deepam Oils*", ""];
  lines.forEach((l, i) => out.push(`${i + 1}. ${l.p.name} (${l.s.label}) × ${l.qty} = ${money(l.sub)}`));
  out.push("", `*Estimated total: ${money(total)}*`);
  if (name || address || note) out.push("");
  if (name) out.push(`Name: ${name}`);
  if (address) out.push(`Address: ${address}`);
  if (note) out.push(`Note: ${note}`);
  out.push("", "Please confirm availability & delivery. 🙏");
  return out.join("\n");
}
function initCart() {
  const open = () => { document.body.classList.add("drawer-open"); $("#drawer").setAttribute("aria-hidden", "false"); };
  const close = () => { document.body.classList.remove("drawer-open"); $("#drawer").setAttribute("aria-hidden", "true"); };
  $("#cartOpen").addEventListener("click", open);
  $("#cartClose").addEventListener("click", close);
  $("#drawerBackdrop").addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  $("#cartList").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cstep]");
    if (!b) return;
    const i = +b.closest(".cart-item").dataset.i;
    cart[i].qty += +b.dataset.cstep;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    saveCart();
    renderCart();
  });

  // remember name/address for next time (on this device only)
  const form = $("#cartForm");
  const saved = store("deepam_customer_v1") || {};
  ["name", "address"].forEach((k) => { if (saved[k]) form.elements[k].value = saved[k]; });
  form.addEventListener("input", () => store("deepam_customer_v1", { name: form.elements.name.value, address: form.elements.address.value }));

  $("#sendOrder").addEventListener("click", () => {
    if (!cart.length) return;
    openWA(buildOrderMessage());
  });

  renderCart();
}

function flyToCart(card) {
  if (!hasGSAP || reduceMotion) return;
  const src = $(".product-visual svg", card).getBoundingClientRect();
  const dst = $("#cartOpen").getBoundingClientRect();
  const dot = document.createElement("div");
  Object.assign(dot.style, {
    position: "fixed", zIndex: 95, width: "14px", height: "14px", borderRadius: "50%", pointerEvents: "none",
    background: "radial-gradient(circle, #fff6d0, #f3a73a 60%, transparent 70%)", boxShadow: "0 0 20px 6px rgba(255,170,60,.6)",
    left: src.left + src.width / 2 - 7 + "px", top: src.top + src.height / 3 + "px",
  });
  document.body.appendChild(dot);
  gsap.to(dot, {
    duration: 0.9, ease: "power2.in",
    x: dst.left + dst.width - 20 - (src.left + src.width / 2),
    y: dst.top + dst.height / 2 - (src.top + src.height / 3),
    scale: 0.4, onComplete: () => dot.remove(),
  });
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------------------------------------------------------
   General WhatsApp links & business details
   --------------------------------------------------------- */
function initLinks() {
  const general = "Hi Deepam Oils! 🪔 I'd like to know more about your lamp oils.";
  const bulk = "Hi Deepam Oils! 🪔 I'm interested in bulk pricing.\n\nFor: (temple / event / store)\nOils needed:\nApprox. quantity:\nCity:";
  $$(".js-wa-general").forEach((a) => { a.href = waLink(general); a.target = "_blank"; a.rel = "noopener"; });
  $$(".js-wa-bulk").forEach((a) => { a.href = waLink(bulk); a.target = "_blank"; a.rel = "noopener"; });
  $("#footerAddress").textContent = CONFIG.address;
  $("#footerProprietor").textContent = CONFIG.proprietor;
  $("#footerPlace").textContent = CONFIG.place;
  const ph = $("#footerPhone");
  ph.textContent = CONFIG.phoneDisplay;
  ph.href = "tel:+" + CONFIG.whatsapp;
  $("#year").textContent = new Date().getFullYear();

  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------
   Embers — golden sparks rising from the flame
   --------------------------------------------------------- */
const embers = { lit: false };

const videoState = { active: false, mobile: false };
// Flame position inside a video drawn with object-fit: cover
function videoFlamePoint() {
  const vid = $("#heroVideo");
  const r = vid.getBoundingClientRect();
  const vw = vid.videoWidth || (videoState.mobile ? 1080 : 1920);
  const vh = vid.videoHeight || (videoState.mobile ? 1920 : 1080);
  const s = Math.max(r.width / vw, r.height / vh);
  // respect CSS object-position (e.g. "32% 50%") when the clip is cropped
  const [px, py] = getComputedStyle(vid).objectPosition.split(" ").map((v) => parseFloat(v) / 100);
  const ox = r.left + (r.width - vw * s) * (isNaN(px) ? 0.5 : px);
  const oy = r.top + (r.height - vh * s) * (isNaN(py) ? 0.5 : py);
  const f = videoState.mobile ? CONFIG.heroVideo.flameMobile : CONFIG.heroVideo.flameDesktop;
  return { x: ox + f.x * vw * s, y: oy + f.y * vh * s };
}
// Centre of the flame in viewport pixels (works with any scene size / mirroring)
function flameOnScreen() {
  if (videoState.active) return videoFlamePoint();
  const tip = $("#wickTip").getBoundingClientRect();
  const scale = $("#scene").getScreenCTM()?.a || 1;
  return { x: tip.left + tip.width / 2, y: tip.top + tip.height / 2 - 30 * scale };
}
// Feed the flame position to CSS so the "room light" radiates from the diya
function updateLightPos() {
  const f = flameOnScreen();
  const hr = $("#hero").getBoundingClientRect();
  $("#hero").style.setProperty("--fx", f.x - hr.left + "px");
  $("#hero").style.setProperty("--fy", f.y - hr.top + "px");
  $("#veil").style.setProperty("--fx", f.x + "px");
  $("#veil").style.setProperty("--fy", f.y + "px");
}
function initEmbers() {
  const canvas = $("#embers");
  const hero = $("#hero");
  const svg = $("#scene");
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1, visible = true, raf = 0;
  const parts = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth; h = hero.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function flamePoint() {
    const f = flameOnScreen();
    const hr = hero.getBoundingClientRect();
    return { x: f.x - hr.left, y: f.y - hr.top };
  }
  function spawn() {
    const fromFlame = Math.random() < 0.55;
    const f = flamePoint();
    parts.push({
      x: fromFlame ? f.x + (Math.random() - 0.5) * 8 : Math.random() * w,
      y: fromFlame ? f.y : h * (0.55 + Math.random() * 0.5),
      vx: (Math.random() - 0.5) * (fromFlame ? 0.5 : 0.25),
      vy: -(0.25 + Math.random() * (fromFlame ? 1.1 : 0.45)),
      life: 0,
      max: 160 + Math.random() * 260,
      r: Math.random() * (fromFlame ? 1.6 : 1.2) + 0.4,
      seed: Math.random() * 6.28,
    });
  }
  function tick() {
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    ctx.clearRect(0, 0, w, h);
    if (embers.lit && parts.length < 70 && Math.random() < 0.5) spawn();
    ctx.globalCompositeOperation = "lighter";
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life++;
      p.x += p.vx + Math.sin((p.life + p.seed * 40) / 30) * 0.25;
      p.y += p.vy;
      const t = p.life / p.max;
      const a = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
      if (t >= 1) { parts.splice(i, 1); continue; }
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `rgba(255, 214, 140, ${0.9 * a})`);
      g.addColorStop(0.4, `rgba(255, 150, 50, ${0.35 * a})`);
      g.addColorStop(1, "rgba(255, 120, 30, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  resize();
  window.addEventListener("resize", resize);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(hero);
  if (!reduceMotion) tick();
}

/* ---------------------------------------------------------
   Cursor light — a soft warm glow following the pointer
   --------------------------------------------------------- */
function initCursorLight() {
  if (!canHover || !hasGSAP || reduceMotion) return;
  const el = $("#cursorLight");
  const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
  window.addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
}

/* ---------------------------------------------------------
   HERO INTRO — diya from right, bottle from left, pour, light
   --------------------------------------------------------- */
function heroIntro() {
  const body = document.body;
  const veil = $("#veil");
  const svg = $("#scene");

  // keep the page pinned to the top while the intro plays (beats browser scroll restoration)
  const pinTop = () => { if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: "instant" }); };
  window.addEventListener("scroll", pinTop);
  pinTop();

  const finish = () => {
    window.removeEventListener("scroll", pinTop);
    body.classList.remove("intro");
    body.classList.add("lit");
    embers.lit = true;
    veil.style.display = "none";
    updateLightPos();
    window.addEventListener("resize", updateLightPos);
    sessionFlag("deepam_intro_seen", true);
    if (hasGSAP) { initScroll(); requestAnimationFrame(() => ScrollTrigger.refresh()); }
  };

  // No GSAP (CDN blocked) or reduced motion: show the final, lit scene immediately.
  if (!hasGSAP || reduceMotion) { finish(); return; }

  const bigR = () => Math.hypot(window.innerWidth, window.innerHeight) * 1.1;

  // starting states
  gsap.set(veil, { "--r": "0px", "--fx": "50%", "--fy": "60%" });
  gsap.set(["#nav", "#scrollCue", "#heroGlow", "#floorLight", "#roomShade"], { opacity: 0 });
  gsap.set("[data-hero]", { opacity: 0, y: 26 });
  gsap.set("#oil", { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
  gsap.set("#flameGroup", { opacity: 0, scale: 0.2, transformOrigin: "50% 67%" });
  gsap.set("#wick, #wickTip", { opacity: 0 });
  gsap.set(".ripple", { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });

  const tl = gsap.timeline({ onComplete: finish });

  // (the stage is mirrored in SVG: local -x = screen right, local +x = screen left)
  // 1. Diya glides in from the right and settles with a gentle rock
  tl.from("#diya", { x: -760, duration: 1.6, ease: "power3.out" }, 0.25)
    .from("#diya", { rotation: -7, transformOrigin: "50% 92%", duration: 1.9, ease: "elastic.out(1, 0.55)" }, 0.25)

  // 2. Bottle arrives from the left
    .from("#bottle", { x: 760, duration: 1.5, ease: "power3.out" }, 0.55)

  // 3. Lifts and tilts over the diya
    .to(".bottle-shadow", { opacity: 0, duration: 0.3 }, 2.0)
    .to("#bottle", { x: -66, y: -146, rotation: -115, transformOrigin: "50% 50%", duration: 1.15, ease: "power2.inOut" }, 2.0)

  // 4. Golden stream pours and the diya fills
    .to("#stream", { strokeDashoffset: 0, duration: 0.35, ease: "power1.in" }, 3.0)
    .to("#oil", { scale: 1, opacity: 1, duration: 1.5, ease: "power1.out" }, 3.25)
    .to(".ripple", { keyframes: { opacity: [0, 0.8, 0], scale: [0.4, 2.6] }, duration: 0.9, stagger: { each: 0.45, repeat: 1 }, ease: "power1.out" }, 3.3)
    .to("#stream", { strokeWidth: 4.5, duration: 0.25, yoyo: true, repeat: 4, ease: "sine.inOut" }, 3.35)

  // 5. Stream ends, bottle returns upright beside the diya
    .to("#stream", { strokeDashoffset: -1, duration: 0.35, ease: "power1.in" }, 4.75)
    .to("#bottle", { x: 0, y: 0, rotation: 0, duration: 1.1, ease: "power2.inOut" }, 4.8)
    .to(".bottle-shadow", { opacity: 0.45, duration: 0.4 }, 5.7)

  // 6. Wick appears… a spark… and the flame is born
    .to("#wick, #wickTip", { opacity: 1, duration: 0.5 }, 5.0)
    .call(updateLightPos, null, 5.7)
    .fromTo("#spark", { opacity: 1, scale: 0.2, transformOrigin: "50% 50%" }, { opacity: 0, scale: 4, duration: 0.6, ease: "power2.out" }, 5.75)
    .to("#flameGroup", { opacity: 1, scale: 1, duration: 1.0, ease: "back.out(2.2)" }, 5.85)
    .to("#wickTip", { fill: "#ffcf6b", duration: 0.4 }, 5.85)

  // 7. Light spreads through the dark "room"
    .call(() => { body.classList.add("lit"); embers.lit = true; }, null, 6.0)
    .to(veil, { "--r": () => bigR() + "px", duration: 2.2, ease: "power2.inOut" }, 6.0)
    .to(veil, { opacity: 0, duration: 1.2 }, 7.2)
    .to("#roomShade", { opacity: 1, duration: 2.0, ease: "power1.inOut" }, 6.6)
    .to("#heroGlow", { opacity: 1, duration: 2.0, ease: "power2.out" }, 6.0)
    .fromTo("#heroGlow", { scale: 0.3 }, { scale: 1, duration: 2.4, ease: "power3.out" }, 6.0)
    .to("#floorLight", { opacity: 1, duration: 1.6 }, 6.1)

  // 8. Brand & message reveal
    .to("#nav", { opacity: 1, duration: 1 }, 6.7)
    .to("[data-hero]", { opacity: 1, y: 0, duration: 1.1, stagger: 0.14, ease: "power3.out" }, 6.8)
    .to("#scrollCue", { opacity: 1, duration: 0.8 }, 7.8);

  // returning visitors in the same session get a faster intro
  if (sessionFlag("deepam_intro_seen")) tl.timeScale(1.8);
  // intro switched off: jump straight to the finished, lit scene
  if (CONFIG.heroVideo && CONFIG.heroVideo.playIntro === false) { $("#skipIntro")?.remove(); tl.progress(1, false); }

  $("#skipIntro")?.addEventListener("click", () => tl.progress(1, false));
}

/* ---------------------------------------------------------
   SPLASH SCREEN — business & proprietor name, once per visit
   --------------------------------------------------------- */
let splashDone = Promise.resolve();
function runSplash() {
  const el = $("#splash");
  if (!el) return Promise.resolve();
  if (document.documentElement.classList.contains("no-splash")) { el.remove(); return Promise.resolve(); }
  document.body.classList.add("splashing");
  sessionFlag("deepam_splash_seen", true);
  const hold = reduceMotion ? 1200 : 2700;
  return new Promise((resolve) => {
    setTimeout(() => {
      el.classList.add("splash-out");
      document.body.classList.remove("splashing");
      resolve(); // homepage starts revealing while the splash fades away
      setTimeout(() => el.remove(), 1100);
    }, hold);
  });
}

/* ---------------------------------------------------------
   REALISTIC VIDEO HERO — used when the clip exists
   --------------------------------------------------------- */
async function fileExists(url) {
  try { const r = await fetch(url, { method: "HEAD", cache: "no-store" }); return r.ok; }
  catch (e) { return false; }
}

async function startHero() {
  const v = CONFIG.heroVideo;
  if (v && hasGSAP && !reduceMotion) {
    const portrait = window.matchMedia("(max-aspect-ratio: 1/1)").matches;
    let src = null, mobile = false;
    if (portrait && v.mobile && await fileExists(v.mobile)) { src = v.mobile; mobile = true; }
    else {
      const d = v.playIntro === false ? v.desktopLoop : v.desktop;
      if (d && await fileExists(d)) src = d;
    }
    if (src) {
      // phone without its own portrait clip: show the landscape clip as a framed band
      const wide = window.matchMedia("(min-width: 1024px) and (min-aspect-ratio: 4/3)").matches;
      if (!wide && !mobile) document.body.classList.add("video-band");
      return v.playIntro === false ? videoHome(src, mobile) : videoIntro(src, mobile);
    }
  }
  heroIntro();
}

// Homepage without the intro: the lit diya fades up from darkness and keeps flickering
function videoHome(src, mobile) {
  const body = document.body;
  videoState.active = true;
  videoState.mobile = !!mobile;
  body.classList.add("video-mode");
  body.classList.remove("intro");
  $("#veil").style.display = "none";
  $("#skipIntro")?.remove();

  const vid = document.createElement("video");
  Object.assign(vid, { id: "heroVideo", muted: true, playsInline: true, loop: true, autoplay: true, preload: "auto", src });
  vid.className = "hero-video";
  ["muted", "playsinline", "loop", "autoplay"].forEach((a) => vid.setAttribute(a, ""));
  vid.setAttribute("aria-hidden", "true");
  $("#hero").prepend(vid);

  gsap.set(vid, { opacity: 0 });
  gsap.set(["#heroGlow", "#roomShade", "#nav", "#scrollCue"], { opacity: 0 });
  gsap.set("[data-hero]", { opacity: 0, y: 22 });

  const reveal = gsap.timeline({ paused: true })
    .call(() => { updateLightPos(); body.classList.add("lit"); embers.lit = true; })
    .to(vid, { opacity: 1, duration: 1.4, ease: "power2.out" }, 0)
    .fromTo("#heroGlow", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.8, ease: "power3.out" }, 0.2)
    .to("#roomShade", { opacity: 1, duration: 1.4 }, 0.3)
    .to("#nav", { opacity: 1, duration: 0.9 }, 0.4)
    .to("[data-hero]", { opacity: 1, y: 0, duration: 1.0, stagger: 0.12, ease: "power3.out" }, 0.5)
    .to("#scrollCue", { opacity: 1, duration: 0.8 }, 1.3);

  // reveal once the splash is leaving AND the video has a frame (or 1.5s passed)
  const videoReady = new Promise((res) => { vid.addEventListener("loadeddata", res, { once: true }); setTimeout(res, 1500); });
  vid.addEventListener("loadedmetadata", updateLightPos);
  Promise.all([splashDone, videoReady]).then(() => reveal.play());
  vid.play().catch(() => {}); // autoplay blocked: first frame still shows

  window.addEventListener("resize", updateLightPos);
  initScroll();
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function videoIntro(src, mobile) {
  const body = document.body;
  const hero = $("#hero");
  videoState.active = true;
  videoState.mobile = !!mobile;
  body.classList.add("video-mode");
  $("#veil").style.display = "none";

  const vid = document.createElement("video");
  Object.assign(vid, { id: "heroVideo", muted: true, playsInline: true, preload: "auto", src });
  vid.className = "hero-video";
  vid.setAttribute("muted", "");
  vid.setAttribute("playsinline", "");
  vid.setAttribute("aria-hidden", "true");
  hero.prepend(vid);

  // living-flame loop, so the flame keeps flickering after the clip ends
  const loopSrc = mobile ? CONFIG.heroVideo.mobileLoop : CONFIG.heroVideo.desktopLoop;
  let loopVid = null;
  if (loopSrc) {
    loopVid = document.createElement("video");
    Object.assign(loopVid, { muted: true, playsInline: true, loop: true, preload: "auto", src: loopSrc });
    loopVid.className = "hero-video";
    loopVid.setAttribute("muted", "");
    loopVid.setAttribute("playsinline", "");
    loopVid.setAttribute("aria-hidden", "true");
    loopVid.style.opacity = "0";
    vid.after(loopVid);
  }
  const startLoop = () => {
    if (!loopVid) return;
    try { loopVid.currentTime = CONFIG.heroVideo.loopStartAt || 0; } catch (e) {}
    loopVid.play().then(() => { loopVid.style.opacity = "1"; vid.style.opacity = "0"; vid.pause(); }).catch(() => {});
  };

  const pinTop = () => { if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: "instant" }); };
  window.addEventListener("scroll", pinTop);
  pinTop();

  gsap.set(["#nav", "#scrollCue", "#heroGlow", "#roomShade"], { opacity: 0 });
  gsap.set("[data-hero]", { opacity: 0, y: 26 });

  // light + reveal, fired when the flame ignites in the video
  const light = gsap.timeline({ paused: true })
    .call(() => { updateLightPos(); body.classList.add("lit"); embers.lit = true; })
    .fromTo("#heroGlow", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 2.4, ease: "power3.out" }, 0)
    .to("#roomShade", { opacity: 1, duration: 2.0, ease: "power1.inOut" }, 0.4)
    .to("#nav", { opacity: 1, duration: 1 }, 0.8)
    .to("[data-hero]", { opacity: 1, y: 0, duration: 1.1, stagger: 0.14, ease: "power3.out" }, 0.9)
    .to("#scrollCue", { opacity: 1, duration: 0.8 }, 1.8);

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    window.removeEventListener("scroll", pinTop);
    body.classList.remove("intro");
    if (light.progress() < 1) light.progress(1, false);
    updateLightPos();
    window.addEventListener("resize", updateLightPos);
    sessionFlag("deepam_intro_seen", true);
    initScroll();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  const flameAt = CONFIG.heroVideo.flameAt;
  let lit = false;
  const watch = () => {
    if (!lit && vid.currentTime >= flameAt) { lit = true; light.play(); }
    if (!done) requestAnimationFrame(watch);
  };
  vid.addEventListener("loadedmetadata", updateLightPos);
  vid.addEventListener("ended", () => { startLoop(); if (!lit) { lit = true; light.play(); } light.then(finish); });

  // if the clip can't play (data saver, autoplay blocked), jump straight to the lit last frame
  const fallbackToEnd = () => {
    vid.addEventListener("loadedmetadata", () => { vid.currentTime = Math.max(0, vid.duration - 0.05); }, { once: true });
    if (vid.readyState >= 1) vid.currentTime = Math.max(0, vid.duration - 0.05);
    startLoop();
    lit = true; light.progress(1, false); finish();
  };
  vid.play().then(watch).catch(fallbackToEnd);

  $("#skipIntro").addEventListener("click", () => {
    if (vid.duration) vid.currentTime = Math.max(0, vid.duration - 0.05);
    vid.pause();
    startLoop();
    lit = true;
    light.progress(1, false);
    finish();
  });
}

/* ---------------------------------------------------------
   Scroll animations
   --------------------------------------------------------- */
let scrollInited = false;
function initScroll() {
  if (scrollInited || !hasGSAP) return;
  scrollInited = true;
  gsap.registerPlugin(ScrollTrigger);

  // hero parallax as you scroll away
  if (videoState.active) gsap.to(".hero-video", { yPercent: 10, scale: 1.05, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to("#heroScene", { y: 90, scale: 0.92, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to("#heroCopy", { y: -40, opacity: 0.2, ease: "none", scrollTrigger: { trigger: "#hero", start: "center top", end: "bottom top", scrub: true } });

  $$("[data-reveal]").forEach((el) => {
    gsap.from(el, { y: 44, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });

  gsap.set(".product", { opacity: 0, y: 60 });
  ScrollTrigger.batch(".product", {
    start: "top 90%",
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: "power3.out" }),
  });

  // story word slowly glows in with scroll
  gsap.fromTo(".story-num .big-word", { opacity: 0.15, filter: "blur(6px)" }, {
    opacity: 0.95, filter: "blur(0px)", ease: "none",
    scrollTrigger: { trigger: ".story", start: "top 80%", end: "center 55%", scrub: true },
  });
}

/* ---------------------------------------------------------
   Boot
   --------------------------------------------------------- */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("load", () => {
  if (document.body.classList.contains("intro")) window.scrollTo({ top: 0, behavior: "instant" });
});

document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo({ top: 0, behavior: "instant" }); // the intro always plays from the top of the page
  injectSharedDefs();
  renderProducts();
  initCart();
  initLinks();
  initEmbers();
  initCursorLight();
  splashDone = runSplash();
  startHero();
});
