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
  const source = typeof HYPES !== "undefined" && HYPES.length ? HYPES : PHOTOS;

  source.forEach((photo, index) => {
    const article = document.createElement("article");
    article.classList.add("gallery-item");

    if (photo.easterEgg) {
      article.style.cursor = "pointer";
      article.addEventListener("click", () => {
        window.location.href = `game.html?filePath=${encodeURIComponent(
          photo.filePath
        )}`;
      });
    }

    const img = document.createElement("img");
    img.src = `../static/img/${photo.filePath}`;
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
});

