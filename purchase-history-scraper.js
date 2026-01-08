// Purchase History Scraper for Audible (with images)
const books = JSON.parse(localStorage.getItem('purchaseHistoryBooks') || '[]');
let newCount = 0;

// Find all table rows that contain book info
document.querySelectorAll('tr').forEach(row => {
  const text = row.innerText || '';

  // Skip header rows and short rows
  if (text.length < 30) return;
  if (text.includes('Title') && text.includes('Purchased') && text.includes('Total')) return;

  // Look for rows that have a date pattern (MM-DD-YYYY)
  const dateMatch = text.match(/(\d{2}-\d{2}-\d{4})/);
  if (!dateMatch) return;

  // Split by newlines and clean up
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // First line should be title
  let title = lines[0];
  if (!title || title.length < 3) return;

  // Find author line (starts with "By:")
  let author = 'Unknown';
  const authorLine = lines.find(l => l.startsWith('By:'));
  if (authorLine) {
    author = authorLine.replace(/^By:\s*/i, '').trim();
  }

  // Get year from date
  const year = dateMatch[1].split('-')[2];

  // Get cover image from this row
  const img = row.querySelector('img[src*="m.media-amazon"]');
  const cover = img ? img.src : '';

  // Skip duplicates
  if (books.find(b => b.title === title)) return;

  books.push({
    title: title,
    author: author,
    year: year,
    cover: cover
  });
  newCount++;
});

console.log('Found', newCount, 'NEW books on this page');
console.log('Total collected:', books.length);

// Save to localStorage
localStorage.setItem('purchaseHistoryBooks', JSON.stringify(books));

alert('Found ' + newCount + ' new books on this page!\n\nTotal collected: ' + books.length + ' books\n\nGo to next page/year and run again.\nWhen done with ALL pages, run the EXPORT script.');
