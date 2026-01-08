const books = JSON.parse(localStorage.getItem('audibleBooks') || '[]');
document.querySelectorAll('[class*="library-item"], [class*="adbl-library"], .bc-list-item, li[class*="productListItem"]').forEach(row => {
  const titleEl = row.querySelector('h2, [class*="title"], .bc-heading, h3');
  const authorEl = row.querySelector('[class*="author"] a, [class*="subtitle"], .authorLabel');
  const imgEl = row.querySelector('img');
  if (titleEl && titleEl.textContent.trim()) {
    const title = titleEl.textContent.trim();
    if (!books.find(b => b.title === title)) {
      books.push({
        title: title,
        author: authorEl ? authorEl.textContent.replace(/^By:\s*/i, '').trim() : 'Unknown',
        cover: imgEl ? imgEl.src : ''
      });
    }
  }
});
localStorage.setItem('audibleBooks', JSON.stringify(books));
alert('Collected ' + books.length + ' books so far. Go to next page and run again!');
