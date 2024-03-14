import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

const paymentMethodApi = createApi({
  reducerPath: "paymentMethods",
  tagTypes: ["PaymentsMethods"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = JSON.parse(localStorage.getItem("accessToken")!)
      try {
        headers.set('Authorization', `Bearer ${token}`);
      } catch (error) {
        console.error("Invalid token:", token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    addPaymentMethod: builder.mutation<any, void>({
      query: (data) => ({
        url: "/payment-methods",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PaymentsMethods"],
    }),
    getPaymentsMethods: builder.query<any, void>({
      query: () => `/payment-methods`,
      providesTags: ["PaymentsMethods"],
    }),
    removePaymentMethod: builder.mutation<void, any>({
      query: (id) => ({
        url: `/payment-methods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentsMethods"],
    }),
    getByIdPaymentMethod: builder.query<any, string | number>({
      query: (id) => ({
        url: `/PaymentsMethods/${id}`,
        method: "GET"
      }),
      providesTags: ["PaymentsMethods"]
    }),
    updatePaymentMethod: builder.mutation<any, any>({
      query: (PaymentMethod) => {
        const { _id, ...body } = PaymentMethod
        return {
          url: `/payment-methods/${_id as string}`,
          method: "PUT",
          body
        }
      },
      invalidatesTags: ["PaymentsMethods"]
    })
  }),
});
export const { useAddPaymentMethodMutation, useUpdatePaymentMethodMutation, useGetByIdPaymentMethodQuery, useGetPaymentsMethodsQuery } = paymentMethodApi;
export const paymentMethodReducer = paymentMethodApi.reducer;
export default paymentMethodApi;