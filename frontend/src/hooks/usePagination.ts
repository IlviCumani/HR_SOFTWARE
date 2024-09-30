import { useState, useCallback } from "react";
const usePagination = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [itemCount, setItemCount] = useState(0);
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  return {
    page,
    limit,
    handlePageChange,
    handleLimitChange,
    itemCount,
    setItemCount,
  };
};

export default usePagination;
