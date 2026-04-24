if ("scrollRestoration" in history) {
  history.scrollRestoration = "auto";
}

const startButton = document.getElementsByTagName("button")[0];
const galleryEl = document.querySelector(".gallery");

if (!sessionStorage.getItem("started")) {
  startButton.style.display = "block";
  startButton.addEventListener("click", () => {
    sessionStorage.setItem("started", "true");

    startButton.style.animation = "fadeOut 2s linear forwards";
    galleryEl.style.animation = "wallEnter 12.3s ease-out forwards";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const renderGallery = (source) => {
    source.forEach((photo, index) => {
      const article = document.createElement("article");
      article.classList.add("gallery-item");

      const img = document.createElement("img");
      img.src = `./static/img/${photo.filePath}`;
      img.alt = `Photo ${index + 1}`;

      if (photo.easterEgg) {
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
          window.location.href = `game.html?filePath=${encodeURIComponent(
            photo.filePath
          )}`;
        });
      }

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
      tags.style.color = "darkblue";

      span.appendChild(h3);
      span.appendChild(figcaption);
      span.appendChild(p);
      span.appendChild(tags);

      article.appendChild(img);
      article.appendChild(span);

      galleryEl.insertBefore(article, galleryEl.lastElementChild);
    });
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


// 마우스 휠을 가로 스크롤로 변환
const scrollContainer = document.querySelector('main');

scrollContainer.addEventListener('wheel', (event) => {
  event.preventDefault();
  // 세로 휠을 가로 스크롤로
  // scrollContainer.scrollLeft += event.deltaY;
  // scrollContainer.scrollTo({
  //   left: scrollContainer.scrollLeft + event.deltaY;
  // });
  scrollContainer.scrollBy({
    left: event.deltaY * 3,
    behavior: 'smooth'
  });
});

const slider = scrollContainer;
let isDragging = false; // 드래그 상태 확인용
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active'); // 클릭 시 커서 모양 변경 등을 위한 클래스
  // 클릭한 시점의 마우스 위치와 현재 스크롤 위치를 저장
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
  isDown = false;
});

slider.addEventListener('mouseup', () => {
  isDown = false;
});

slider.addEventListener('mousemove', (e) => {
  if (!isDown) return; // 마우스를 누르고 있을 때만 실행
  e.preventDefault();

  // 현재 마우스 위치에서 시작 위치를 빼서 얼마나 움직였는지 계산
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1; // 스크롤 속도 조절 (2를 곱하면 더 빠르게 움직임)
  // slider.scrollLeft = scrollLeft - walk;

  if (Math.abs(walk) > 5) {
    isDragging = true;
  }

  slider.scrollBy({
    left: -walk,
    behavior: 'smooth'
  });
});

slider.addEventListener('click', (e) => {
  if (isDragging) {
    // 드래그 중이었다면 링크 이동 등 기본 동작을 막음
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation(); // 부모/자식으로의 전파를 즉시 차단
  }

  // 클릭이 끝난 후 상태 초기화
  isDragging = false;
}, true); // <--- 이 'true'가 핵심입니다!
// 보통 이벤트는 안쪽에서 바깥쪽으로 퍼지지만, 캡처링을 사용하면 바깥쪽(부모)에서 먼저 낚아챌 수 있습니다. addEventListener의 세 번째 인자에 true를 주면 됩니다.
// - 왜 이 방법인가?: 하이퍼링크(<a>) 자체에 걸린 클릭 이벤트보다 이 코드가 먼저 실행되어 가로챌 수 있습니다.