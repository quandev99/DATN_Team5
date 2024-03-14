import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react"
const cartApi = createApi({
    reducerPath: "carts",
    tagTypes: ['Cart'],
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
    endpoints: (build) => ({
        addToCart: build.mutation({
            query: (cart) => ({
                url: `/carts`,
                method: "POST",
                body: cart
            }),
            invalidatesTags: ['Cart']
        }),
        updateCart: build.mutation({
            query: (cart) => ({
                url: `/carts/update`,
                method: "PUT",
                body: cart
            }),
            invalidatesTags: ['Cart']
        }),
        getCartByUser: build.query<any, string|number>({
            query: (userId) => `/carts/user/${userId}`,
            providesTags: ['Cart']
        }),
        deleteAllProductCart: build.mutation({
            query: (userId: string | number) => ({
                url: `carts/deleteall/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Cart']
        }),
        deleteOneProductCart: build.mutation({
            query: (cart) => ({
                url: `/carts/delete`,
                method: "POST",
                body: cart
            }),
            invalidatesTags: ['Cart']
        }),
    }),
})

export const { 
    useGetCartByUserQuery, 
    useAddToCartMutation, 
    useDeleteAllProductCartMutation, 
    useDeleteOneProductCartMutation, 
    useUpdateCartMutation ,
} = cartApi
export const CartReducer = cartApi.reducer
export default cartApi