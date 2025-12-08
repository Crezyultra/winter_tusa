/**
 * Peer To Peer - Зимняя встреча 2025
 * Основной JavaScript файл
 */

// ==================== ПРЕЛОАДЕР ====================
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const page = document.querySelector('.page');
  const MIN_DISPLAY_TIME = 1000; // Минимум 1 секунда показа прелоадера
  let startTime = Date.now();
  let isHidden = false;
  let hideTimeout = null;
  
  // Функция скрытия прелоадера с гарантией минимального времени
  function hidePreloader() {
    if (isHidden) return;
    
    // Вычисляем, сколько времени прошло с момента старта
    const elapsedTime = Date.now() - startTime;
    const timeLeft = Math.max(0, MIN_DISPLAY_TIME - elapsedTime);
    
    console.log(`Прошло времени: ${elapsedTime}мс, осталось ждать: ${timeLeft}мс`);
    
    // Если минимальное время уже прошло, скрываем сразу
    if (timeLeft <= 0) {
      performHide();
      return;
    }
    
    // Иначе ждем оставшееся время
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(performHide, timeLeft);
  }
  
  // Функция непосредственного скрытия прелоадера
  function performHide() {
    if (isHidden) return;
    
    isHidden = true;
    console.log('Скрываем прелоадер после минимальной задержки');
    
    // Добавляем класс для анимации исчезновения
    preloader.classList.add('hidden');
    
    // Показываем основной контент
    setTimeout(() => {
      page.style.opacity = '1';
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
      
      // Полностью удаляем прелоадер из DOM через 1 секунду
      setTimeout(() => {
        if (preloader && preloader.parentNode) {
          preloader.style.display = 'none';
        }
      }, 1000);
    }, 500);
  }
  
  // Начинаем отсчет времени с момента запуска скрипта
  startTime = Date.now();
  console.log('Прелоадер запущен в:', new Date(startTime).toISOString());
  
  // Событие когда DOM полностью загружен
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - страница загружена');
    
    // Не скрываем сразу, а используем hidePreloader который учтет минимальное время
    hidePreloader();
  });
  
  // Событие когда все ресурсы загружены
  window.addEventListener('load', () => {
    console.log('window.load - все ресурсы загружены');
    
    // Не скрываем сразу, а используем hidePreloader который учтет минимальное время
    hidePreloader();
  });
  
  // Безопасный таймаут - всегда скрываем через 4 секунды, даже если что-то пошло не так
  setTimeout(() => {
    if (!isHidden) {
      console.log('Safety timeout - скрываем прелоадер через 4 секунды');
      performHide();
    }
  }, 4000);
  
  // Проверка если страница уже загружена (например, при кэшировании)
  if (document.readyState === 'complete') {
    console.log('Страница уже загружена (readyState = complete)');
    // Даем минимум 1 секунду на показ прелоадера
    setTimeout(hidePreloader, 1000);
  }
})();

// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
const SCROLL_OFFSET = 80; // Отступ для скролла к якорям

// ==================== ПЛАВНЫЙ СКРОЛЛ ====================
(function initSmoothScroll() {
  document.addEventListener('click', function(e) {
    // Проверяем клик по элементу с data-scroll-to
    const scrollTarget = e.target.closest('[data-scroll-to]');
    if (!scrollTarget) return;
    
    e.preventDefault();
    
    const targetId = scrollTarget.getAttribute('data-scroll-to');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerHeight = document.querySelector('.site-header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Обновляем URL без перезагрузки страницы
      history.pushState(null, null, targetId);
    }
  });
})();

// ==================== ТАЙМЕР ОБРАТНОГО ОТСЧЕТА ====================
(function initCountdown() {
  const targetDate = new Date('2025-12-26T19:00:00+03:00').getTime();
  const daysElement = document.getElementById('days');
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');
  
  // Форматирование чисел (добавление нуля)
  function padNumber(num) {
    return num.toString().padStart(2, '0');
  }
  
  // Обновление таймера
  function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = targetDate - now;
    
    // Если время истекло
    if (timeLeft < 0) {
      daysElement.textContent = '00';
      hoursElement.textContent = '00';
      minutesElement.textContent = '00';
      secondsElement.textContent = '00';
      return;
    }
    
    // Расчет дней, часов, минут, секунд
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // Обновление элементов
    daysElement.textContent = padNumber(days);
    hoursElement.textContent = padNumber(hours);
    minutesElement.textContent = padNumber(minutes);
    secondsElement.textContent = padNumber(seconds);
  }
  
  // Запуск таймера
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
  
  // Остановка таймера при уходе со страницы для экономии ресурсов
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(countdownInterval);
    } else {
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
  });
})();

