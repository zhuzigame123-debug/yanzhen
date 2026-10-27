/* 言侦公寓 · 交互 */
(function () {
  const D = window.DATA || { world: [], chars: [] };
  const $ = (s, r) => (r || document).querySelector(s);

  /* ---------- 世界观段落（关键词点亮） ---------- */
  const body = $("#worldBody");
  const HL = ["侦探", "异能", "凶手", "布局", "并非偶然", "八个人"];
  function renderWorld() {
  const src = (window.__LANG === "ko" && D.worldKo && D.worldKo.length) ? D.worldKo : D.world;
  body.innerHTML = "";
  src.forEach((txt, i) => {
    const p = document.createElement("p");
    p.className = "world-p reveal";
    let html = txt.replace(/[<>&]/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[m]));
    HL.forEach((w) => {
      html = html.replace(new RegExp(w, "g"), `<span class="hl">${w}</span>`);
    });
    p.innerHTML = html;
    p.style.transitionDelay = (i * 0.06) + "s";
    p.classList.add("in");
    body.appendChild(p);
  });
  }
  renderWorld();

  /* ---------- 角色卡片 ---------- */
  const grid = $("#grid");
  const VOL = (i) => String(i + 3).padStart(2, "0") + " / 10";
  const LANG = { v: localStorage.getItem("yz-lang") || "zh" };

  function T(key, fallback) {
    const e = (D.i18n || {})[key];
    if (!e) return fallback || key;
    return LANG.v === "ko" ? e[1] : e[0];
  }

  function renderCards() {
    grid.innerHTML = "";
    D.chars.forEach((c, i) => {
      const el = document.createElement("button");
      el.className = "card reveal in";
      el.style.setProperty("--c", c.color);
      el.style.transitionDelay = (i % 4) * 0.06 + "s";
      const main = LANG.v === "ko" ? c.ko : c.name;
      const sub = LANG.v === "ko" ? c.name + (c.sid ? " · " + c.sid : "") : c.ko + (c.sid ? " · " + c.sid : "");
      const tag = LANG.v === "ko" ? (c.koTag || c.tag) : c.tag;
      el.innerHTML = `
        <span class="card-no">VOL.${VOL(i)}</span>
        <span class="card-glyph">${c.glyph}</span>
        <img class="card-art" src="assets/chars/${c.slug}.webp" alt="${c.name} 角色立绘" loading="lazy">
        <span class="card-body">
          <span class="card-name">${main}</span>
          <span class="card-ko">${sub}</span>
          <span class="card-tag">${tag}</span>
          <span class="card-foot"><span>${c.author}</span><span>${T("d.open", "打开档案 →")}</span></span>
        </span>`;
      el.addEventListener("click", () => { location.hash = "#/c/" + c.slug; });
      grid.appendChild(el);
    });
    bindTilt();
  }

  function bindTilt() {
    grid.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--rx", ((0.5 - py) * 9).toFixed(2) + "deg");
        card.style.setProperty("--ry", ((px - 0.5) * 11).toFixed(2) + "deg");
        card.style.setProperty("--px", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--py", (py * 100).toFixed(1) + "%");
      });
      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }
  renderCards();

  /* ---------- 设计原稿 ---------- */
  const GAL = [
    ["assets/gallery/g1.jpg", "言侦公寓 · 封面"],
    ["assets/gallery/g2.jpg", "八人完整设定集"],
    ["assets/gallery/d1.jpg", "角色档案页 · 设计稿"],
    ["assets/gallery/d2.jpg", "白天 / 夜晚 立绘对比"],
    ["assets/gallery/d3.jpg", "Q 版形象对照"],
    ["assets/gallery/d4.jpg", "角色风格对比"],
    ["assets/gallery/g3.jpg", "韩系排版参考"]
  ];
  const galGrid = $("#galGrid");
  GAL.forEach(([src, cap], i) => {
    const fig = document.createElement("figure");
    fig.className = "gal-item reveal";
    fig.style.transitionDelay = (i % 3) * 0.05 + "s";
    fig.innerHTML = `<img src="${src}" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption>`;
    fig.addEventListener("click", () => openLightbox(src, cap));
    galGrid.appendChild(fig);
  });

  /* ---------- 作者名单 ---------- */
  const credits = $("#credits");
  D.chars.forEach((c) => {
    const li = document.createElement("li");
    li.textContent = `${c.author} · ${c.name}`;
    credits.appendChild(li);
  });

  /* ---------- 详情弹层 ---------- */
  const modal = $("#modal");
  const mScroll = $("#modalScroll");

  function renderDetail(c, i) {
    const groups = c.groups.map((g) => `
      <section class="d-group" id="g-${g.n}">
        <h4>${groupLabel(g.n)}</h4>
        <dl>
          ${g.items.map((it) => `<div class="d-item"><dt>${it.k}</dt><dd>${escapeHTML(it.v)}</dd></div>`).join("")}
        </dl>
      </section>`).join("");

    mScroll.innerHTML = `
      <div class="detail" style="--c:${c.color}">
        <div class="detail-art">
          <span class="ghost-no">${String(i + 3).padStart(2, "0")}</span>
          <img src="assets/chars/${c.slug}.webp" alt="${c.name} 角色立绘">
        </div>
        <div class="detail-body">
          <header class="d-head">
            <p class="d-no">VOL.${VOL(i)} · CHARACTER PROFILE</p>
            <h3 class="d-name">${c.name}</h3>
            <p class="d-ko">${c.ko}${c.sid ? " · " + c.sid : ""}</p>
            <p class="d-tag">${c.tag}</p>
            <p class="d-kotag">${c.koTag || ""}</p>
            <div class="d-meta">
              <span>${T("d.author", "作者")} · ${c.author}</span>
              <span>${T("d.sid", "学号")} · ${c.sid || "—"}</span>
              <span>${T("d.body", "三头身 · 人型")}</span>
            </div>
          </header>
          <nav class="d-chips">
            ${c.groups.map((g) => `<button data-go="g-${g.n}">${groupLabel(g.n)}</button>`).join("")}
          </nav>
          ${groups}
        </div>
      </div>
      <button class="d-close" id="dClose" aria-label="关闭">✕</button>`;

    $("#dClose").addEventListener("click", closeModal);
    mScroll.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = document.getElementById(btn.dataset.go);
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function openModal(slug) {
    const i = D.chars.findIndex((c) => c.slug === slug);
    if (i < 0) return;
    renderDetail(D.chars[i], i);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
    mScroll.scrollTop = 0;
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("locked");
    if (location.hash.startsWith("#/c/")) {
      history.replaceState(null, "", location.pathname + "#chars");
    }
  }

  function route() {
    const m = location.hash.match(/^#\/c\/([\w-]+)$/);
    if (m) openModal(m[1]);
    else closeModal();
  }
  window.addEventListener("hashchange", route);

  /* ---------- 灯箱 ---------- */
  const lb = $("#lightbox");
  const lbImg = lb.querySelector("img");
  function openLightbox(src, cap) {
    lbImg.src = src;
    lbImg.alt = cap || "";
    lb.classList.add("open");
    document.body.classList.add("locked");
  }
  lb.addEventListener("click", () => {
    lb.classList.remove("open");
    document.body.classList.remove("locked");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (lb.classList.contains("open")) {
      lb.classList.remove("open");
      document.body.classList.remove("locked");
    } else if (modal.classList.contains("open")) {
      closeModal();
    }
  });

  /* ---------- 滚动效果 ---------- */
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const nav = $("#nav");
  const bar = $("#progress");
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("solid", y > 40);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  route();

  function groupLabel(n) {
    const e = (D.i18n || {})["group." + n];
    if (!e) return n;
    return LANG.v === "ko" ? n + " " + e[1] : n + " " + e[1];
  }

  function applyLang() {
    document.documentElement.lang = LANG.v === "ko" ? "ko" : "zh-CN";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = T(el.dataset.i18n, el.textContent);
    });
    const btn = document.getElementById("langBtn");
    if (btn) btn.textContent = LANG.v === "ko" ? "한 / 中" : "中 / 한";
    window.__LANG = LANG.v;
    renderWorld();
    const q = document.querySelector(".world-quote");
    if (q && D.i18n["world.quote"]) {
      const txt = LANG.v === "ko" ? D.i18n["world.quote"][1] : D.i18n["world.quote"][0];
      if (q.firstChild && q.firstChild.nodeType === 3) q.firstChild.textContent = "\n      " + txt + "\n      ";
    }
    renderCards();
    const m = location.hash.match(/^#\/c\/([\w-]+)$/);
    if (m) {
      const idx = D.chars.findIndex((c) => c.slug === m[1]);
      if (idx >= 0) renderDetail(D.chars[idx], idx);
    }
  }

  const qLang = new URLSearchParams(location.search).get("lang");
  if (qLang === "ko" || qLang === "zh") LANG.v = qLang;

  const langBtn = document.getElementById("langBtn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      LANG.v = LANG.v === "ko" ? "zh" : "ko";
      localStorage.setItem("yz-lang", LANG.v);
      applyLang();
    });
  }
  applyLang();

  /* 截图/无动画预览模式：?static=1&y=1800 */
  if (new URLSearchParams(location.search).has("static")) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    document.body.classList.add("debug");
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = "eager"; });
    const y = parseInt(new URLSearchParams(location.search).get("y") || "0", 10);
    if (y > 0) {
      document.documentElement.style.scrollBehavior = "auto";
      const go = () => window.scrollTo(0, y);
      go();
      setTimeout(go, 400);
      setTimeout(go, 1200);
    }
  }

  function escapeHTML(s) {
    return String(s).replace(/[<>&]/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[m]));
  }
})();


