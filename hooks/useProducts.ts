"use client";

import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '@/lib/api-client';
import { Product, Category } from '@/types/product';

interface UseProductsOptions {
  category?: string;
  featured?: boolean;
  search?: string;
}

// Fetch all products with optional filters
export function useProducts(options?: UseProductsOptions) {
  return useQuery<Product[]>({
    queryKey: ['products', options],
    queryFn: async () => {
      const params: any = {};
      if (options?.category) params.category = options.category;
      if (options?.featured) params.featured = "true";
      if (options?.search) params.search = options.search;
      
      return productsApi.getAll(params);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch single product by slug
export function useProduct(slug: string) {
  return useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
  });
}

// Fetch all categories
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
