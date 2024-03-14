import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'

const imageApi = createApi({
  reducerPath: "images",
  tagTypes: ["Images"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (image: any) => ({
        url: "/images/upload",
        method: "POST",
        body: image,
      }),
      invalidatesTags: ["Images"],
    }),
    removeImage: builder.mutation({
      query: (id) => ({
        url: `/images/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Images"],
    }),
    updateImage: builder.mutation({
      query: (body:any) => {
        console.log("updateImage API 123:",body)
        return {
          url: `/images/update/${body.publicId}`,
          method: "PUT",
          body: body.formDataImageUpdate,
        };
      },
      invalidatesTags: ["Images"],
    }),
  }),
});

export const { useUploadImageMutation, useRemoveImageMutation, useUpdateImageMutation } =
  imageApi;
export const imageReducer = imageApi.reducer
export default imageApi