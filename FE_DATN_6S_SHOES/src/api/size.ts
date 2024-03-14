import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { ISize } from "../interface/size";
const sizeApi = createApi({
  reducerPath: "sizes",
  tagTypes: ['Size'],
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
    addSize: builder.mutation<ISize, void>({
      query: (data) => ({
        url: "/sizes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Size']
    }),
    getSizes: builder.query<ISize, void>({
      query: () => `/sizes`,
      providesTags: ['Size']
    }),
    searchSize: builder.query<ISize, any>({
      query: ({ currentPages, limit }) => `/sizes?_page=${currentPages}&_limit=${limit}`,
      providesTags: ['Size']
    }),
    removeSize: builder.mutation({
      query: (id) => ({
        url: `/sizes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Size']
    }),
    getSizeById: builder.query<ISize, string | number>({
      query: (id) => ({
        url: `/sizes/${id}`,
      }),
      providesTags: ["Size"],
    }),
    updateSize: builder.mutation<ISize, ISize>({
      query: (data) => {
        const { _id, ...body } = data;
        return {
          url: `/sizes/${_id as string}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Size"],
    }),
  }),
});

export const {
  useAddSizeMutation,
  useGetSizesQuery,
  useRemoveSizeMutation,
  useGetSizeByIdQuery,
  useUpdateSizeMutation,
  useSearchSizeQuery
} = sizeApi;
export const sizeReducer = sizeApi.reducer;
export default sizeApi;
