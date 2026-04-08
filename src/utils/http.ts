/** biome-ignore-all lint/suspicious/noExplicitAny: Generic HTTP utility requires flexible typing for various API responses */

import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import ENDPOINT, { ROUTES } from "@/constants/endpoint";
import type { ApiResponse, RefreshTokenResult } from "@/types/auth";

const StatusCode = {
  Unauthorized: 401,
  Forbidden: 403,
  TooManyRequests: 429,
  InternalServerError: 500,
} as const;

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Credentials": true,
  "X-Requested-With": "XMLHttpRequest",
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// We can use the following function to inject the JWT token through an interceptor
// We get the `accessToken` from the localStorage that we set when we authenticate
const injectToken = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  try {
    const token = localStorage.getItem("accessToken");

    if (token != null && config?.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error: unknown) {
    const { message } = error as Error;
    throw new Error(message);
  }
};

class Http {
  private instance: AxiosInstance | null = null;
  private isRefreshing = false;
  private pendingQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }> = [];

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp();
  }

  initHttp() {
    const http = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
      timeout: 20000,
      headers,
      withCredentials: true,
    });

    http.interceptors.request.use(injectToken, (error) =>
      Promise.reject(error),
    );

    http.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.handleError(error),
    );

    this.instance = http;
    return http;
  }

  request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.request(config);
  }

  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.get<T, R>(url, config);
  }

  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.post<T, R>(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.put<T, R>(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.delete<T, R>(url, config);
  }

  private flushQueue(error: unknown, token: string | null) {
    this.pendingQueue.forEach(({ resolve, reject }) => {
      if (token) {
        resolve(token);
      } else {
        reject(error);
      }
    });
    this.pendingQueue = [];
  }

  private handleAuthFailure(error: unknown) {
    localStorage.removeItem("accessToken");
    if (
      typeof window !== "undefined" &&
      window.location.pathname !== ROUTES.LOGIN
    ) {
      window.location.replace(ROUTES.LOGIN);
    }
    return Promise.reject(error);
  }

  // Handle global app errors
  // We can handle generic app errors depending on the status code
  private async handleError(error: AxiosError) {
    const response = error.response;
    const status = response?.status;
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      status === StatusCode.Unauthorized &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/refresh-token") &&
      !originalRequest.url?.includes("/api/auth/login")
    ) {
      originalRequest._retry = true;

      if (this.isRefreshing) {
        try {
          const newToken = await new Promise<string>((resolve, reject) => {
            this.pendingQueue.push({ resolve, reject });
          });
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return this.http.request(originalRequest);
        } catch (queueError) {
          return Promise.reject(queueError);
        }
      }

      this.isRefreshing = true;
      try {
        const { data } = await axios.post<ApiResponse<RefreshTokenResult>>(
          ENDPOINT.AUTH.REFRESH_TOKEN,
          undefined,
          {
            baseURL: this.http.defaults.baseURL,
            timeout: this.http.defaults.timeout,
            withCredentials: true,
            headers,
          },
        );
        const newAccessToken = data.result.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        this.flushQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return this.http.request(originalRequest);
      } catch (refreshError) {
        this.flushQueue(refreshError, null);
        return this.handleAuthFailure(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    }

    switch (status) {
      case StatusCode.InternalServerError: {
        // Handle InternalServerError
        break;
      }
      case StatusCode.Forbidden: {
        // Handle Forbidden
        break;
      }
      case StatusCode.Unauthorized: {
        // Handle Unauthorized
        break;
      }
      case StatusCode.TooManyRequests: {
        // Handle TooManyRequests
        break;
      }
    }

    return Promise.reject(error);
  }
}

export const http = new Http();
