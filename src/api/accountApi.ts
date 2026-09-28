import { baseApi } from "./baseQuery";
// import type { PaginatedResponse } from "./transactionApi";
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Account {
  id: number;
  name: string;
  account_type: AccountType;
  currency: string;
  balance: string;
  is_active: boolean;
  balance_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export type AccountType =
  "cash" | "bank" | "mobile_money" | "savings" | "other";

export interface CreateAccountRequest {
  name: string;
  account_type: AccountType;
  currency: string;
}

export interface UpdateAccountRequest {
  name?: string;
  account_type?: AccountType;
  currency?: string;
  is_active?: boolean;
}

export interface AccountQueryParams {
  page?: number;
  page_size?: number;
}

export const ACCOUNT_TYPES: {
  value: AccountType;
  label: string;
}[] = [
  {
    value: "cash",
    label: "Cash",
  },
  {
    value: "bank",
    label: "Bank",
  },
  {
    value: "mobile_money",
    label: "Mobile Money",
  },
  {
    value: "savings",
    label: "Savings",
  },
  {
    value: "other",
    label: "Other",
  },
];

export const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --------------------------------------------------
    // Get accounts
    // --------------------------------------------------

    getAccounts: builder.query<
      PaginatedResponse<Account>,
      AccountQueryParams | undefined
    >({
      query: (params) => ({
        url: "/accounts/",
        method: "GET",
        params: params ?? {},
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.results.map((account) => ({
                type: "Accounts" as const,
                id: account.id,
              })),
              {
                type: "Accounts" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Accounts" as const,
                id: "LIST",
              },
            ],
    }),

    // --------------------------------------------------
    // Get single account
    // --------------------------------------------------

    getAccount: builder.query<Account, number>({
      query: (id) => `/accounts/${id}/`,

      providesTags: (_result, _error, id) => [
        {
          type: "Accounts",
          id,
        },
      ],
    }),

    // --------------------------------------------------
    // Create account
    // --------------------------------------------------

    createAccount: builder.mutation<Account, CreateAccountRequest>({
      query: (body) => ({
        url: "/accounts/",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        {
          type: "Accounts",
          id: "LIST",
        },
      ],
    }),

    // --------------------------------------------------
    // Update account
    // --------------------------------------------------

    updateAccount: builder.mutation<
      Account,
      {
        id: number;
        data: UpdateAccountRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `/accounts/${id}/`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: "Accounts",
          id,
        },
        {
          type: "Accounts",
          id: "LIST",
        },
      ],
    }),

    // --------------------------------------------------
    // Delete account
    // --------------------------------------------------

    deleteAccount: builder.mutation<void, number>({
      query: (id) => ({
        url: `/accounts/${id}/`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        {
          type: "Accounts",
          id,
        },
        {
          type: "Accounts",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useGetAccountQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = accountApi;
