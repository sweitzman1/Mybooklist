'use client';

import { useState, useRef } from 'react';
import { X, Upload, FileText, FolderOpen } from 'lucide-react';
import { useBookStore } from '@/store/bookStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: Props) {
  const { importBooks } = useBookStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvText, setCsvText] = useState('');
  const [importCount, setImportCount] = useState(0);
  const [error, setError] = useState('');

  const parseAndImport = (text: string) => {
    setError('');
    const lines = text.trim().split('\n');

    if (lines.length === 0) {
      setError('No data to import');
      return;
    }

    const books: { title: string; author: string; yearRead: number; coverImage: string }[] = [];

    for (const line of lines) {
      // Skip empty lines and header
      if (!line.trim() || (line.toLowerCase().includes('title') && line.toLowerCase().includes('author'))) {
        continue;
      }

      // Try to parse CSV (handle quoted values)
      const parts = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);

      if (parts && parts.length >= 2) {
        const title = parts[0]?.replace(/^"|"$/g, '').trim() || '';
        const author = parts[1]?.replace(/^"|"$/g, '').trim() || '';
        const yearRead = parts[2] ? parseInt(parts[2].replace(/^"|"$/g, '').trim()) : new Date().getFullYear();
        const coverImage = parts[3]?.replace(/^"|"$/g, '').trim() || '';

        if (title && author) {
          books.push({
            title,
            author,
            yearRead: isNaN(yearRead) ? new Date().getFullYear() : yearRead,
            coverImage,
          });
        }
      }
    }

    if (books.length === 0) {
      setError('Could not parse any books. Make sure format is: Title, Author, Year');
      return;
    }

    importBooks(books);
    setImportCount(books.length);
    setCsvText('');

    setTimeout(() => {
      setImportCount(0);
      onClose();
    }, 2000);
  };

  const handleImport = () => {
    parseAndImport(csvText);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;

      // Check if it's JSON
      if (file.name.endsWith('.json')) {
        try {
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            // Convert JSON to CSV format
            const csvLines = json.map((b: any) => {
              const title = (b.title || '').replace(/"/g, '""');
              const author = (b.author || '').replace(/"/g, '""');
              const year = b.year || b.yearRead || new Date().getFullYear();
              const cover = b.cover || b.coverImage || '';
              return `"${title}","${author}",${year},"${cover}"`;
            }).join('\n');
            parseAndImport(csvLines);
          }
        } catch {
          setError('Invalid JSON file');
        }
      } else {
        // Treat as CSV
        parseAndImport(text);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Import Books</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {importCount > 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-medium text-green-600">
                Successfully imported {importCount} books!
              </p>
            </div>
          ) : (
            <>
              {/* File Browser Button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors flex items-center justify-center gap-3"
                >
                  <FolderOpen className="w-6 h-6 text-purple-600" />
                  <span className="text-purple-700 font-medium">Browse for CSV or JSON file</span>
                </button>
              </div>

              <div className="text-center text-gray-400 text-sm">— or paste below —</div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-medium text-purple-800 mb-2">Format</h3>
                <p className="text-sm text-purple-700">
                  CSV format: Title, Author, Year, CoverURL
                </p>
                <code className="block mt-2 text-xs bg-white p-2 rounded text-gray-700">
                  "The Great Gatsby","F. Scott Fitzgerald",2023,""<br />
                  "1984","George Orwell",2022,""
                </code>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste your book list
                </label>
                <textarea
                  value={csvText}
                  onChange={(e) => {
                    setCsvText(e.target.value);
                    setError('');
                  }}
                  className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none font-mono text-sm"
                  placeholder="Paste your CSV data here..."
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                onClick={handleImport}
                disabled={!csvText.trim()}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Import Books
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
