import { ICategory } from '../interface/category';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const categoryApi = createApi({
  reducerPath: "categories",
  tagTypes: ["Categories"],
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
    getCategory: builder.query<any, void>({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    searchCategory: builder.query<ICategory, any>({
      query: (data) => `/categories?_limit=${data.limit}`,
      providesTags: ["Categories"],
    }),
    removeCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    addCategory: builder.mutation<ICategory, void>({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    getCategoryById: builder.query<ICategory, string | number>({
      query: (id) => ({
        url: `/categories/${id}`,
      }),
      providesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<ICategory, ICategory>({
      query: (data) => {
        const { _id, ...body } = data;
        return {
          url: `/categories/${_id as string}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetCategoryQuery,
  useRemoveCategoryMutation,
  useUpdateCategoryMutation,
  useGetCategoryByIdQuery,
  useSearchCategoryQuery
} = categoryApi;

export const categoryReducer = categoryApi.reducer;
export default categoryApi