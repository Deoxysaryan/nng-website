/*
  Transformation with NNG: website prototype, portable copy.
  The same behaviour as the Next.js build, written as one small script so these pages open by
  double-click, with no server: the enquiry dialog, the phone menu, the swipe rows, the client
  films, the tilak page transition and the call-back form. Nothing is sent from any page.
*/
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const plainClick = (e) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

  // ?export=pdf gives a static capture: no sticky header, bar or transition.
  if (new URLSearchParams(location.search).get("export") === "pdf") document.documentElement.classList.add("pdf-export");

  // Phone menu.
  const toggle = $(".menu-toggle");
  const menu = $("#mobile-nav");
  const header = $(".site-header");
  const setMenu = (open) => {
    if (!toggle || !menu) return;
    if (open && header) document.documentElement.style.setProperty("--menu-top", `${Math.round(header.getBoundingClientRect().bottom)}px`);
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    if (open) header?.classList.remove("is-hidden");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  };
  toggle?.addEventListener("click", () => setMenu(menu.hidden));
  menu?.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));

  // Smart header on phones and tablets: away while reading down, back on the way up.
  if (header) {
    const narrow = matchMedia("(max-width: 960px)");
    let last = scrollY;
    let queued = false;
    const setHidden = (hidden) => {
      header.classList.toggle("is-hidden", hidden);
      document.documentElement.dataset.header = hidden ? "hidden" : "shown";
    };
    addEventListener(
      "scroll",
      () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          const y = scrollY;
          const delta = y - last;
          const busy = document.body.classList.contains("dialog-open") || document.body.classList.contains("menu-open");
          if (!narrow.matches || y < 140 || busy) {
            setHidden(false);
            last = y;
          } else if (delta > 10) {
            setHidden(true);
            last = y;
          } else if (delta < -10) {
            setHidden(false);
            last = y;
          }
        });
      },
      { passive: true },
    );
  }

  // The phone bar waits until the page's first-screen action has scrolled away, and steps aside
  // once the footer, with its own invitation, is on screen.
  const bar = $(".mobile-enquiry");
  if (bar && "IntersectionObserver" in window) {
    const onScreen = new Set();
    const show = (shown) => {
      bar.classList.toggle("is-shown", shown);
      bar.setAttribute("aria-hidden", String(!shown));
      bar.toggleAttribute("inert", !shown);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? onScreen.add(entry.target) : onScreen.delete(entry.target)));
      show(onScreen.size === 0);
    });
    $$("[data-primary-cta], .site-footer").forEach((target) => observer.observe(target));
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu && !menu.hidden) {
      setMenu(false);
      toggle.focus();
    }
  });
  matchMedia("(min-width: 961px)").addEventListener("change", (e) => e.matches && setMenu(false));

  // Enquiry dialog: any [data-enquiry] link opens it with its service chosen.
  const dialog = $("dialog.enquiry");
  if (dialog) {
    const topic = $("#enquiry-topic", dialog);
    const region = $("#enquiry-region", dialog);
    const preview = $(".message-preview", dialog);
    const whatsapp = $("a.button", dialog);
    const callback = $(".dialog-alt a", dialog);
    const number = (dialog.dataset.number || "").replace(/\D/g, "");
    let trigger = null;
    const update = () => {
      const message = `Hello, I would like to enquire about ${topic.value} with Narayani Garg. I am based ${
        region.value === "India" ? "in India" : "outside India"
      }. Could you please share the consultation process, current fees and availability?`;
      preview.textContent = message;
      whatsapp.href = (number ? `https://wa.me/${number}?text=` : "https://wa.me/?text=") + encodeURIComponent(message);
      if (callback) callback.href = `contact.html?topic=${encodeURIComponent(topic.value)}#callback`;
    };
    topic.addEventListener("change", update);
    region.addEventListener("change", update);
    document.addEventListener("click", (e) => {
      if (!plainClick(e)) return;
      const t = e.target.closest("[data-enquiry]");
      if (!t) return;
      e.preventDefault();
      trigger = t;
      topic.value = t.dataset.topic || topic.options[0].value;
      update();
      setMenu(false);
      document.body.classList.add("dialog-open");
      dialog.showModal();
      topic.focus();
    });
    $(".dialog-close", dialog).addEventListener("click", () => dialog.close());
    callback?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
      trigger?.focus();
    });
    dialog.addEventListener("click", (e) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
    dialog.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const items = $$("button, select, a[href]", dialog).filter((n) => !n.disabled);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    update();
  }

  // Swipe rows (testimonials, films): previous, next and position.
  $$(".track-controls").forEach((controls) => {
    const track = controls.previousElementSibling;
    if (!track) return;
    const [prev, next] = $$("button", controls);
    const position = $("span", controls);
    const count = track.children.length;
    const step = () => (count > 1 ? track.children[1].offsetLeft - track.children[0].offsetLeft : track.clientWidth);
    const measure = () => {
      const s = step() || 1;
      const max = track.scrollWidth - track.clientWidth;
      position.textContent = `${Math.min(count, Math.round(track.scrollLeft / s) + 1)} / ${count}`;
      prev.disabled = track.scrollLeft < 5;
      next.disabled = track.scrollLeft >= max - 5;
    };
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: reduce() ? "auto" : "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: reduce() ? "auto" : "smooth" }));
    track.addEventListener("scroll", measure, { passive: true });
    addEventListener("resize", measure);
    measure();
  });

  // Client films: the Drive player loads only when a film is pressed. Phones watch full screen.
  const viewer = $("dialog.film-viewer");
  if (viewer) {
    let from = null;
    $(".film-close", viewer)?.addEventListener("click", () => viewer.close());
    viewer.addEventListener("close", () => {
      viewer.querySelector("iframe")?.remove();
      document.body.classList.remove("dialog-open");
      from?.focus();
    });
    viewer.openFilm = (id, title, button) => {
      from = button;
      const player = document.createElement("iframe");
      player.src = `https://drive.google.com/file/d/${id}/preview`;
      player.allow = "autoplay; fullscreen";
      player.allowFullscreen = true;
      player.title = title;
      viewer.append(player);
      viewer.setAttribute("aria-label", title);
      document.body.classList.add("dialog-open");
      viewer.showModal();
    };
  }
  $$(".reel-play").forEach((button) =>
    button.addEventListener("click", () => {
      const frame = button.closest(".reel-frame");
      const id = frame.querySelector("img")?.src.match(/\/d\/([^=]+)=w/)?.[1];
      if (!id) return;
      if (viewer && matchMedia("(max-width: 680px)").matches) {
        viewer.openFilm(id, button.dataset.title || "Client film", button);
        return;
      }
      const player = document.createElement("iframe");
      player.src = `https://drive.google.com/file/d/${id}/preview`;
      player.allow = "autoplay; fullscreen";
      player.allowFullscreen = true;
      player.title = button.dataset.title || "Client film";
      Object.assign(player.style, { position: "absolute", inset: "0", width: "100%", height: "100%", border: "0" });
      frame.replaceChildren(player);
    }),
  );

  // Drawings draw themselves in the first time they come into view, then keep a slow idle motion
  // (the stylesheet does the drawing; this only says when). Off in the PDF export and without script.
  if (!document.documentElement.classList.contains("pdf-export") && "IntersectionObserver" in window) {
    document.documentElement.classList.add("motion");
    const drawings = document.querySelectorAll("[data-draw]:not(.is-drawn)");
    const seen = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-drawn");
        seen.unobserve(entry.target);
      }
    }, { threshold: 0.2 });
    drawings.forEach((el) => seen.observe(el));
  }

  // The graha orbit can be paused (WCAG 2.2.2). The choice lasts for the visit.
  $$(".orbit-control").forEach((button) => {
    const key = "nng-orbit";
    const paint = (paused) => {
      document.documentElement.classList.toggle("orbit-paused", paused);
      button.setAttribute("aria-pressed", String(paused));
      button.setAttribute("aria-label", paused ? "Play the orbit" : "Pause the orbit");
      button.querySelector("path").setAttribute("d", paused ? "M3 1.5l7 4.5-7 4.5z" : "M2.5 1.5h2.4v9H2.5zM7.1 1.5h2.4v9H7.1z");
    };
    let paused = false;
    try {
      paused = sessionStorage.getItem(key) === "paused";
    } catch {
      paused = false;
    }
    paint(paused);
    button.addEventListener("click", () => {
      paused = !paused;
      paint(paused);
      try {
        sessionStorage.setItem(key, paused ? "paused" : "playing");
      } catch {
        /* private mode */
      }
    });
  });

  // Section chips: light up the section being read, and keep that chip in view.
  const chips = $(".section-chips-row");
  if (chips && "IntersectionObserver" in window) {
    const links = $$("a[data-chip]", chips);
    const setActive = (id) =>
      links.forEach((link) => {
        const on = link.dataset.chip === id;
        link.toggleAttribute("aria-current", on);
        if (on) {
          link.setAttribute("aria-current", "true");
          chips.scrollTo({ left: link.offsetLeft - chips.clientWidth / 2 + link.clientWidth / 2, behavior: reduce() ? "auto" : "smooth" });
        }
      });
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    links.forEach((link) => {
      const section = document.getElementById(link.dataset.chip);
      if (section) observer.observe(section);
    });
  }

  // Page transition: the tilak on warm paper for a moment when moving to another page.
  const veil = $(".page-veil");
  document.addEventListener(
    "click",
    (e) => {
      if (!veil || !plainClick(e) || reduce()) return;
      const link = e.target.closest("a[href]");
      if (!link || link.hasAttribute("data-enquiry") || link.target === "_blank") return;
      const url = new URL(link.href, location.href);
      if (url.protocol !== location.protocol || url.host !== location.host || url.pathname === location.pathname) return;
      e.preventDefault();
      veil.classList.add("is-active");
      setTimeout(() => (location.href = url.href), 380);
    },
    true,
  );
  addEventListener("pageshow", () => veil?.classList.remove("is-active"));

  // Call-back form: validates, then shows the thank-you state. Nothing is sent.
  const form = $("#callback form");
  if (form) {
    const select = $("select[name=topic]", form);
    const wanted = new URLSearchParams(location.search).get("topic");
    if (wanted && select && [...select.options].some((o) => o.value === wanted)) select.value = wanted;
    const setError = (input, text) => {
      const holder = input.closest(".field") || input.closest(".consent");
      const id = input.id || input.name;
      let note = document.getElementById(`${id}-error`);
      if (text) {
        if (!note) {
          note = document.createElement("p");
          note.className = "field-error";
          note.id = `${id}-error`;
          // Under the field, or under the consent line.
          holder.insertAdjacentElement(holder.classList.contains("consent") ? "afterend" : "beforeend", note);
        }
        note.textContent = text;
        input.setAttribute("aria-invalid", "true");
        input.setAttribute("aria-describedby", note.id);
      } else {
        note?.remove();
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
      }
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.elements.name;
      const phone = form.elements.phone;
      const email = form.elements.email;
      const consent = form.elements.consent;
      setError(name, name.value.trim().length < 2 ? "Please enter your name." : "");
      setError(phone, phone.value.replace(/\D/g, "").length < 8 ? "Please enter a phone number we can call, with the country code if outside India." : "");
      setError(email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? "" : "Please enter an email address.");
      setError(consent, consent.checked ? "" : "Please tick the box so the team may contact you.");
      const firstBad = $("[aria-invalid=true]", form);
      if (firstBad) return firstBad.focus();
      const done = document.createElement("div");
      done.className = "form-done";
      done.setAttribute("role", "status");
      done.innerHTML =
        "<h3>Thank you.</h3><p>The team will call you back soon to understand what you need, and suggest the right consultation or program.</p><p class=\"form-note\">Prototype: nothing was sent. At launch, this form goes to the practice’s enquiry inbox.</p>";
      form.replaceWith(done);
    });
  }
})();
