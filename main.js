// script.js
// Прелоадер
(function () {
  const preloader = document.getElementById("preloader");
  let done = false;

  // Проверяем, если страница уже загружена
  if (document.readyState === 'complete') {
    preloader.classList.add("hidden");
    return;
  }

  window.addEventListener("load", () => {
    if (done) return;
    done = true;
    setTimeout(() => {
      preloader.classList.add("hidden");
    }, 1000);
  });

  // safety timeout
  setTimeout(() => {
    if (!done) {
      done = true;
      preloader.classList.add("hidden");
    }
  }, 4000);
})();

// Плавный скролл к якорям
document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-scroll-to]");
  if (!target) return;
  const id = target.getAttribute("data-scroll-to");
  const el = document.querySelector(id);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// Таймер обратного отсчёта
(function () {
  const targetDate = new Date("2025-12-26T18:00:00+03:00").getTime();

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateTimer() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("days").textContent = pad(days);
    document.getElementById("hours").textContent = pad(hours);
    document.getElementById("minutes").textContent = pad(minutes);
    document.getElementById("seconds").textContent = pad(seconds);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
})();

// Снежинки (поверх всего) с адаптацией для мобильных
(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  const canvas = document.getElementById("snow-canvas");
  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  let flakes = [];
  let frameId;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createFlakes() {
    // АДАПТАЦИЯ ДЛЯ МОБИЛЬНЫХ: 
    // На десктопе - нормальное количество, на мобильных - в 2 раза меньше
    // для снижения нагрузки и визуального шума
    const isMobile = window.innerWidth <= 767;
    const base = (width * height) / (isMobile ? 44000 : 22000); // В 2 раза меньше на мобильных
    const count = Math.min(isMobile ? 100 : 200, Math.max(isMobile ? 40 : 80, base));
    
    flakes = [];
    for (let i = 0; i < count; i++) {
      const layer = Math.random();
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.9 + layer * 2.2,
        vy: 0.7 + layer * 1,
        vx: -0.25 + Math.random() * 0.5,
        drift: 0.35 + layer * 0.8,
        opacity: 0.6 + layer * 0.4,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const f of flakes) {
      ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }

    update();
  }

  function update() {
    for (const f of flakes) {
      f.y += f.vy;
      f.x += f.vx + Math.sin(f.y * 0.01) * f.drift;

      if (f.y > height + 10) {
        f.y = -10;
        f.x = Math.random() * width;
      }
      if (f.x > width + 10) f.x = -10;
      if (f.x < -10) f.x = width + 10;
    }
  }

  function loop() {
    frameId = requestAnimationFrame(loop);
    draw();
  }

  resize();
  createFlakes();
  loop();

  window.addEventListener("resize", () => {
    resize();
    createFlakes(); // Пересоздаем снежинки при изменении размера окна
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
    } else {
      loop();
    }
  });
})();

// Lightbox для галереи изображений
(function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const galleryItems = document.querySelectorAll(".gallery-image");

  // Функция открытия lightbox
  function openLightbox(imageNumber) {
    // Устанавливаем соответствующий градиент для выбранного изображения
    const gradients = {
      1: "linear-gradient(135deg, rgba(168, 216, 234, 0.9), rgba(212, 175, 55, 0.8))",
      2: "linear-gradient(135deg, rgba(255, 150, 100, 0.9), rgba(100, 200, 255, 0.8))",
      3: "linear-gradient(135deg, rgba(200, 150, 100, 0.9), rgba(100, 150, 150, 0.8))"
    };

    lightboxImage.style.background = gradients[imageNumber] || gradients[1];
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden"; // Блокируем скролл страницы
  }

  // Функция закрытия lightbox
  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = ""; // Восстанавливаем скролл
  }

  // Добавляем обработчики кликов на изображения галереи
  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      const imageNumber = item.getAttribute("data-image");
      openLightbox(imageNumber);
    });

    // Поддержка тапов на мобильных устройствах
    item.addEventListener("touchend", (e) => {
      e.preventDefault();
      const imageNumber = item.getAttribute("data-image");
      openLightbox(imageNumber);
    });
  });

  // Закрытие по клику на overlay
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-overlay")) {
      closeLightbox();
    }
  });

  // Закрытие по кнопке
  lightboxClose.addEventListener("click", closeLightbox);

  // Закрытие по клавише Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
})();

// Плавное появление элементов при скролле
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  });

  document.querySelectorAll(".atmosphere-card, .detail-card, .gallery-item").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
    observer.observe(el);
  });
})();