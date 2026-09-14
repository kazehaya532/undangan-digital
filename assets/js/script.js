const environmentName = (window.WEDDING_CONFIG || {}).ENVIRONMENT;
if (environmentName) {
  console.info(`Supabase environment: ${environmentName}`);
}

const event = {
  title: "Pernikahan Fahrur & Aurum",
  start: "2026-12-06T09:00:00+07:00",
  end: null,
  location: "Griya Curug Blok D5 No.23",
  description: "Akad nikah pukul 09.00 WIB dan resepsi pukul 10.00 WIB sampai selesai di Griya Curug Blok D5 No.23."
};

const pad = (value) => String(value).padStart(2, "0");

const guestName = document.querySelector("#guestName");
const guestDefault = document.querySelector("#guestDefault");

if (guestName && guestDefault) {
  const parameters = new Map();

  new URLSearchParams(window.location.search).forEach((value, key) => {
    const normalizedKey = key.toLowerCase();
    if (!parameters.has(normalizedKey)) {
      parameters.set(normalizedKey, value);
    }
  });

  const recipient = ["to", "kepada", "for", "u"]
    .map((key) => parameters.get(key))
    .find((value) => value && value.trim())
    ?.replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

  if (recipient) {
    guestName.textContent = recipient;
    guestDefault.hidden = true;
  }
}

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
const wishStatus = document.querySelector("#wishStatus");
const wishCount = document.querySelector("#wishCount");
const wishPagination = document.querySelector("#wishPagination");

const wishConfig = window.WEDDING_CONFIG || {};
const isPlaceholder = (value) =>
  typeof value !== "string" || value.trim() === "" || value.includes("YOUR-");
const wishEnabled =
  Boolean(window.supabase) &&
  typeof wishConfig.SUPABASE_URL === "string" &&
  /^https:\/\//.test(wishConfig.SUPABASE_URL) &&
  !isPlaceholder(wishConfig.SUPABASE_URL) &&
  !isPlaceholder(wishConfig.SUPABASE_ANON_KEY);

const wishClient = wishEnabled
  ? window.supabase.createClient(wishConfig.SUPABASE_URL, wishConfig.SUPABASE_ANON_KEY)
  : null;

const setWishStatus = (message, isError) => {
  if (!wishStatus) {
    return;
  }

  wishStatus.textContent = message;
  wishStatus.dataset.error = String(Boolean(isError));
};

const relativeWishTime = (isoString) => {
  const then = new Date(isoString).getTime();
  if (Number.isNaN(then)) {
    return "";
  }

  const seconds = Math.max(Math.floor((Date.now() - then) / 1000), 0);
  if (seconds < 60) {
    return "baru saja";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} menit lalu`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} jam lalu`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} hari lalu`;
  }

  const weeks = Math.floor(days / 7);
  if (days < 30) {
    return `${weeks} minggu lalu`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} bulan lalu`;
  }

  return `${Math.floor(months / 12)} tahun lalu`;
};

const createWishArticle = (wish) => {
  const article = document.createElement("article");
  const header = document.createElement("div");
  const author = document.createElement("strong");
  const copy = document.createElement("p");
  const time = document.createElement("small");
  const clock = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const clockPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

  article.setAttribute("role", "listitem");
  header.className = "wish-item__header";
  time.className = "wish-item__time";
  copy.className = "wish-item__message";
  author.textContent = wish.name;
  copy.textContent = wish.message;
  time.textContent = relativeWishTime(wish.created_at);
  clock.setAttribute("viewBox", "0 0 24 24");
  clock.setAttribute("aria-hidden", "true");
  clockPath.setAttribute("d", "M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z");
  clock.append(clockPath);
  time.prepend(clock);
  header.append(author, time);
  article.append(header, copy);
  return article;
};

