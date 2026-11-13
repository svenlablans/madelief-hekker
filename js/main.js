/* Renders the whole site from js/site.js and js/projects.js.
   Elements marked with data-edit / data-img / data-list are editable in edit mode
   (see editor/). You normally don't need to edit this file. */
(function () {
  const page = document.body.dataset.page;
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const projectUrl = (p) => `project.html?p=${encodeURIComponent(p.slug)}`;

  // Editable text: <tag data-edit="path">value</tag>
  const t = (tag, path, value, cls = "") =>
    `<${tag}${cls ? ` class="${cls}"` : ""} data-edit="${path}">${esc(value)}</${tag}>`;
  // Image (or placeholder) that can be replaced in edit mode
  const img = (src, alt, path, slug, eager) =>
    src
      ? `<img src="${esc(src)}" alt="${esc(alt)}" ${eager ? "" : 'loading="lazy"'} ${path ? `data-img="${path}" data-slug="${esc(slug)}"` : ""}>`
      : `<div class="img-placeholder" ${path ? `data-img="${path}" data-slug="${esc(slug)}"` : ""}>${path ? "Add image" : esc(alt)}</div>`;

  const nav = [
    { label: "Work", href: "work.html", key: "work" },
    { label: "About", href: "about.html", key: "about" },
    { label: "Contact", href: "contact.html", key: "contact" },
  ];

  const card = (p) => `
    <a class="card reveal" href="${projectUrl(p)}">
      <div class="card-media">${img(p.cover, p.title)}</div>
      <div class="card-meta">
        <h3>${esc(p.title)}</h3>
        <span class="muted">${esc(p.tagline)}</span>
      </div>
    </a>`;

  function header(S) {
    return `
    <div class="container header-inner">
      <a href="index.html" class="logo">${esc(S.name)}</a>
      <button class="menu-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
      <nav class="nav">
        ${nav.map((n) => `<a href="${n.href}" class="${page === n.key || (page === "project" && n.key === "work") ? "active" : ""}">${n.label}</a>`).join("")}
        <a href="mailto:${esc(S.email)}" class="nav-email">${esc(S.email)}</a>
      </nav>
    </div>`;
  }

  function footer(S) {
    return `
    <div class="container">
      <section class="cta reveal">
        ${t("p", "site.cta.text", S.cta.text, "cta-text")}
        <a class="btn" href="${esc(S.cta.buttonLink)}">${t("span", "site.cta.buttonLabel", S.cta.buttonLabel)} <span aria-hidden="true">→</span></a>
      </section>
      <div class="footer-grid">
        <div>
          <p class="footer-label">Contact</p>
          <a href="mailto:${esc(S.email)}">${esc(S.email)}</a>
          ${S.phone ? `<a href="tel:${esc(S.phone.replace(/\s/g, ""))}">${esc(S.phone)}</a>` : ""}
          ${S.location ? `<span>${esc(S.location)}</span>` : ""}
        </div>
        <div>
          <p class="footer-label">Pages</p>
          ${nav.map((n) => `<a href="${n.href}">${n.label}</a>`).join("")}
        </div>
        <div>
          <p class="footer-label">Social</p>
          ${S.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("")}
        </div>
      </div>
      <div class="footer-bottom">
        <span class="footer-name">${esc(S.name)}</span>
        <span>© ${new Date().getFullYear()}</span>
      </div>
    </div>`;
  }

  /* ---------- Page bodies ---------- */
  const pages = {
    home(S, P) {
      document.title = `${S.name} — ${S.tagline}`;
      return `
      <section class="container hero">
        ${t("h1", "site.hero.title", S.hero.title, "reveal")}
        <div class="hero-bottom reveal">
          ${t("p", "site.hero.intro", S.hero.intro, "lead")}
          <a class="btn" href="${esc(S.hero.buttonLink)}">${t("span", "site.hero.buttonLabel", S.hero.buttonLabel)} <span aria-hidden="true">→</span></a>
        </div>
        <ul class="capabilities reveal" data-list="site.capabilities" data-new='"New skill"'>
          ${S.capabilities.map((c, i) => `<li>${t("span", `site.capabilities.${i}`, c)}</li>`).join("")}
        </ul>
      </section>
      <section class="container">
        <div class="section-head reveal">
          ${t("h2", "site.homeWorkTitle", S.homeWorkTitle)}
          <a href="work.html" class="link">View all</a>
        </div>
        <div class="grid">${P.slice(0, S.homeProjectCount).map(card).join("")}</div>
      </section>`;
    },

    work(S, P) {
      document.title = `Work — ${S.name}`;
      return `
      <section class="container page-head">
        <h1 class="reveal">${t("span", "site.workTitle", S.workTitle)}<span class="count">(${P.length})</span></h1>
      </section>
      <section class="container section" style="padding-top:56px">
        <div class="grid">${P.map(card).join("")}</div>
      </section>`;
    },

    about(S) {
      document.title = `About — ${S.name}`;
      const A = S.about;
      return `
      <section class="container page-head">
        ${t("h1", "site.about.title", A.title, "reveal")}
      </section>
      ${A.image || window.EDITOR ? `<div class="container about-image reveal">${img(A.image, S.name, "site.about.image", "about", true)}</div>` : ""}
      <section class="container two-col">
        <div class="reveal"><p class="label">About</p></div>
        <div class="reveal">
          ${t("p", "site.about.intro", A.intro, "lead")}
          ${t("p", "site.about.body", A.body, "muted about-body")}
        </div>
      </section>
      <section class="container two-col">
        <div class="reveal"><p class="label">Services</p></div>
        <ul class="list reveal" data-list="site.about.services" data-new='"New service"'>
          ${A.services.map((s, i) => `<li>${t("span", `site.about.services.${i}`, s)}<span class="muted">${String(i + 1).padStart(2, "0")}</span></li>`).join("")}
        </ul>
      </section>
      <section class="container two-col">
        <div class="reveal"><p class="label">Experience</p></div>
        <ul class="list reveal" data-list="site.about.experience" data-new='{"role":"Role — Company","years":"2026"}'>
          ${A.experience.map((e, i) => `<li>${t("span", `site.about.experience.${i}.role`, e.role)}${t("span", `site.about.experience.${i}.years`, e.years, "muted")}</li>`).join("")}
        </ul>
      </section>`;
    },

    contact(S) {
      document.title = `Contact — ${S.name}`;
      return `
      <section class="container page-head">
        ${t("h1", "site.contact.title", S.contact.title, "reveal")}
      </section>
      <section class="container two-col">
        <div class="reveal"><p class="label">Email</p></div>
        <div class="reveal">
          <a class="big-link link" href="mailto:${esc(S.email)}">${esc(S.email)}</a>
          ${t("p", "site.contact.text", S.contact.text, "muted contact-text")}
        </div>
      </section>`;
    },

    project(S, P) {
      const slug = new URLSearchParams(location.search).get("p");
      const i = P.findIndex((x) => x.slug === slug);
      const p = P[i];
      if (!p) {
        document.title = `Not found — ${S.name}`;
        return `<div class="container page-head"><h1>Project not found</h1><p style="margin-top:24px"><a class="btn" href="work.html">Back to work →</a></p></div>`;
      }
      document.title = `${p.title} — ${S.name}`;
      const base = `projects.${i}`;
      const more = P.filter((x) => x !== p);
      const nextUp = [...more.slice(i), ...more.slice(0, i)].slice(0, 2);
      const gallery = p.images || [];
      return `
      <section class="container project-head">
        ${t("h1", `${base}.title`, p.title, "reveal")}
        ${t("p", `${base}.tagline`, p.tagline, "lead muted reveal")}
        <dl class="project-facts reveal">
          <div><dt>Client</dt>${t("dd", `${base}.client`, p.client)}</div>
          <div><dt>Year</dt>${t("dd", `${base}.year`, p.year)}</div>
          <div><dt>Type</dt><dd data-edit="${base}.type" data-csv>${esc((p.type || []).join(", "))}</dd></div>
        </dl>
      </section>
      <div class="container"><div class="project-cover reveal">${img(p.cover, p.title, `${base}.cover`, p.slug, true)}</div></div>
      <section class="container project-body">
        ${t("p", `${base}.intro`, p.intro, "lead reveal")}
        <div class="project-text reveal">
          <h2 class="label">Project description</h2>
          <div data-list="${base}.description" data-new='"New paragraph"'>
            ${(p.description || []).map((d, j) => `<div class="para">${t("p", `${base}.description.${j}`, d)}</div>`).join("")}
          </div>
          ${(p.credits || []).length || window.EDITOR ? `
            <h2 class="label">Credits</h2>
            <dl class="credits" data-list="${base}.credits" data-new='{"role":"Role","name":"Name"}'>
              ${(p.credits || []).map((c, j) => `<div>${t("dt", `${base}.credits.${j}.role`, c.role)}${t("dd", `${base}.credits.${j}.name`, c.name)}</div>`).join("")}
            </dl>` : ""}
        </div>
      </section>
      ${gallery.length || window.EDITOR ? `
        <section class="container gallery" data-list="${base}.images" data-new='""' data-slug="${esc(p.slug)}">
          ${gallery.map((s, j) => `<div class="gallery-item reveal">${img(s, p.title, `${base}.images.${j}`, p.slug)}</div>`).join("")}
        </section>` : ""}
      ${nextUp.length ? `
        <section class="container section">
          <div class="section-head"><h2>More work</h2><a href="work.html" class="link">View all</a></div>
          <div class="grid">${nextUp.map(card).join("")}</div>
        </section>` : ""}`;
    },
  };

  /* ---------- Render ---------- */
  let io;
  function render() {
    const S = window.SITE, P = window.PROJECTS || [];
    let h = document.querySelector(".site-header");
    if (!h) {
      h = document.createElement("header");
      h.className = "site-header";
      document.body.prepend(h);
    }
    h.innerHTML = header(S);
    const toggle = h.querySelector(".menu-toggle");
    toggle.addEventListener("click", () => toggle.setAttribute("aria-expanded", h.classList.toggle("open")));

    let main = document.querySelector("main");
    if (!main) { main = document.createElement("main"); h.after(main); }
    main.innerHTML = (pages[page] || (() => ""))(S, P);

    let f = document.querySelector(".site-footer");
    if (!f) { f = document.createElement("footer"); f.className = "site-footer"; main.after(f); }
    f.innerHTML = footer(S);

    // reveal on scroll
    const els = document.querySelectorAll(".reveal");
    if (io) io.disconnect();
    if ("IntersectionObserver" in window && !window.EDITOR) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { rootMargin: "0px 0px -8% 0px" });
      els.forEach((el) => io.observe(el));
    } else {
      els.forEach((el) => el.classList.add("in"));
    }
    document.dispatchEvent(new Event("site:rendered"));
  }

  window.renderSite = render;
  render();
})();
