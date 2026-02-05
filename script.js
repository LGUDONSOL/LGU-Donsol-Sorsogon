// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

// Close menu after clicking a link (mobile)
nav.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// Contact form: simple mailto fallback
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

// TODO: change to LGU’s real email
const LGU_EMAIL = "info@donsol.gov.ph";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !email || !message) {
    statusEl.textContent = "Please fill in all fields.";
    return;
  }

  statusEl.textContent = "Opening your email app…";

  const subject = encodeURIComponent(`LGU Website Inquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

  window.location.href = `mailto:${LGU_EMAIL}?subject=${subject}&body=${body}`;
});
