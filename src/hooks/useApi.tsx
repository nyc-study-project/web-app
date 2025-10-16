import { useState, useEffect, useCallback } from "react";

/**
 * Generic API hook for calling OpenAPI-generated client methods.
 * - T: response payload type
 * - Args: tuple of arg types for the API function
 */
export const useApi = <T, Args extends unknown[] = unknown[]>(
  apiFunc?: (...args: Args) => Promise<T>,
  { lazy = false }: { lazy?: boolean } = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!lazy);

  const execute = useCallback(
    async (...args: Args): Promise<
      | { success: true; data: T }
      | { success: false; error: unknown }
    > => {
      if (!apiFunc) {
        const err = new Error("API function not provided.");
        setError(err);
        return { success: false, error: err };
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await apiFunc(...args);

        // If someone wraps responses as { data }, fall back gracefully.
        const payload =
          (response as unknown as { data?: T })?.data !== undefined
            ? (response as unknown as { data: T }).data
            : response;

        setData(payload as T);
        return { success: true, data: payload as T };
      } catch (err) {
        setError(err);
        return { success: false, error: err };
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunc]
  );

  useEffect(() => {
    if (!lazy && apiFunc) {
      void execute();
    }
  }, [lazy, apiFunc, execute]);

  return {
    data,
    error,
    isLoading,
    execute,
    refetch: execute,
  };
};
