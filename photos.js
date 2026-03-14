const galleryEl = document.querySelector(".gallery");
const searchBar = document.getElementById("search-bar");
const suggestions = document.getElementById("suggestions");

let photos = PHOTOS.slice();

document.addEventListener("DOMContentLoaded", () => {
  renderGallery(photos);
});

const renderGallery = (filteredPhotos) => {
  galleryEl.innerHTML = "";
  filteredPhotos.forEach((photo, index) => {
    const img = document.createElement("img");
    img.src = `static/img/${photo.filePath}`;
    img.alt = `Photo ${index + 1}`;
    galleryEl.appendChild(img);
  });
};

searchBar.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();

  const filtered = photos.filter((photo) =>
    (photo.tags || []).some((tag) => tag.toLowerCase().includes(keyword))
  );
  renderGallery(filtered);

  suggestions.innerHTML = "";
  if (keyword) {
    const allTags = [...new Set(photos.flatMap((photo) => photo.tags || []))];
    const matchedTags = allTags.filter((tag) =>
      tag.toLowerCase().includes(keyword)
    );
    matchedTags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      li.addEventListener("click", () => {
        searchBar.value = tag;
        const filteredByTag = photos.filter(
          (photo) => photo.tags && photo.tags.includes(tag)
        );
        renderGallery(filteredByTag);
        suggestions.innerHTML = "";
      });
      suggestions.appendChild(li);
    });
  }
});

