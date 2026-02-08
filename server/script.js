document.addEventListener('DOMContentLoaded', () => {
    fetch('/photos')
      .then(res => res.json())
      .then(urls => {
        const gallery = document.querySelector('.gallery');
  
        urls.forEach((url, index) => {
          const article = document.createElement('article');
          article.classList.add('gallery-item');
  
          const img = document.createElement('img');
          img.src = url;
          img.alt = `Photo ${index + 1}`;
  
          const span = document.createElement('span');
          const h3 = document.createElement('h3');
          h3.textContent = `이미지 ${index + 1}`;
          const figcaption = document.createElement('figcaption');
          figcaption.textContent = '캔버스에 유화. 35mm.';
          const p = document.createElement('p');
          p.textContent = '설명 텍스트';
  
          span.appendChild(h3);
          span.appendChild(figcaption);
          span.appendChild(p);
  
          article.appendChild(img);
          article.appendChild(span);
  
          gallery.appendChild(article);
        });
      })
      .catch(err => console.error('이미지 목록 불러오기 실패:', err));
  });