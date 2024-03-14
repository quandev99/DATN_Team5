import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IFavorite } from '../interface/favorite';


const favoriteApi = createApi({
    reducerPath: 'favorites',
    tagTypes: ['Favorite'],
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
        addToFavorite: builder.mutation<IFavorite, IFavorite>({
            query: (favorite) => {
                return {
                    url: `/favorites`,
                    method: "POST",
                    body: favorite
                }
            },
            invalidatesTags: ["Favorite"]
        }),
        getFavoriteByUser: builder.query<IFavorite, string | number>({
            query: (user_id) => ({
                url: `/favorites/${user_id}`,
                method: "GET"
            }),
            providesTags: ["Favorite"]
        }),
        getAllFavorite: builder.query<IFavorite, void>({
            query: () => "favorites",
            providesTags: ["Favorite"]
        })
    }),
});

export const { useAddToFavoriteMutation, useGetFavoriteByUserQuery, useGetAllFavoriteQuery } = favoriteApi
export const favoriteReducer = favoriteApi.reducer;
export default favoriteApi


