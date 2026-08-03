(function () {
  "use strict";

  const page = document.body.dataset.page || "home";
  const navItems = [
    ["destinations", "Destinations", "destinations.html"],
    ["experiences", "Experiences", "experiences.html"],
    ["about", "About", "about.html"],
    ["contact", "Contact", "contact.html"]
  ];

  const activeAttribute = (key) => key === page ? ' aria-current="page"' : "";
  const navLinks = navItems.map(([key, label, href]) =>
    `<a href="${href}"${activeAttribute(key)}>${label}</a>`
  ).join("");

  const headerSlot = document.querySelector("[data-header]");
  if (headerSlot) {
    headerSlot.outerHTML = `
      <header class="site-header">
        <div class="header-inner">
          <a class="brand brand--header" href="index.html" aria-label="Aoria home">
            <img class="brand-logo brand-logo--header" src="assets/brand/aoria-logo.png" width="3334" height="889" alt="">
            <img class="brand-icon brand-icon--header" src="assets/brand/aoria-icon.png" width="1250" height="767" alt="">
          </a>
          <nav class="desktop-nav" aria-label="Primary navigation">${navLinks}</nav>
          <div class="header-actions">
            <button class="language-button" type="button" data-demo="Language selection is a visual placeholder." aria-label="Choose language">Language</button>
            <a class="button button--compact" href="contact.html">Plan your trip</a>
            <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">
              <span>Menu</span><span class="menu-icon" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </header>
      <div class="mobile-nav-layer" id="mobile-menu" aria-hidden="true">
        <div class="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Site menu">
          <div class="mobile-menu-head">
            <a class="brand brand--mobile-menu" href="index.html" aria-label="Aoria home">
              <img class="brand-logo brand-logo--mobile-menu" src="assets/brand/aoria-logo.png" width="3334" height="889" alt="">
            </a>
            <button class="menu-close" type="button" aria-label="Close menu">Close menu</button>
          </div>
          <nav class="mobile-nav" aria-label="Mobile navigation">${navLinks}</nav>
          <a class="button mobile-menu-cta" href="contact.html">Plan your trip</a>
        </div>
      </div>`;
  }

  const footerSlot = document.querySelector("[data-footer]");
  if (footerSlot) {
    footerSlot.outerHTML = `
      <footer class="site-footer">
        <div class="container footer-main">
          <div>
            <a class="brand brand--footer" href="index.html" aria-label="Aoria home">
              <img class="brand-logo brand-logo--tagline" src="assets/brand/aoria-logo-tagline.png" width="3334" height="1285" alt="">
            </a>
            <p class="footer-brand-copy">Concierge travel agency for bespoke luxury holidays.</p>
          </div>
          <div>
            <h2 class="footer-title">Contact</h2>
            <ul class="footer-contact">
              <li>Email address to be confirmed</li>
              <li>Phone number to be confirmed</li>
              <li>Physical address to be confirmed</li>
            </ul>
          </div>
          <div>
            <h2 class="footer-title">Explore</h2>
            <nav aria-label="Footer navigation">
              <ul class="footer-nav">
                ${navItems.map(([, label, href]) => `<li><a href="${href}">${label}</a></li>`).join("")}
                <li><button class="footer-link-button" type="button" data-demo="FAQ content has not been supplied for this mockup.">FAQ</button></li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© 2026 Aoria. All rights reserved.</span>
        </div>
      </footer>`;
  }

  const menuLayer = document.querySelector(".mobile-nav-layer");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuClose = document.querySelector(".menu-close");
  let priorFocus = null;

  function openMenu() {
    if (!menuLayer || !menuToggle) return;
    priorFocus = document.activeElement;
    menuLayer.classList.add("is-open");
    menuLayer.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    const firstLink = menuLayer.querySelector("a, button");
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    if (!menuLayer || !menuToggle) return;
    menuLayer.classList.remove("is-open");
    menuLayer.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    if (priorFocus) priorFocus.focus();
  }

  if (menuToggle) menuToggle.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (menuLayer) {
    menuLayer.addEventListener("click", (event) => {
      if (event.target === menuLayer) closeMenu();
    });

    menuLayer.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(menuLayer.querySelectorAll("a, button:not([disabled])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuLayer && menuLayer.classList.contains("is-open")) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && menuLayer && menuLayer.classList.contains("is-open")) closeMenu();
  });

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  let toastTimer;

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  document.addEventListener("click", (event) => {
    const demoControl = event.target.closest("[data-demo]");
    if (demoControl) showToast(demoControl.dataset.demo);
  });

  document.querySelectorAll("[data-mock-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector('[type="submit"]');
      const status = form.querySelector(".form-status");
      const originalLabel = button ? button.textContent : "";
      form.setAttribute("aria-busy", "true");
      if (status) status.classList.remove("is-visible");
      if (button) {
        button.disabled = true;
        button.textContent = "Preparing…";
      }
      window.setTimeout(() => {
        form.removeAttribute("aria-busy");
        if (button) {
          button.disabled = false;
          button.textContent = originalLabel;
        }
        if (status) {
          status.textContent = "Thank you. This is a visual mockup, so your details have not been sent.";
          status.classList.add("is-visible");
          status.focus();
        }
      }, 650);
    });
  });
})();
