const CONTACT = {
  // Substitua pelo numero real no formato internacional antes do deploy final.
  whatsappNumber: "5500000000000",
  whatsappMessage:
    "Ola! Gostaria de conhecer a Casa Pet SBS e agendar uma visita.",
  instagramUrl: "https://www.instagram.com/casapet_sbs/",
};

const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll("[data-reveal]");
const yearTarget = document.querySelector("[data-current-year]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const instagramLinks = document.querySelectorAll("[data-instagram-link]");
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

whatsappLinks.forEach((link) => {
  link.href = buildWhatsAppUrl();
  link.target = "_blank";
  link.rel = "noreferrer";
});

instagramLinks.forEach((link) => {
  link.href = CONTACT.instagramUrl;
  link.target = "_blank";
  link.rel = "noreferrer";
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