if (wishForm && wishList) {
  let wishes = [];
  let wishPages = [];
  let currentWishPage = 0;

  const buildWishPages = () => {
    if (!wishes.length) {
      wishPages = [];
      return;
    }

    const measureList = document.createElement("div");
    measureList.className = "wish-list wish-list--measure";
    measureList.style.width = `${wishList.clientWidth}px`;
    document.body.append(measureList);

    const maxHeight = Math.max(window.innerHeight * 0.4, 180);
    const pages = [];
    let page = [];
    let pageHeight = 0;

    wishes.forEach((wish) => {
      const article = createWishArticle(wish);
      measureList.append(article);
      const articleHeight = article.getBoundingClientRect().height;
      measureList.replaceChildren();

      const shouldBreak = page.length >= 3 && pageHeight + articleHeight > maxHeight;
      if (shouldBreak || page.length === 4) {
        pages.push(page);
        page = [];
        pageHeight = 0;
      }

      page.push(wish);
      pageHeight += articleHeight;
    });

    if (page.length) {
      pages.push(page);
    }

    measureList.remove();
    wishPages = pages;
  };

  const renderWishPagination = () => {
    wishPagination.replaceChildren();
    wishPagination.hidden = wishPages.length <= 1;

    if (wishPages.length <= 1) {
      return;
    }

    const addControl = (label, page, disabled, current = false) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.disabled = disabled;
      if (current) {
        button.setAttribute("aria-current", "page");
      }
      button.addEventListener("click", () => renderWishPage(page));
      wishPagination.append(button);
    };

    addControl("Previous", currentWishPage - 1, currentWishPage === 0);
    wishPages.forEach((_, page) => addControl(String(page + 1), page, false, page === currentWishPage));
    addControl("Next", currentWishPage + 1, currentWishPage === wishPages.length - 1);
  };

  const renderWishPage = (page) => {
    currentWishPage = Math.max(0, Math.min(page, wishPages.length - 1));
    wishList.replaceChildren();
    (wishPages[currentWishPage] || []).forEach((wish) => wishList.append(createWishArticle(wish)));
    wishList.scrollTop = 0;
    renderWishPagination();
  };

  const refreshWishPages = (page = 0) => {
    buildWishPages();
    renderWishPage(Math.min(page, Math.max(wishPages.length - 1, 0)));
  };

  const loadWishes = async () => {
    if (!wishClient) {
      return;
    }

    const { data, error } = await wishClient
      .from("wedding_wishes")
      .select("name, message, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .range(0, 49);

    if (error) {
      setWishStatus("Ucapan gagal dimuat. Silakan muat ulang halaman.", true);
      return;
    }

    wishes = data || [];
    if (wishCount) {
      wishCount.textContent = `${wishes.length} Comments`;
    }
    refreshWishPages();
  };

  wishForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(wishForm);
    if (String(formData.get("website") || "").trim()) {
      wishForm.reset();
      return;
    }

    const name = String(formData.get("name") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !message) {
      setWishStatus("Mohon isi nama dan pesan Anda.", true);
      return;
    }

    if (!wishClient) {
      setWishStatus("Belum terhubung ke server. Silakan hubungi pemilik undangan.", true);
      return;
    }

    const submitButton = wishForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
    }
    setWishStatus("");

    const { error } = await wishClient.from("wedding_wishes").insert({
      name: name.slice(0, 80),
      message: message.slice(0, 500)
    });

    if (submitButton) {
      submitButton.disabled = false;
    }

    if (error) {
      setWishStatus("Ucapan gagal dikirim. Silakan coba lagi.", true);
      return;
    }

    wishForm.reset();
    setWishStatus("Terima kasih! Ucapan Anda telah terkirim.", false);
  });

  loadWishes();
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => refreshWishPages(currentWishPage), 160);
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
const backgroundMusic = document.querySelector("#backgroundMusic");
const musicCluster = document.querySelector("#musicCluster");
const musicToggle = document.querySelector("#musicToggle");
const musicInfo = document.querySelector("#musicInfo");
const musicCredit = document.querySelector("#musicCredit");
let musicManuallyPaused = false;
let musicPausedByVisibility = false;

