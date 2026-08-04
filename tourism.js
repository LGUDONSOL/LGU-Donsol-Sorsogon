/*
  Project Version: v1.16.06
  Update: Media gallery videos muted by default
  Description: All videos opened inside the Experience Preview media galleries now start muted while retaining the browser's native controls so visitors can manually unmute them.
  Date: 2026-07-20
*/

document.addEventListener("DOMContentLoaded", () => {
  initHeroContextReveal();
  initHeaderReveal();
  initScrollTopButton();
  initWhatsNewPanel();
  initFeedbackModal();
  initMobileNavigation();
  initItineraryTabs();
  initMediaShowcase();
  initAccommodationFilter();
  initScrollReveal();
  initHeroVideoFallback();
  initInquiryForm();
  initNewsletterForm();
  initTravelDateMinimum();
});

/* Video-first hero context reveal */

function initHeroContextReveal() {
  const hero = document.querySelector("[data-hero-reveal]");

  if (!hero) return;

  const scrollCue = hero.querySelector("[data-hero-reveal-trigger]");
  const replayButton = hero.querySelector("[data-hero-video-replay]");
  const heroVideo = hero.querySelector(".hero-video");
  const revealOffset = 64;

  let touchStartY = 0;
  let contextHasRevealed = false;
  let isReturningToVideoMode = false;
  let returnTimer = null;
  let replayUpdateFrame = null;

  document.body.classList.add("hero-reveal-ready");
  updateReplayAvailability();

  function getViewportHeight() {
    return window.visualViewport?.height || document.documentElement.clientHeight || window.innerHeight;
  }

  function dispatchRevealStateChange() {
    document.dispatchEvent(new CustomEvent("heroContextRevealChange"));
  }

  function playHeroVideo() {
    if (!heroVideo) return;

    heroVideo.muted = true;
    heroVideo.playsInline = true;

    const playPromise = heroVideo.play();

    if (playPromise === undefined) return;

    playPromise.catch(() => {
      // Some browsers may block programmatic video playback.
      // The cinematic layout still resets safely.
    });
  }

  function updateReplayAvailability() {
    const viewportHeight = getViewportHeight();
    const heroBounds = hero.getBoundingClientRect();
    const nextSection = hero.nextElementSibling;
    const nextSectionBounds = nextSection ? nextSection.getBoundingClientRect() : null;

    const nextSectionHasAppeared = nextSectionBounds
      ? nextSectionBounds.top <= viewportHeight - 1 && nextSectionBounds.bottom > 0
      : heroBounds.bottom <= viewportHeight - 1;

    const heroStillOwnsViewport = heroBounds.top <= 0 && heroBounds.bottom > viewportHeight + 1;

    const replayShouldBeAvailable =
      contextHasRevealed &&
      heroStillOwnsViewport &&
      !nextSectionHasAppeared &&
      !isReturningToVideoMode;

    document.body.classList.toggle("hero-replay-available", replayShouldBeAvailable);

    if (replayButton) {
      replayButton.setAttribute("aria-hidden", replayShouldBeAvailable ? "false" : "true");
      replayButton.tabIndex = replayShouldBeAvailable ? 0 : -1;
    }
  }

  function scheduleReplayAvailabilityUpdate() {
    if (replayUpdateFrame) return;

    replayUpdateFrame = window.requestAnimationFrame(() => {
      replayUpdateFrame = null;
      updateReplayAvailability();
    });
  }

  function revealHeroContext() {
    if (contextHasRevealed || isReturningToVideoMode) return;

    contextHasRevealed = true;
    document.body.classList.add("hero-context-visible");
    updateReplayAvailability();
    dispatchRevealStateChange();
  }

  function returnToVideoMode() {
    if (!contextHasRevealed && window.scrollY <= 4) return;

    contextHasRevealed = false;
    isReturningToVideoMode = true;

    document.body.classList.remove("hero-context-visible");
    updateReplayAvailability();
    dispatchRevealStateChange();
    playHeroVideo();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    clearTimeout(returnTimer);

    returnTimer = window.setTimeout(() => {
      isReturningToVideoMode = false;
      updateReplayAvailability();
    }, 900);
  }

  function shouldRevealFromTop() {
    return (
      window.scrollY <= 4 &&
      !contextHasRevealed &&
      !isReturningToVideoMode &&
      !document.body.classList.contains("nav-open")
    );
  }

  function revealWhenScrolled() {
    scheduleReplayAvailabilityUpdate();

    if (isReturningToVideoMode) return;

    const hasDeepLinked = window.location.hash && window.location.hash !== "#top";

    if (window.scrollY > revealOffset || hasDeepLinked) {
      revealHeroContext();
    }
  }

  if (window.scrollY > revealOffset || (window.location.hash && window.location.hash !== "#top")) {
    revealHeroContext();
  } else {
    updateReplayAvailability();
  }

  window.addEventListener("scroll", revealWhenScrolled, { passive: true });
  window.addEventListener("resize", scheduleReplayAvailabilityUpdate);
  window.addEventListener("orientationchange", scheduleReplayAvailabilityUpdate);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleReplayAvailabilityUpdate);
    window.visualViewport.addEventListener("scroll", scheduleReplayAvailabilityUpdate);
  }

  window.addEventListener(
    "wheel",
    (event) => {
      const isScrollingDown = event.deltaY > 0;

      if (!isScrollingDown || !shouldRevealFromTop()) return;

      event.preventDefault();
      revealHeroContext();
    },
    { passive: false }
  );

  window.addEventListener(
    "keydown",
    (event) => {
      const revealKeys = ["ArrowDown", "PageDown", " ", "Spacebar"];

      if (!revealKeys.includes(event.key) || !shouldRevealFromTop()) return;

      event.preventDefault();
      revealHeroContext();
    }
  );

  window.addEventListener(
    "touchstart",
    (event) => {
      if (!event.touches.length) return;

      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (!event.touches.length) return;

      scheduleReplayAvailabilityUpdate();

      if (!shouldRevealFromTop()) return;

      const currentTouchY = event.touches[0].clientY;
      const isSwipingUp = touchStartY - currentTouchY > 10;

      if (!isSwipingUp) return;

      event.preventDefault();
      revealHeroContext();
    },
    { passive: false }
  );

  window.addEventListener("touchend", scheduleReplayAvailabilityUpdate, { passive: true });

  if (scrollCue) {
    scrollCue.addEventListener("click", (event) => {
      if (contextHasRevealed) return;

      event.preventDefault();
      revealHeroContext();
    });
  }

  if (replayButton) {
    replayButton.addEventListener("click", returnToVideoMode);
  }
}
/* Header reveal */

