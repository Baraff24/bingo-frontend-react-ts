import useSWR from 'swr';
import { ZodSchema } from 'zod';

/**
 * Custom hook for data fetching with validation using Zod.
 * @param url - The API endpoint to fetch data from. If null, fetching is disabled.
 * @param schema - Zod schema to validate the fetched data.
 * @returns An object containing the data, error, loading state, and mutate function.
 */
export function useDataFetching<T>(url: string | null, schema: ZodSchema<T>) {
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data from ${url}: ${response.statusText}`);
    }
    const data = await response.json();
    return schema.parse(data);
  };

  const { data, error, mutate, isValidating } = useSWR<T>(url, fetcher);

  return {
    data,
    error,
    isLoading: isValidating && !data,
    mutate,
  };
}
