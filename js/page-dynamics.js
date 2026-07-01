(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initHeroMotion() {
    const hero = document.querySelector(".page-hero[data-hero-images]");
    if (!hero) return;

    const images = hero.dataset.heroImages
      .split(",")
      .map((image) => image.trim())
      .filter(Boolean);

    if (!images.length) return;

    let index = 0;
    hero.style.setProperty("--hero-image", `url("${images[index]}")`);
    hero.style.setProperty("--hero-glow-x", "48%");

    if (prefersReducedMotion || images.length === 1) return;

    window.setInterval(() => {
      index = (index + 1) % images.length;
      hero.style.setProperty("--hero-image", `url("${images[index]}")`);
      hero.style.setProperty("--hero-glow-x", `${36 + (index * 14) % 36}%`);
    }, 4200);
  }

  function initReveal() {
    const targets = document.querySelectorAll(
      ".catalog-card, .bundle-section, .compare-section, .article-card, .notice-grid article, .about-copy, .contact-panel, .motion-timeline article"
    );

    if (!targets.length) return;

    targets.forEach((target, index) => {
      target.classList.add("reveal-on-scroll");
      target.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    targets.forEach((target) => observer.observe(target));
  }

  function initProductFilter() {
    const toolbar = document.querySelector("[data-filter-group]");
    const cards = document.querySelectorAll(".catalog-card[data-category]");
    if (!toolbar || !cards.length) return;

    toolbar.addEventListener("click", (event) => {
      const link = event.target.closest("[data-filter]");
      if (!link) return;

      event.preventDefault();
      const filter = link.dataset.filter;

      toolbar.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");

      cards.forEach((card, index) => {
        const shouldShow = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-filtered-out", !shouldShow);
        card.classList.remove("filter-enter");
        if (shouldShow) {
          window.setTimeout(() => card.classList.add("filter-enter"), index * 35);
        }
      });

      const catalog = document.getElementById("all-products");
      if (catalog) {
        catalog.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      }
    });
  }

  function initNewsNav() {
    const nav = document.querySelector(".news-category-nav");
    const sections = document.querySelectorAll(".news-category[id]");
    if (!nav || !sections.length) return;

    const links = Array.from(nav.querySelectorAll("a[href^='#']"));

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      });
    });

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-35% 0px -50% 0px", threshold: 0.01 });

    sections.forEach((section) => observer.observe(section));
  }

  function initCountUp() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    const runCounter = (counter) => {
      const target = Number(counter.dataset.count);
      if (!Number.isFinite(target)) return;
      if (prefersReducedMotion) {
        counter.textContent = target;
        return;
      }

      let start = null;
      const duration = 1100;

      const tick = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        counter.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) window.requestAnimationFrame(tick);
      };

      window.requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.7 });

    counters.forEach((counter) => observer.observe(counter));
  }

  initHeroMotion();
  initReveal();
  initProductFilter();
  initNewsNav();
  initCountUp();
})();
