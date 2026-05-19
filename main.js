/* ============================================
   CLICKICLICK MEDICAL — Main JS
   ============================================ */

(function () {
  'use strict';

  // ── Navigation scroll effect ──
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    nav.classList.toggle('nav--scrolled', scroll > 60);
    lastScroll = scroll;
  }, { passive: true });

  // ── Mobile menu ──
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ── Counter animation ──
  function animateCounters() {
    const counters = document.querySelectorAll('.hero__stat-number');
    counters.forEach(counter => {
      if (counter.dataset.animated) return;
      const target = parseInt(counter.dataset.target, 10);
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
          counter.dataset.animated = 'true';
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Run counters when hero is in view
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const heroProof = document.querySelector('.hero__proof');
  if (heroProof) heroObserver.observe(heroProof);

  // ── Scroll reveal ──
  const revealElements = document.querySelectorAll(
    '.problem__item, .solution__step, .service-card, .result-card, ' +
    '.process__step, .pricing-card, .faq__item, .contact__channel, ' +
    '.section-tag, .section-title, .section-desc'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Staggered reveal for grids ──
  const gridContainers = document.querySelectorAll(
    '.services__grid, .results__grid, .pricing__grid, .problem__list'
  );

  gridContainers.forEach(grid => {
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.1}s`;
          });
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    gridObserver.observe(grid);
  });

  // ── Form handling ──
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
        });

        if (response.ok) {
          form.innerHTML = `
            <div class="form-success">
              <h3>Mensaje enviado</h3>
              <p>Te contactaremos en menos de 24 horas. Mientras tanto, puedes agendar tu llamada directamente.</p>
              <a href="https://calendly.com/diegopuelles/30min" target="_blank" rel="noopener" class="btn btn--primary" style="margin-top: 1.5rem;">Agendar llamada ahora</a>
            </div>
          `;
        } else {
          throw new Error('Error');
        }
      } catch {
        btn.textContent = 'Error — intenta de nuevo';
        btn.disabled = false;
        setTimeout(() => {
          btn.textContent = originalText;
        }, 3000);
      }
    });
  }

  // ── Smooth anchor scrolling with offset ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
