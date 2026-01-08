// Export all collected Audible books
const books = JSON.parse(localStorage.getItem('myAudibleBooks') || '[]');

if (books.length === 0) {
  alert('No books found! Run the scraper script on each page first.');
} else {
  // Create CSV
  const csv = books.map(b => {
    const title = (b.title || '').replace(/"/g, '""');
    const author = (b.author || 'Unknown').replace(/"/g, '""');
    return `"${title}","${author}",2024`;
  }).join('\n');

  console.log('=== YOUR ' + books.length + ' BOOKS ===');
  console.log(csv);

  // Copy to clipboard
  const textarea = document.createElement('textarea');
  textarea.value = csv;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  // Clear storage
  localStorage.removeItem('myAudibleBooks');

  alert('SUCCESS! Exported ' + books.length + ' books.\n\nCSV copied to clipboard!\n\nNow paste into your Book List app Import feature.');
}
