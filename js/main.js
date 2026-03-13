/* ========================================
   GSAP Setup
   ======================================== */
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

var prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/* ========================================
   1. Nav Island — Scroll + Mobile Menu
   ======================================== */
var nav = document.getElementById('nav');
var navToggle = document.getElementById('navToggle');
var mobileMenu = document.getElementById('mobileMenu');

if (navToggle && mobileMenu) {
  var iconMenu = navToggle.querySelector('.icon-menu');
  var iconClose = navToggle.querySelector('.icon-close');

  // Only add scroll listener if nav doesn't already have scrolled class
  // (writings.html starts with nav--scrolled)
  if (!nav.classList.contains('nav--scrolled')) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 100) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }, { passive: true });
  }

  navToggle.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('mobile-menu--open');
    iconMenu.style.display = isOpen ? 'none' : 'block';
    iconClose.style.display = isOpen ? 'block' : 'none';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('.mobile-menu-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('mobile-menu--open');
      iconMenu.style.display = 'block';
      iconClose.style.display = 'none';
    });
  });
}

/* ========================================
   2. Prologue — Parallax + Text Entrance
   ======================================== */
if (!prefersReducedMotion && document.getElementById('prologue')) {
  // Parallax background
  gsap.to('#prologueBg', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '#prologue',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Text entrance
  gsap.from(['#prologueLine1', '#prologueLine2', '#prologueMotto'], {
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    stagger: 0.2,
    delay: 0.3,
  });
}

/* ========================================
   3. Artifacts — Scroll-triggered Fade Up
   ======================================== */
if (!prefersReducedMotion && document.getElementById('artifactCard1')) {
  ['#artifactCard1', '#artifactCard2', '#artifactCard3'].forEach(function (sel, i) {
    gsap.from(sel, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: i * 0.15,
      scrollTrigger: {
        trigger: sel,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/* ========================================
   4. Stack Shuffler — Card Cycling
   ======================================== */
if (document.querySelector('.shuffler-card')) {
  (function () {
    var cards = document.querySelectorAll('.shuffler-card');
    var dots = document.querySelectorAll('.shuffler-dot');
    var deck = document.getElementById('shufflerDeck');
    var activeIndex = 0;
    var total = cards.length;

    function updateCards() {
      cards.forEach(function (card, i) {
        var offset = (i - activeIndex + total) % total;
        if (prefersReducedMotion) {
          card.style.transform = 'translateY(' + (offset * 12) + 'px) scale(' + (1 - offset * 0.04) + ')';
          card.style.zIndex = total - offset;
          card.style.opacity = offset === 0 ? 1 : 0.6 - offset * 0.15;
        } else {
          gsap.to(card, {
            y: offset * 12,
            scale: 1 - offset * 0.04,
            zIndex: total - offset,
            opacity: offset === 0 ? 1 : 0.6 - offset * 0.15,
            duration: 0.6,
            ease: 'power3.out',
          });
        }
      });

      dots.forEach(function (dot, i) {
        if (i === activeIndex) {
          dot.classList.add('shuffler-dot--active');
        } else {
          dot.classList.remove('shuffler-dot--active');
        }
      });
    }

    updateCards();

    // Click on deck to advance
    if (deck) {
      deck.addEventListener('click', function () {
        activeIndex = (activeIndex + 1) % total;
        updateCards();
      });
    }

    // Dot click
    dots.forEach(function (dot) {
      dot.addEventListener('click', function (e) {
        e.stopPropagation();
        activeIndex = parseInt(dot.getAttribute('data-dot'));
        updateCards();
      });
    });

    // Auto-advance every 5s (same speed as milestone carousel)
    var shufflerTimer = setInterval(function () {
      activeIndex = (activeIndex + 1) % total;
      updateCards();
    }, 5000);

    // Pause on hover
    var card1 = document.getElementById('artifactCard1');
    if (card1) {
      card1.addEventListener('mouseenter', function () { clearInterval(shufflerTimer); });
      card1.addEventListener('mouseleave', function () {
        shufflerTimer = setInterval(function () {
          activeIndex = (activeIndex + 1) % total;
          updateCards();
        }, 5000);
      });
    }
  })();
}

/* ========================================
   5. Energy Transition — Milestone Carousel
   ======================================== */
(function () {
  var track = document.getElementById('milestoneTrack');
  var dots = document.querySelectorAll('.milestone-dot');
  var prevBtn = document.getElementById('milestonePrev');
  var nextBtn = document.getElementById('milestoneNext');
  if (!track || dots.length === 0) return;

  var current = 0;
  var total = dots.length;

  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';

    dots.forEach(function (dot, i) {
      if (i === current) {
        dot.classList.add('milestone-dot--active');
      } else {
        dot.classList.remove('milestone-dot--active');
      }
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.getAttribute('data-mdot')));
    });
  });

  // Auto-advance every 5s
  var autoTimer = setInterval(function () { goTo(current + 1); }, 5000);

  // Pause on hover
  var card2 = document.getElementById('artifactCard2');
  if (card2) {
    card2.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    card2.addEventListener('mouseleave', function () {
      autoTimer = setInterval(function () { goTo(current + 1); }, 5000);
    });
  }
})();

/* ========================================
   5b. Nexus Card — Flip on Click
   ======================================== */
(function () {
  var nexusFlip = document.getElementById('nexusFlip');
  if (!nexusFlip) return;

  nexusFlip.addEventListener('click', function () {
    nexusFlip.classList.toggle('is-flipped');
  });
})();

/* ========================================
   6. Precision Path — MotionPath Cursor
   ======================================== */
if (!prefersReducedMotion && document.getElementById('pathCursor')) {
  gsap.to('#pathCursor', {
    motionPath: {
      path: '#triangle-path',
      align: '#triangle-path',
      alignOrigin: [0.5, 0.5],
      autoRotate: false,
    },
    duration: 8,
    repeat: -1,
    ease: 'power1.inOut',
  });
}

/* ========================================
   7. Manifesto — Word-by-word Reveal
   ======================================== */
if (document.getElementById('manifesto')) {
  if (!prefersReducedMotion) {
    var manifestoWords = document.querySelectorAll('.manifesto-word');

    manifestoWords.forEach(function (word, i) {
      gsap.fromTo(word,
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#manifesto',
            start: 'top+=' + (i * 35) + ' 60%',
            end: 'top+=' + (i * 35 + 60) + ' 60%',
            scrub: true,
          },
        }
      );
    });
  } else {
    document.querySelectorAll('.manifesto-word').forEach(function (word) {
      word.style.opacity = '1';
    });
  }
}

