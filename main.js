// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

const setMobileNavOpen = (isOpen) => {
  mobileNav.classList.toggle('open', isOpen);
  burger.textContent = isOpen ? '✕' : '☰';
  burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  burger.setAttribute('aria-expanded', String(isOpen));
  mobileNav.setAttribute('aria-hidden', String(!isOpen));
  mobileNav.querySelectorAll('a').forEach(link => {
    link.tabIndex = isOpen ? 0 : -1;
  });
};

burger.addEventListener('click', () => {
  setMobileNavOpen(!mobileNav.classList.contains('open'));
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    setMobileNavOpen(false);
  });
});

// ===== SCROLL TO TOP =====
const scrollBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  scrollBtn.style.display = window.scrollY > 400 ? 'block' : 'none';
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== ANIMATED COUNTERS =====
const animateCounter = (el) => {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ===== FORM VALIDATION =====
const form = document.getElementById('contactForm');
const formError = document.getElementById('formError');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

   if (name.length < 2) {
    formError.textContent = 'Please enter your name.';
    document.getElementById('name').style.borderColor = '#f87171';
    return;
  }
  if (!email.includes('@')) {
    formError.textContent = 'Please enter a valid email.';
    document.getElementById('email').style.borderColor = '#f87171';
    return;
  }
  if (message.length < 10) {
    formError.textContent = 'Please tell us more about your project.';
    document.getElementById('message').style.borderColor = '#f87171';
    return;
  }

  submitBtn.innerHTML = 'Sending...';
  submitBtn.disabled = true;

  const response = await fetch('https://formspree.io/f/mgaevgzq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  });

  const defaultBtnHTML = 'Send message → <span class="btn-sub">Free audit included</span>';

  if (response.ok) {
    submitBtn.innerHTML = '✓ Sent! We\'ll reply within 24h. 🎉';
    submitBtn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
    form.reset();
    setTimeout(() => {
      submitBtn.innerHTML = defaultBtnHTML;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 4000);
  } else {
    formError.textContent = 'Something went wrong. Please try again.';
    submitBtn.innerHTML = defaultBtnHTML;
    submitBtn.disabled = false;
  }
});

// Reset border on input
['name', 'email', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    el.style.borderColor = '';
    formError.textContent = '';
  });
});

// ===== HEADER SCROLL SHADOW =====
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 20) {
    header.style.background = 'rgba(10, 10, 15, 0.98)';
  } else {
    header.style.background = 'rgba(10, 10, 15, 0.85)';
  }
});

//Lanugage

const langBtn = document.getElementById('langBtn');
const savedLang = localStorage.getItem('language');
let currentLang = savedLang || 'en';

const applyLanguage = (lang) => {
  document.documentElement.lang = lang;
  langBtn.textContent = lang === 'de' ? '🇬🇧 EN' : '🇩🇪 DE';
  langBtn.setAttribute('aria-label', lang === 'de' ? 'Switch language to English' : 'Switch language to German');
  document.querySelectorAll('[data-en]').forEach(el => {
    el.innerHTML = el.getAttribute(`data-${lang}`);
  });
};

// Always apply on load so the full text (not the placeholder shorthand
// written in the HTML) is what visitors actually see, in whichever
// language is active.
applyLanguage(currentLang);

langBtn.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'de' : 'en';
  applyLanguage(currentLang);
  localStorage.setItem('language', currentLang);
});

