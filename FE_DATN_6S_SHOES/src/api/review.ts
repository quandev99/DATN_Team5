import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IReview } from "../interface/review";
const reviewApi = createApi({
  reducerPath: "reviews",
  tagTypes: ['Review'],
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
    getReviews: builder.query<IReview, any>({
      query: ({ currentPages }) => `/reviews?_page=${currentPages}`,
      providesTags: ['Review']
    }),
    getReviewProductId: builder.query<IReview, any>({
      query: ({ productId, currentPages }) => `/reviews/productId/${productId}?_page=${currentPages}`,
      providesTags: ['Review']
    }),
    addReview: builder.mutation<IReview, void>({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Review']
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useAddReviewMutation,
  useGetReviewProductIdQuery,
} = reviewApi;
export const reviewReducer = reviewApi.reducer;
export default reviewApi;
