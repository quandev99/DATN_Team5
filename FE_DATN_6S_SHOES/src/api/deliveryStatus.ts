

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

const dstatusApi = createApi({
  reducerPath: 'DStatuss',
  tagTypes: ['DStatuss'],
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
    addDstatus: builder.mutation<any, void>({
      query: (data) => ({
        url: "/pStatus",
        method: "POST",
        body: data,
      }),
    }),
    getDstatuss: builder.query<any, void>({
      query: () => `/pStatus`,
      providesTags: ['DStatuss']
    }),
    removeDstatus: builder.mutation({
      query: (id) => ({
        url: `/pStatus/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['DStatuss']
    }),
    getDstatusById: builder.query<any, number | string>({
      query: (id) => ({
        url: `/pStatus/${id}`,
        method: "GET",
      }),
      providesTags: ["DStatuss"]
    }),
    updateDstatus: builder.mutation<any, any>({
      query: (Dstatus) => {
        const { _id, ...body } = Dstatus
        return {
          url: `/pStatus/${_id as string}`,
          method: "PUT",
          body
        }
      },
      invalidatesTags: ["DStatuss"]
    })
  }),
});

export const { useAddDstatusMutation, useGetDstatussQuery, useRemoveDstatusMutation, useUpdateDstatusMutation, useGetDstatusByIdQuery } = dstatusApi;
export const DstatusReducer = dstatusApi.reducer;
export default dstatusApi;







