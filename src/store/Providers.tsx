'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './slices/authSlice';
import { AppDispatch } from './index';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}