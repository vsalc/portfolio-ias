// Resume download: fetch as a blob to force a custom filename,
// falling back to direct navigation on error. Guarded — only the CV
// page has the button.
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

// Reveal-on-scroll for works and experience entries.
// CSS owns the hidden/visible states; honor reduced-motion by skipping.
const revealEls = document.querySelectorAll(".work, .experience-item");
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
