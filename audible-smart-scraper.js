// Smart Audible Scraper - tries multiple methods
localStorage.removeItem('audibleBooks'); // Fresh start
const books = [];

// Method 1: Look for rows with data-asin (Amazon product IDs)
document.querySelectorAll('[data-asin]').forEach(el => {
  const title = el.querySelector('h2, h3, [class*="title"]')?.textContent?.trim();
  const author = el.querySelector('[class*="author"], [class*="subtitle"]')?.textContent?.replace(/^By:\s*/i, '').trim();
  const img = el.querySelector('img')?.src;
  if (title && !books.find(b => b.title === title)) {
    books.push({ title, author: author || 'Unknown', cover: img || '' });
  }
});

// Method 2: Look for list items containing images and headings
if (books.length < 10) {
  document.querySelectorAll('li').forEach(li => {
    const hasImg = li.querySelector('img[src*="image"]');
    const heading = li.querySelector('h2, h3, h4');
    if (hasImg && heading) {
      const title = heading.textContent?.trim();
      const author = li.querySelector('a:not(:first-child), span[class*="subtle"]')?.textContent?.replace(/^By:\s*/i, '').trim();
      if (title && !books.find(b => b.title === title)) {
        books.push({ title, author: author || 'Unknown', cover: hasImg.src || '' });
      }
    }
  });
}

// Method 3: Find all images with "audible" or "amazon" in src, get nearby text
if (books.length < 10) {
  document.querySelectorAll('img[src*="m.media-amazon"], img[src*="images-amazon"]').forEach(img => {
    const container = img.closest('li, div[class*="row"], div[class*="item"], article');
    if (container) {
      const texts = Array.from(container.querySelectorAll('h2, h3, h4, a, span'))
        .map(el => el.textContent?.trim())
        .filter(t => t && t.length > 2 && t.length < 200);
      if (texts.length >= 1) {
        const title = texts[0];
        const author = texts[1] || 'Unknown';
        if (!books.find(b => b.title === title)) {
          books.push({ title, author: author.replace(/^By:\s*/i, ''), cover: img.src });
        }
      }
    }
  });
}

console.log('Found ' + books.length + ' books on this page');
console.log(books);

if (books.length > 0) {
  const existing = JSON.parse(localStorage.getItem('allAudibleBooks') || '[]');
  const combined = [...existing, ...books];
  localStorage.setItem('allAudibleBooks', JSON.stringify(combined));
  alert('Found ' + books.length + ' books on this page. Total collected: ' + combined.length + '\n\nGo to next page and run again, or if this is the last page, run the EXPORT script.');
} else {
  alert('Could not find books. Please right-click on a book title, click Inspect, and tell me what HTML tag and class you see.');
}
