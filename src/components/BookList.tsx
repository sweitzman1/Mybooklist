'use client';

import { useState, useMemo } from 'react';
import { Plus, Upload, LogOut, Search, Filter, BookOpen } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useBookStore } from '@/store/bookStore';
import BookCard from './BookCard';
import AddBookModal from './AddBookModal';
import ImportModal from './ImportModal';

export default function BookList() {
  const { logout } = useAuthStore();
  const { books } = useBookStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<number | 'all'>('all');

  // Get unique years for filter
  const years = useMemo(() => {
    const uniqueYears = [...new Set(books.map((b) => b.yearRead))];
    return uniqueYears.sort((a, b) => b - a);
  }, [books]);

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = filterYear === 'all' || book.yearRead === filterYear;
      return matchesSearch && matchesYear;
    });
  }, [books, searchTerm, filterYear]);

  // Group books by year
  const booksByYear = useMemo(() => {
    const grouped: { [key: number]: typeof books } = {};
    filteredBooks.forEach((book) => {
      if (!grouped[book.yearRead]) {
        grouped[book.yearRead] = [];
      }
      grouped[book.yearRead].push(book);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, books]) => ({ year: Number(year), books }));
  }, [filteredBooks]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">My Book List</h1>
                <p className="text-sm text-gray-500">{books.length} books</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search books..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none w-48"
                />
              </div>

              {/* Year Filter */}
              {years.length > 0 && (
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    <option value="all">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Actions */}
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Book</span>
              </button>

              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {books.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-white/80" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No books yet</h2>
            <p className="text-white/70 mb-6">Start building your reading list!</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Your First Book
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
              >
                <Upload className="w-5 h-5" />
                Import from CSV
              </button>
            </div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/70">No books match your search.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {booksByYear.map(({ year, books }) => (
              <section key={year}>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="bg-white/20 px-4 py-1 rounded-full">{year}</span>
                  <span className="text-white/60 text-lg font-normal">
                    {books.length} {books.length === 1 ? 'book' : 'books'}
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddBookModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
    </div>
  );
}
