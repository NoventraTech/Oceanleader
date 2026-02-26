/**
 * Ocean Leader Shipping & Logistics - Main JavaScript
 * Production-Ready Multi-Device Responsive Site
 */

// ============================================================================
// AOS & SWIPER INITIALIZATION
// ============================================================================
(function() {
  'use strict';
  
  // Initialize AOS (Animate On Scroll) with optimized settings
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic',
      disable: window.innerWidth < 768 ? 'mobile' : false
    });
  }

  // Initialize Swiper for testimonials
  if (typeof Swiper !== 'undefined') {
    new Swiper('.swiper-testi', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 5500,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }
})();

// ============================================================================
// NAVIGATION & SCROLL HANDLING
// ============================================================================
(function() {
  'use strict';
  
  const nav = document.getElementById('mainNav');
  const stb = document.getElementById('stb');
  
  if (!nav) return;
  
  // Throttle scroll events for better performance
  let scrollTimeout;
  let lastScrollTime = 0;
  
  function handleScroll() {
    const now = Date.now();
    const elapsed = now - lastScrollTime;
    
    if (elapsed > 10) {
      lastScrollTime = now;
      
      const scrollY = window.scrollY;
      
      // Update nav background on scroll
      nav.classList.toggle('scrolled', scrollY > 80);
      
      // Show/hide back-to-top button
      if (stb) {
        stb.classList.toggle('show', scrollY > 400);
      }
      
      // Update active nav link based on scroll position
      updateActiveNavLink(scrollY);
    }
    
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(handleScroll, 10);
  }
  
  function updateActiveNavLink(scrollY) {
    const secs = document.querySelectorAll('section[id]');
    let currentSection = '';
    
    secs.forEach(section => {
      if (scrollY >= section.offsetTop - 130) {
        currentSection = section.id;
      }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentSection);
    });
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initial call
  handleScroll();
})();

// ============================================================================
// MOBILE MENU TOGGLE
// ============================================================================
function toggleMenu() {
  'use strict';
  const mobileMenu = document.getElementById('mob');
  const hamburger = document.getElementById('ham');
  
  if (!mobileMenu || !hamburger) return;
  
  mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
  
  // Toggle body overflow
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  
  // Close menu on escape key
  if (mobileMenu.classList.contains('open')) {
    document.addEventListener('keydown', handleEscapeKey);
  } else {
    document.removeEventListener('keydown', handleEscapeKey);
  }
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    toggleMenu();
  }
}

// ============================================================================
// FORM HANDLING
// ============================================================================
function handleForm(event) {
  'use strict';
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = form.querySelector('.form-submit');
  const formOk = document.getElementById('fok');
  
  if (!submitBtn || !formOk) return;
  
  // Disable button and show loading state
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;
  
  // Simulate form submission (replace with actual backend call)
  setTimeout(() => {
    // Show success message
    formOk.classList.add('show');
    
    // Reset form
    form.reset();
    
    // Restore button
    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      formOk.classList.remove('show');
    }, 5000);
    
    // Optional: Scroll to success message
    formOk.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 1500);
  
  // Here you would typically send data to your backend:
  /*
  const formData = new FormData(form);
  fetch('/api/contact', {
    method: 'POST',
    body: formData,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
  .then(response => response.json())
  .then(data => {
    formOk.classList.add('show');
    form.reset();
    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
  })
  .catch(error => {
    console.error('Form submission error:', error);
    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
  });
  */
}

// ============================================================================
// ANIMATED NUMBER COUNTER
// ============================================================================
function animNum(el, targetValue) {
  'use strict';
  if (!el) return;
  
  const duration = 2000;
  const stepSize = targetValue / (duration / 16);
  let currentValue = 0;
  
  const animationInterval = setInterval(() => {
    currentValue += stepSize;
    
    if (currentValue >= targetValue) {
      currentValue = targetValue;
      clearInterval(animationInterval);
    }
    
    el.textContent = Math.round(currentValue);
  }, 16);
}

// ============================================================================
// STATS SECTION INTERSECTION OBSERVER
// ============================================================================
(function() {
  'use strict';
  
  const statsSection = document.querySelector('.stats-strip');
  if (!statsSection) return;
  
  const observerOptions = {
    threshold: 0.4
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate all stat counters
        animNum(document.getElementById('s1'), 15);
        animNum(document.getElementById('s2'), 500);
        animNum(document.getElementById('s3'), 50);
        animNum(document.getElementById('s4'), 30);
        
        // Disconnect observer after first trigger
        observer.disconnect();
      }
    });
  }, observerOptions);
  
  observer.observe(statsSection);
})();

// ============================================================================
// SERVICE WORKER REGISTRATION (PWA Support)
// ============================================================================
(function() {
  'use strict';
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
      });
    });
  }
})();

// ============================================================================
// LAZY LOADING OPTIMIZATION
// ============================================================================
(function() {
  'use strict';
  
  if ('IntersectionObserver' in window) {
    const imageElements = document.querySelectorAll('img[loading="lazy"]');
    
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.removeAttribute('loading');
          observer.unobserve(img);
        }
      });
    });
    
    imageElements.forEach(img => lazyImageObserver.observe(img));
  }
})();

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================
(function() {
  'use strict';
  
  // Log performance metrics in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
      if (performance && performance.timing) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page Load Time: ${loadTime}ms`);
      }
    });
  }
})();

// ============================================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================================
(function() {
  'use strict';
  
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;
    
    const href = target.getAttribute('href');
    if (href === '#') return;
    
    const element = document.querySelector(href);
    if (!element) return;
    
    e.preventDefault();
    
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mob');
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      toggleMenu();
    }
    
    // Smooth scroll with offset for fixed nav
    const navHeight = document.getElementById('mainNav')?.offsetHeight || 0;
    const targetPosition = element.offsetTop - navHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
})();

// ============================================================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================================================
(function() {
  'use strict';
  
  // Add keyboard navigation support
  document.addEventListener('keydown', (e) => {
    // Skip navigation (press 's' for skip link)
    if (e.key === 's' || e.key === 'S') {
      const main = document.querySelector('main') || document.querySelector('section');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
      }
    }
  });
  
  // Enhance form validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        input.classList.add('error');
      });
      
      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
    });
  });
})();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
  let isThrottled = false;
  return function(...args) {
    if (!isThrottled) {
      func.apply(this, args);
      isThrottled = true;
      setTimeout(() => isThrottled = false, limit);
    }
  };
}

/**
 * Check if element is visible in viewport
 */
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ============================================================================
// READY STATE
// ============================================================================
(function() {
  'use strict';
  
  // Fire custom ready event
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.dispatchEvent(new CustomEvent('appReady'));
    });
  } else {
    window.dispatchEvent(new CustomEvent('appReady'));
  }
})();

console.log('🚢 Ocean Leader Shipping & Logistics - Site Loaded Successfully');
