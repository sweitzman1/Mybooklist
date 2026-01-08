// Export Purchase History Books (with cover URLs)
const books = JSON.parse(localStorage.getItem('purchaseHistoryBooks') || '[]');

if (books.length === 0) {
  alert('No books found! Run the scraper on each page first.');
} else {
  // Create CSV with year and cover URL
  const csv = books.map(b => {
    const title = (b.title || '').replace(/"/g, '""');
    const author = (b.author || 'Unknown').replace(/"/g, '""');
    const year = b.year || '2024';
    const cover = b.cover || '';
    return `"${title}","${author}",${year},"${cover}"`;
  }).join('\n');

  console.log('=== YOUR ' + books.length + ' BOOKS ===');
  console.log(csv);

  // Also log as JSON for the cover URLs
  console.log('\n=== JSON FORMAT (includes cover images) ===');
  console.log(JSON.stringify(books, null, 2));

  // Copy CSV to clipboard
  const textarea = document.createElement('textarea');
  textarea.value = csv;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  // Don't clear storage yet in case they need to re-export
  // localStorage.removeItem('purchaseHistoryBooks');

  alert('SUCCESS! Exported ' + books.length + ' books!\n\nCSV copied to clipboard (includes cover URLs).\n\nPaste into your Book List app Import feature.\n\nTo clear saved data, run: localStorage.removeItem("purchaseHistoryBooks")');
}