/* ========================================
   8. Timeline — Scroll Reveal + Toggle
   ======================================== */
// Scroll reveal for timeline items (IntersectionObserver like the reference site)
var revealElements = document.querySelectorAll('[data-reveal]');
if (revealElements.length > 0) {
  if (prefersReducedMotion) {
    // Show everything immediately if reduced motion
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }
}

// Timeline "Show earlier roles" toggle
var timelineToggle = document.getElementById('timelineToggle');
var timelineMore = document.getElementById('timelineMore');
if (timelineToggle && timelineMore) {
  // Remove hidden attribute on load (CSS handles visibility via max-height)
  timelineMore.removeAttribute('hidden');

  timelineToggle.addEventListener('click', function () {
    var isOpen = timelineMore.classList.toggle('is-open');
    timelineToggle.setAttribute('aria-expanded', isOpen);

    var arrow = timelineToggle.querySelector('.timeline-toggle-arrow');
    if (isOpen) {
      timelineToggle.childNodes[0].textContent = 'Hide earlier roles ';
      arrow.innerHTML = '&uarr;';
      // Reveal items inside the expanded section
      timelineMore.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.add('visible');
      });
    } else {
      timelineToggle.childNodes[0].textContent = 'Show earlier roles ';
      arrow.innerHTML = '&darr;';
    }
  });
}

/* ========================================
   9. Gateway — Title Fade Up
   ======================================== */
if (!prefersReducedMotion && document.getElementById('gatewayTitle')) {
  gsap.from('#gatewayTitle', {
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#gateway',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}

/* ========================================
   10. Writings — Card Fade Up
   ======================================== */
if (!prefersReducedMotion) {
  var writingCards = document.querySelectorAll('[data-writing]');
  if (writingCards.length > 0) {
    writingCards.forEach(function (card, i) {
      gsap.from(card, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.1,
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });
  }
}

/* ========================================
   11. Magnetic Buttons
   ======================================== */
document.querySelectorAll('[data-magnetic]').forEach(function (el) {
  el.addEventListener('mousemove', function (e) {
    var rect = el.getBoundingClientRect();
    var x = e.clientX - rect.left - rect.width / 2;
    var y = e.clientY - rect.top - rect.height / 2;

    gsap.to(el, {
      x: x * 0.3,
      y: y * 0.3,
      scale: 1.03,
      duration: 0.3,
      ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    });
  });

  el.addEventListener('mouseleave', function () {
    gsap.to(el, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    });
  });
});
