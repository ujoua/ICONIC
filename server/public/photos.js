const gallery = document.getElementById('gallery');
const searchBar = document.getElementById('search-bar');

let photos = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('/photos')
    .then(res => res.json())
    .then(data => {
      photos = data;
      renderGallery(photos);
    })
    .catch(err => console.error('이미지 목록 불러오기 실패:', err));
});

const renderGallery = (filteredPhotos) => {
  gallery.innerHTML = '';
  filteredPhotos.forEach((photo, index) => {
    const img = document.createElement('img');
    img.src = `http://192.168.1.105:4000/photos/${photo.filePath}`;
    img.alt = `Photo ${index + 1}`;
    gallery.appendChild(img);
  });
}

searchBar.addEventListener('input', (e) => {
  const keyword = e.target.value.toLowerCase();

  const filtered = photos.filter(photo =>
    photo.tags.some(tag => tag.toLowerCase().includes(keyword))
  );
  renderGallery(filtered);

  suggestions.innerHTML = '';
  if (keyword) {
    const allTags = [...new Set(photos.flatMap(photo => photo.tags || []))];
    const matchedTags = allTags.filter(tag => tag.toLowerCase().includes(keyword));
    matchedTags.forEach(tag => {
      const li = document.createElement('li');
      li.textContent = tag;
      li.addEventListener('click', () => {
        searchBar.value = tag;
        const filteredByTag = photos.filter(photo =>
          photo.tags && photo.tags.includes(tag)
        );
        renderGallery(filteredByTag);
        suggestions.innerHTML = '';
      });
      suggestions.appendChild(li);
    });
  }
});