import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IBill } from "../interface/bill";

const statisticApi = createApi({
    reducerPath: "statistics",
    tagTypes: ["Statistic"],
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
    endpoints: builder => ({
        getCountBillToday: builder.query<any, void>({
            query: () => `/statistics/count-bill-today`,
            providesTags: ["Statistic"],
        }),
        topSellingProduct: builder.query<IBill, void>({
            query: () => "/products-sell",
            providesTags: ["Statistic"]
        }),
    }),
});

export const {
    useGetCountBillTodayQuery,
    useTopSellingProductQuery
} = statisticApi;
export const statisticReducer = statisticApi.reducer;
export default statisticApi;
