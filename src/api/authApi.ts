import { baseApi } from "./baseQuery";

interface LoginRequest {
  email: string;

  password: string;
}
interface RegisterRequest {
  email: string;

  password: string;

  first_name: string;
}
interface LoginResponse {
  data: {
    access: string;

    refresh: string;

    user: {
      id: number;
      email: string;
      first_name: string;
    };
    security: {
      setup_required: boolean;
      verification_required: boolean;
      methods: string[];
    };
  };
}
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  username?: string;
}

export interface UpdateUserProfileRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login/",

        method: "POST",

        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register/",
        method: "POST",
        body,
      }),
    }),
    tokenVerify: builder.mutation<unknown, { token: string }>({
      query: ({ token }) => ({
        url: "/auth/token/verify/",
        method: "POST",
        body: {
          token,
        },
      }),
    }),
    refreshToken: builder.mutation<
      {
        access: string;
        refresh?: string;
      },
      {
        refresh: string;
      }
    >({
      query: ({ refresh }) => ({
        url: "/auth/token/refresh/",
        method: "POST",
        body: {
          refresh,
        },
      }),
    }),
    pinsetup: builder.mutation({
      query: (body) => ({
        url: "/auth/security/pin/setup/",
        method: "POST",
        body,
      }),
    }),
    pinverify: builder.mutation({
      query: (body) => ({
        url: "/auth/security/pin/verify/",
        method: "POST",
        body,
      }),
    }),
    forgotpassword: builder.mutation({
      query: (body) => ({
        url: "/auth/password/forgot/",
        method: "POST",
        body,
      }),
    }),
    VerifyPasswordResetOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/password/verify-otp/",
        method: "POST",
        body,
      }),
    }),
    ResetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/password/reset/",
        method: "POST",
        body,
      }),
    }),
    forgotpin: builder.mutation({
      query: (body) => ({
        url: "auth/security/pin_reset/request_otp/",
        method: "POST",
        body,
      }),
    }),
    verifyPinResetOtp: builder.mutation({
      query: ({ otp }) => ({
        url: "auth/security/pin_reset/verify_otp/",
        method: "POST",
        body: {
          otp,
        },
      }),
    }),
    resetPin: builder.mutation({
      query: (body) => ({
        url: "auth/security/pin_reset/request_otp/",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<void, { refresh: string }>({
      query: ({ refresh }) => ({
        url: "auth/logout/",
        method: "POST",
        body: {
          refresh,
        },
      }),
    }),
    getCurrentUser: builder.query<any, void>({
      query: () => ({
        url: "/auth/me/",
        method: "GET",
      }),
    }),
    updateUserProfile: builder.mutation<UserProfile, UpdateUserProfileRequest>({
      query: (body) => ({
        url: "/auth/me/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUserAccount: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/me/",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<any, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password/",
        method: "POST",
        body,
      }),
    }),
    getCurrentAppVersion: builder.query<any, string>({
      query: (platform) => ({
        url: "/app-versions/current/",
        params: {
          platform,
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useTokenVerifyMutation,
  usePinsetupMutation,
  usePinverifyMutation,
  useLogoutMutation,
  useForgotpasswordMutation,
  useVerifyPasswordResetOtpMutation,
  useResetPasswordMutation,
  useForgotpinMutation,
  useVerifyPinResetOtpMutation,
  useResetPinMutation,
  useLazyGetCurrentUserQuery,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useUpdateUserProfileMutation,
  useDeleteUserAccountMutation,
  useChangePasswordMutation,
  useGetCurrentAppVersionQuery,
} = authApi;
