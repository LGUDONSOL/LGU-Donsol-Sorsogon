(function () {
  const body = document.body;

  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  const currentYear = document.getElementById("currentYear");

  const mayorModal = document.getElementById("mayorModal");
  const openMayorMessage = document.getElementById("openMayorMessage");
  const closeMayorMessages = Array.from(
    document.querySelectorAll("#closeMayorMessage, .modal__close--desktop")
  );

  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  const inquiryForm = document.getElementById("inquiryForm");
  const formStatus = document.getElementById("formStatus");
  const backToTop = document.getElementById("backToTop");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear().toString();
  }

  function setNavOpen(isOpen) {
    if (!siteNav || !navToggle) return;

    siteNav.classList.toggle("is-open", isOpen);
    navToggle.classList.toggle("is-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!siteNav.classList.contains("is-open"));
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 820) {
          setNavOpen(false);
        }
      });
    });

    document.addEventListener("click", function (event) {
      const clickInsideNav = siteNav.contains(event.target);
      const clickOnToggle = navToggle.contains(event.target);

      if (
        !clickInsideNav &&
        !clickOnToggle &&
        siteNav.classList.contains("is-open") &&
        window.innerWidth <= 820
      ) {
        setNavOpen(false);
      }
    });
  }

  function openMayorModal() {
    if (!mayorModal) return;

    mayorModal.classList.add("is-open");
    mayorModal.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
  }

  function closeMayorModal() {
    if (!mayorModal) return;

    mayorModal.classList.remove("is-open");
    mayorModal.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
  }

  if (openMayorMessage && mayorModal) {
    openMayorMessage.addEventListener("click", openMayorModal);

    closeMayorMessages.forEach(function (button) {
      button.addEventListener("click", closeMayorModal);
    });

    mayorModal.addEventListener("click", function (event) {
      if (event.target === mayorModal) {
        closeMayorModal();
      }
    });
  }

  faqItems.forEach(function (item) {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!button || !answer) return;

    button.addEventListener("click", function () {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach(function (otherItem) {
        const otherButton = otherItem.querySelector(".faq-question");
        const otherAnswer = otherItem.querySelector(".faq-answer");

        if (!otherButton || !otherAnswer) return;

        otherItem.classList.remove("is-open");
        otherButton.setAttribute("aria-expanded", "false");
        otherAnswer.style.maxHeight = "0px";
      });

      if (!isOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  function setActiveNavLink() {
    const scrollPosition = window.scrollY + 130;
    let currentSectionId = "";

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPosition >= top && scrollPosition < bottom) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      link.classList.toggle("is-active", href === "#" + currentSectionId);
    });
  }

  function toggleBackToTop() {
    if (!backToTop) return;

    backToTop.classList.toggle("is-visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", function () {
    setActiveNavLink();
    toggleBackToTop();
  });

  setActiveNavLink();
  toggleBackToTop();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function showStatus(message, isError) {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.classList.add("is-visible");
    formStatus.style.background = isError
      ? "rgba(194, 44, 59, 0.10)"
      : "rgba(13, 143, 98, 0.10)";
    formStatus.style.color = isError ? "#b32334" : "#0d8f62";
  }

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const fullName = document.getElementById("fullName")?.value.trim() || "";
      const email = document.getElementById("email")?.value.trim() || "";
      const contactNumber =
        document.getElementById("contactNumber")?.value.trim() || "";
      const subject = document.getElementById("subject")?.value.trim() || "";
      const message = document.getElementById("message")?.value.trim() || "";

      if (!fullName || !email || !subject || !message) {
        showStatus(
          "Please complete the required fields before sending your inquiry.",
          true
        );
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showStatus("Please enter a valid email address.", true);
        return;
      }

      const bodyLines = [
        "Municipality of Donsol Website Inquiry",
        "",
        "Full Name: " + fullName,
        "Email Address: " + email,
        "Contact Number: " + (contactNumber || "Not provided"),
        "",
        "Message:",
        message
      ];

      const mailtoLink =
        "mailto:admin@donsol.gov.ph" +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(bodyLines.join("\n"));

      showStatus(
        "Your email app is opening with your prepared inquiry. Review it, then click send.",
        false
      );

      window.location.href = mailtoLink;
    });
  }

  (function () {
    const carousel = document.getElementById("announcementCarousel");
    const track = document.getElementById("announcementCarouselTrack");
    const counter = document.getElementById("carouselCounter");

    if (!carousel || !track || !counter) return;

    const totalImages = 21;
    const imageFolder = "images/Announcement/MASSO";

    for (let i = 1; i <= totalImages; i++) {
      const imagePath = `${imageFolder}/smv (${i}).jpg`;

      track.insertAdjacentHTML(
        "beforeend",
        `
        <div class="carousel-item">
          <img src="${imagePath}" alt="SMV ${i}" loading="lazy" data-index="${i - 1}">
          <a href="documents/smv.pdf" target="_blank" class="download-btn">
            ⬇ Download File
          </a>
        </div>
        `
      );
    }

    const items = Array.from(track.querySelectorAll(".carousel-item"));
    const images = Array.from(track.querySelectorAll("img"));
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");

    if (!items.length || !prevBtn || !nextBtn) return;

    let index = 0;
    let autoSlideInterval = null;

    function updateCarousel() {
      const width = carousel.offsetWidth;
      track.style.transform = `translateX(-${index * width}px)`;
      counter.textContent = `${index + 1} / ${items.length}`;
    }

    function showNextSlide() {
      index = (index + 1) % items.length;
      updateCarousel();
    }

    function showPrevSlide() {
      index = (index - 1 + items.length) % items.length;
      updateCarousel();
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = window.setInterval(showNextSlide, 4000);
    }

    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }

    nextBtn.addEventListener("click", function () {
      showNextSlide();
      startAutoSlide();
    });

    prevBtn.addEventListener("click", function () {
      showPrevSlide();
      startAutoSlide();
    });

    window.addEventListener("resize", updateCarousel);

    carousel.addEventListener("mouseenter", stopAutoSlide);
    carousel.addEventListener("mouseleave", startAutoSlide);
    carousel.addEventListener("touchstart", stopAutoSlide, { passive: true });
    carousel.addEventListener("touchend", startAutoSlide);

    updateCarousel();
    startAutoSlide();

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    const lightboxCounter = document.getElementById("lightboxCounter");
    const lightboxDownload = document.getElementById("lightboxDownload");

    if (
      !lightbox ||
      !lightboxImg ||
      !lightboxClose ||
      !lightboxPrev ||
      !lightboxNext ||
      !lightboxCounter ||
      !lightboxDownload
    ) {
      return;
    }

    let lightboxIndex = 0;

    function updateLightbox() {
      const currentImg = images[lightboxIndex];
      if (!currentImg) return;

      lightboxImg.src = currentImg.src;
      lightboxImg.alt = currentImg.alt;
      lightboxCounter.textContent = `${lightboxIndex + 1} / ${images.length}`;
      lightboxDownload.href = currentImg.src;
      lightboxDownload.setAttribute(
        "download",
        currentImg.alt.replace(/\s+/g, "-").toLowerCase() + ".jpg"
      );
    }

    function openLightbox(clickedIndex) {
      lightboxIndex = clickedIndex;
      updateLightbox();
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      body.style.overflow = "";
    }

    function showPrevLightboxImage() {
      lightboxIndex = (lightboxIndex - 1 + images.length) % images.length;
      updateLightbox();
    }

    function showNextLightboxImage() {
      lightboxIndex = (lightboxIndex + 1) % images.length;
      updateLightbox();
    }

    images.forEach(function (img, imgIndex) {
      img.addEventListener("click", function () {
        openLightbox(imgIndex);
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", showPrevLightboxImage);
    lightboxNext.addEventListener("click", showNextLightboxImage);

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        if (mayorModal && mayorModal.classList.contains("is-open")) {
          closeMayorModal();
        }

        if (lightbox.classList.contains("is-open")) {
          closeLightbox();
        }
      }

      if (!lightbox.classList.contains("is-open")) return;

      if (event.key === "ArrowLeft") {
        showPrevLightboxImage();
      }

      if (event.key === "ArrowRight") {
        showNextLightboxImage();
      }
    });
  })();
})();

(function () {
  const tabs = Array.from(document.querySelectorAll(".announcement-tab"));
  const panels = Array.from(document.querySelectorAll(".announcement-panel"));

  if (!tabs.length || !panels.length) return;

  function activatePanel(targetId) {
    tabs.forEach(function (tab) {
      const isMatch = tab.getAttribute("data-target") === targetId;
      tab.classList.toggle("is-active", isMatch);
    });

    panels.forEach(function (panel) {
      panel.classList.toggle("is-active", panel.id === targetId);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const targetId = tab.getAttribute("data-target");
      if (!targetId) return;
      activatePanel(targetId);
    });
  });
})();