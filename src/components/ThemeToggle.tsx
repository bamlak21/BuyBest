'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleTheme, setTheme } from '../store/slices/themeSlice';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check system preference and localStorage
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    
    dispatch(setTheme(shouldBeDark));
  }, [dispatch]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <div className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleToggle}>
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}