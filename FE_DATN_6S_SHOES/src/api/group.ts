// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { IGroup } from '../interface/group';

// const groupApi = createApi({
//     reducerPath: "groups",
//     tagTypes: ["Group"],
//     baseQuery: fetchBaseQuery({
//         baseUrl: import.meta.env.VITE_API_URL,
//         prepareHeaders: (headers) => {
//             const token = JSON.parse(localStorage.getItem("accessToken")!)
//             try {
//                 headers.set('Authorization', `Bearer ${token}`);
//             } catch (error) {
//                 console.error("Invalid token:", token);
//             }
//             return headers;
//         },
//     }),
//     endpoints: (builder) => ({
//         getGroup: builder.query<IGroup[], void>({
//             query: () => "/product-groups",
//             providesTags: ["Group"],
//         }),
//         getAllGroup: builder.query<IGroup[], void>({
//             query: (data: any) => `/product-groups/all?_sort=${data?._sort}`,
//             providesTags: ["Group"],
//         }),
//         removeGroup: builder.mutation<IGroup, string>({
//             query: (id) => ({
//                 url: `/product-groups/delete/${id}`,
//                 method: "DELETE",
//             }),
//             invalidatesTags: ["Group"],
//         }),
//         addGroup: builder.mutation<IGroup, IGroup>({
//             query: (data) => ({
//                 url: "/product-groups",
//                 method: "POST",
//                 body: data,
//             }),
//             invalidatesTags: ["Group"],
//         }),
//         getGroupById: builder.query<IGroup, string | number>({
//             query: (id) => `/product-groups/${id}`,
//             providesTags: ["Group"],
//         }),
//         updateGroup: builder.mutation<IGroup, IGroup>({
//             query: (data) => {
//                 const { _id, ...body } = data;
//                 return {
//                     url: `/product-groups/${_id as string}`,
//                     method: "PUT",
//                     body,
//                 };
//             },
//             invalidatesTags: ["Group"],
//         }),
//     }),
// });

// export const {
// useAddGroupMutation,
// useGetGroupQuery,
// useRemoveGroupMutation,
// useUpdateGroupMutation,
// useGetAllGroupQuery,
// useGetGroupByIdQuery
// } = groupApi;

// export const groupReducer = groupApi.reducer;
// export default groupApi