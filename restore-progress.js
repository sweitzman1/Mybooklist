// Restore your scraping progress from backup
// INSTRUCTIONS: First, open your audible-books-backup.json file,
// copy ALL the contents, then replace PASTE_JSON_HERE below with it.

const backupData = PASTE_JSON_HERE;

if (Array.isArray(backupData) && backupData.length > 0) {
  localStorage.setItem('purchaseHistoryBooks', JSON.stringify(backupData));
  alert('Restored ' + backupData.length + ' books!\n\nYou can continue scraping more pages now.');
} else {
  alert('Invalid backup data. Make sure you pasted the JSON correctly.');
}
