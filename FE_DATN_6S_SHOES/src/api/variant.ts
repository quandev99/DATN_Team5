
// import { IVariant } from "../interface/variant";
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// const variantApi = createApi({
//     reducerPath: 'variants',
//     tagTypes: ['Variants'],
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

//     }),
// });

// export const {
//     useGetVariantByIdQuery,
//     useGetVariantQuery,
//     useAddVariantMutation,
//     useRemoveVariantMutation,
//     useGetVariantProductIDQuery,
//     useUpdateVariantMutation
// } = variantApi

// export const variantReducer = variantApi.reducer;
// export default variantApi