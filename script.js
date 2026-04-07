(function () {
  const body = document.body;
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const currentYear = document.getElementById("currentYear");
  const mayorModal = document.getElementById("mayorModal");
  const openMayorMessage = document.getElementById("openMayorMessage");
  const closeMayorMessage = document.getElementById("closeMayorMessage");
  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  const inquiryForm = document.getElementById("inquiryForm");
  const formStatus = document.getElementById("formStatus");
  const backToTop = document.getElementById("backToTop");

  currentYear.textContent = new Date().getFullYear().toString();

  function setNavOpen(isOpen) {
    siteNav.classList.toggle("is-open", isOpen);
    navToggle.classList.toggle("is-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  navToggle.addEventListener("click", function () {
    const isOpen = !siteNav.classList.contains("is-open");
    setNavOpen(isOpen);
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

    if (!clickInsideNav && !clickOnToggle && siteNav.classList.contains("is-open") && window.innerWidth <= 820) {
      setNavOpen(false);
    }
  });

  function openModal() {
    mayorModal.classList.add("is-open");
    mayorModal.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
  }

  function closeModal() {
    mayorModal.classList.remove("is-open");
    mayorModal.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
  }

  openMayorMessage.addEventListener("click", openModal);
  closeMayorMessage.addEventListener("click", closeModal);

  mayorModal.addEventListener("click", function (event) {
    if (event.target === mayorModal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mayorModal.classList.contains("is-open")) {
      closeModal();
    }
  });

  faqItems.forEach(function (item) {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    button.addEventListener("click", function () {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach(function (otherItem) {
        const otherButton = otherItem.querySelector(".faq-question");
        const otherAnswer = otherItem.querySelector(".faq-answer");

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
      link.classList.toggle("is-active", href === "#" + currentSectionId);
    });
  }

  function toggleBackToTop() {
    const shouldShow = window.scrollY > 500;
    backToTop.classList.toggle("is-visible", shouldShow);
  }

  window.addEventListener("scroll", function () {
    setActiveNavLink();
    toggleBackToTop();
  });

  setActiveNavLink();
  toggleBackToTop();

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function showStatus(message, isError) {
    formStatus.textContent = message;
    formStatus.classList.add("is-visible");
    formStatus.style.background = isError
      ? "rgba(194, 44, 59, 0.10)"
      : "rgba(13, 143, 98, 0.10)";
    formStatus.style.color = isError ? "#b32334" : "#0d8f62";
  }

  inquiryForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const contactNumber = document.getElementById("contactNumber").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!fullName || !email || !subject || !message) {
      showStatus("Please complete the required fields before sending your inquiry.", true);
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
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(bodyLines.join("\n"));

    showStatus("Your email app is opening with your prepared inquiry. Review it, then click send.", false);

    window.location.href = mailtoLink;
  });
})();