import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IUser } from "../interface/user";

const userApi = createApi({
  reducerPath: "users",
  tagTypes: ["users"],
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
    adduser: builder.mutation<IUser, IUser>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),
    getusers: builder.query<IUser, void>({
      query: () => `/users`,
      providesTags: ["users"],
    }),
    getUserAdmin: builder.query<IUser, void>({
      query: (data: any) => `/users?_limit=${data._limit}`,
      providesTags: ["users"],
    }),
    removeuser: builder.mutation<IUser, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
    getUserById: builder.query<IUser, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getOneUserByToken: builder.query<IUser, string>({
      query: (token) => ({
        url: `/users/profile/token/${token}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    updateUser: builder.mutation<IUser, IUser>({
      query: (data) => {
        const { _id, ...body } = data;
        return {
          url: `/users/${_id as string}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["users"],
    }),
    banUser: builder.mutation<IUser, string>({
      query: (_id) => {
        return {
          url: `/users/ban/${_id}`,
          method: "PUT",
        };
      },
      invalidatesTags: ["users"],
    }),
  }),
});
export const {
  useAdduserMutation,
  useBanUserMutation,
  useGetusersQuery,
  useRemoveuserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetOneUserByTokenQuery,
  useGetUserAdminQuery
} = userApi;
export const userReducer = userApi.reducer;
export default userApi;