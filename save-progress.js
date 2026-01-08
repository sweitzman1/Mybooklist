// Save your scraping progress to a file
const books = JSON.parse(localStorage.getItem('purchaseHistoryBooks') || '[]');

if (books.length === 0) {
  alert('No books saved yet. Nothing to backup.');
} else {
  const json = JSON.stringify(books, null, 2);
  const blob = new Blob([json], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'audible-books-backup.json';
  a.click();
  URL.revokeObjectURL(url);
  alert('Saved ' + books.length + ' books to audible-books-backup.json\n\nThis file is in your Downloads folder.');
}
