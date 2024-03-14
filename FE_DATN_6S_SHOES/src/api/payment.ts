import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

const paymentApi = createApi({
  reducerPath: "payments",
  tagTypes: ["Payments"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  endpoints: (builder) => ({
    createPayment: builder.mutation<any, void>({
      query: (bills) => ({
        url: `/create_payment_url`,
        method: "POST",
        body: bills,
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});
export const { useCreatePaymentMutation } = paymentApi;
export const paymentReducer = paymentApi.reducer;
export default paymentApi;
