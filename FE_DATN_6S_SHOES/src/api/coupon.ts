import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { ICoupon } from "../interface/coupons";

const couponApi = createApi({
  reducerPath: "coupons",
  tagTypes: ["Coupons"],
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
    addCoupon: builder.mutation<ICoupon, ICoupon>({
      query: (data) => ({
        url: "/coupons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),
    applyCoupon: builder.mutation<ICoupon, void>({
      query: (data) => ({
        url: "/coupons/apply",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),
    getCouponsAdmin: builder.query<ICoupon, void>({
      query: () => `/coupons`,
      providesTags: ["Coupons"],
    }),
    getCouponsAllUsers: builder.query<ICoupon, void>({
      query: () => `/get-coupon-all-users`,
      providesTags: ["Coupons"],
    }),
    getCouponsByUsers: builder.query<ICoupon, string>({
      query: (data) => `/coupons/users/${data}`,
      providesTags: ["Coupons"],
    }),

    removeCoupon: builder.mutation<ICoupon, ICoupon>({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),
    getByIdCoupon: builder.query<ICoupon, string>({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: "GET",
      }),
      providesTags: ["Coupons"],
    }),
    getByUserCoupon: builder.query<ICoupon, string | number>({
      query: (id) => ({
        url: `/coupons/userApply/${id}`,
        method: "GET",
      }),
      providesTags: ["Coupons"],
    }),
    updateCoupon: builder.mutation<ICoupon, ICoupon>({
      query: (data) => {
        const { _id, ...body } = data;
        return {
          url: `/coupons/${_id as string}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Coupons"],
    }),
    patchCoupon: builder.mutation<ICoupon, ICoupon>({
      query: (data) => {
        const { _id, ...body } = data;
        return {
          url: `/coupon/patch/${_id as string}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Coupons"],
    }),
  }),
});
export const {
  useGetCouponsAdminQuery,
  useGetCouponsAllUsersQuery,
  useGetCouponsByUsersQuery,
  usePatchCouponMutation,

  useAddCouponMutation,
  useApplyCouponMutation,
  useGetByIdCouponQuery,
  useGetByUserCouponQuery,
  useRemoveCouponMutation,
  useUpdateCouponMutation,
} = couponApi;
export const couponReducer = couponApi.reducer;
export default couponApi;
