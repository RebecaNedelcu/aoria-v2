(function () {
  "use strict";

  const page = document.body.dataset.page || "home";

  const heroVideo = document.querySelector(".home-hero-video");
  const motionButton = document.querySelector(".home-hero-motion");
  if (heroVideo && motionButton && heroVideo.canPlayType("video/mp4")) {
    const hero = heroVideo.closest(".home-hero");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator.connection;
    const prefersStill = () => reducedMotion.matches || connection?.saveData ||
      ["slow-2g", "2g"].includes(connection?.effectiveType);
    let motionEnabled = !prefersStill();
    let heroVisible = hero.getBoundingClientRect().bottom > 0 &&
      hero.getBoundingClientRect().top < window.innerHeight;
    let mediaFailed = false;

    const updateMotionButton = () => {
      motionButton.classList.toggle("is-playing", motionEnabled);
      motionButton.setAttribute("aria-label", motionEnabled ? "Pause background video" : "Play background video");
    };

    const updatePlayback = () => {
      updateMotionButton();
      if (!motionEnabled || !heroVisible || document.hidden || mediaFailed) {
        heroVideo.pause();
        return;
      }

      // Attach just one local source, only when motion is allowed.
      if (!heroVideo.getAttribute("src")) {
        heroVideo.src = window.matchMedia("(max-width: 760px)").matches
          ? heroVideo.dataset.mobileSrc
          : heroVideo.dataset.src;
      }
      heroVideo.muted = true;
      heroVideo.play().catch((error) => {
        // Pausing while a video is loading cancels its pending play request.
        if (error.name === "AbortError") return;
        motionEnabled = false;
        updateMotionButton();
      });
    };

    heroVideo.addEventListener("playing", () => heroVideo.classList.add("is-ready"));
    heroVideo.addEventListener("error", () => {
      mediaFailed = true;
      heroVideo.classList.remove("is-ready");
      motionButton.hidden = true;
    });

    motionButton.hidden = false;
    motionButton.addEventListener("click", () => {
      motionEnabled = !motionEnabled;
      updatePlayback();
    });

    const updatePreferences = () => {
      motionEnabled = !prefersStill();
      if (!motionEnabled) heroVideo.classList.remove("is-ready");
      updatePlayback();
    };
    reducedMotion.addEventListener("change", updatePreferences);
    connection?.addEventListener("change", updatePreferences);
    document.addEventListener("visibilitychange", updatePlayback);

    if ("IntersectionObserver" in window) {
      const heroObserver = new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        updatePlayback();
      });
      heroObserver.observe(hero);
    }

    updatePlayback();
  }

  const navItems = [
    ["about", "About AORIA", "about.html"],
    ["destinations", "The AORIA Edit", "destinations.html"],
    ["experiences", "Experiences", "experiences.html"],
    ["touch", "The AORIA Touch", "aoria-touch.html"],
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
            <button class="language-button" type="button" data-demo="Language selection is a visual placeholder." aria-label="Choose language, current language English">EN</button>
            <a class="button button--compact" href="contact.html">Begin your journey</a>
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
          <a class="button mobile-menu-cta" href="contact.html">Begin your journey</a>
        </div>
      </div>`;
  }

  const siteHeader = document.querySelector(".site-header");

  if (page === "home" && siteHeader) {
    const updateHomeHeader = () => {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    updateHomeHeader();
    window.addEventListener("scroll", updateHomeHeader, { passive: true });
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
              <li><a href="mailto:hello@aoria-travel.com">hello@aoria-travel.com</a></li>
              <li><a href="tel:+40745621200">+40 745 621 200</a></li>
            </ul>
            <div class="footer-social-group">
              <h2 class="footer-title">Follow</h2>
              <div class="footer-social-links" aria-label="Social media">
                <button class="social-button" type="button" aria-label="Instagram" data-demo="Instagram profile link has not been supplied yet.">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                    <circle cx="12" cy="12" r="4"></circle>
                    <circle class="social-button__dot" cx="17.5" cy="6.5" r="1"></circle>
                  </svg>
                </button>
                <button class="social-button" type="button" aria-label="Facebook" data-demo="Facebook profile link has not been supplied yet.">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M13.6 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.6 1.7-1.6H17V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H8v3h2.6v8h3z"></path>
                  </svg>
                </button>
                <button class="social-button" type="button" aria-label="LinkedIn" data-demo="LinkedIn profile link has not been supplied yet.">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="5.5" cy="5.5" r="1.7"></circle>
                    <path d="M4 9h3v11H4zM10 9h3v1.5c.8-1.1 2-1.8 3.7-1.8 3 0 4.3 2 4.3 5.4V20h-3v-5.3c0-1.7-.6-2.8-2.2-2.8-1.7 0-2.8 1.1-2.8 3.3V20h-3z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div>
            <h2 class="footer-title">Explore</h2>
            <nav aria-label="Footer navigation">
              <ul class="footer-nav">
                ${navItems.map(([, label, href]) => `<li><a href="${href}">${label}</a></li>`).join("")}
                <li><a href="privacy-policy.html"${activeAttribute("privacy")}>Privacy Policy</a></li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© 2026 Aoria. All rights reserved.</span>
          <a class="footer-anpc" href="https://reclamatiisal.anpc.ro/" target="_blank" rel="noopener noreferrer" aria-label="ANPC — Soluționarea Alternativă a Litigiilor">
            <img src="assets/brand/anpc-sal.svg" width="202" height="50" loading="lazy" alt="ANPC SAL">
          </a>
        </div>
      </footer>`;
  }

  const whatsappLink = document.createElement("a");
  whatsappLink.className = "whatsapp-fab";
  whatsappLink.href = "https://wa.me/40745621200";
  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
  whatsappLink.setAttribute("aria-label", "Chat with AORIA on WhatsApp");
  whatsappLink.title = "Chat with AORIA on WhatsApp";
  const whatsappArtwork = document.createElement("img");
  whatsappArtwork.src = "assets/brand/whatsapp-icon.svg";
  whatsappArtwork.width = 52;
  whatsappArtwork.height = 52;
  whatsappArtwork.alt = "";
  whatsappLink.appendChild(whatsappArtwork);
  document.body.appendChild(whatsappLink);

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
