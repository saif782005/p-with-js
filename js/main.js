let images = ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg"];

let box = document.querySelector("#randumImg");
let button = document.querySelector("#randButt");

let index = 0;
let timer;

// بتغيّر الصورة وتحرك العدّاد
function changeImage() {
  box.style.backgroundImage = `url("../imgs/${images[index]}")`;
  index = (index + 1) % images.length; // بعد الصورة الأخيرة يرجع لـ 0
}

function start() {
  timer = setInterval(changeImage, 7000);
  button.textContent = "off";
  button.classList.add("clicked");
  localStorage.setItem("background", "on");
}

function stop() {
  clearInterval(timer);
  button.textContent = "on";
  button.classList.remove("clicked");
  localStorage.setItem("background", "off");
}

// أول ما الصفحة تفتح: لو كان شغال قبل كدا، شغّله
if (localStorage.getItem("background") === "on") {
  start();
}

// الضغط على الزرار
button.addEventListener("click", function () {
  if (button.classList.contains("clicked")) {
    stop();
  } else {
    start();
  }
});

//
//
//
//
// gear and settinge

let gear = document.querySelector("#gear");
let gearBox = document.querySelector("#gearBox");
let logo = document.querySelector(".logo");
//
//click to open click to close
gear.addEventListener("click", function () {
  gearBox.classList.toggle("open");
  logo.classList.toggle("no-seen");
});
//click on img to close the gear box
box.addEventListener("click", function () {
  gearBox.classList.remove("open");
});

// change main color

let colors = document.querySelectorAll(".color-list li");
let root = document.documentElement.style;
colors.forEach((x) => {
  x.addEventListener("click", function (e) {
    localStorage.setItem("color", e.target.dataset.color);
    root.setProperty("--main-color", e.target.dataset.color);
  });
});
let savedColor = localStorage.getItem("color");

root.setProperty("--main-color", savedColor);

//
//
//
//
// set active
colors.forEach((l) => {
  l.addEventListener("click", function () {
    colors.forEach((li) => {
      li.classList.remove("active-color");
    });

    l.classList.add("active-color");
  });
});
//
//
//
//
//
//
//
//
//
//

let items = document.querySelectorAll(".link");
items.forEach((link) => {
  link.addEventListener("click", function () {
    items.forEach((el) => {
      el.classList.remove("setcolor");
    });

    this.classList.add("setcolor");
  });
});
//
//
//
//
// burger-menu
let ico = document.querySelector(".ico");
let burgerMenu = document.querySelector(".burger-menu");
let blurr = document.querySelector(".blur");
let linkB = document.querySelectorAll(".link-b");
let burgerCheck = document.querySelector(".hamburger input");

ico.addEventListener("click", function () {
  burgerMenu.classList.toggle("hide");
});

blurr.addEventListener("click", function () {
  burgerMenu.classList.add("hide");
});

linkB.forEach((e) => {
  e.addEventListener("click", function () {
    burgerMenu.classList.add("hide");
    burgerCheck.checked = false;
  });
});
//
//
//
//
//
//skills section

let skillsSection = document.getElementById("skills-sec");
let lineW = document.querySelectorAll(".lineW");
let secH = skillsSection.offsetTop;
window.addEventListener("scroll", function () {
  let winH = this.pageYOffset;
  if (winH >= secH - 300) {
    lineW.forEach(function (eW) {
      eW.style.width = eW.getAttribute("data-width");
    });
  }
});

//
//
//
//
// our gallary
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popup-img");
const closeBtn = document.getElementById("close");
let imgg = document.querySelectorAll(".img-cont img");

imgg.forEach((img) => {
  img.addEventListener("click", () => {
    popupImg.src = img.src;
    popup.classList.add("show");
  });
});

// اقفل بالـ X
closeBtn.addEventListener("click", () => popup.classList.remove("show"));
//
//
//
//
//
//
//

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// ========================================================== */
(() => {
  const timeline = document.querySelector(".timeline");
  if (!timeline) return;

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  /* العناصر اللي الـ JS بيعملها بنفسه (مش لازم تكتبها في الـ HTML) */
  const createLayer = (className) => {
    const el = document.createElement("div");
    el.className = className;
    timeline.prepend(el);
    return el;
  };

  const orb = createLayer("tl-orb");
  const progress = createLayer("tl-progress");

  const milestones = [...timeline.querySelectorAll(".tl-item")];
  const years = [...timeline.querySelectorAll(".tl-year")];

  timeline.classList.add("is-ready");

  /* ---------- 1) الظهور + عدّاد السنة ---------- */
  function countUp(el) {
    const end = parseInt(el.textContent, 10);
    if (reduceMotion || Number.isNaN(end)) return;

    el.setAttribute("aria-label", end);
    const start = end - 12;
    const duration = 900;
    const startTime = performance.now();

    const tick = (now) => {
      const p = clamp((now - startTime) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (end - start) * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        if (entry.target.classList.contains("tl-year")) countUp(entry.target);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
  );

  [...milestones, ...years].forEach((el) => revealObserver.observe(el));

  /* ---------- 2) الخط + الكُرة ---------- */
  let target = 0;
  let current = 0;
  let running = false;

  function paint() {
    progress.style.height = `${current}px`;
    orb.style.transform = `translateY(${current}px)`;
  }

  function frame() {
    current += (target - current) * 0.14;
    const speed = Math.abs(target - current);

    if (speed < 0.3) {
      current = target;
      running = false;
    }

    orb.style.setProperty("--tail", `${clamp(speed * 1.2 + 20, 20, 160)}px`);
    paint();
    if (running) requestAnimationFrame(frame);
  }

  function moveTo(value) {
    target = value;
    if (reduceMotion) {
      current = target;
      paint();
    } else if (!running) {
      running = true;
      requestAnimationFrame(frame);
    }
  }

  /* ---------- 3) العنصر الحالي ---------- */
  function dotCenterY(milestone) {
    const dotTop = parseFloat(getComputedStyle(milestone, "::before").top) || 0;
    return milestone.getBoundingClientRect().top + dotTop + 14;
  }

  let ticking = false;

  function update() {
    ticking = false;

    const rect = timeline.getBoundingClientRect();
    const focusY = window.innerHeight * 0.55;

    moveTo(clamp(focusY - rect.top, 0, rect.height));
    orb.classList.toggle("is-on", target > 0 && target < rect.height);

    let closest = null;
    let closestDistance = Infinity;

    milestones.forEach((milestone) => {
      const distance = Math.abs(dotCenterY(milestone) - focusY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = milestone;
      }
    });

    const inRange = closestDistance < window.innerHeight * 0.35;
    milestones.forEach((milestone) =>
      milestone.classList.toggle(
        "is-current",
        inRange && milestone === closest,
      ),
    );
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();

  /* ---------- 4) ميلان 3D + إضاءة الماوس ---------- */
  if (canHover && !reduceMotion) {
    timeline.querySelectorAll(".tl-card").forEach((card) => {
      const milestone = card.closest(".tl-item");

      card.addEventListener("pointermove", (e) => {
        if (!milestone.classList.contains("is-visible")) return;

        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        card.classList.add("is-tilting");
        card.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
        card.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
        card.style.setProperty("--mx", `${x * 100}%`);
        card.style.setProperty("--my", `${y * 100}%`);
      });

      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-tilting");
        card.style.removeProperty("--rx");
        card.style.removeProperty("--ry");
      });
    });
  }
})();
