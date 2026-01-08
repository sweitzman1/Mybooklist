'use client';

import { useState } from 'react';
import { Trash2, Edit2, X, Check } from 'lucide-react';
import { Book } from '@/types';
import { useBookStore } from '@/store/bookStore';

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  const { deleteBook, updateBook } = useBookStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState(book);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    updateBook(book.id, editedBook);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBook(book);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
      {/* Book Cover */}
      <div className="relative aspect-square bg-gray-100">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600">
            <span className="text-white text-4xl font-bold">
              {book.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 bg-white rounded-full hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editedBook.title}
              onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Title"
            />
            <input
              type="text"
              value={editedBook.author}
              onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Author"
            />
            <input
              type="number"
              value={editedBook.yearRead}
              onChange={(e) => setEditedBook({ ...editedBook, yearRead: parseInt(e.target.value) })}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Year Read"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                <Check className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
              >
                <X className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-gray-800 truncate" title={book.title}>
              {book.title}
            </h3>
            <p className="text-sm text-gray-500 truncate" title={book.author}>
              {book.author}
            </p>
            <p className="text-xs text-purple-600 mt-1">Read in {book.yearRead}</p>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Delete Book?</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete "{book.title}"?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteBook(book.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
