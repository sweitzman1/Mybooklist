// Diagnose Purchase History page structure
console.log('=== PURCHASE HISTORY DIAGNOSIS ===');
console.log('URL:', window.location.href);

// Find tables
const tables = document.querySelectorAll('table');
console.log('Tables found:', tables.length);

// Find rows
const rows = document.querySelectorAll('tr');
console.log('Table rows found:', rows.length);

// Find links (book titles are often links)
const links = document.querySelectorAll('a');
console.log('Links found:', links.length);

// Find images
const images = document.querySelectorAll('img');
console.log('Images found:', images.length);

// Look for specific patterns
['order', 'purchase', 'product', 'title', 'item'].forEach(p => {
  const matches = document.querySelectorAll(`[class*="${p}"]`);
  if (matches.length > 0) {
    console.log(`Found ${matches.length} elements with "${p}" in class`);
  }
});

// Try to find book entries - look for images with Amazon media URLs
const bookImages = document.querySelectorAll('img[src*="m.media-amazon"]');
console.log('Book cover images found:', bookImages.length);

// Show first few potential book entries
console.log('\n=== SAMPLE CONTENT ===');
let count = 0;
document.querySelectorAll('tr').forEach(row => {
  if (count >= 5) return;
  const text = row.innerText?.trim();
  if (text && text.length > 20 && text.length < 500) {
    console.log('Row:', text.substring(0, 200));
    count++;
  }
});

// Also check for any spans or divs with substantial text
console.log('\n=== LOOKING FOR TITLES ===');
document.querySelectorAll('a, span, div').forEach(el => {
  const text = el.innerText?.trim();
  // Look for things that look like book titles
  if (text && text.length > 10 && text.length < 100 && !text.includes('\n') && !text.includes('$')) {
    const parent = el.parentElement?.className || '';
    if (parent.includes('title') || parent.includes('product') || parent.includes('name')) {
      console.log('Potential title:', text, '| class:', el.className);
    }
  }
});
