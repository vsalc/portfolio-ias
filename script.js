// Smooth scroll for in-page anchor links, offset by the navbar height.
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const navHeight = document.querySelector(".navbar")?.offsetHeight ?? 0;
    window.scrollTo({
      top: target.offsetTop - navHeight,
      behavior: "smooth",
    });
  });
});

// Scroll-spy: highlight the nav link for the section currently in view.
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");
const navbar = document.querySelector(".navbar");

const onScroll = () => {
  const navHeight = navbar?.offsetHeight ?? 0;

  // Active section
  let current = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - navHeight - 100) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`,
    );
  });

  // Stronger navbar shadow once scrolled past the hero edge
  navbar?.classList.toggle("scrolled", window.scrollY > 50);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Resume download: fetch as a blob to force a custom filename,
// falling back to direct navigation on error.
const resumeBtn = document.getElementById("resumeBtn");
if (resumeBtn) {
  resumeBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/files/resume.pdf");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "salcedo-isabella-resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.location.href = "/files/resume.pdf";
    }
  });
}

// Reveal-on-scroll for work cards and experience items.
// CSS handles the hidden/visible states; honor reduced-motion by skipping.
const revealEls = document.querySelectorAll(".work-card, .experience-item");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("reveal", "is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
  );

  revealEls.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}
