import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { INew } from "../interface/new";

const newApi = createApi({
  reducerPath: "news",
  tagTypes: ["News"],
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
  endpoints: builder => ({
    getNews: builder.query<INew, any>({
      query: (data) => `/news?_limit=${data.limit}`,
      providesTags: ["News"],
    }),
    getNewById: builder.query<INew, number | string>({
      query: (id) => `/news/${id}`,
      providesTags: ["News"],
    }),
    addNews: builder.mutation<INew, INew>({
      query: (news: INew) => ({
        url: "/news",
        method: "POST",
        body: news
      }),
      invalidatesTags: ["News"]
    }),
    deleteNews: builder.mutation<INew, string | number>({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["News"]
    }),
    updateNews: builder.mutation<INew, INew>({
      query: (news: INew) => {
        const { _id, ...body } = news
        return {
          url: `/news/${_id as string}`,
          method: "PUT",
          body
        }
      },
      invalidatesTags: ["News"]
    }),
  }),
});
export const { useGetNewsQuery, useGetNewByIdQuery, useAddNewsMutation, useDeleteNewsMutation, useUpdateNewsMutation } = newApi;
export const newReducer = newApi.reducer;
export default newApi;