function initHeaderReveal() {
  const siteHeader = document.querySelector("[data-site-header]") || document.querySelector(".site-header");

  if (!siteHeader) return;

  const revealOffset = 64;
  const mobileBreakpoint = 900;
  const mobileTopOffset = 6;

  function isMobileHeaderLayout() {
    return window.innerWidth <= mobileBreakpoint;
  }

  function updateHeaderState() {
    const heroContextIsVisible = document.body.classList.contains("hero-context-visible");
    const scrolledPastHeroStart = window.scrollY > revealOffset;
    const menuIsOpen = document.body.classList.contains("nav-open");
    const isAtVeryTop = window.scrollY <= mobileTopOffset;

    let shouldShowHeader = scrolledPastHeroStart || heroContextIsVisible || menuIsOpen;

    if (isMobileHeaderLayout()) {
      shouldShowHeader = menuIsOpen || !isAtVeryTop;
    }

    siteHeader.classList.toggle("is-hidden-at-top", !shouldShowHeader);
    siteHeader.classList.toggle("is-visible", shouldShowHeader);
    siteHeader.classList.toggle("is-floating", window.scrollY > mobileTopOffset);
  }

  updateHeaderState();

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("resize", updateHeaderState);
  window.addEventListener("orientationchange", updateHeaderState);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateHeaderState);
    window.visualViewport.addEventListener("scroll", updateHeaderState);
  }

  document.addEventListener("heroContextRevealChange", updateHeaderState);
}

/* Scroll to top button */

