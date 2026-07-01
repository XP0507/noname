(function () {
  const carousel = document.querySelector(".hero-carousel");
  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
  const dots = Array.from(carousel.querySelectorAll(".hero-dots span"));
  if (slides.length <= 1) {
    return;
  }

  const intervalMs = 3500;
  let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
  let timer = null;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  function nextSlide() {
    showSlide(current + 1);
  }

  function start() {
    window.clearInterval(timer);
    timer = window.setInterval(nextSlide, intervalMs);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      start();
    });
  });

  carousel.addEventListener("mouseenter", () => window.clearInterval(timer));
  carousel.addEventListener("mouseleave", start);

  showSlide(current);
  start();
})();
