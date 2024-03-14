
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

const bannerApi = createApi({
    reducerPath: "banners",
    tagTypes: ["Banners"],
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
        getAllBanner: builder.query<any, void>({
            query: () => "/banners",
            providesTags: ["Banners"],
        }),
        removeBanner: builder.mutation({
            query: (id) => ({
                url: `/banners/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Banners"],
        }),
        addBanner: builder.mutation<any, any>({
            query: (data) => ({
                url: "/banners",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Banners"],
        }),
        getBannerById: builder.query<any, string | number>({
            query: (id) => ({
                url: `/banners/${id}`,
            }),
            providesTags: ["Banners"],
        }),
        updateBanner: builder.mutation<any, any>({
            query: (data) => {
                const { _id, ...body } = data;
                return {
                    url: `/banners/${_id}`,
                    method: "PUT",
                    body,
                };
            },
            invalidatesTags: ["Banners"],
        }),
    }),
});


export const { useGetBannerByIdQuery, useGetAllBannerQuery, useAddBannerMutation, useUpdateBannerMutation, useRemoveBannerMutation } = bannerApi;
export const bannerReducer = bannerApi.reducer;
export default bannerApi;
