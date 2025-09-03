import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { toast } from "sonner";

import {
  ApiErrorResponse,
  ApiResponse,
  PaginatedApiResponse,
  PaginatedResult,
  QueryOptions,
  RequestParams,
} from "@/types/api-response";
import { TokenPair } from "@/types/auth";
import { apiRoutes } from "@/config/api-routes";
import { TokenStorage } from "./token-storage";
import { env } from "../env";
import { authRoutes } from "@/config";

// Base configuration for axios
const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Type for retry config
interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Type for refresh token response
interface RefreshTokenResponse {
  tokens: TokenPair;
}

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token using TokenStorage
    const token = await TokenStorage.getAccessToken();

    // If token exists, add to Authorization header
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Helper function to handle API errors consistently
const handleApiError = (
  error: AxiosError<ApiErrorResponse>,
  showToast: boolean = true
): never => {
  if (error.response?.data) {
    const errorData = error.response.data;
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join(", ")
      : errorData.message;

    // Display error toast only if showToast is true
    if (showToast) {
      toast.error(
        errorMessage ||
          errorData.error ||
          "An error occurred while making the request. Please try again."
      );
    }

    // Throw a more informative error
    throw new Error(errorMessage || errorData.error, { cause: errorData });
  } else if (error.request) {
    // Request was made but no response was received
    const message = "No response received from server";
    if (showToast) {
      toast.error(message);
    }
    throw new Error(message, { cause: error });
  } else {
    // Something happened in setting up the request
    const message = error.message || "Error setting up request";
    if (showToast) {
      toast.error(message);
    }
    throw new Error(message, { cause: error });
  }
};

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryableRequestConfig;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token using TokenStorage
        const refreshToken = await TokenStorage.getRefreshToken();

        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = authRoutes.login;
          return Promise.reject(error);
        }

        // Call refresh token endpoint
        const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
          `${API_BASE_URL}${apiRoutes.auth.refreshAccessToken}`,
          { refreshToken }
        );

        // Store new tokens using TokenStorage
        await TokenStorage.setTokens(response.data.data.tokens);

        // Update Authorization header for the retry
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${response.data.data.tokens.accessToken}`,
        };

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        TokenStorage.clearTokens();
        window.location.href = authRoutes.login;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Error handling for API responses (without toast for GET requests)
const handleApiResponse = <T>(
  response: AxiosResponse<ApiResponse<T>>,
  showToast: boolean = false
): T => {
  const data = response.data;
  if (!data.isSuccessful) {
    if (showToast) {
      toast.error(data.message);
    }
    throw new Error(data.message || "API request failed");
  }

  // Show success toast for mutations
  if (showToast && data.message) {
    toast.success(data.message);
  }

  return data.data;
};

// Export instance and API methods
export const api = {
  // For regular (non-paginated) responses - NO TOAST
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance
      .get<ApiResponse<T>>(url, config)
      .then((response) => handleApiResponse<T>(response, false))
      .catch((error: AxiosError<ApiErrorResponse>) =>
        handleApiError(error, false)
      ),

  // For paginated responses - NO TOAST
  getPaginated: async <T>(
    url: string,
    queryOptions?: QueryOptions,
    config?: AxiosRequestConfig
  ): Promise<PaginatedResult<T>> => {
    // Create params object for axios
    const params: RequestParams = {};

    if (queryOptions?.page && queryOptions?.limit) {
      params.page = queryOptions.page ?? 1;
      params.limit = queryOptions.limit ?? 10;
    }

    if (queryOptions?.searchKey) {
      params.searchKey = queryOptions.searchKey;
    }

    if (queryOptions?.filters) {
      // Handle filters as nested objects instead of stringifying
      params.filters = queryOptions.filters;
    }

    if (queryOptions?.sort) {
      params.sort = queryOptions.sort;
    }

    // Merge params with any existing params in config
    const mergedConfig: AxiosRequestConfig = {
      ...config,
      params: {
        ...(config?.params || {}),
        ...params,
      },
    };

    try {
      const response = await axiosInstance.get<PaginatedApiResponse<T>>(
        url,
        mergedConfig
      );
      const data = response.data;

      if (!data.isSuccessful) {
        throw new Error(data.message || "API request failed");
      }

      return {
        data: data.data,
        meta: data.meta,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return handleApiError(error, false);
      } else {
        // Handle other types of errors
        throw error;
      }
    }
  },

  // Mutation methods - WITH TOAST
  post: <T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    axiosInstance
      .post<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, D>(url, data, config)
      .then((response) => handleApiResponse<T>(response, true))
      .catch((error: AxiosError<ApiErrorResponse>) =>
        handleApiError(error, true)
      ),

  put: <T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    axiosInstance
      .put<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, D>(url, data, config)
      .then((response) => handleApiResponse<T>(response, true))
      .catch((error: AxiosError<ApiErrorResponse>) =>
        handleApiError(error, true)
      ),

  patch: <T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    axiosInstance
      .patch<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, D>(
        url,
        data,
        config
      )
      .then((response) => handleApiResponse<T>(response, true))
      .catch((error: AxiosError<ApiErrorResponse>) =>
        handleApiError(error, true)
      ),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance
      .delete<ApiResponse<T>, AxiosResponse<ApiResponse<T>>>(url, config)
      .then((response) => handleApiResponse<T>(response, true))
      .catch((error: AxiosError<ApiErrorResponse>) =>
        handleApiError(error, true)
      ),
};

export default axiosInstance;
