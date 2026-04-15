// MyCozyTrove - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  console.log('MyCozyTrove loaded');

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      var isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.querySelector('.nav-toggle-icon').textContent = isOpen ? '✕' : '☰';
    });
  }

  // Smooth scrolling to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Track affiliate link clicks
  document.querySelectorAll('a[rel*="sponsored"]').forEach(link => {
    link.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          'event_category': 'affiliate_link',
          'event_label': this.href
        });
      }
    });
  });
});
