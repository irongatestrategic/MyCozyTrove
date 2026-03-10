// MyCozyTrove - Main JavaScript

// Mobile menu toggle (if needed in future)
document.addEventListener('DOMContentLoaded', function() {
  console.log('MyCozyTrove loaded');
  
  // Add smooth scrolling to anchor links
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
