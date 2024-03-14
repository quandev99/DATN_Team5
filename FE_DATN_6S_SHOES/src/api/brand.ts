import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import IBrand from "../interface/brand";

const brandApi = createApi({
  reducerPath: "brands",
  tagTypes: ["Brands"],
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
    addBrand: builder.mutation<IBrand, void>({
      query: (data) => ({
        url: "/brands",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brands"],
    }),
    getBrands: builder.query<IBrand, void>({
      query: () => `/brands`,
      providesTags: ["Brands"],
    }),
    searchBrands: builder.query<IBrand, any>({
      query: (data) => `/brands?_limit=${data.limit}`,
      providesTags: ["Brands"],
    }),
    removeBrand: builder.mutation<void, IBrand>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brands"],
    }),
    getByIdBrand: builder.query<IBrand, string | number>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "GET"
      }),
      providesTags: ["Brands"]
    }),
    updateBrand: builder.mutation<IBrand, IBrand>({
      query: (brand) => {
        const { _id, ...body } = brand
        return {
          url: `/brands/${_id as string}`,
          method: "PUT",
          body
        }
      },
      invalidatesTags: ["Brands"]
    })
  }),
});
export const {
  useAddBrandMutation,
  useSearchBrandsQuery,
  useGetBrandsQuery,
  useRemoveBrandMutation,
  useGetByIdBrandQuery,
  useUpdateBrandMutation
} = brandApi;
export const brandReducer = brandApi.reducer;
export default brandApi;