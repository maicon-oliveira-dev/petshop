const header = document.querySelector(".site-header");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuPanel = document.querySelector("[data-menu-panel]");
const menuLinks = document.querySelectorAll(".mobile-menu a");
const revealItems = document.querySelectorAll("[data-reveal]");
const counters = document.querySelectorAll("[data-count]");
const yearTarget = document.querySelector("[data-current-year]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTriggers = document.querySelectorAll("[data-lightbox-src]");
const lightboxClosers = document.querySelectorAll("[data-lightbox-close]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeMenu = () => {
  if (!menuToggle || !menuPanel) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuPanel.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

const openMenu = () => {
  if (!menuToggle || !menuPanel) return;
  menuToggle.setAttribute("aria-expanded", "true");
  menuPanel.classList.add("is-open");
  document.body.classList.add("menu-open");
};

if (menuToggle && menuPanel) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  });
}

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("load", setHeaderState);
setHeaderState();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = prefersReducedMotion ? "0ms" : `${Math.min(index * 60, 260)}ms`;
    revealObserver.observe(item);
  });

  const animateCount = (element) => {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || "";

    if (prefersReducedMotion) {
      element.textContent = `${target}${suffix}`;
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    const tick = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      element.textContent = `${value}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    };

    window.requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.55,
    },
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  counters.forEach((counter) => {
    const target = counter.dataset.count || "0";
    const suffix = counter.dataset.suffix || "";
    counter.textContent = `${target}${suffix}`;
  });
}

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = "";
  lightboxImage.alt = "";
};

if (lightbox && lightboxImage) {
  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const src = trigger.getAttribute("data-lightbox-src");
      const alt = trigger.getAttribute("data-lightbox-alt") || "";
      if (!src) return;

      lightboxImage.src = src;
      lightboxImage.alt = alt;
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
    });
  });

  lightboxClosers.forEach((closer) => {
    closer.addEventListener("click", closeLightbox);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}
