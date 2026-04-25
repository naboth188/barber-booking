// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('active');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('active');
}
mobileClose.addEventListener('click', closeMobile);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = eased * target;
        el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
        if (progress < 1) requestAnimationFrame(animate);
        else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString() + '+';
      };
      requestAnimationFrame(animate);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => countObserver.observe(c));

// ===== LIGHTBOX =====
function openLightbox(el) {
  const img = el.querySelector('img');
  document.getElementById('lightboxImg').src = img.src;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ===== BOOKING FORM =====
async function submitBooking(e) {
  e.preventDefault();
  const form = document.getElementById('bookingForm');
  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('bookingSuccess');

  btn.textContent = 'SENDING...';
  btn.disabled = true;
  btn.style.opacity = '0.6';

  try {
    const formData = new FormData(form);
    // Replace with barber's email
    const response = await fetch('https://formsubmit.co/ajax/your-email@gmail.com', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();

    if (data.success === 'true' || data.success === true || response.ok) {
      success.textContent = '✦ Locked in. We\'ll text you to confirm your time. See you in the chair.';
      success.style.display = 'block';
      form.reset();
    } else {
      success.textContent = '✦ Something went wrong. Call or text us directly to book.';
      success.style.background = 'var(--gold-dim)';
      success.style.display = 'block';
    }
  } catch (err) {
    success.textContent = '✦ Something went wrong. Call or text us directly to book.';
    success.style.background = 'var(--gold-dim)';
    success.style.display = 'block';
  }

  btn.textContent = 'BOOK APPOINTMENT →';
  btn.disabled = false;
  btn.style.opacity = '1';
  setTimeout(() => success.style.display = 'none', 8000);
}

// Set min date to today
const dateInput = document.getElementById('bookDate');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}
