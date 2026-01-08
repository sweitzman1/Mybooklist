// Export all collected books
const books = JSON.parse(localStorage.getItem('allAudibleBooks') || '[]');

if (books.length === 0) {
  alert('No books collected yet. Run the scraper on each page first.');
} else {
  const csv = books.map(b => {
    const title = b.title.replace(/"/g, '""');
    const author = b.author.replace(/"/g, '""');
    return `"${title}","${author}",2024`;
  }).join('\n');

  console.log('=== YOUR BOOKS ===');
  console.log(csv);

  // Copy to clipboard
  const textarea = document.createElement('textarea');
  textarea.value = csv;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  localStorage.removeItem('allAudibleBooks');
  alert('Exported ' + books.length + ' books! CSV copied to clipboard.\n\nNow paste into your Book List app\'s Import feature.');
}
