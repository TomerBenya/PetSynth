// API client utilities

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8787';

interface FetchJsonOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  token?: string | null;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: any,
    message?: string
  ) {
    super(message || `API Error: ${status}`);
    this.name = 'ApiError';
  }
}

/**
 * Fetch JSON data from API with automatic token handling
 * @param url - API endpoint URL (relative or absolute)
 * @param options - Fetch options (method, body, token, headers)
 * @returns Promise<T> - Parsed JSON response
 * @throws ApiError - On non-2xx responses
 */
export async function fetchJson<T = any>(
  url: string,
  options: FetchJsonOptions = {}
): Promise<T> {
  const { method = 'GET', body, token, headers = {} } = options;

  // Build full URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  // Build headers
  const fetchHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authorization header if token provided
  if (token) {
    fetchHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Build fetch options
  const fetchOptions: RequestInit = {
    method,
    headers: fetchHeaders,
  };

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  // Make request
  const response = await fetch(fullUrl, fetchOptions);

  // Parse JSON response
  let data: any;
  try {
    data = await response.json();
  } catch (error) {
    // If JSON parsing fails, throw with status
    throw new ApiError(response.status, null, 'Failed to parse JSON response');
  }

  // Throw on non-2xx responses
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data,
      data?.error || data?.message || `Request failed with status ${response.status}`
    );
  }

  return data as T;
}
