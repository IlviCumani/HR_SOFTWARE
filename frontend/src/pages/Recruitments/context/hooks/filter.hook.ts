import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export interface Filters {
  name?: string | null;
  surname?: string | null;
  stage?: string | null;
  reference?: string | null;
  position?: string | null;
}

const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    name: searchParams.get("name"),
    surname: searchParams.get("surname"),
    stage: searchParams.get("stage"),
    reference: searchParams.get("reference"),
    position: searchParams.get("position"),
  });

  useEffect(() => {
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  const updateFilter = (key: keyof Filters, value: string | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: null,
      surname: null,
      stage: null,
      reference: null,
      position: null,
    });
    setSearchParams(new URLSearchParams());
  };

  return { filters, updateFilter, clearFilters };
};

export default useFilters;
