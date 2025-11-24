'use client';

import React, { useEffect, useState } from 'react';

type Loader<T> = () => Promise<T>;

function createLazyComponent<T extends object>(
  key: string,
  loader: Loader<React.ComponentType<T>>
) {
  let cachedComponent: React.ComponentType<T> | null = null;

  return function LazyComponent(props: T) {
    const [Component, setComponent] = useState<React.ComponentType<T> | null>(
      () => cachedComponent
    );

    useEffect(() => {
      if (!Component) {
        let mounted = true;
        loader().then((LoadedComponent) => {
          if (!mounted) return;
          cachedComponent = LoadedComponent;
          setComponent(() => LoadedComponent);
        });
        return () => {
          mounted = false;
        };
      }
    }, [Component]);

    if (!Component) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          Loading 3D scene...
        </div>
      );
    }

    return <Component {...props} />;
  };
}

export const Canvas = createLazyComponent(
  'Canvas',
  () => import('@react-three/fiber').then((mod) => mod.Canvas)
);

export const OrbitControls = createLazyComponent(
  'OrbitControls',
  () => import('@react-three/drei').then((mod) => mod.OrbitControls)
);

export const Text3D = createLazyComponent(
  'Text',
  () => import('@react-three/drei').then((mod) => mod.Text)
);

