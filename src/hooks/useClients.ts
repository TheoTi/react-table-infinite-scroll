import { ClientsService } from '@/services/ClientsService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePagination } from './usePagination';
import { useEffect } from 'react';

export function useClients(perPage = 20) {
  const {
    currentPage,
    initialPage,
    nextPage,
    previousPage,
    setPage
  } = usePagination();

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['clients', {
      page: currentPage,
      perPage
    }],
    staleTime: Infinity,
    queryFn: () => ClientsService.getAll(currentPage, perPage),
  });

  const totalItems = data?.items ?? 0;
  const totalPages = Math.ceil(totalItems / perPage );

  const hasPreviousPage = currentPage > initialPage;
  const hasNextPage = currentPage < totalPages;

  useEffect(() => {
    if (hasNextPage) {
      const nextPage = currentPage + 1;

      queryClient.prefetchQuery({
        queryKey: ['clients', {
          page: nextPage,
          perPage
        }],
        staleTime: Infinity,
        queryFn: () => ClientsService.getAll(nextPage, perPage),
      });
    }
  }, [currentPage, hasNextPage]);

  return {
    clients: data?.data ?? [],
    isLoading,
    pagination : {
      nextPage,
      previousPage,
      setPage,

      totalPages,
      currentPage,

      hasPreviousPage,
      hasNextPage
    }
  };
}
