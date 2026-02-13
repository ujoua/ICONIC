document.addEventListener('DOMContentLoaded', () => {
  fetch('/photos')
    .then(res => res.json())
    .then(photos => {
      const gallery = document.querySelector('.gallery');

      photos.forEach((photo, index) => {
        const img = document.createElement('img');
        img.src = `http://192.168.1.105:4000/photos/${photo.filePath}`;
        img.alt = `Photo ${index + 1}`;

        gallery.appendChild(img);
      });
    })
    .catch(err => console.error('이미지 목록 불러오기 실패:', err));
});