/* ============================================================
   交互增强
   ============================================================ */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- 标题拆字 --- */
  const title = document.querySelector(".hero-title");
  if (title && !reduce) {
    const txt = title.textContent.trim();
    title.textContent = "";
    [...txt].forEach((ch, i) => {
      const sp = document.createElement("span");
      sp.textContent = ch;
      sp.style.animationDelay = (0.25 + i * 0.11) + "s";
      title.appendChild(sp);
    });
  }

  /* --- 光标光晕 --- */
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);
  let gx = innerWidth / 2, gy = innerHeight / 2, cx = gx, cy = gy;
  if (!reduce && matchMedia("(pointer:fine)").matches) {
    document.body.classList.add("glow-on");
    addEventListener("mousemove", (e) => { gx = e.clientX; gy = e.clientY; }, { passive: true });
    (function loop() {
      cx += (gx - cx) * 0.11; cy += (gy - cy) * 0.11;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
  }

  /* --- 卡片 3D 倾斜 + 光斑 --- */
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--rx", ((0.5 - py) * 9).toFixed(2) + "deg");
      card.style.setProperty("--ry", ((px - 0.5) * 11).toFixed(2) + "deg");
      card.style.setProperty("--px", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--py", (py * 100).toFixed(1) + "%");
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });

  /* --- Hero 尘埃粒子 --- */
  const cv = document.getElementById("dust");
  if (cv && !reduce) {
    const ctx = cv.getContext("2d");
    let W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 2);
    const parts = [];
    function resize() {
      const box = cv.parentElement.getBoundingClientRect();
      W = box.width; H = box.height;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + "px"; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    addEventListener("resize", resize);
    const N = W < 800 ? 40 : 80;
    for (let i = 0; i < N; i++) {
      parts.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.7 + 0.4,
        vy: -(Math.random() * 0.22 + 0.05),
        vx: (Math.random() - 0.5) * 0.16,
        a: Math.random() * 0.5 + 0.15,
        t: Math.random() * Math.PI * 2
      });
    }
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      parts.forEach((p) => {
        p.t += 0.012;
        p.x += p.vx + Math.sin(p.t) * 0.14;
        p.y += p.vy;
        if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W; }
        if (p.x < -8) p.x = W + 8;
        if (p.x > W + 8) p.x = -8;
        const flick = 0.55 + 0.45 * Math.sin(p.t * 1.7);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226,206,160,${(p.a * flick).toFixed(3)})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  }

  /* --- Hero 视差 --- */
  if (!reduce) {
    const bg = document.querySelector(".hero-video");
    const inner = document.querySelector(".hero-inner");
    addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) return;
      if (bg) bg.style.transform = `translateY(${y * 0.16}px) scale(1.04)`;
      if (inner) { inner.style.transform = `translateY(${y * 0.32}px)`; inner.style.opacity = String(Math.max(0, 1 - y / (innerHeight * 0.85))); }
    }, { passive: true });
  }

  /* --- 详情分组高亮 --- */
  const mo = new MutationObserver(() => {
    const chips = document.querySelectorAll(".d-chips button");
    if (!chips.length) return;
    const groups = [...document.querySelectorAll(".d-group")];
    const spy = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        chips.forEach((b) => b.classList.toggle("on", b.dataset.go === e.target.id));
      });
    }, { root: document.querySelector("#modalScroll"), rootMargin: "-20% 0px -70% 0px" });
    groups.forEach((g) => spy.observe(g));
    mo.disconnect();
  });
  mo.observe(document.getElementById("modalScroll"), { childList: true });

  /* --- 回到顶部 --- */
  const top = document.createElement("button");
  top.className = "to-top";
  top.innerHTML = "↑";
  top.setAttribute("aria-label", "回到顶部");
  document.body.appendChild(top);
  top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  addEventListener("scroll", () => {
    top.classList.toggle("show", window.scrollY > innerHeight * 0.9);
  }, { passive: true });

  /* --- 画廊点击光标 --- */
  document.querySelectorAll(".gal-item").forEach((g) => g.setAttribute("tabindex", "0"));
})();


/* ============================================================
   键盘 / 导航联动 / 图片淡入
   ============================================================ */
(function () {
  const chars = (window.DATA || {}).chars || [];

  /* 详情页左右键切换角色 */
  addEventListener("keydown", (e) => {
    const m = location.hash.match(/^#\/c\/([\w-]+)$/);
    if (!m || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
    const i = chars.findIndex((c) => c.slug === m[1]);
    if (i < 0) return;
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + chars.length) % chars.length;
    location.hash = "#/c/" + chars[n].slug;
  });

  /* 导航当前区块高亮 */
  const links = [...document.querySelectorAll(".nav-links a")];
  const secs = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => {
        const on = a.getAttribute("href") === "#" + e.target.id;
        a.style.color = on ? "var(--ink)" : "";
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach((s) => spy.observe(s));

  /* 图片淡入 */
  document.querySelectorAll("img").forEach((img) => {
    img.style.transition = "opacity .8s var(--ease)";
    if (img.complete) return;
    img.style.opacity = "0";
    const show = () => { img.style.opacity = "1"; };
    img.addEventListener("load", show, { once: true });
    img.addEventListener("error", show, { once: true });
  });
})();
