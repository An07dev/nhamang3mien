'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PackageTheme,
  PackageItem,
  CategoryItem,
  DEFAULT_FALLBACK_CATEGORIES,
  DEFAULT_FALLBACK_PACKAGES,
} from '@/lib/default-packages';

export type { PackageTheme, PackageItem, CategoryItem };
export { DEFAULT_FALLBACK_CATEGORIES, DEFAULT_FALLBACK_PACKAGES };

interface PackagesContextType {
  categories: CategoryItem[];
  packages: PackageItem[];
  isLoading: boolean;
  refreshPackages: () => Promise<void>;
}

const PackagesContext = createContext<PackagesContextType>({
  categories: DEFAULT_FALLBACK_CATEGORIES,
  packages: DEFAULT_FALLBACK_PACKAGES,
  isLoading: false,
  refreshPackages: async () => {},
});

export function PackagesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_FALLBACK_CATEGORIES);
  const [packages, setPackages] = useState<PackageItem[]>(DEFAULT_FALLBACK_PACKAGES);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = useCallback(async () => {
    try {
      const res = await fetch('/api/packages');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
          if (data.packages && data.packages.length > 0) {
            setPackages(data.packages);
          }
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách gói cước:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return (
    <PackagesContext.Provider
      value={{
        categories,
        packages,
        isLoading,
        refreshPackages: fetchPackages,
      }}
    >
      {children}
    </PackagesContext.Provider>
  );
}

export function usePackages() {
  const context = useContext(PackagesContext);
  return (
    context || {
      categories: DEFAULT_FALLBACK_CATEGORIES,
      packages: DEFAULT_FALLBACK_PACKAGES,
      isLoading: false,
      refreshPackages: async () => {},
    }
  );
}
