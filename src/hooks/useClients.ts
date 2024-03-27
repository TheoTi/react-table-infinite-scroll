import { ClientsService } from '@/services/ClientsService';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useClients(perPage = 20) {

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['clients'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => ClientsService.getAll(pageParam, perPage),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const totalPages = Math.ceil(lastPage.items / perPage);
      const isLastPage =  allPages.length >= totalPages;

      if (isLastPage) {
        return null;
      }

      return lastPageParam + 1;
    },

  });

  const clients = data?.pages.flatMap(page => page.data);

  return {
    clients: clients ?? [],
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    nextPage: fetchNextPage
  };
}
