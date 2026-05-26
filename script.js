const CONTACT = {
  whatsappNumber: "5547996052222",
  whatsappMessage:
    "Olá! Vim pela página da LanaLu Banho e Tosa e gostaria de agendar um horário para meu pet.",
  instagramUrl: "https://www.instagram.com/lanalu_banho_tosa/",
};

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const revealItems = document.querySelectorAll("[data-reveal]");
const yearTarget = document.querySelector("[data-current-year]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const instagramLinks = document.querySelectorAll("[data-instagram-link]");
const faqItems = document.querySelectorAll("[data-faq-item]");
const logoMarks = document.querySelectorAll("[data-logo-mark]");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const buildWhatsAppUrl = () => {
  const message = encodeURIComponent(CONTACT.whatsappMessage);
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${message}`;
};

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const setMenuState = (isOpen) => {
  if (!nav || !menuToggle) return;

  nav.classList.toggle("is-open", isOpen);
  menuToggle.classList.toggle("is-active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", isOpen);
};

const setFaqState = (item, isOpen) => {
  const button = item.querySelector("[data-faq-button]");
  const answer = item.querySelector("[data-faq-answer]");

  if (!button || !answer) return;

  item.classList.toggle("is-open", isOpen);
  button.setAttribute("aria-expanded", String(isOpen));
  answer.hidden = !isOpen;
};

whatsappLinks.forEach((link) => {
  link.href = buildWhatsAppUrl();
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

instagramLinks.forEach((link) => {
  link.href = CONTACT.instagramUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

logoMarks.forEach((mark) => {
  const image = mark.querySelector("[data-logo-image]");

  if (!image) return;

  const handleLoad = () => {
    mark.classList.add("is-loaded");
  };

  if (image.complete && image.naturalWidth > 0) {
    handleLoad();
    return;
  }

  image.addEventListener("load", handleLoad, { once: true });
});

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 980) return;
    if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
    setMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      setMenuState(false);
    }
  });
}

faqItems.forEach((item) => {
  const button = item.querySelector("[data-faq-button]");
  const initiallyOpen = item.classList.contains("is-open");

  setFaqState(item, initiallyOpen);

  if (!button) return;

  button.addEventListener("click", () => {
    const shouldOpen = !item.classList.contains("is-open");

    faqItems.forEach((entry) => {
      setFaqState(entry, false);
    });

    if (shouldOpen) {
      setFaqState(item, true);
    }
  });
});

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("load", setHeaderState);
setHeaderState();

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}
