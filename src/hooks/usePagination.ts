import { useCallback, useEffect, useState } from 'react';

export function usePagination(initialPage = 1) {
  const [ currentPage, setCurrentPage ] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const page = searchParams.get('page');

    if ( !page ) {
      return initialPage;
    }

    return Number(page);
  });

  useEffect(() => {
    const { searchParams, origin, pathname } = new URL(window.location.href);

    searchParams.set('page', currentPage.toString());

    const url = `${origin}${pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, '', url);
  }, [currentPage]);

  const nextPage = useCallback(() => {
    setCurrentPage(prevState => prevState + 1);
  }, []);

  const previousPage = useCallback(() => {
    setCurrentPage(prevState => prevState - 1);
  }, []);

  const setPage = useCallback(( page: number ) => {
    setCurrentPage(page);
  }, []);

  return {
    nextPage,
    previousPage,
    setPage,

    initialPage,
    currentPage
  };
}
