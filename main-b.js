// Minimal, performance-safe interactions for variant B
(function(){
  const doc = document;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Lazy load images with data-src
  const lazy = Array.from(doc.querySelectorAll("img.lazy[data-src]"));
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver((entries, obs)=>{
      for(const e of entries){
        if(e.isIntersecting){
          const el = e.target;
          el.src = el.getAttribute("data-src");
          el.removeAttribute("data-src");
          obs.unobserve(el);
        }
      }
    }, {rootMargin:"200px 0px", threshold:0.01});
    lazy.forEach(el=>io.observe(el));
  }else{
    lazy.forEach(el=>{ el.src = el.getAttribute("data-src"); el.removeAttribute("data-src"); });
  }

  // Scroll progress
  const bar = doc.querySelector(".progress-bar");
  const update = ()=>{
    const st = window.pageYOffset || doc.documentElement.scrollTop || 0;
    const h = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight, doc.body.offsetHeight, doc.documentElement.offsetHeight, doc.body.clientHeight, doc.documentElement.clientHeight);
    const win = window.innerHeight || doc.documentElement.clientHeight || 1;
    const pct = Math.min(1, st / Math.max(1, h - win));
    bar.style.width = (pct * 100) + "%";
  };
  ["scroll","resize","orientationchange","load"].forEach(evt=>window.addEventListener(evt, update, {passive:true}));
  update();

  // Time intent band logic
  const hint = doc.getElementById("time-hint");
  doc.querySelectorAll(".time-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      doc.querySelectorAll(".time-btn").forEach(b=>b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const m = +btn.dataset.min;
      if(m <= 15) hint.textContent = "Best for 15m: 1–2 spots very close";
      else if(m <= 30) hint.textContent = "Best for 30m: 3 spots nearby";
      else hint.textContent = "Best for 45m: 3–4 spots with a longer walk";
    }, {passive:true});
  });

  // CTA click tag (for analytics wiring later)
  doc.querySelectorAll("[data-cta]").forEach(a=>{
    a.addEventListener("click", ()=>{ a.dataset.clicked = "1"; }, {passive:true});
  });

  // Mobile menu toggle
  const toggle = doc.querySelector('.menu-toggle');
  const nav = doc.getElementById('primary-nav');
  const backdrop = doc.querySelector('.nav-backdrop');

  const closeNav = ()=>{
    document.documentElement.classList.remove('nav-open');
    if(toggle) toggle.setAttribute('aria-expanded', 'false');
    if(backdrop) backdrop.hidden = true;
  };
  const openNav = ()=>{
    document.documentElement.classList.add('nav-open');
    if(toggle) toggle.setAttribute('aria-expanded', 'true');
    if(backdrop) backdrop.hidden = false;
    // Focus first link for accessibility
    const first = nav && nav.querySelector('a.nav-link');
    if(first) first.focus({preventScroll:true});
  };

  if(toggle && nav){
    toggle.addEventListener('click', ()=>{
      const isOpen = document.documentElement.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if(backdrop) backdrop.hidden = !isOpen;
      if(isOpen){
        const first = nav.querySelector('a.nav-link');
        if(first) first.focus({preventScroll:true});
      }
    });
  }
  if(backdrop){
    backdrop.addEventListener('click', closeNav, {passive:true});
  }
  doc.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){ closeNav(); }
  });
  // Close menu on link click
  doc.querySelectorAll('.top-nav .nav-link').forEach(a=>a.addEventListener('click', closeNav));

})();
