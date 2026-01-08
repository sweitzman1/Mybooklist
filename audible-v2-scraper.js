// Audible Library Scraper v2 - finds all book rows
localStorage.removeItem('myAudibleBooks');
const books = [];

// Method 1: Find product rows by looking for elements with book images
document.querySelectorAll('img[src*="m.media-amazon"]').forEach(img => {
  // Get the parent row/container
  let container = img.closest('li, tr, div[class*="row"], article');
  if (!container) container = img.parentElement?.parentElement?.parentElement;
  if (!container) return;

  // Skip tiny images (icons, not book covers)
  if (img.width < 50 || img.height < 50) return;

  // Get all text from the container
  const allText = container.innerText || '';
  const lines = allText.split('\n').map(l => l.trim()).filter(l => l && l.length > 1 && l.length < 200);

  // First substantial line is usually the title
  const title = lines.find(l => l.length > 3 && !l.includes('By:') && !l.includes('Rating') && !l.includes('stars') && !l.includes('hr') && !l.includes('min'));

  // Find author (usually after "By:" or second line)
  let author = 'Unknown';
  const byLine = lines.find(l => l.includes('By:'));
  if (byLine) {
    author = byLine.replace(/^By:\s*/i, '').trim();
  } else if (lines.length > 1) {
    author = lines[1];
  }

  if (title && !books.find(b => b.title === title)) {
    books.push({
      title: title,
      author: author,
      cover: img.src
    });
  }
});

console.log('Method 1 found:', books.length, 'books');

// If we didn't find enough, try Method 2
if (books.length < 10) {
  console.log('Trying Method 2...');
  // Look for headings inside library rows
  document.querySelectorAll('[class*="library"] h1, [class*="library"] h2, [class*="library"] h3').forEach(h => {
    const title = h.innerText?.trim();
    if (title && title.length > 3 && !books.find(b => b.title === title)) {
      const container = h.closest('li, tr, div[class*="row"]');
      const authorEl = container?.querySelector('[class*="author"], [class*="subtitle"]');
      books.push({
        title: title,
        author: authorEl?.innerText?.replace(/^By:\s*/i, '').trim() || 'Unknown',
        cover: container?.querySelector('img')?.src || ''
      });
    }
  });
}

console.log('Total found:', books.length, 'books');
console.log('Books:', books);

// Save to localStorage for accumulation across pages
const existing = JSON.parse(localStorage.getItem('myAudibleBooks') || '[]');
const combined = [...existing];
books.forEach(b => {
  if (!combined.find(e => e.title === b.title)) {
    combined.push(b);
  }
});
localStorage.setItem('myAudibleBooks', JSON.stringify(combined));

alert('Found ' + books.length + ' books on this page.\nTotal collected: ' + combined.length + '\n\nGo to next page and run again. On last page, run the EXPORT script.');
