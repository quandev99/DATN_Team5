import { useMemo } from "react";
import { useGetAllFavoriteQuery } from "../../api/favorite";

const ProductFavorite = () => {
  const {
    data: TopFavorite,
    isLoading: TopLoading,
    isError: TopError,
  } = useGetAllFavoriteQuery<any>();
  const TopData = useMemo(() => TopFavorite?.topFavorites, [TopFavorite]);

  if (TopLoading) {
    return <div>Loading...</div>;
  }

  if (TopError) {
    return <div>Error loading data</div>;
  }

  const topFavoriteProduct = TopData.map(
    (top: any) => ({
      name: top.product_name,
      count: top.totalFavorites,
    })
  );

  return (
    <div>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-sm bg-white divide-y-2 divide-gray-200">
          <thead className="text-left ltr:text-left rtl:text-right">
            <tr>
              <th className="px-4 py-2 text-xl font-bold text-gray-900 whitespace-nowrap">
                Tên sản phẩm
              </th>
              <th className="px-4 py-2 text-xl font-bold text-gray-900 whitespace-nowrap">
                Số lượt yêu thích
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {topFavoriteProduct.map((top: any) => (
              <tr key={top.name}>
                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                  {top.name}
                </td>
                <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                  {top.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductFavorite;