// ==================== АНИМАЦИЯ СНЕЖИНОК ====================
(function initSnowflakes() {
  // Проверяем, не отключена ли анимация в системе
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  let snowflakes = [];
  let animationId = null;
  
  // Настройка размеров canvas
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    
    // Для retina дисплеев
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  
  // Создание снежинок
  function createSnowflakes() {
    const isMobile = width <= 768;
    const count = isMobile ? Math.floor(width * height / 6000) : Math.floor(width * height / 4000);
    
    snowflakes = [];
    
    for (let i = 0; i < count; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        wind: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.5,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.05 + 0.02
      });
    }
  }
  
  // Рисование снежинок
  function drawSnowflakes() {
    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    for (const flake of snowflakes) {
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.globalAlpha = flake.opacity;
      ctx.fill();
    }
  }
  
  // Обновление позиций снежинок
  function updateSnowflakes() {
    for (const flake of snowflakes) {
      // Движение вниз
      flake.y += flake.speed;
      
      // Движение в сторону
      flake.x += flake.wind + Math.sin(flake.swing) * 0.5;
      flake.swing += flake.swingSpeed;
      
      // Если снежинка ушла за нижнюю границу
      if (flake.y > height + 10) {
        flake.y = -10;
        flake.x = Math.random() * width;
      }
      
      // Если снежинка ушла за боковые границы
      if (flake.x > width + 10) flake.x = -10;
      if (flake.x < -10) flake.x = width + 10;
    }
  }
  
  // Главный цикл анимации
  function animate() {
    drawSnowflakes();
    updateSnowflakes();
    animationId = requestAnimationFrame(animate);
  }
  
  // Инициализация
  function init() {
    resizeCanvas();
    createSnowflakes();
    animate();
  }
  
  // Запуск после загрузки страницы
  window.addEventListener('load', () => {
    setTimeout(init, 1000);
  });
  
  // Обработка изменения размеров окна
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      createSnowflakes();
    }, 250);
  });
  
  // Оптимизация при скрытии вкладки
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
})();

// ==================== ГАЛЕРЕЯ ТОВАРОВ ====================
(function initProductGallery() {
  const modal = document.getElementById('productModal');
  const modalSlides = modal?.querySelector('.product-modal-slides');
  const modalClose = modal?.querySelector('.product-modal-close');
  const modalOverlay = modal?.querySelector('.product-modal-overlay');
  const prevBtn = modal?.querySelector('.product-modal-prev');
  const nextBtn = modal?.querySelector('.product-modal-next');
  const currentSlideEl = modal?.querySelector('.current-slide');
  const totalSlidesEl = modal?.querySelector('.total-slides');
  
  // Проверяем, есть ли необходимые элементы
  if (!modal || !modalSlides || !modalClose || !modalOverlay) {
    console.warn('Product gallery elements not found');
    return;
  }
  
  let currentSlide = 0;
  let totalSlides = 0;
  let slides = [];
  let imagesData = [];
  let touchStartX = 0;
  let touchEndX = 0;
  let lastFocusedElement = null;
  
  // Создание слайда
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
  
  // Открытие модального окна
  function openModal(images, productId) {
    // Сохраняем элемент, который был в фокусе
    lastFocusedElement = document.activeElement;
    
    imagesData = images;
    totalSlides = images.length;
    currentSlide = 0;
    
    // Обновляем счетчик
    currentSlideEl.textContent = '1';
    totalSlidesEl.textContent = totalSlides;
    
    // Очищаем и создаем слайды
    modalSlides.innerHTML = '';
    slides = [];
    
    images.forEach((src, index) => {
      const slide = createSlide(src, index);
      modalSlides.appendChild(slide);
      slides.push(slide);
    });
    
    // Показываем первый слайд
    updateSlides();
    
    // Открываем модальное окно
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Фокусируем на кнопке закрытия
    setTimeout(() => modalClose.focus(), 100);
  }
  
  // Обновление слайдов
  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });
    
    currentSlideEl.textContent = currentSlide + 1;
    
    // Обновляем состояние кнопок
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
  }
  
  // Переход к слайду
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentSlide = index;
    updateSlides();
  }
  
  // Закрытие модального окна - ИСПРАВЛЕННАЯ ВЕРСИЯ
  function closeModal() {
    // Убираем фокус с любого элемента внутри модалки, который может быть в фокусе
    const focusedElement = modal.querySelector(':focus');
    if (focusedElement) {
      focusedElement.blur();
    }
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Возвращаем фокус на элемент, который открыл модалку
    if (lastFocusedElement) {
      setTimeout(() => {
        lastFocusedElement.focus();
      }, 10);
    }
    
    // Очищаем данные
    slides = [];
    imagesData = [];
  }
  
  // Навигация
  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }
  
  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  }
  
  // Swipe для мобильных
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
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }
  
  // Обработчики событий для карточек товаров
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
      console.error('Error loading product data:', error);
    }
  });
  
  // Обработчики модального окна
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  
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
        prevSlide();
        break;
      case 'ArrowRight':
        nextSlide();
        break;
    }
  });
  
  // Оптимизация при ресайзе
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (modal.classList.contains('active')) {
        updateSlides();
      }
    }, 250);
  });
  
  // Fix for Safari - убеждаемся, что модалка правильно скрыта при загрузке
  window.addEventListener('load', () => {
  modal.setAttribute('aria-hidden', 'true');
  // Убираем установку display: none, так как модалка уже скрыта через CSS
});
})();

