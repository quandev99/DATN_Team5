

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IColor } from "../interface/color";
// interface IColor {
//   color_name?: string;
//   color_code?: string;
//   color_image?: object;
//   color_description?: string;
// }

const colorApi = createApi({
  reducerPath: 'colors',
  tagTypes: ['Color'],
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
    addColor: builder.mutation<IColor, void>({
      query: (data) => ({
        url: "/colors",
        method: "POST",
        body: data,
      }),
    }),
    getColors: builder.query<IColor, void>({
      query: () => `/colors`,
      providesTags: ['Color']
    }),
    searchColors: builder.query<IColor, any>({
      query: ({ currentPages, limit }) => `/colors?_page=${currentPages}&_limit=${limit}`,
      providesTags: ['Color']
    }),
    removeColor: builder.mutation({
      query: (id) => ({
        url: `/colors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Color']
    }),
    getColor: builder.query<IColor, number | string>({
      query: (id) => ({
        url: `/colors/${id}`,
        method: "GET",
      }),
      providesTags: ["Color"]
    }),
    updateColor: builder.mutation<IColor, IColor>({
      query: (color) => {
        const { _id, ...body } = color
        return {
          url: `/colors/${_id as string}`,
          method: "PUT",
          body
        }
      },
      invalidatesTags: ["Color"]
    })

  }),
});

export const { useAddColorMutation, useGetColorsQuery, useSearchColorsQuery, useRemoveColorMutation, useUpdateColorMutation, useGetColorQuery } = colorApi;
export const colorReducer = colorApi.reducer;
export default colorApi;







