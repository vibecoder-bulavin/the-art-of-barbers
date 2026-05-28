(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  initHeader();
  initMobileMenu();
  initScrollReveal();
  initStatCounters();
  initReviews();
  initBookingModal();
  initHeroParallax();
})();

function initHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 48);
    header.classList.toggle("is-hidden", y > lastY && y > 200);
    lastY = y;
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  menu.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", () => setOpen(false));
  });
}

function initScrollReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  elements.forEach((el) => {
    const parent = el.parentElement;
    const siblings = parent ? [...parent.querySelectorAll(":scope > .reveal")] : [el];
    const index = siblings.indexOf(el);
    el.style.setProperty("--reveal-delay", `${Math.min(index, 6) * 90}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  elements.forEach((el) => observer.observe(el));
}

function initStatCounters() {
  const cards = document.querySelectorAll(".stat-card");
  if (!cards.length) return;

  const animate = (el, target, duration = 1400) => {
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        card.querySelectorAll("[data-count]").forEach((el) => {
          const target = Number(el.getAttribute("data-count"));
          if (!Number.isNaN(target)) animate(el, target);
        });
        observer.unobserve(card);
      });
    },
    { threshold: 0.4 }
  );

  cards.forEach((card) => observer.observe(card));
}

function initReviews() {
  const reviews = [
    {
      text: "Най-добрият барбершоп в града. Винаги перфектен fade, приятна атмосфера и професионално отношение. Препоръчвам на всеки, който цени качеството.",
      author: "— Алексей, постоянен клиент",
    },
    {
      text: "Ходя тук вече трета година. Майсторите знаят какво трябва — резултатът винаги е на висота. Истински луксозно изживяване.",
      author: "— Андрей, fade и брада",
    },
    {
      text: "Royal пакетът си заслужава. Стилен интериор, премиум сервиз и внимание към всеки детайл.",
      author: "— Максим, VIP клиент",
    },
  ];

  let index = 0;
  const textEl = document.getElementById("review-text");
  const authorEl = document.getElementById("review-author");
  const dots = document.querySelectorAll(".reviews__dots li");
  const prevBtn = document.querySelector(".reviews__arrow--prev");
  const nextBtn = document.querySelector(".reviews__arrow--next");

  if (!textEl || !authorEl) return;

  const show = (i, animate = true) => {
    index = (i + reviews.length) % reviews.length;

    const apply = () => {
      textEl.textContent = reviews[index].text;
      authorEl.textContent = reviews[index].author;
      dots.forEach((dot, n) => dot.classList.toggle("is-active", n === index));
    };

    if (!animate) {
      apply();
      return;
    }

    textEl.classList.add("is-fading");
    setTimeout(() => {
      apply();
      textEl.classList.remove("is-fading");
    }, 280);
  };

  show(0, false);
  prevBtn?.addEventListener("click", () => show(index - 1));
  nextBtn?.addEventListener("click", () => show(index + 1));

  let autoplay = setInterval(() => show(index + 1), 6000);
  const slider = document.querySelector(".reviews__slider");
  slider?.addEventListener("mouseenter", () => clearInterval(autoplay));
  slider?.addEventListener("mouseleave", () => {
    autoplay = setInterval(() => show(index + 1), 6000);
  });
}

function initBookingModal() {
  const modal = document.getElementById("booking-modal");
  const form = document.getElementById("booking-form");
  if (!modal) return;

  const open = () => {
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector("input")?.focus();
  };

  const close = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  document.querySelectorAll("[data-open-booking]").forEach((btn) => {
    btn.addEventListener("click", open);
  });

  document.querySelectorAll("[data-close-booking]").forEach((el) => {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = new FormData(form).get("name");
    alert(`Благодарим, ${name}! Вашият VIP запис е приет. Ще се обадим скоро.`);
    form.reset();
    close();
  });
}

function initHeroParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const frame = document.querySelector(".hero__frame");
  if (!frame) return;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y > window.innerHeight) return;
      frame.style.transform = `translateY(${y * 0.06}px)`;
    },
    { passive: true }
  );
}
