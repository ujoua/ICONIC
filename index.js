if ("scrollRestoration" in history) {
  history.scrollRestoration = "auto";
}

const startButton = document.getElementsByTagName("button")[0];
const galleryEl = document.querySelector(".gallery");
const mainEl = document.getElementById("main-viewport") || document.querySelector("main");
const galleryStageEl =
  document.getElementById("gallery-stage") || document.querySelector(".gallery-stage");

/** overflow 스크롤 대신 패닝 — 네이티브 가로 스크롤은 3D를 평면으로 뭉갬 */
let panX = 0;

let wallEnterAnimating = false;

function prefersReducedMotion() {
  return (
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getMaxPan() {
  if (!mainEl || !galleryStageEl) return 0;
  const w = galleryStageEl.scrollWidth;
  const vw = mainEl.clientWidth;
  return Math.max(0, w - vw);
}

function syncPan() {
  if (!mainEl || !galleryStageEl) return;
  const max = getMaxPan();
  panX = Math.max(0, Math.min(panX, max));
  galleryStageEl.style.setProperty("--pan-x", `${panX}px`);
  const p = max > 0 ? panX / max : 0;
  document.documentElement.style.setProperty("--scroll-p", String(p));
  updateGalleryPose();
}

/**
 * 패닝 진행도에 따라 벽 Y회전 (왼쪽: 더 안쪽으로 돌아감 → 오른쪽: 조금 펴짐)
 */
function updateGalleryPose() {
  if (!mainEl || !galleryEl || wallEnterAnimating) return;
  if (prefersReducedMotion()) return;
  const max = getMaxPan();
  const t = max > 0 ? panX / max : 0;
  const ry = -40 + t * 26;
  galleryEl.style.setProperty("--gallery-ry", `${ry}deg`);
}

function onWheel(e) {
  const dx = e.deltaX !== 0 ? e.deltaX : e.shiftKey ? e.deltaY : 0;
  if (dx === 0) return;
  e.preventDefault();
  panX += dx * 1.15;
  syncPan();
}

let touchLastX = 0;

function onTouchStart(ev) {
  if (ev.touches.length !== 1) return;
  touchLastX = ev.touches[0].clientX;
}

function onTouchMove(ev) {
  if (ev.touches.length !== 1) return;
  const x = ev.touches[0].clientX;
  const dx = touchLastX - x;
  touchLastX = x;
  panX += dx;
  syncPan();
}

function onKeyDown(ev) {
  if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
  const t = ev.target;
  if (
    t &&
    (t.tagName === "INPUT" ||
      t.tagName === "TEXTAREA" ||
      t.tagName === "SELECT" ||
      t.isContentEditable)
  ) {
    return;
  }
  ev.preventDefault();
  if (ev.key === "ArrowLeft") panX -= 52;
  else panX += 52;
  syncPan();
}

function bindPanControls() {
  if (!mainEl || !galleryStageEl) return;

  mainEl.addEventListener("wheel", onWheel, { passive: false });
  mainEl.addEventListener("touchstart", onTouchStart, { passive: true });
  mainEl.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", () => syncPan(), { passive: true });
  window.addEventListener("load", () => syncPan(), { once: true });
  mainEl.addEventListener("click", () => {
    try {
      mainEl.focus({ preventScroll: true });
    } catch (_) {
      mainEl.focus();
    }
  });

  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => syncPan());
    ro.observe(galleryStageEl);
    ro.observe(mainEl);
  }
}

if (!sessionStorage.getItem("started")) {
  startButton.style.display = "block";
  startButton.addEventListener("click", () => {
    sessionStorage.setItem("started", "true");

    startButton.style.animation = "fadeOut 2s linear forwards";
    const reduceMotion = prefersReducedMotion();
    if (!reduceMotion && galleryEl) {
      wallEnterAnimating = true;
      galleryEl.style.animation =
        "wallEnter 12.35s cubic-bezier(0.18, 0.82, 0.15, 1) forwards";
      galleryEl.addEventListener(
        "animationend",
        (e) => {
          if (e.animationName !== "wallEnter") return;
          galleryEl.style.animation = "none";
          wallEnterAnimating = false;
          syncPan();
        },
        { once: true }
      );
    } else {
      syncPan();
    }
  });
}

let galleryRevealObserver = null;