function initScrollTopButton() {
  const scrollTopButton = document.querySelector("[data-scroll-top]");
  const hero = document.querySelector("[data-hero-reveal]") || document.querySelector("#top");

  if (!scrollTopButton || !hero) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let scrollTopUpdateFrame = null;

  function updateScrollTopVisibility() {
    const heroBounds = hero.getBoundingClientRect();
    const menuIsOpen = document.body.classList.contains("nav-open");
    const heroIsCompletelyGone = heroBounds.bottom <= 0;
    const shouldShowButton = heroIsCompletelyGone && !menuIsOpen;

    document.body.classList.toggle("scroll-top-visible", shouldShowButton);
    scrollTopButton.setAttribute("aria-hidden", shouldShowButton ? "false" : "true");
    scrollTopButton.tabIndex = shouldShowButton ? 0 : -1;
  }

  function scheduleScrollTopVisibilityUpdate() {
    if (scrollTopUpdateFrame) return;

    scrollTopUpdateFrame = window.requestAnimationFrame(() => {
      scrollTopUpdateFrame = null;
      updateScrollTopVisibility();
    });
  }

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth"
    });
  });

  updateScrollTopVisibility();

  window.addEventListener("scroll", scheduleScrollTopVisibilityUpdate, { passive: true });
  window.addEventListener("resize", scheduleScrollTopVisibilityUpdate);
  window.addEventListener("orientationchange", scheduleScrollTopVisibilityUpdate);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleScrollTopVisibilityUpdate);
    window.visualViewport.addEventListener("scroll", scheduleScrollTopVisibilityUpdate);
  }

  const bodyClassObserver = new MutationObserver(scheduleScrollTopVisibilityUpdate);
  bodyClassObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"]
  });
}

/* What's New floating panel */

function initWhatsNewPanel() {
  const widget = document.querySelector("[data-whats-new-widget]");
  const toggleButton = document.querySelector("[data-whats-new-toggle]");
  const panel = document.querySelector("[data-whats-new-panel]");
  const closeButton = document.querySelector("[data-whats-new-close]");

  if (!widget || !toggleButton || !panel) return;

  let lastFocusedElement = null;

  function isPanelOpen() {
    return !panel.hasAttribute("hidden");
  }

  function openPanel() {
    if (isPanelOpen()) return;

    lastFocusedElement = document.activeElement;

    panel.removeAttribute("hidden");
    toggleButton.setAttribute("aria-expanded", "true");
    toggleButton.setAttribute("aria-label", "Close latest Donsol tourism updates");
    document.body.classList.add("whats-new-open");

    window.requestAnimationFrame(() => {
      if (closeButton) {
        closeButton.focus();
      } else {
        panel.setAttribute("tabindex", "-1");
        panel.focus();
      }
    });
  }

  function closePanel({ returnFocus = true } = {}) {
    if (!isPanelOpen()) return;

    panel.setAttribute("hidden", "");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("aria-label", "Open latest Donsol tourism updates");
    document.body.classList.remove("whats-new-open");

    if (
      returnFocus &&
      lastFocusedElement instanceof HTMLElement &&
      document.contains(lastFocusedElement)
    ) {
      lastFocusedElement.focus();
    }
  }

  function togglePanel() {
    if (isPanelOpen()) {
      closePanel();
    } else {
      openPanel();
    }
  }

  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    togglePanel();
  });

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closePanel();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
    }
  });

  document.addEventListener("click", (event) => {
    if (!isPanelOpen()) return;

    const clickedInsideWidget = widget.contains(event.target);

    if (!clickedInsideWidget) {
      closePanel({ returnFocus: false });
    }
  });
}



/* Floating Google Forms feedback modal */

