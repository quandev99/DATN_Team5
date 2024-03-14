
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import IRole from "../interface/role";

const roleApi = createApi({
  reducerPath: "roles",
  tagTypes: ["Roles"],
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
    getAllRole: builder.query<IRole, any>({
      query: ({ currentPages }: any) => `/roles?_page=${currentPages}`,
      providesTags: ["Roles"],
    }),
    getRoles: builder.query<IRole, void>({
      query: () => `/roles`,
      providesTags: ["Roles"],
    }),
    removeRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),
    addRole: builder.mutation<IRole, IRole>({
      query: (data) => ({
        url: "/roles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Roles"],
    }),
    getRoleById: builder.query<IRole, string | number>({
      query: (id) => ({
        url: `/roles/${id}`,
      }),
      providesTags: ["Roles"],
    }),
    updateRole: builder.mutation<IRole, IRole>({
      query: (data) => {
        const { _id, ...body } = data;
        return {
          url: `/roles/${_id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Roles"],
    }),
  }),
});


export const {
  useGetRoleByIdQuery,
  useGetRolesQuery,
  useGetAllRoleQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useRemoveRoleMutation
} = roleApi;
export const roleReducer = roleApi.reducer;
export default roleApi;
