import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { tokenStorage } from "@/utils/storage";

import { logout, setAccessToken } from "@/store/slices/authSlice";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const REFRESH_ENDPOINT = "/auth/token/refresh/";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // Access token has expired or is invalid
  if (result.error?.status === 401) {
    console.log("Access token expired. Attempting refresh...");

    const refreshToken = await tokenStorage.getRefreshToken();

    if (!refreshToken) {
      console.log("No refresh token available. Logging out.");

      await tokenStorage.clearTokens();

      api.dispatch(logout());

      return result;
    }

    // Request a new access token
    const refreshResult = await rawBaseQuery(
      {
        url: REFRESH_ENDPOINT,
        method: "POST",
        body: {
          refresh: refreshToken,
        },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const data = refreshResult.data as {
        access: string;
        refresh?: string;
      };

      const newAccessToken = data.access;

      if (!newAccessToken) {
        console.log("Refresh succeeded but no access token was returned.");

        await tokenStorage.clearTokens();

        api.dispatch(logout());

        return result;
      }

      // Store the new access token securely
      await tokenStorage.setTokens(newAccessToken, data.refresh);

      // Update Redux runtime state
      api.dispatch(setAccessToken(newAccessToken));

      // Retry the original request
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      console.log("Refresh token is invalid or expired.");

      await tokenStorage.clearTokens();

      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "Auth",
    "Accounts",
    "Transaction",
    "Loans",
    "FinancialReminder",
    "Dashboard",
    "User",
  ],

  endpoints: () => ({}),
});