function initFeedbackModal() {
  const widget = document.querySelector("[data-feedback-widget]");
  const toggleButton = document.querySelector("[data-feedback-toggle]");
  const modal = document.querySelector("[data-feedback-modal]");
  const dialog = document.querySelector("[data-feedback-dialog]");
  const backdrop = document.querySelector("[data-feedback-backdrop]");
  const closeButton = document.querySelector("[data-feedback-close]");

  if (!widget || !toggleButton || !modal || !dialog) return;

  const focusableSelector = [
    "button:not([disabled])",
    "a[href]",
    "iframe",
    "[tabindex]:not([tabindex='-1'])"
  ].join(", ");

  const backgroundElements = Array.from(document.body.children).filter((element) => {
    return element !== modal && element.tagName !== "SCRIPT";
  });

  const previousInertStates = new Map();
  let lastFocusedElement = null;

  function isModalOpen() {
    return !modal.hasAttribute("hidden");
  }

  function closeWhatsNewPanel() {
    const whatsNewPanel = document.querySelector("[data-whats-new-panel]");
    const whatsNewToggle = document.querySelector("[data-whats-new-toggle]");

    if (!whatsNewPanel || whatsNewPanel.hasAttribute("hidden")) return;

    whatsNewPanel.setAttribute("hidden", "");
    document.body.classList.remove("whats-new-open");

    if (whatsNewToggle) {
      whatsNewToggle.setAttribute("aria-expanded", "false");
      whatsNewToggle.setAttribute("aria-label", "Open latest Donsol tourism updates");
    }
  }

  function disableBackgroundInteraction() {
    previousInertStates.clear();

    backgroundElements.forEach((element) => {
      previousInertStates.set(element, element.hasAttribute("inert"));
      element.setAttribute("inert", "");
    });
  }

  function restoreBackgroundInteraction() {
    backgroundElements.forEach((element) => {
      if (!previousInertStates.get(element)) {
        element.removeAttribute("inert");
      }
    });

    previousInertStates.clear();
  }

  function openModal() {
    if (isModalOpen()) return;

    closeWhatsNewPanel();
    lastFocusedElement = document.activeElement;

    modal.removeAttribute("hidden");
    toggleButton.setAttribute("aria-expanded", "true");
    toggleButton.setAttribute("aria-label", "Close Donsol Tourism feedback form");
    document.body.classList.add("feedback-open");
    disableBackgroundInteraction();

    window.requestAnimationFrame(() => {
      if (closeButton instanceof HTMLElement) {
        closeButton.focus();
      } else {
        dialog.focus();
      }
    });
  }

  function closeModal({ returnFocus = true } = {}) {
    if (!isModalOpen()) return;

    modal.setAttribute("hidden", "");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("aria-label", "Open Donsol Tourism feedback form");
    document.body.classList.remove("feedback-open");
    restoreBackgroundInteraction();

    if (
      returnFocus &&
      lastFocusedElement instanceof HTMLElement &&
      document.contains(lastFocusedElement)
    ) {
      lastFocusedElement.focus();
    } else if (returnFocus) {
      toggleButton.focus();
    }
  }

  function trapFocus(event) {
    if (event.key !== "Tab" || !isModalOpen()) return;

    const focusableElements = Array.from(
      dialog.querySelectorAll(focusableSelector)
    ).filter((element) => {
      return element instanceof HTMLElement && element.offsetParent !== null;
    });

    if (!focusableElements.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  toggleButton.addEventListener("click", () => {
    if (isModalOpen()) {
      closeModal();
    } else {
      openModal();
    }
  });

  closeButton?.addEventListener("click", () => {
    closeModal();
  });

  backdrop?.addEventListener("click", () => {
    closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (!isModalOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    trapFocus(event);
  });
}

/* Scroll reveal animations */

function initScrollReveal() {
  const revealSelectors = [
    ".section-heading",
    ".explore-heading",
    ".explore-card",
    ".intro-grid",
    ".signature-heading",
    ".signature-card",
    ".signature-planning-note",
    ".media-showcase-section .section-heading",
    ".media-showcase",
    ".media-panel",
    ".media-tab",
    ".experience-item",
    ".itinerary-tabs",
    ".info-card",
    ".food-copy",
    ".mini-card",
    ".special-card",
    ".event-card",
    ".guide-content",
    ".guide-card",
    ".contact-card",
    ".inquiry-form"
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(", "));

  if (!revealElements.length) return;

  revealElements.forEach((element, index) => {
    element.setAttribute("data-reveal", "");

    if (!element.style.getPropertyValue("--reveal-delay")) {
      element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 80}ms`);
    }
  });

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.16,
      rootMargin: "0px 0px -80px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* Hero video fallback */

function initHeroVideoFallback() {
  const heroVideo = document.querySelector(".hero-video");
  const heroPoster = document.querySelector(".hero-poster");

  if (!heroVideo || !heroPoster) return;

  heroVideo.addEventListener("loadeddata", () => {
    heroPoster.classList.add("is-hidden");
  });

  heroVideo.addEventListener("error", () => {
    heroPoster.classList.remove("is-hidden");
  });

  const playPromise = heroVideo.play();

  if (playPromise === undefined) return;

  playPromise
    .then(() => {
      heroPoster.classList.add("is-hidden");
    })
    .catch(() => {
      heroPoster.classList.remove("is-hidden");
    });
}

/* Mobile navigation */

function initMobileNavigation() {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");

  if (!navToggle || !navMenu) return;

  const menuLinks = navMenu.querySelectorAll("a");

  function openMenu() {
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation menu");
    navMenu.classList.add("is-open");
    document.body.classList.add("nav-open");
  }

  function closeMenu() {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  function toggleMenu() {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  navToggle.addEventListener("click", toggleMenu);

  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = navMenu.contains(event.target);
    const clickedToggle = navToggle.contains(event.target);
    const menuIsOpen = navMenu.classList.contains("is-open");

    if (!clickedInsideMenu && !clickedToggle && menuIsOpen) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120) {
      closeMenu();
    }
  });
}

/* Itinerary tabs */

function initItineraryTabs() {
  const tabButtons = document.querySelectorAll("[data-tab-button]");
  const tabPanels = document.querySelectorAll("[data-tab-panel]");

  if (!tabButtons.length || !tabPanels.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetPanelId = button.getAttribute("aria-controls");
      const targetPanel = document.getElementById(targetPanelId);

      if (!targetPanel) return;

      tabButtons.forEach((tabButton) => {
        tabButton.classList.remove("active");
        tabButton.setAttribute("aria-selected", "false");
      });

      tabPanels.forEach((panel) => {
        panel.classList.remove("active");
        panel.setAttribute("hidden", "");
      });

      button.classList.add("active");
      button.setAttribute("aria-selected", "true");

      targetPanel.classList.add("active");
      targetPanel.removeAttribute("hidden");
    });
  });

  const tabList = document.querySelector("[role='tablist']");

  if (!tabList) return;

  tabList.addEventListener("keydown", (event) => {
    const currentTab = document.activeElement;
    const tabs = Array.from(tabButtons);
    const currentIndex = tabs.indexOf(currentTab);

    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = currentIndex + 1;
    }

    if (event.key === "ArrowLeft") {
      nextIndex = currentIndex - 1;
    }

    if (event.key === "Home") {
      nextIndex = 0;
    }

    if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex < 0) {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex >= tabs.length) {
      nextIndex = 0;
    }

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowLeft" ||
      event.key === "Home" ||
      event.key === "End"
    ) {
      event.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    }
  });
}


/* Media showcase */

function initMediaShowcase() {
  const showcases = document.querySelectorAll("[data-media-showcase]");

  if (!showcases.length) return;

  showcases.forEach((showcase) => {
    const buttons = Array.from(showcase.querySelectorAll("[data-media-button]"));
    const panels = Array.from(showcase.querySelectorAll("[data-media-panel]"));

    if (!buttons.length || !panels.length) return;

    const galleryControllers = new Map();

    panels.forEach((panel) => {
      const gallery = panel.querySelector("[data-media-gallery]");

      if (!gallery) return;

      const controller = initMediaGallery(gallery);

      if (controller) {
        galleryControllers.set(panel, controller);
      }
    });

    function getPanelForButton(button) {
      const controlledPanelId = button.getAttribute("aria-controls");

      if (!controlledPanelId) return null;

      return document.getElementById(controlledPanelId);
    }

    function pausePanelVideos(panel) {
      const controller = galleryControllers.get(panel);

      if (controller) {
        controller.pause();
        return;
      }

      panel.querySelectorAll("video").forEach((video) => {
        video.pause();
      });
    }

    function activateButton(button) {
      const targetPanel = getPanelForButton(button);

      if (!targetPanel) return;

      buttons.forEach((mediaButton) => {
        const isActiveButton = mediaButton === button;

        mediaButton.classList.toggle("active", isActiveButton);
        mediaButton.setAttribute("aria-selected", isActiveButton ? "true" : "false");
        mediaButton.setAttribute("tabindex", isActiveButton ? "0" : "-1");
      });

      panels.forEach((panel) => {
        const isActivePanel = panel === targetPanel;

        panel.classList.toggle("active", isActivePanel);
        panel.toggleAttribute("hidden", !isActivePanel);

        if (!isActivePanel) {
          pausePanelVideos(panel);
        }
      });
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        activateButton(button);
      });
    });

    showcase.addEventListener("keydown", (event) => {
      const currentIndex = buttons.indexOf(document.activeElement);

      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = currentIndex + 1;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = currentIndex - 1;
      }

      if (event.key === "Home") {
        nextIndex = 0;
      }

      if (event.key === "End") {
        nextIndex = buttons.length - 1;
      }

      if (nextIndex < 0) {
        nextIndex = buttons.length - 1;
      }

      if (nextIndex >= buttons.length) {
        nextIndex = 0;
      }

      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp" ||
        event.key === "Home" ||
        event.key === "End"
      ) {
        event.preventDefault();
        buttons[nextIndex].focus();
        activateButton(buttons[nextIndex]);
      }
    });

    const initiallyActiveButton =
      buttons.find((button) => button.classList.contains("active")) ||
      buttons.find((button) => button.getAttribute("aria-selected") === "true") ||
      buttons[0];

    activateButton(initiallyActiveButton);
  });
}

function initMediaGallery(gallery) {
  const output = gallery.querySelector("[data-media-gallery-output]");
  const stage = gallery.querySelector("[data-media-gallery-stage]");
  const previousButton = gallery.querySelector("[data-media-prev]");
  const nextButton = gallery.querySelector("[data-media-next]");
  const counter = gallery.querySelector("[data-media-counter]");
  const thumbnailContainer = gallery.querySelector("[data-media-thumbnails]");
  const requestedLimit = Number.parseInt(gallery.dataset.mediaLimit || "8", 10);
  const mediaLimit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 8)
    : 8;

  const allItems = Array.from(gallery.querySelectorAll("[data-media-item]"));
  const items = allItems.slice(0, mediaLimit);

  if (!output || !stage || !items.length) return null;

  allItems.slice(mediaLimit).forEach((item) => {
    item.hidden = true;
    item.tabIndex = -1;
    item.setAttribute("aria-hidden", "true");
  });

  let activeIndex = items.findIndex((item) => {
    return (
      item.classList.contains("active") ||
      item.getAttribute("aria-pressed") === "true"
    );
  });

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  function pauseActiveVideo() {
    const activeVideo = output.querySelector("video");

    if (activeVideo) {
      activeVideo.pause();
    }
  }

  function getVideoMimeType(source) {
    const cleanSource = source.split("?")[0].split("#")[0].toLowerCase();

    if (cleanSource.endsWith(".webm")) return "video/webm";
    if (cleanSource.endsWith(".ogv") || cleanSource.endsWith(".ogg")) return "video/ogg";

    return "video/mp4";
  }

  function createMediaElement(item) {
    const mediaType = item.dataset.mediaType === "video" ? "video" : "image";
    const mediaSource = item.dataset.mediaSrc || "";
    const mediaAlt = item.dataset.mediaAlt || "";
    const mediaPoster = item.dataset.mediaPoster || "";

    if (mediaType === "video") {
      const video = document.createElement("video");
      const source = document.createElement("source");

      video.controls = true;
      video.defaultMuted = true;
      video.muted = true;
      video.setAttribute("muted", "");
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("data-media-active", "");

      if (mediaPoster) {
        video.poster = mediaPoster;
      }

      source.src = mediaSource;
      source.type = getVideoMimeType(mediaSource);

      video.appendChild(source);
      video.appendChild(
        document.createTextNode("Your browser does not support the video tag.")
      );

      return video;
    }

    const image = document.createElement("img");

    image.src = mediaSource;
    image.alt = mediaAlt;
    image.loading = "eager";
    image.decoding = "async";
    image.setAttribute("data-media-active", "");

    return image;
  }

  function updateControls() {
    const hasMultipleItems = items.length > 1;

    if (previousButton) {
      previousButton.disabled = !hasMultipleItems;
      previousButton.setAttribute("aria-hidden", hasMultipleItems ? "false" : "true");
    }

    if (nextButton) {
      nextButton.disabled = !hasMultipleItems;
      nextButton.setAttribute("aria-hidden", hasMultipleItems ? "false" : "true");
    }

    if (counter) {
      counter.textContent = `${activeIndex + 1} / ${items.length}`;
    }
  }

  function updateThumbnails() {
    items.forEach((item, index) => {
      const isActive = index === activeIndex;

      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", isActive ? "true" : "false");
      item.tabIndex = isActive ? 0 : -1;
    });
  }

  function renderActiveItem({ moveFocus = false } = {}) {
    const activeItem = items[activeIndex];

    if (!activeItem) return;

    pauseActiveVideo();

    const mediaElement = createMediaElement(activeItem);
    const isVideo = activeItem.dataset.mediaType === "video";

    output.replaceChildren(mediaElement);
    stage.classList.toggle("media-frame-video", isVideo);

    updateThumbnails();
    updateControls();

    activeItem.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest"
    });

    if (moveFocus) {
      activeItem.focus();
    }
  }

  function showItem(index, options = {}) {
    if (!items.length) return;

    activeIndex = (index + items.length) % items.length;
    renderActiveItem(options);
  }

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      showItem(index);
    });
  });

  previousButton?.addEventListener("click", () => {
    showItem(activeIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    showItem(activeIndex + 1);
  });

  thumbnailContainer?.addEventListener("keydown", (event) => {
    const currentIndex = items.indexOf(document.activeElement);

    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = currentIndex + 1;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = currentIndex - 1;
    }

    if (event.key === "Home") {
      nextIndex = 0;
    }

    if (event.key === "End") {
      nextIndex = items.length - 1;
    }

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp" ||
      event.key === "Home" ||
      event.key === "End"
    ) {
      event.preventDefault();
      showItem(nextIndex, { moveFocus: true });
    }
  });

  renderActiveItem();

  return {
    pause: pauseActiveVideo,
    showItem
  };
}

/* Accommodation filter */

function initAccommodationFilter() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");

  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((filterButton) => {
        filterButton.classList.remove("active");
      });

      button.classList.add("active");

      cards.forEach((card) => {
        const cardCategory = card.dataset.category;
        const shouldShow = selectedFilter === "all" || selectedFilter === cardCategory;

        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });
}

/* Inquiry form */

function initInquiryForm() {
  const inquiryForm = document.querySelector(".inquiry-form");

  if (!inquiryForm) return;

  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = inquiryForm.querySelector("#full-name");
    const email = inquiryForm.querySelector("#email");
    const message = inquiryForm.querySelector("#message");

    const nameValue = fullName.value.trim();
    const emailValue = email.value.trim();
    const messageValue = message.value.trim();

    clearFormStatus(inquiryForm);

    if (!nameValue || !emailValue) {
      showFormStatus(inquiryForm, "Please enter your name and email address.", "error");
      return;
    }

    if (!isValidEmail(emailValue)) {
      showFormStatus(inquiryForm, "Please enter a valid email address.", "error");
      return;
    }

    if (messageValue.length > 0 && messageValue.length < 10) {
      showFormStatus(inquiryForm, "Please add a little more detail to your message.", "error");
      return;
    }

    showFormStatus(
      inquiryForm,
      "Your inquiry is ready. Connect this form to email, Google Forms, or a backend before launching.",
      "success"
    );

    inquiryForm.reset();
    initTravelDateMinimum();
  });
}

/* Newsletter form */

function initNewsletterForm() {
  const newsletterForm = document.querySelector(".newsletter-form");

  if (!newsletterForm) return;

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput = newsletterForm.querySelector("input[type='email']");
    const emailValue = emailInput.value.trim();

    clearFormStatus(newsletterForm);

    if (!isValidEmail(emailValue)) {
      showFormStatus(newsletterForm, "Please enter a valid email address.", "error");
      return;
    }

    showFormStatus(
      newsletterForm,
      "Subscription layout is ready. Connect this to your mailing system before publishing.",
      "success"
    );

    newsletterForm.reset();
  });
}

/* Date field */

function initTravelDateMinimum() {
  const travelDateInput = document.querySelector("#travel-date");

  if (!travelDateInput) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  travelDateInput.min = `${year}-${month}-${day}`;
}

/* Form helpers */

function showFormStatus(form, message, type) {
  const status = document.createElement("p");

  status.className = `form-status form-status-${type}`;
  status.setAttribute("role", type === "error" ? "alert" : "status");
  status.textContent = message;

  form.appendChild(status);
}

function clearFormStatus(form) {
  const existingStatus = form.querySelector(".form-status");

  if (existingStatus) {
    existingStatus.remove();
  }
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
}