'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import LoginForm from '@/components/LoginForm';
import BookList from '@/components/BookList';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? <BookList /> : <LoginForm />;
}
