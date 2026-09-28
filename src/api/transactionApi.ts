// src/api/transactionApi.ts

import { baseApi } from "./baseQuery";

export type TransactionType = "income" | "expense" | "transfer" | "loan";

export interface Transaction {
  id: number;

  account: number;
  account_name: string;

  destination_account: number | null;
  destination_account_name: string | null;

  transaction_type?: TransactionType;

  amount: string;

  category: string;
  description: string;

  transaction_date: string;

  created_at: string;
  updated_at: string;
}
export interface TransactionStats {
  data: {
    total: number;
    income: number;
    expense: number;
    transfer: number;
  };
}
export interface CreateTransactionRequest {
  account: number;
  destination_account?: number | null;
  transaction_type: TransactionType;
  amount: string;
  category?: string;
  description?: string;
  transaction_date: string;
}

export type UpdateTransactionRequest = Partial<CreateTransactionRequest>;

export interface TransactionQueryParams {
  account?: number;
  destination_account?: number;
  transaction_type?: TransactionType;
  category?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}
export interface AccountTransactionsQuery {
  accountId: number;
  page?: number;
  transaction_type?: "income" | "expense" | "transfer";
  search?: string;
  ordering?: string;
}
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
// export type TransactionType = "income" | "expense" | "transfer";

export interface TransactionFilters {
  page?: number;
  page_size?: number;

  transaction_type?: TransactionType;

  account?: number;
  destination_account?: number;

  category?: string;

  search?: string;

  date_from?: string;
  date_to?: string;

  min_amount?: number;
  max_amount?: number;

  ordering?: string;
}

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<
      PaginatedResponse<Transaction>,
      TransactionQueryParams | undefined
    >({
      query: (params) => ({
        url: "/transactions/",
        method: "GET",
        params: params ?? {},
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "Transaction" as const,
                id,
              })),
              {
                type: "Transaction" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Transaction" as const,
                id: "LIST",
              },
            ],
    }),

    getTransaction: builder.query<Transaction, number>({
      query: (id) => `/transactions/${id}/`,

      providesTags: (_result, _error, id) => [
        {
          type: "Transaction",
          id,
        },
      ],
    }),

    createTransaction: builder.mutation<Transaction, CreateTransactionRequest>({
      query: (body) => ({
        url: "/transactions/",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Accounts", "Transaction", "Dashboard"],
    }),

    updateTransaction: builder.mutation<
      Transaction,
      {
        id: number;
        data: UpdateTransactionRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `/transactions/${id}/`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["Accounts", "Transaction", "Dashboard"],
    }),

    deleteTransaction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/transactions/${id}/`,
        method: "DELETE",
      }),

      invalidatesTags: ["Accounts", "Transaction", "Dashboard"],
    }),
    getTransactionStats: builder.query<
      TransactionStats,
      {
        search?: string;
      }
    >({
      query: (params) => ({
        url: "/transactions/stats/",
        method: "GET",
        params,
      }),
    }),
    getAccountTransactions: builder.query<
      PaginatedResponse<Transaction>,
      AccountTransactionsQuery
    >({
      query: ({ accountId, page = 1, transaction_type, search, ordering }) => ({
        url: `/transactions/account/${accountId}/`,
        method: "GET",
        params: {
          page,
          transaction_type,
          search,
          ordering,
        },
      }),
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetAccountTransactionsQuery,
  useGetTransactionQuery,
  useGetTransactionStatsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi;
