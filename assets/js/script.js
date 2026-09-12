const event = {
  title: "Pernikahan Aurum & Fahrur",
  start: "2026-12-06T09:00:00+07:00",
  end: null,
  location: "Griya Curug Blok D5 No.23",
  description: "Akad nikah pukul 09.00 WIB dan resepsi pukul 10.00 WIB sampai selesai di Griya Curug Blok D5 No.23."
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
  calendarLink.setAttribute("download", "undangan-aurum-fahrur.ics");
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
      copyStatus.textContent = "Nomor rekening berhasil disalin.";
    } catch {
      copyStatus.textContent = "Nomor rekening belum tersalin. Silakan salin manual.";
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
  document.querySelector("#couple")?.scrollIntoView({ block: "start" });
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const sliderControllers = [...document.querySelectorAll("[data-slider]")].map((slider) => {
  const slides = [...slider.querySelectorAll("[data-slide]")];
  const dots = [...slider.querySelectorAll("[data-slide-dot]")];
  const previousSlide = slider.querySelector("[data-slider-prev]");
  const nextSlide = slider.querySelector("[data-slider-next]");
  const toggle = slider.querySelector("[data-slider-toggle]");
  const autoplay = slider.hasAttribute("data-autoplay");
  const interval = Number(slider.dataset.interval) || 5000;
  const autoplayDirection = slider.dataset.direction === "right" ? "right" : "left";
  let activeSlide = Math.max(slides.findIndex((slide) => slide.classList.contains("is-active")), 0);
  let timer = null;
  let isVisible = !autoplay;
  let manuallyPaused = reduceMotion.matches;

  slider.dataset.motionDirection = autoplayDirection;

  const clearTimer = () => {
    window.clearTimeout(timer);
    timer = null;
  };

  const canAutoplay = () => autoplay
    && slides.length > 1
    && isVisible
    && !document.hidden
    && !reduceMotion.matches
    && !manuallyPaused;

  const scheduleAutoplay = () => {
    clearTimer();
    if (!canAutoplay()) {
      return;
    }

    timer = window.setTimeout(() => {
      showSlide(activeSlide + 1, autoplayDirection);
      scheduleAutoplay();
    }, interval);
  };

  const updateToggle = () => {
    if (!toggle) {
      return;
    }

    if (reduceMotion.matches) {
      const reducedMotionLabel = "Slideshow dijeda karena preferensi gerakan dikurangi";
      toggle.setAttribute("aria-label", reducedMotionLabel);
      toggle.setAttribute("title", reducedMotionLabel);
      toggle.setAttribute("aria-pressed", "true");
      toggle.disabled = true;
      return;
    }

    toggle.disabled = false;
    const toggleLabel = manuallyPaused ? "Putar slideshow" : "Jeda slideshow";
    toggle.setAttribute("aria-label", toggleLabel);
    toggle.setAttribute("title", toggleLabel);
    toggle.setAttribute("aria-pressed", String(manuallyPaused));
  };

  const showSlide = (index, direction = autoplayDirection) => {
    if (!slides.length) {
      return;
    }

    const nextIndex = (index + slides.length) % slides.length;
    if (nextIndex === activeSlide) {
      return;
    }

    const outgoingSlide = slides[activeSlide];
    const incomingSlide = slides[nextIndex];
    slider.dataset.motionDirection = direction;
    incomingSlide.classList.remove("is-active", "is-leaving");
    incomingSlide.getBoundingClientRect();
    outgoingSlide.classList.remove("is-active");
    outgoingSlide.classList.add("is-leaving");
    incomingSlide.classList.add("is-active");
    activeSlide = nextIndex;

    slides.forEach((slide, slideIndex) => {
      slide.toggleAttribute("aria-hidden", slideIndex !== activeSlide);
    });
    dots.forEach((dot, dotIndex) => {
      const isCurrent = dotIndex === activeSlide;
      dot.classList.toggle("is-active", isCurrent);
      dot.toggleAttribute("aria-current", isCurrent);
    });

    window.setTimeout(() => outgoingSlide.classList.remove("is-leaving"), 500);
  };

  previousSlide?.addEventListener("click", () => {
    showSlide(activeSlide - 1, "right");
    scheduleAutoplay();
  });
  nextSlide?.addEventListener("click", () => {
    showSlide(activeSlide + 1, "left");
    scheduleAutoplay();
  });
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = Number(dot.dataset.slideDot);
      showSlide(target, target < activeSlide ? "right" : "left");
      scheduleAutoplay();
    });
  });
  toggle?.addEventListener("click", () => {
    manuallyPaused = !manuallyPaused;
    updateToggle();
    scheduleAutoplay();
  });

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
    slide.toggleAttribute("aria-hidden", slideIndex !== activeSlide);
  });
  dots.forEach((dot, dotIndex) => {
    const isCurrent = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isCurrent);
    dot.toggleAttribute("aria-current", isCurrent);
  });
  updateToggle();

  return {
    autoplay,
    setVisible(value) {
      isVisible = value;
      scheduleAutoplay();
    },
    refreshMotionPreference() {
      manuallyPaused = reduceMotion.matches;
      updateToggle();
      scheduleAutoplay();
    },
    scheduleAutoplay
  };
});

const autoplayControllers = sliderControllers.filter((controller) => controller.autoplay);

if ("IntersectionObserver" in window) {
  const sliderObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const index = [...document.querySelectorAll("[data-slider][data-autoplay]")].indexOf(entry.target);
      autoplayControllers[index]?.setVisible(entry.isIntersecting);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll("[data-slider][data-autoplay]").forEach((slider) => sliderObserver.observe(slider));
} else {
  autoplayControllers.forEach((controller) => controller.setVisible(true));
}

document.addEventListener("visibilitychange", () => {
  autoplayControllers.forEach((controller) => controller.scheduleAutoplay());
});
reduceMotion.addEventListener("change", () => {
  autoplayControllers.forEach((controller) => controller.refreshMotionPreference());
});

const ambientMotionSections = document.querySelectorAll("[data-ambient-motion]");

if ("IntersectionObserver" in window) {
  const ambientMotionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-in-view", entry.isIntersecting);
    });
  }, { threshold: 0.15 });

  ambientMotionSections.forEach((section) => ambientMotionObserver.observe(section));
} else {
  ambientMotionSections.forEach((section) => section.classList.add("is-in-view"));
}

const revealSections = [...document.querySelectorAll("[data-reveal-section]")];
let revealObserver = null;

const refreshRevealMotion = () => {
  revealObserver?.disconnect();
  revealObserver = null;

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    document.body.classList.remove("reveal-motion");
    revealSections.forEach((section) => section.classList.add("is-revealed"));
    return;
  }

  document.body.classList.add("reveal-motion");
  revealSections.forEach((section) => section.classList.remove("is-revealed"));

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.16) {
        entry.target.classList.add("is-revealed");
      } else if (!entry.isIntersecting) {
        entry.target.classList.remove("is-revealed");
      }
    });
  }, { threshold: [0, 0.16] });

  revealSections.forEach((section) => revealObserver.observe(section));
};

refreshRevealMotion();
reduceMotion.addEventListener("change", refreshRevealMotion);
