/* =====================================================================
   Autopost — script.js
   Vanilla JS: smooth-scroll, modal control, scroll reveal, header state.
   No frameworks, no CDN dependencies.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- 1. SMOOTH SCROLL FOR IN-PAGE LINKS ---------- */
  // Native CSS `scroll-behavior: smooth` handles most of this, but we
  // intercept to respect reduced-motion and to close the modal first.
  var scrollLinks = document.querySelectorAll('[data-scroll], a[href^="#"]');

  function smoothScrollTo(targetEl) {
    if (!targetEl) return;
    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    targetEl.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start"
    });
  }

  scrollLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "#" || href === "#") return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        closeModal();
        smoothScrollTo(target);
        // update the hash without an extra jump
        history.pushState(null, "", href);
      }
    });
  });

  /* ---------- 2. MODAL CONTROL ---------- */
  var modal = document.getElementById("modal");
  var openBtn = document.getElementById("open-modal");
  var closeEls = document.querySelectorAll("[data-close-modal]");
  var lastFocused = null;

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    // focus the first input for accessibility
    var firstInput = modal.querySelector("input, textarea, button");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  if (openBtn) {
    openBtn.addEventListener("click", function () {
      // Behaviour: open a simple modal. (Swap openModal() for
      // smoothScrollTo(document.getElementById('create')) if you prefer
      // scroll-only behaviour.)
      openModal();
    });
  }

  closeEls.forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- 3. MODAL FORM (demo submit) ---------- */
  var form = document.getElementById("post-form");
  var success = document.getElementById("modal-success");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var channel = form.querySelector('[name="channel"]');
      if (channel && !channel.value.trim()) {
        channel.focus();
        channel.style.borderColor = "#ffffff";
        return;
      }
      if (success) success.hidden = false;
      form.reset();
      // auto-dismiss after a short beat
      setTimeout(closeModal, 2200);
    });
  }

  /* ---------- 4. REVEAL-ON-SCROLL ---------- */
  // Add .reveal to elements you want animated in, then this observer
  // toggles .is-visible. We tag cards + section heads at runtime.
  var revealTargets = document.querySelectorAll(
    ".card, .section__head, .stat, .cta__inner"
  );
  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- 5. HEADER SHADOW ON SCROLL ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) {
      header.style.borderBottomColor = "rgba(255,255,255,0.18)";
    } else {
      header.style.borderBottomColor = "rgba(255,255,255,0.12)";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
