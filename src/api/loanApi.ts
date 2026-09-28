// features/loans/loanApi.ts

import { baseApi } from "./baseQuery";
import { PaginatedResponse } from "./transactionApi";
export type LoanType = "lent" | "borrowed";
console.log("🔥🔥🔥 LOAN API FILE LOADED 🔥🔥🔥");
export type LoanStatus = "active" | "paid";
export interface LoanFilters {
  loan_type?: LoanType;
  status?: LoanStatus;
  currency?: string;
  search?: string;
  ordering?: string;
}
export interface LoanPaymentRequest {
  amount: string;
  account: number;
  payment_date?: string | null;
  description?: string;
}
export interface Loan {
  id: number;
  person: string;
  loan_type: LoanType;
  principal_amount: string;
  remaining_amount: string;
  currency: string;
  payment_date: string | null;
  description: string;
  account?: number | null;
  status: LoanStatus;
  paid_amount: string;
  created_at: string;
  updated_at: string;
}
export interface LoanQueryParams {
  page?: number;
  page_size?: number;
  loan_type?: LoanType;
}

export interface CreateLoanRequest {
  person: string;
  loan_type: LoanType;
  principal_amount: string;
  currency: string;
  payment_date?: string | null;
  description?: string;
  account?: number | null;
}

export interface UpdateLoanRequest {
  id: number;
  data: {
    id?: number;
    person?: string;
    loan_type?: LoanType;
    principal_amount?: string;
    currency?: string;
    payment_date?: string | null;
    account?: number | null;
    description?: string;
  };
}
export const loanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLoans: builder.query<
      PaginatedResponse<Loan>,
      LoanQueryParams | undefined
    >({
      query: (params) => ({
        url: "/loans/",
        method: "GET",
        params,
      }),

      providesTags: (result) => [
        { type: "Loans", id: "LIST" },
        ...(result?.results ?? []).map((loan: Loan) => ({
          type: "Loans" as const,
          id: loan.id,
        })),
      ],
    }),

    getLoan: builder.query<Loan, number>({
      query: (id) => `/loans/${id}/`,

      providesTags: (_result, _error, id) => [
        {
          type: "Loans",
          id,
        },
      ],
    }),

    createLoan: builder.mutation<Loan, CreateLoanRequest>({
      query: (body) => ({
        url: "/loans/",
        method: "POST",
        body,
      }),

      invalidatesTags: [{ type: "Loans", id: "LIST" }, "Dashboard"],
    }),

    updateLoan: builder.mutation<Loan, UpdateLoanRequest>({
      query: ({ id, data }) => {
        return {
          url: `/loans/${id}/`,
          method: "PATCH",
          body: {
            person: data.person,
            loan_type: data.loan_type,
            principal_amount: data.principal_amount,
            currency: data.currency,
            account: data.account,
            payment_date: data.payment_date,
            description: data.description,
          },
        };
      },

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Loans", id: "LIST" },
        { type: "Loans", id },
        "Dashboard",
      ],
    }),

    deleteLoan: builder.mutation<unknown, number>({
      query: (id) => ({
        url: `/loans/${id}/`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Loans", id: "LIST" }, "Dashboard"],
    }),
    recordLoanPayment: builder.mutation<
      Loan,
      { id: number; data: LoanPaymentRequest }
    >({
      query: ({ id, data }) => ({
        url: `/loans/${id}/payment/`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Loans", id: "LIST" },
        { type: "Loans", id },
        { type: "Accounts", id: "LIST" },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetLoansQuery,
  useGetLoanQuery,
  useCreateLoanMutation,
  useUpdateLoanMutation,
  useDeleteLoanMutation,
  useRecordLoanPaymentMutation,
} = loanApi;