// ==================== АНИМАЦИЯ ПРИ СКРОЛЛЕ ====================
(function initScrollAnimations() {
  // Проверяем поддержку Intersection Observer
  if (!('IntersectionObserver' in window)) {
    // Fallback для старых браузеров
    const animateElements = () => {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.8;
        if (isVisible) {
          el.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', animateElements);
    window.addEventListener('load', animateElements);
    animateElements();
    return;
  }
  
  // Создаем observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  // Наблюдаем за элементами
  const animatedElements = document.querySelectorAll(
    '.atmosphere-card, .detail-card, .gallery-item, .product-card, .section-title, .section-subtitle, .section-text'
  );
  
  animatedElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
})();

// ==================== ФИКСИРОВАННЫЙ ХЕДЕР ====================
(function initStickyHeader() {
  const header = document.querySelector('.site-header');
  let lastScrollTop = 0;
  
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Добавляем/удаляем класс при скролле
    if (scrollTop > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Скрываем/показываем хедер при скролле
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      // Скролл вниз
      header.style.transform = 'translateY(-100%)';
    } else {
      // Скролл вверх
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });
})();

// ==================== ОБРАБОТКА ОШИБОК ИЗОБРАЖЕНИЙ ====================
(function initImageErrorHandling() {
  // Заменяем битые изображения на заглушки
  document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
      console.warn('Image failed to load:', e.target.src);
      
      // Можно добавить заглушку для изображений
      // e.target.src = 'path/to/placeholder.jpg';
      
      // Или просто скрыть
      e.target.style.opacity = '0.5';
    }
  }, true);
  
  // Предзагрузка критических изображений
  function preloadCriticalImages() {
    const criticalImages = [
      './assets/img/logo.png',
      './assets/img/preloader.png'
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
  
  // Запускаем после полной загрузки
  window.addEventListener('load', preloadCriticalImages);
})();

// ==================== ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ ====================
(function initPerformanceOptimizations() {
  // Дебаунс для событий resize и scroll
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Оптимизация скролла
  window.addEventListener('scroll', debounce(() => {
    // Можно добавить логику для lazy loading
  }, 100));
  
  // Оптимизация ресайза
  window.addEventListener('resize', debounce(() => {
    // Обновляем позиции элементов
  }, 250));
})();

// ==================== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ====================
(function initOnLoad() {
  // Добавляем класс для body когда страница загружена
  document.body.classList.add('loaded');
  
  // Инициализация мобильного меню (если нужно)
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');
  
  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      });
    });
  }
  
  // Логирование успешной загрузки
  console.log('Peer To Peer Winter Meeting 2025 - Website loaded successfully');
})();

// ==================== ОБРАБОТЧИКИ ОШИБОК ====================
window.addEventListener('error', function(e) {
  console.error('JavaScript Error:', e.message, 'in', e.filename, 'line:', e.lineno);
  return true;
});

// ==================== СЛУЖЕБНЫЕ ФУНКЦИИ ====================
// Утилитарные функции могут быть добавлены здесь

// Экспорт для отладки (если нужно)
if (typeof window !== 'undefined') {
  window.P2PApp = {
    version: '1.0.0',
    initTime: new Date().toISOString()
  };
}