import { IBill } from "../../interface/bill";
import { useTopSellingProductQuery } from "../../api/statistic";
import TopSale from "./components/TopSale";
import { Skeleton } from "antd";
import { useMemo } from "react";

const TopSelling = () => {
  const {
    data: topSellingData,
    isLoading: topSellingLoading,
    isError: topSellingError,
  } = useTopSellingProductQuery<any>();

  const topSelling = useMemo(() => topSellingData, [topSellingData])

  if (topSellingLoading) {
    return <Skeleton />
  }
  return (
    <div>
      {topSellingLoading && <div>Loading...</div>}
      {topSellingError && <div>Error loading data</div>}

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-sm bg-white divide-y-2 divide-gray-200">
          <thead className="text-left ltr:text-left rtl:text-right">
            <tr>
              <th className="px-4 py-2 text-xl font-bold text-gray-900 whitespace-nowrap">
                Top
              </th>
              <th className="px-4 py-2 text-xl font-bold text-gray-900 whitespace-nowrap">
                Sản phẩm
              </th>
              <th className="px-4 py-2 text-xl font-bold text-gray-900 whitespace-nowrap">
                Lượt bán
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {topSelling && topSelling.map((item: IBill, index: number) => (
              <TopSale item={item} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSelling;
