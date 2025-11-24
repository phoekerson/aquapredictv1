'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyCanvasProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnlyCanvas({ children, fallback }: ClientOnlyCanvasProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Double check to ensure we're on client
    if (typeof window !== 'undefined') {
      setHasMounted(true);
    }
  }, []);

  // Never render on server
  if (typeof window === 'undefined' || !hasMounted) {
    return <>{fallback || <div className="flex items-center justify-center h-full text-gray-400">Loading 3D scene...</div>}</>;
  }

  return <>{children}</>;
}

