import { IProduct } from "../interface/product";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IVariant } from "../interface/variant";
import { IGroup } from "../interface/group";

const productApi = createApi({
  reducerPath: "products",
  tagTypes: ["Products"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = JSON.parse(localStorage.getItem("accessToken")!);
      try {
        headers.set("Authorization", `Bearer ${token}`);
      } catch (error) {
        console.error("Invalid token:", token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<any, void>({
      query: (url) => "/products" + url,
      providesTags: ["Products"],
    }),
    getProductFeature: builder.query<any, any>({
      query: ({
        product_name,
        product_code,
        category_id,
        brand_id,
        currentPages,
        limit,
      }) => {
        return `/get-product-feature?_search=${product_name === undefined ? '' : product_name
          }&_page=${currentPages}&_product_code=${product_code || ''}&_category_id=${category_id || ''}&_brand_id=${brand_id || ''}&_limit=${limit ? limit : 10}`;
      },
      providesTags: ["Products"],
    }),
    getProductSale: builder.query<any, any>({
      query: ({
        product_name,
        product_code,
        category_id,
        brand_id,
        currentPages,
        limit
      }) => {
        return `/get-product-sale?_search=${product_name === undefined ? '' : product_name
          }&_page=${currentPages}&_product_code=${product_code || undefined}&_category_id=${category_id || undefined}&_brand_id=${brand_id || ''}&_limit=${limit ? limit : 10}`;
      },
      providesTags: ["Products"],
    }),
    getAllProductClient: builder.query<any, any>({
      query: ({
        product_name,
        product_code,
        category_id,
        brand_id,
        currentPages,
        limit,
        color_id,
        size_id,
        PriceFilter
      }) => {
        return `/get-all-product-client?_search=${product_name}&_page=${currentPages || ''}&_product_code=${product_code || ''}&${PriceFilter}&_category_id=${category_id}&_brand_id=${brand_id}&_size_id=${size_id}&_color_id=${color_id}&_limit=${limit ? limit : 10}`;
      },
      providesTags: ["Products"],
    }),
    getAllProductClients: builder.query<any, any>({
      query: (url) => {
        return `/get-all-product-client${url}`;
      },
      providesTags: ["Products"],
    }),
    getAllProductClientGroup: builder.query<any, any>({
      query: ({ limit }: any) => {
        return `/get-all-product-client?_limit=${limit}`;
      },
      providesTags: ["Products"],
    }),
    getProduct: builder.query<IProduct, void>({
      query: () => "/products",
      providesTags: ["Products"],
    }),
    searchProduct: builder.query<any, any>({
      query: ({
        product_name,
        product_code,
        category_id,
        brand_id,
        currentPages,
        limit,
        color_id,
        size_id,
      }) => {
        return `/products?_search=${product_name || ''
          }&_page=${currentPages}&_product_code=${product_code || ''}&_category_id=${category_id || ''}&_brand_id=${brand_id || ''}&color_id=${color_id || ''}&size_id=${size_id || ''}&_limit=${limit ? limit : 10}`;
      },
      providesTags: ["Products"],
    }),
    getProductAllDelete: builder.query<IProduct, string | number>({
      query: () => "/product/getAllDeleted",
      providesTags: ["Products"],
    }),
    getProductById: builder.query<IProduct, number | string>({
      query: (id) => `/products/${id}`,
      providesTags: ["Products"],
    }),
    getProductByCategory: builder.query<IProduct, number | string>({
      query: (id) => `/products/categoryID/${id}`,
      providesTags: ["Products"],
    }),
    getProductByBrand: builder.query<IProduct, number | string>({
      query: (id) => `/products/brandId/${id}`,
      providesTags: ["Products"],
    }),

    getProductNew: builder.query<IProduct, { currentPages: number, _limit: number }>({
      query: (data) => `/get-product-new?_page=${data.currentPages}&_limit=${data._limit}`,
      providesTags: ["Products"],
    }),
    getProductTopBestSale: builder.query<IProduct, void>({
      query: () => `/get-product-best-sale`,
      providesTags: ["Products"],
    }),

    addProducts: builder.mutation<IProduct, IProduct>({
      query: (product: IProduct) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProducts: builder.mutation<IProduct, IProduct>({
      query: (product: IProduct) => ({
        url: `/products/${product._id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),
    patchProducts: builder.mutation<IProduct, IProduct>({
      query: (product: IProduct) => ({
        url: `/products/patch/${product._id}`,
        method: "PATCH",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),
    removeProductSoft: builder.mutation<IProduct, string | number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    removeProductForce: builder.mutation<IProduct, string | number>({
      query: (id) => ({
        url: `/products/force/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    restoreProduct: builder.mutation<IProduct, string | number>({
      query: (id) => ({
        url: `/products/restore/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Products"],
    }),

    // variant 
    getVariant: builder.query<IVariant, void>({
      query: () => '/variant-product',
      providesTags: ['Products']
    }),
    searchVariant: builder.query<IVariant, any>({
      query: ({ limit }: any) => `/variant-product?_limit=${limit}`,
      providesTags: ['Products']
    }),
    getVariantProductID: builder.query<IVariant, number | string>({
      query: (id) => `/variant-product/variant/${id}`,
      providesTags: ['Products']
    }),
    getVariantById: builder.query<IVariant, number | string>({
      query: (id) => `/variant-product/${id}`,
      providesTags: ['Products']
    }),
    addVariant: builder.mutation<IVariant, IVariant>({
      query: (variant: IVariant) => ({
        url: "/variant-product",
        method: 'POST',
        body: variant
      }),
      invalidatesTags: ['Products']
    }),
    updateVariant: builder.mutation<IVariant, IVariant>({
      query: (variant: IVariant) => ({
        url: `/variant-product/${variant._id}/update`,
        method: 'PUT',
        body: variant
      }),
      invalidatesTags: ['Products']
    }),
    removeVariant: builder.mutation<IVariant, string | number>({
      query: (id) => ({
        url: `/variant-product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products']
    }),


    getGroup: builder.query<IGroup, void>({
      query: () => "/product-groups",
      providesTags: ["Products"],
    }),
    getAllGroup: builder.query<IGroup, void>({
      query: (data: any) => `/product-groups/all?_sort=${data?._sort}`,
      providesTags: ["Products"],
    }),
    removeGroup: builder.mutation<IGroup, string>({
      query: (id) => ({
        url: `/product-groups/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    addGroup: builder.mutation<IGroup, IGroup>({
      query: (data) => ({
        url: "/product-groups",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProductByGroup: builder.mutation<IGroup, any>({
      query: (data) => ({
        url: "/product-groups/delete-product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    getGroupById: builder.query<IGroup, string | number>({
      query: (id) => `/product-groups/${id}`,
      providesTags: ["Products"],
    }),
    updateGroup: builder.mutation<IGroup, IGroup>({
      query: (data) => {
        const { _id, ...body } = data;
        return {
          url: `/product-groups/${_id as string}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  usePatchProductsMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductsMutation,
  useRemoveProductSoftMutation,
  useRemoveProductForceMutation,
  useGetProductByIdQuery,
  useUpdateProductsMutation,
  useGetProductByCategoryQuery,
  useSearchProductQuery,
  useGetProductAllDeleteQuery,
  useRestoreProductMutation,
  useGetAllProductClientQuery,
  useGetProductFeatureQuery,
  useGetProductSaleQuery,
  useGetProductByBrandQuery,
  useGetAllProductClientsQuery,
  useGetProductNewQuery,
  useGetAllProductClientGroupQuery,

  // variant
  useGetVariantByIdQuery,
  useSearchVariantQuery,
  useGetVariantQuery,
  useAddVariantMutation,
  useRemoveVariantMutation,
  useGetVariantProductIDQuery,
  useUpdateVariantMutation,

  // group
  useAddGroupMutation,
  useGetGroupQuery,
  useRemoveGroupMutation,
  useUpdateGroupMutation,
  useGetAllGroupQuery,
  useGetGroupByIdQuery,
  useDeleteProductByGroupMutation,
  useGetProductTopBestSaleQuery
} = productApi;

export const productReducer = productApi.reducer;
export default productApi