function observeRevealTargets(root) {
  const prefersReduced =
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!root) return;

  if (prefersReduced) {
    root
      .querySelectorAll(".gallery-item, .gallery-next")
      .forEach((el) => el.classList.add("is-visible"));
    return;
  }

  if (!galleryRevealObserver) {
    galleryRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { root, rootMargin: "-6% 0px -10% 0px", threshold: [0, 0.22, 0.5] }
    );
  }

  root.querySelectorAll(".gallery-item, .gallery-next").forEach((el) => {
    if (el.dataset.revealObserved) return;
    el.dataset.revealObserved = "1";
    galleryRevealObserver.observe(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindPanControls();
  syncPan();
  observeRevealTargets(mainEl);

  const renderGallery = (source) => {
    source.forEach((photo, index) => {
      const article = document.createElement("article");
      article.classList.add("gallery-item");
      article.dataset.tone = String(index % 4);
      article.style.setProperty("--reveal-order", String(index));

      if (photo.easterEgg) {
        article.style.cursor = "pointer";
        article.addEventListener("click", () => {
          window.location.href = `game.html?filePath=${encodeURIComponent(
            photo.filePath
          )}`;
        });
      }

      const img = document.createElement("img");
      img.src = `./static/img/${photo.filePath}`;
      img.alt = `Photo ${index + 1}`;

      const span = document.createElement("span");
      const h3 = document.createElement("h3");
      h3.textContent = `《${photo.title}》`;

      const figcaption = document.createElement("figcaption");
      figcaption.innerHTML = `<div>${photo.earliestDate}</div> <div>${photo.materials.join(
        ", "
      )}</div> <div>${photo.dimensons}</div>`;

      const p = document.createElement("p");
      p.innerHTML = `<strong>${photo.text}</strong>`;

      const tags = document.createElement("p");
      tags.className = "gallery-item__tags";
      tags.textContent = (photo.tags || []).join(", ");

      span.appendChild(h3);
      span.appendChild(figcaption);
      span.appendChild(p);
      span.appendChild(tags);

      article.appendChild(img);
      article.appendChild(span);

      galleryEl.insertBefore(article, galleryEl.lastElementChild);
    });

    observeRevealTargets(mainEl);
    requestAnimationFrame(() => syncPan());
  };

  const loadData = async () => {
    try {
      const [photosRes, hypeRes] = await Promise.all([
        fetch("./photos-data.json"),
        fetch("./hype.json"),
      ]);
      const photos = await photosRes.json();
      const hypes = await hypeRes.json();

      const hypeFileSet = new Set(
        (hypes || []).map((item) =>
          typeof item === "string" ? item : item?.filePath
        )
      );
      const source = hypeFileSet.size
        ? photos.filter((photo) => hypeFileSet.has(photo.filePath))
        : photos;

      renderGallery(source);
    } catch (error) {
      console.error("Failed to load photo data:", error);
    }
  };

  loadData();
});


// PC에서도 터치로 횡스크롤
const viewport = document.querySelector('.main-viewport');
const root = document.documentElement;

let isDown = false;
let startX;
let scrollLeft;
// let panX = 0; // 현재 이동 거리 저장용

// 1. 마우스 휠로 가로 이동 (이미 있다면 생략 가능)
window.addEventListener('wheel', (e) => {
  panX += e.deltaY; // 세로 휠 양만큼 더함
  updateScroll();
});

// 2. 마우스 드래그 시작
window.addEventListener('mousedown', (e) => {
  isDown = true;
  viewport.style.cursor = 'grabbing';
  startX = e.pageX;
  scrollLeft = panX;
});

// 3. 마우스 드래그 중
window.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();

  const x = e.pageX;
  const walk = (startX - x) * 1.5; // 드래그 속도 조절 (1.5배)
  panX = scrollLeft + walk;

  updateScroll();
});

// 4. 마우스 떼기
window.addEventListener('mouseup', () => {
  isDown = false;
  viewport.style.cursor = 'grab';
});

window.addEventListener('mouseleave', () => {
  isDown = false;
});

// 공통 업데이트 함수
function updateScroll() {
  // 갤러리 범위를 벗어나지 않게 제한 (선택 사항)
  const galleryWidth = document.querySelector('.gallery').offsetWidth;
  const maxScroll = galleryWidth - window.innerWidth;

  if (panX < 0) panX = 0;
  if (panX > maxScroll) panX = maxScroll;

  // CSS 변수 업데이트
  // root.style.setProperty('--pan-x', `${panX}px`);
  syncPan();

  // 진행바 업데이트 (기존 변수 활용)
  const progress = panX / maxScroll;
  root.style.setProperty('--scroll-p', progress);
}
