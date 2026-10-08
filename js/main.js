/**
 * Channel IT - Main JavaScript
 */
document.addEventListener('DOMContentLoaded', function () {

  // 1. Navbar scroll effect
  var navbar = document.querySelector('#mainNavbar') || document.querySelector('.navbar');
  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll();

  // 2. Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      var navbarHeight = navbar ? navbar.offsetHeight : 0;
      window.scrollTo({
        top: targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight,
        behavior: 'smooth'
      });
    });
  });

  // 3. Back to top button
  var backToTopBtn = document.querySelector('.back-to-top');
  function handleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', handleBackToTop);
  handleBackToTop();
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Counter animation (supports both .counter[data-target] and .stat-number[data-count])
  var counters = document.querySelectorAll('.counter[data-target], .stat-number[data-count]');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target') || el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var duration = 2000;
    var startTime = performance.now();
    function step(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      var easedProgress = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(easedProgress * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(step);
  }
  if (counters.length > 0) {
    var counterObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(function (counter) { counterObserver.observe(counter); });
  }

  // 5. Portfolio filtering
  var filterButtons = document.querySelectorAll('.portfolio-filter-btn');
  var portfolioItems = document.querySelectorAll('.portfolio-item');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      var filterValue = this.getAttribute('data-filter');
      portfolioItems.forEach(function (item) {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.opacity = '0';
          item.style.display = '';
          void item.offsetWidth;
          item.style.transition = 'opacity 0.4s ease';
          item.style.opacity = '1';
        } else {
          item.style.transition = 'opacity 0.3s ease';
          item.style.opacity = '0';
          setTimeout(function () { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // 6. FAQ tab filtering
  var faqTabs = document.querySelectorAll('.faq-tab-btn');
  var faqItems = document.querySelectorAll('.faq-item');
  faqTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      faqTabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
      var category = this.getAttribute('data-category');
      faqItems.forEach(function (item) {
        item.style.display = (category === 'all' || item.getAttribute('data-category') === category) ? '' : 'none';
      });
    });
  });

  // 7. Contact form validation
  var contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      var isValid = true;
      contactForm.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
      contactForm.querySelectorAll('.form-error').forEach(function (el) { el.remove(); });

      var nameField = contactForm.querySelector('[name="name"]');
      if (nameField && nameField.value.trim().length < 2) { isValid = false; markInvalid(nameField, 'Please enter your name.'); }

      var emailField = contactForm.querySelector('[name="email"]');
      if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) { isValid = false; markInvalid(emailField, 'Please enter a valid email.'); }

      var messageField = contactForm.querySelector('[name="message"]');
      if (messageField && messageField.value.trim().length < 10) { isValid = false; markInvalid(messageField, 'Message must be at least 10 characters.'); }

      if (!isValid) {
        e.preventDefault();
        var firstError = contactForm.querySelector('.is-invalid');
        if (firstError) { firstError.focus(); firstError.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }
    });

    function markInvalid(field, message) {
      field.classList.add('is-invalid');
      var errorEl = document.createElement('div');
      errorEl.className = 'form-error text-danger';
      errorEl.style.fontSize = '0.85rem';
      errorEl.style.marginTop = '0.25rem';
      errorEl.textContent = message;
      field.parentNode.insertBefore(errorEl, field.nextSibling);
    }

    contactForm.addEventListener('input', function (e) {
      if (e.target.classList.contains('is-invalid')) {
        e.target.classList.remove('is-invalid');
        var errorMsg = e.target.parentNode.querySelector('.form-error');
        if (errorMsg) errorMsg.remove();
      }
    });
  }

  // 8. Active nav link based on current page
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var linkFile = href.split('/').pop().split('#')[0].split('?')[0];
    if (linkFile === currentPath) {
      link.classList.add('active');
    }
  });

  // 9. Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 80,
      easing: 'ease-out-cubic'
    });
  }

  // 10. Mobile menu close on link click
  var navbarCollapse = document.querySelector('.navbar-collapse');
  if (navbarCollapse) {
    document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navbarCollapse.classList.contains('show')) {
          var bsCollapse = (typeof bootstrap !== 'undefined' && bootstrap.Collapse)
            ? bootstrap.Collapse.getInstance(navbarCollapse) : null;
          if (bsCollapse) { bsCollapse.hide(); } else { navbarCollapse.classList.remove('show'); }
        }
      });
    });
  }
});
