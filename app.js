// ========================================
// MERCURY AGENCY - ENHANCED SCRIPTS
// ========================================

const TELEGRAM_CONFIG = {
  BOT_TOKEN: '8365323652:AAEqEBYCJ4s4SZ6qbNIvlwLLYZFlm65884Y', // Замените на токен вашего бота
  CHAT_ID: '-1003687464665'                                    // Замените на ID чата/канала
};

// ========================================
// DOMContentLoaded - Инициализация всех модулей
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Initialize all modules
  initNavigation();
  initRevealAnimations();
  initCounters();
  initParallax();
  initSmoothScroll();
  initHoverEffects();
  initModal();
  initScrollDownButton();
  initTelegramForm();
  initInlineVideoPlayback(); // <-- Новая функция для инлайн-видео
});

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  // Navbar scroll effect
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu on link click
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// ========================================
// REVEAL ANIMATIONS
// ========================================
function initRevealAnimations() {
  // Hero animations on load
  const heroElements = document.querySelectorAll('.hero [data-reveal]');
  
  gsap.to(heroElements, {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    delay: 0.3
  });

  // Scroll reveal animations
  const revealElements = document.querySelectorAll('section:not(.hero) [data-reveal]');
  
  revealElements.forEach(el => {
    const revealType = el.dataset.reveal;
    const delay = parseFloat(el.dataset.delay) || 0;
    
    let fromVars = { opacity: 0 };
    
    switch(revealType) {
      case 'up':
        fromVars.y = 30;
        break;
      case 'left':
        fromVars.x = -30;
        break;
      case 'right':
        fromVars.x = 30;
        break;
      case 'scale':
        fromVars.scale = 0.9;
        break;
      case 'scale-x':
        fromVars.scaleX = 0;
        break;
    }

    gsap.fromTo(el, fromVars, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      scaleX: 1,
      duration: 0.8,
      ease: 'power3.out',
      delay: delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Stagger animations for grids
  const grids = document.querySelectorAll('.clients-grid, .works-grid');
  
  grids.forEach(grid => {
    const items = grid.querySelectorAll('[data-reveal]');
    
    gsap.fromTo(items, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Timeline steps animation
  const timelineSteps = document.querySelectorAll('.timeline-step');
  
  gsap.fromTo(timelineSteps,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.process-timeline',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );

  // Timeline line animation
  const timelineLine = document.querySelector('.timeline-line');
  if (timelineLine) {
    gsap.fromTo(timelineLine,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.process-timeline',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }
}

// ========================================
// COUNTERS
// ========================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const duration = 2000;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(counter, target, duration);
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

function animateCounter(element, target, duration) {
  const startTime = performance.now();
  const startValue = 0;
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
    
    element.textContent = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// ========================================
// PARALLAX EFFECTS
// ========================================
function initParallax() {
  // Background orbs parallax
  const orbs = document.querySelectorAll('.bg-orb');
  
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 20;
      const x = mouseX * speed;
      const y = mouseY * speed;
      
      gsap.to(orb, {
        x: x,
        y: y,
        duration: 1,
        ease: 'power2.out'
      });
    });
  });

  // Scroll parallax for hero visual
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    gsap.to(heroVisual, {
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// HOVER EFFECTS
// ========================================
function initHoverEffects() {
  // Add hover effects to interactive elements
  const interactiveElements = document.querySelectorAll(
    '.client-card, .work-item, .feature-item, .btn, .nav-cta, .cta-button, .timeline-step'
  );

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      // Add subtle scale effect
      gsap.to(el, {
        scale: 1.02,
        duration: 0.2,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    });
  });

  // Magnetic effect for buttons
  const magneticElements = document.querySelectorAll('.btn, .nav-cta, .cta-button');
  
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(el, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

// ========================================
// SCROLL DOWN BUTTON
// ========================================
function initScrollDownButton() {
  const scrollDownBtn = document.getElementById('scrollDownBtn');
  
  if (!scrollDownBtn) return;
  
  scrollDownBtn.addEventListener('click', () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const offsetTop = aboutSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
  
  // Скрывать кнопку при скролле вниз
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      scrollDownBtn.style.opacity = '0';
      scrollDownBtn.style.pointerEvents = 'none';
    } else {
      scrollDownBtn.style.opacity = '1';
      scrollDownBtn.style.pointerEvents = 'auto';
    }
    
    lastScrollY = currentScrollY;
  }, { passive: true });
}

// ========================================
// MODAL FUNCTIONALITY - ФОРМА ЗАЯВКИ
// ========================================
function initModal() {
  const fixedCtaBtn = document.getElementById('fixedCtaBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const telegramInput = document.getElementById('telegramUsername');
  const form = document.getElementById('telegramForm');

  if (!fixedCtaBtn || !modalOverlay) return;

  // Open modal
  fixedCtaBtn.addEventListener('click', () => {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus on input after animation
    setTimeout(() => {
      if (telegramInput) telegramInput.focus();
    }, 100);
  });

  // Close modal functions
  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    // Очищаем всю форму
    if (form) form.reset();
  };

  // Close on X button
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close on overlay click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

// ========================================
// TELEGRAM FORM - ОТПРАВКА В TELEGRAM
// ========================================
function initTelegramForm() {
  const form = document.getElementById('telegramForm');
  const submitBtn = document.getElementById('modalSubmit');
  
  if (!form) return;
  
  // Маска для телефона
  const phoneInput = document.getElementById('phoneNumber');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 0) {
        if (value[0] === '7' || value[0] === '8') {
          value = value.substring(1);
        }
        let formattedValue = '+7';
        if (value.length > 0) {
          formattedValue += ' (' + value.substring(0, 3);
        }
        if (value.length >= 3) {
          formattedValue += ') ' + value.substring(3, 6);
        }
        if (value.length >= 6) {
          formattedValue += '-' + value.substring(6, 8);
        }
        if (value.length >= 8) {
          formattedValue += '-' + value.substring(8, 10);
        }
        e.target.value = formattedValue;
      }
    });
  }
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usernameInput = document.getElementById('telegramUsername');
    const phoneInput = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('emailAddress');
    const projectInput = document.getElementById('projectInfo');
    
    const username = usernameInput.value.trim();
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const project = projectInput ? projectInput.value.trim() : '';
    
    if (!username) {
      showInputError(usernameInput, 'Введите username');
      return;
    }
    
    // Убираем @ если пользователь ввел его дважды
    const cleanUsername = username.replace(/^@+/, '');
    
    // Показываем состояние загрузки
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    
    try {
      // Отправляем в Telegram
      await sendToTelegram(cleanUsername, phone, email, project);
      
      // Показываем успешное уведомление
      showSuccessNotification();
      
      // Закрываем модальное окно
      const modalOverlay = document.getElementById('modalOverlay');
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      // Очищаем форму
      form.reset();
      
    } catch (error) {
      console.error('Ошибка отправки:', error);
      showInputError(usernameInput, 'Ошибка отправки. Попробуйте позже.');
    } finally {
      // Восстанавливаем кнопку
      submitBtn.innerHTML = originalBtnContent;
      submitBtn.disabled = false;
    }
  });
}

// Отправка сообщения в Telegram
async function sendToTelegram(username, phone = '', email = '', project = '') {
  const { BOT_TOKEN, CHAT_ID } = TELEGRAM_CONFIG;
  
  // Проверяем, что токен и chat_id установлены
  if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || CHAT_ID === 'YOUR_CHAT_ID_HERE') {
    console.warn('⚠️ Необходимо настроить TELEGRAM_CONFIG в app.js');
    // Для демо показываем успех даже без настройки
    return Promise.resolve();
  }
  
  let message = `
🚀 <b>Новая заявка с сайта Mercury Agency!</b>

👤 <b>Telegram:</b> @${username}
  `;
  
  if (phone) {
    message += `📞 <b>Телефон:</b> ${phone}\n`;
  }
  
  if (email) {
    message += `📧 <b>Email:</b> ${email}\n`;
  }
  
  if (project) {
    message += `\n📝 <b>О проекте:</b>\n${project}\n`;
  }
  
  message += `\n📅 <b>Дата:</b> ${new Date().toLocaleString('ru-RU')}
🌐 <b>Источник:</b> mercury-agency.com`;
  
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  
  return response.json();
}

// Показать ошибку ввода
function showInputError(input, message) {
  const wrapper = input.closest('.input-wrapper');
  
  // Добавляем стиль ошибки
  wrapper.style.borderColor = 'rgba(255, 100, 100, 0.5)';
  wrapper.style.background = 'rgba(255, 100, 100, 0.05)';
  
  // Можно добавить tooltip с ошибкой
  input.setAttribute('placeholder', message);
  
  // Убираем ошибку через 3 секунды
  setTimeout(() => {
    wrapper.style.borderColor = '';
    wrapper.style.background = '';
    input.setAttribute('placeholder', 'username');
  }, 3000);
}

// ========================================
// SUCCESS NOTIFICATION - УВЕДОМЛЕНИЕ ОБ УСПЕХЕ
// ========================================
function showSuccessNotification() {
  const notification = document.getElementById('successNotification');
  
  if (!notification) return;
  
  // Показываем уведомление
  notification.classList.add('show');
  
  // Скрываем через 5 секунд
  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
}

// ========================================
// INLINE VIDEO PLAYBACK (Воспроизведение прямо в карточке)
// ========================================
function initInlineVideoPlayback() {
  const workItems = document.querySelectorAll('.work-item[data-video]');
  
  workItems.forEach(item => {
    const video = item.querySelector('.work-video');
    if (!video) return;

    // Функция обновления состояния (добавление/удаление класса)
    const updatePlayState = () => {
      if (video.paused) {
        item.classList.remove('video-playing');
      } else {
        item.classList.add('video-playing');
      }
    };

    // При клике на карточку
    item.addEventListener('click', (e) => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      // Состояние обновится по событиям play/pause, но на всякий случай обновим сразу
      updatePlayState();
    });

    // Обновление иконки и класса при событиях
    video.addEventListener('play', () => {
      const playBtn = item.querySelector('.play-button i');
      if (playBtn) playBtn.classList.replace('fa-play', 'fa-pause');
      updatePlayState();
    });

    video.addEventListener('pause', () => {
      const playBtn = item.querySelector('.play-button i');
      if (playBtn) playBtn.classList.replace('fa-pause', 'fa-play');
      updatePlayState();
    });

    video.addEventListener('ended', () => {
      const playBtn = item.querySelector('.play-button i');
      if (playBtn) playBtn.classList.replace('fa-pause', 'fa-play');
      updatePlayState();
    });

    // Инициализация класса при загрузке (на случай, если видео уже было запущено где-то ещё)
    updatePlayState();
  });
}

// ========================================
// PREFERS REDUCED MOTION
// ========================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Disable complex animations for users who prefer reduced motion
  gsap.globalTimeline.timeScale(0);
  
  // Show all elements immediately
  document.querySelectorAll('[data-reveal]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}