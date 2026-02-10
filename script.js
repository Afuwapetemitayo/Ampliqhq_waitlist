// Scroll Reveal Animation
const reveal = () => {
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach((el) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < windowHeight - elementVisible) {
      el.classList.add("active");
    }
  });
};
window.addEventListener("scroll", reveal);
window.onload = reveal;

// Hamburger Menu Toggle
const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("active");
    mobileMenu.classList.toggle("hidden");
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburgerBtn.classList.remove("active");
      mobileMenu.classList.add("hidden");
    });
  });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// --- DUAL SUBMISSION (GOOGLE SHEETS + FORMSPREE) ---
// IMPORTANT: Ensure your Google Sheet has a column header named "name" and "email"
const googleScriptURL =
  "https://script.google.com/macros/s/AKfycbwfdWCcF0EQv3EIAd_SfYgWh8KFm8HNF2IzINWFWZ2UkRClhGlYpvBPi92YSlTe3uJR/exec";
const form = document.getElementById("my-form");
const status = document.getElementById("my-form-status");
const button = document.getElementById("my-form-button");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    button.innerHTML = "Submitting...";
    button.disabled = true;
    status.innerHTML = "";

    const formData = new FormData(form);

    // 1. Send to Google Sheets first
    fetch(googleScriptURL, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        // 2. After Google Sheet attempt, send to Formspree
        return fetch(form.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });
      })
      .then((response) => {
        if (response.ok) {
          status.innerHTML =
            "<span class='text-indigo-400 font-semibold'>Success! Redirecting...</span>";
          setTimeout(() => {
            window.location.href = "./thank-you.html";
          }, 1500);
        } else {
          response.json().then((data) => {
            if (Object.hasOwn(data, "errors")) {
              status.innerHTML =
                "<span class='text-red-400'>" +
                data["errors"].map((error) => error["message"]).join(", ") +
                "</span>";
            } else {
              status.innerHTML =
                "<span class='text-red-400'>Problem submitting to Formspree.</span>";
            }
            button.innerHTML = "Join the Waitlist";
            button.disabled = false;
          });
        }
      })
      .catch((error) => {
        button.innerHTML = "Join the Waitlist";
        button.disabled = false;
        status.innerHTML =
          "<span class='text-red-400'>Submission error. Please try again.</span>";
        console.error("Error!", error.message);
      });
  });
}
