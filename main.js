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
  const targetDate = new Date("2025-12-26T19:00:00+03:00").getTime();

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

// ГАЛЕРЕЯ ТОВАРОВ
(function initProductGallery() {
  const modal = document.getElementById('productModal');
  const modalSlides = modal.querySelector('.product-modal-slides');
  const modalClose = modal.querySelector('.product-modal-close');
  const modalOverlay = modal.querySelector('.product-modal-overlay');
  const prevBtn = modal.querySelector('.product-modal-prev');
  const nextBtn = modal.querySelector('.product-modal-next');
  const currentSlideEl = modal.querySelector('.current-slide');
  const totalSlidesEl = modal.querySelector('.total-slides');
  
  let currentSlide = 0;
  let totalSlides = 0;
  let slides = [];
  let imagesData = [];
  
  // Функция создания слайда
  function createSlide(imgSrc, index) {
    const slide = document.createElement('div');
    slide.className = 'product-modal-slide';
    slide.dataset.index = index;
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `Изображение товара ${index + 1}`;
    img.loading = 'lazy';
    
    slide.appendChild(img);
    return slide;
  }
  
  // Функция открытия модалки
  function openModal(images, productId) {
    imagesData = images;
    totalSlides = images.length;
    currentSlide = 0;
    
    // Обновляем счетчик
    currentSlideEl.textContent = '1';
    totalSlidesEl.textContent = totalSlides;
    
    // Очищаем и создаем слайды
    modalSlides.innerHTML = '';
    slides = images.map((src, index) => {
      const slide = createSlide(src, index);
      modalSlides.appendChild(slide);
      return slide;
    });
    
    // Показываем первый слайд
    updateSlides();
    
    // Открываем модалку
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Фокусируем на кнопке закрытия для доступности
    setTimeout(() => modalClose.focus(), 100);
  }
  
  // Функция обновления слайдов
  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });
    
    currentSlideEl.textContent = currentSlide + 1;
    
    // Обновляем состояние кнопок
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
  }
  
  // Функция переключения слайда
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentSlide = index;
    updateSlides();
  }
  
  // Функция закрытия модалки
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    slides = [];
    imagesData = [];
  }
  
  // Обработчики навигации
  function handlePrev() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }
  
  function handleNext() {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  }
  
  // Swipe для мобильных
  let touchStartX = 0;
  let touchEndX = 0;
  
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }
  
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && currentSlide < totalSlides - 1) {
        // Свайп влево -> следующий слайд
        handleNext();
      } else if (diff < 0 && currentSlide > 0) {
        // Свайп вправо -> предыдущий слайд
        handlePrev();
      }
    }
  }
  
  // Добавляем обработчики на карточки товаров через делегирование
  document.addEventListener('click', (e) => {
    const productCard = e.target.closest('.product-card');
    if (!productCard) return;
    
    try {
      const images = JSON.parse(productCard.dataset.images || '[]');
      const productId = productCard.dataset.product;
      
      if (images.length > 0) {
        e.preventDefault();
        openModal(images, productId);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных товара:', error);
    }
  });
  
  // Обработчики для модалки
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', handlePrev);
  nextBtn.addEventListener('click', handleNext);
  
  // Swipe события
  modalSlides.addEventListener('touchstart', handleTouchStart, { passive: true });
  modalSlides.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  // Клавиатурная навигация
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    switch (e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        handlePrev();
        break;
      case 'ArrowRight':
        handleNext();
        break;
    }
  });
  
  // Дебаунс для ресайза
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Обновляем размеры модалки при ресайзе
      if (modal.classList.contains('active')) {
        updateSlides();
      }
    }, 250);
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

  document.querySelectorAll(".atmosphere-card, .detail-card, .gallery-item, .product-card").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
    observer.observe(el);
  });
})();
<<<<<<< HEAD

// Плавное появление карточек товаров с задержкой
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Добавляем задержку для каждой карточки
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100); // 100ms задержка между карточками
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.product-card').forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
    observer.observe(el);
  });
})();
=======
>>>>>>> 7b200dd53f5acb8cd2165c896331764316d91bfa
