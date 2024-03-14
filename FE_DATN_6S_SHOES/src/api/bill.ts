import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IBill } from "../interface/bill";

const billApi = createApi({
  reducerPath: "bills",
  tagTypes: ["Bills"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = JSON.parse(localStorage.getItem("accessToken")!);
      try {
        headers.set("Authorization", `Bearer ${token}`);
      } catch (error) {
        console.error("Invalid token:", token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    checkout: builder.mutation<any, void>({
      query: (data) => ({
        url: "/checkout",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bills"],
    }),
    getAllBillAdmin: builder.query<IBill, any>({
      query: () => `/bills`,
      providesTags: ["Bills"],
    }),
    getBillByIdUserReviews: builder.query<any, any>({
      query: ({ userId, currentPages, bill_code }) => ({
        url: `/bills/user/${userId}/reviews?_page=${currentPages}&_search=${bill_code}`,
        method: "GET",
      }),
      providesTags: ["Bills"],
    }),
    getAllBills: builder.query<any, any>({
      query: () => `/bills`,
      providesTags: ["Bills"],
    }),
    abortBill: builder.mutation<void, any>({
      query: (id) => ({
        url: `/bills/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bills"],
    }),
    getBillById: builder.query<any, string | number>({
      query: (id) => ({
        url: `/bills/${id}`,
        method: "GET",
      }),
      providesTags: ["Bills"],
    }),
    getBillByDStatus: builder.query<any, string | any>({
      query: ({ id, currentPages, bill_code }) => ({
        url: `/bills/dStatus/${id}?_search=${bill_code}&_page=${currentPages}`,
        method: "GET",
      }),
      providesTags: ["Bills"],
    }),
    getBillByIdUser: builder.query<any, any>({
      query: ({ userId }) => ({
        url: `/bills/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["Bills"],
    }),
    getBillByIdUserStatus: builder.query<any, any>({
      query: ({ userId, currentPages, status_id }) => ({
        url: `/bills/user/${userId}/status/${status_id}?_page=${currentPages}`,
        method: "GET",
      }),
      providesTags: ["Bills"],
    }),
    updateBillStatus: builder.mutation<any, any>({
      query: (bills) => {
        const { _id, ...body } = bills;
        return {
          url: `/bills/update/${_id as string}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Bills"],
    }),
    getMonth: builder.query<number, { year: number }>({
      query: ({ year }) => `/revenue/${year}`,
      providesTags: ["Bills"],
    }),

    getYear: builder.query<any, void>({
      query: () => `/yearly-revenue`,
      providesTags: ["Bills"],
    }),
    getWeek: builder.query<number, { year: number; month: number }>({
      query: ({ year, month }) => `/revenue/${year}/${month}/weekly`,
      providesTags: ["Bills"],
    }),

    getCountBillToday: builder.query({
      query: () => `/statistics/count-bill-today`,
      providesTags: ["Bills"],
    }),

    createPayment: builder.mutation<any, void>({
      query: (bills) => ({
        url: `/create_payment_url`,
        method: "POST",
        body: bills,
      }),
      invalidatesTags: ["Bills"],
    }),
  }),
});
export const {
  useGetCountBillTodayQuery,
  useCheckoutMutation,
  useUpdateBillStatusMutation,
  useGetAllBillsQuery,
  useGetBillByIdUserReviewsQuery,
  useGetBillByIdQuery,
  useGetBillByIdUserQuery,
  useAbortBillMutation,
  useGetBillByIdUserStatusQuery,
  useGetBillByDStatusQuery,
  useGetMonthQuery,
  useGetYearQuery,
  useGetWeekQuery,
  useGetAllBillAdminQuery,

  useCreatePaymentMutation
} = billApi;
export const billReducer = billApi.reducer;
export default billApi;