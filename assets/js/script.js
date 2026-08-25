const event = {
  title: "Pernikahan Aurum & Alul",
  start: "2026-12-06T09:00:00+07:00",
  end: null,
  location: "Venue placeholder, Bandung",
  description: "Undangan pernikahan Aurum dan Alul. Venue, keluarga, gift, dan foto masih placeholder."
};

const pad = (value) => String(value).padStart(2, "0");

const toCalendarStamp = (dateString) => {
  const date = new Date(dateString);
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;
};

const buildCalendarHref = () => {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${event.title}`,
    `DTSTART:${toCalendarStamp(event.start)}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${event.description}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  if (event.end) {
    lines.splice(5, 0, `DTEND:${toCalendarStamp(event.end)}`);
  }

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\n"))}`;
};

const calendarLink = document.querySelector("#calendarLink");

if (calendarLink) {
  calendarLink.setAttribute("href", buildCalendarHref());
  calendarLink.setAttribute("download", "undangan-aurum-alul.ics");
}

const countdown = document.querySelector("[data-countdown]");

if (countdown) {
  const target = new Date(countdown.dataset.countdown).getTime();
  const days = countdown.querySelector("[data-days]");
  const hours = countdown.querySelector("[data-hours]");
  const minutes = countdown.querySelector("[data-minutes]");
  const seconds = countdown.querySelector("[data-seconds]");

  const renderCountdown = () => {
    const remaining = Math.max(target - Date.now(), 0);
    const totalSeconds = Math.floor(remaining / 1000);

    days.textContent = Math.floor(totalSeconds / 86400);
    hours.textContent = Math.floor((totalSeconds % 86400) / 3600);
    minutes.textContent = Math.floor((totalSeconds % 3600) / 60);
    seconds.textContent = totalSeconds % 60;
  };

  renderCountdown();
  window.setInterval(renderCountdown, 1000);
}

const wishForm = document.querySelector("#wishForm");
const wishList = document.querySelector("#wishList");

if (wishForm && wishList) {
  wishForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(wishForm);
    const name = String(formData.get("name") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !message) {
      return;
    }

    const wish = document.createElement("article");
    const author = document.createElement("strong");
    const copy = document.createElement("p");

    author.textContent = name;
    copy.textContent = message;
    wish.append(author, copy);
    wishList.prepend(wish);
    wishForm.reset();
  });
}

const toggleGift = document.querySelector("#toggleGift");
const giftAccounts = document.querySelector("#giftAccounts");
const copyStatus = document.querySelector("#copyStatus");

if (toggleGift && giftAccounts) {
  toggleGift.addEventListener("click", () => {
    const isHidden = giftAccounts.hasAttribute("hidden");
    giftAccounts.toggleAttribute("hidden", !isHidden);
    toggleGift.setAttribute("aria-expanded", String(isHidden));
    toggleGift.textContent = isHidden ? "Sembunyikan Rekening" : "Lihat Rekening";
  });
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy") || "";

    try {
      await navigator.clipboard.writeText(value);
      copyStatus.textContent = "Nomor berhasil disalin.";
    } catch {
      copyStatus.textContent = "Nomor belum tersalin. Silakan salin manual.";
    }
  });
});

const navLinks = [...document.querySelectorAll(".bottom-nav a")];
const bottomNav = document.querySelector(".bottom-nav");
const invitationContent = document.querySelector("#invitationContent");
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) {
        return;
      }

      navLinks.forEach((link) => {
        link.toggleAttribute("aria-current", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { rootMargin: "-30% 0px -55%", threshold: [0.1, 0.35, 0.6] }
  );

  sections.forEach((section) => observer.observe(section));
}

const openInvitation = document.querySelector("#openInvitation");
const revealNavigation = () => {
  document.body.classList.add("invitation-open");
  invitationContent?.removeAttribute("hidden");
  invitationContent?.removeAttribute("inert");
  bottomNav?.removeAttribute("inert");
  bottomNav?.setAttribute("aria-hidden", "false");
};

openInvitation?.addEventListener("click", (event) => {
  event.preventDefault();
  revealNavigation();
  document.querySelector("#opening")?.scrollIntoView({ block: "start" });
});

const slides = [...document.querySelectorAll(".photo-wide")];
const dots = [...document.querySelectorAll("[data-slide-dot]")];
const previousSlide = document.querySelector("[data-slider-prev]");
const nextSlide = document.querySelector("[data-slider-next]");
let activeSlide = 0;

const showSlide = (index) => {
  if (!slides.length) {
    return;
  }

  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
    slide.toggleAttribute("aria-hidden", slideIndex !== activeSlide);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeSlide);
  });
};

previousSlide?.addEventListener("click", () => showSlide(activeSlide - 1));
nextSlide?.addEventListener("click", () => showSlide(activeSlide + 1));
dots.forEach((dot) => {
  dot.addEventListener("click", () => showSlide(Number(dot.dataset.slideDot)));
});

showSlide(0);
