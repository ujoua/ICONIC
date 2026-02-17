document.addEventListener('DOMContentLoaded', () => {
  fetch('/hypes')
    .then(res => res.json())
    .then(photos => {
      const gallery = document.querySelector('.gallery');

      photos.forEach((photo, index) => {
        photo = photo.pid;

        const article = document.createElement('article');
        article.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = `http://192.168.1.105:4000/photos/${photo.filePath}`;
        img.alt = `Photo ${index + 1}`;

        const span = document.createElement('span');
        const h3 = document.createElement('h3');
        h3.textContent = `《${photo.title}》`;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = photo.earliestDate + photo.materials + photo.dimensons;
        const p = document.createElement('p');
        p.textContent = `${photo.text}`;
        const tags = document.createElement('p');
        tags.textContent = `${photo.tags}`;

        span.appendChild(h3);
        span.appendChild(figcaption);
        span.appendChild(p);
        span.appendChild(tags);

        article.appendChild(img);
        article.appendChild(span);

        gallery.insertBefore(article, gallery.lastElementChild);
      });
    })
    .catch(err => console.error('이미지 목록 불러오기 실패:', err));
});