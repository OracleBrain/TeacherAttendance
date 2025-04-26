import { QueryClient } from "@tanstack/react-query";

interface GetQueryFnOptions {
  on401?: "throw" | "returnNull";
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Helper for making API requests that handles credentials
export const apiRequest = async (
  method: string,
  endpoint: string,
  body?: any
) => {
  const res = await fetch(`${endpoint}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res;
};

// Helper for react-query queryFn
export const getQueryFn = (options: GetQueryFnOptions = {}) => {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const [endpoint] = queryKey;
    try {
      const res = await fetch(`${endpoint}`, {
        credentials: "include",
      });

      if (res.status === 401 && options.on401 === "returnNull") {
        return null;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }

      if (res.headers.get("Content-Type")?.includes("application/json")) {
        return res.json();
      }

      return null;
    } catch (error) {
      if (options.on401 === "returnNull" && error instanceof Error && error.message.includes("401")) {
        return null;
      }
      throw error;
    }
  };
};