const updateMusicToggle = () => {
  if (!backgroundMusic || !musicToggle) {
    return;
  }

  const isPlaying = !backgroundMusic.paused && !backgroundMusic.ended;
  const label = isPlaying ? "Jeda musik" : "Putar musik";
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", label);
  musicToggle.setAttribute("title", label);
};

const playBackgroundMusic = () => {
  if (!backgroundMusic) {
    return;
  }

  const playRequest = backgroundMusic.play();
  playRequest?.catch(() => updateMusicToggle());
};

const isMusicCreditOpen = () => Boolean(musicCredit) && !musicCredit.hidden;

const openMusicCredit = () => {
  if (!musicCredit || !musicInfo) {
    return;
  }

  musicCredit.removeAttribute("hidden");
  musicInfo.setAttribute("aria-expanded", "true");
};

const closeMusicCredit = ({ returnFocus = true } = {}) => {
  if (!musicCredit || !musicInfo) {
    return;
  }

  musicCredit.setAttribute("hidden", "");
  musicInfo.setAttribute("aria-expanded", "false");
  if (returnFocus) {
    musicInfo.focus({ preventScroll: true });
  }
};

if (backgroundMusic && musicToggle) {
  backgroundMusic.volume = 0.40;
  backgroundMusic.addEventListener("play", updateMusicToggle);
  backgroundMusic.addEventListener("pause", updateMusicToggle);
  backgroundMusic.addEventListener("ended", updateMusicToggle);
  backgroundMusic.addEventListener("error", () => {
    const label = "Musik tidak dapat diputar";
    musicToggle.disabled = true;
    musicToggle.setAttribute("aria-label", label);
    musicToggle.setAttribute("title", label);
  });

  musicToggle.addEventListener("click", () => {
    musicPausedByVisibility = false;

    if (backgroundMusic.paused) {
      musicManuallyPaused = false;
      playBackgroundMusic();
    } else {
      musicManuallyPaused = true;
      backgroundMusic.pause();
    }
  });
}

musicInfo?.addEventListener("click", () => {
  if (isMusicCreditOpen()) {
    closeMusicCredit();
  } else {
    openMusicCredit();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isMusicCreditOpen()) {
    closeMusicCredit();
  }
});

document.addEventListener("click", (event) => {
  if (!isMusicCreditOpen()) {
    return;
  }

  if (musicCluster && musicCluster.contains(event.target)) {
    return;
  }

  closeMusicCredit({ returnFocus: false });
});

const revealNavigation = () => {
  document.body.classList.add("invitation-open");
  invitationContent?.removeAttribute("hidden");
  invitationContent?.removeAttribute("inert");
  bottomNav?.removeAttribute("inert");
  bottomNav?.setAttribute("aria-hidden", "false");
};

openInvitation?.addEventListener("click", (event) => {
  event.preventDefault();
  musicManuallyPaused = false;
  musicPausedByVisibility = false;
  musicCluster?.removeAttribute("hidden");
  playBackgroundMusic();
  revealNavigation();
  document.querySelector("#couple")?.scrollIntoView({ block: "start" });
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const onMotionPreferenceChange = (handler) => {
  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", handler);
  } else {
    reduceMotion.addListener(handler);
  }
};

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

  if (!backgroundMusic || !document.body.classList.contains("invitation-open")) {
    return;
  }

  if (document.hidden) {
    if (!backgroundMusic.paused) {
      musicPausedByVisibility = true;
      backgroundMusic.pause();
    }
  } else if (musicPausedByVisibility && !musicManuallyPaused) {
    musicPausedByVisibility = false;
    playBackgroundMusic();
  }
});
onMotionPreferenceChange(() => {
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
onMotionPreferenceChange(refreshRevealMotion);
