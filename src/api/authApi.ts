import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: "/auth/login/",
                method: "POST",
                body,
            }),
        }),

        register: builder.mutation({
            query: (body) => ({
                url: "/auth/register/",
                method: "POST",
                body,
            }),
        }),

        forgotPassword: builder.mutation({
            query: (email) => ({
                url: "/auth/forgot-password/",
                method: "POST",
                body: { email },
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
} = authApi;