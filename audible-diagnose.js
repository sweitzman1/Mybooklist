// This will show us what's on the page
console.log('=== DIAGNOSING PAGE ===');
console.log('URL:', window.location.href);

// Try to find any book-like elements
const allElements = document.body.innerHTML;

// Look for common patterns
const patterns = [
  'product-list',
  'library',
  'title',
  'book',
  'asin'
];

patterns.forEach(p => {
  const matches = document.querySelectorAll(`[class*="${p}"]`);
  if (matches.length > 0) {
    console.log(`Found ${matches.length} elements with "${p}" in class`);
  }
});

// Show all list items
const listItems = document.querySelectorAll('li');
console.log('Total <li> elements:', listItems.length);

// Show the page HTML structure (first 5000 chars)
console.log('=== COPY EVERYTHING BELOW THIS LINE ===');
console.log(document.body.innerHTML.substring(0, 8000));
