import MonthRevenue from "./MonthRevenue";
import YearRevenue from "./YearRevenue";
import ProductByCate from "./ProductByCate";
import ProductByBrand from "./ProductByBrand";
import TopSelling from "./TopSelling";
import WeekRevenue from "./WeekRevenue";
import ProductFavorite from "./ProductFavorite";

const Statistic = () => {
  return (
    <div>
      <div className="p-2">
        <h2 className=" text-2xl font-bold">Sản phẩm bán chạy trong tháng này</h2>
        <TopSelling />
      </div>
      <div className="grid grid-cols-2 items-center gap-5">
        <div >
          <h2 className="mt-20 text-2xl font-bold">Doanh thu theo các tuần</h2>
          <WeekRevenue />
        </div>
        <div>
          <h2 className="mt-20 text-2xl font-bold">Doanh thu theo các tháng</h2>
          <MonthRevenue />
        </div>

        <div>
          <h1 className="mt-20 text-2xl font-bold">Doanh thu theo năm</h1>
          <YearRevenue />
        </div>
      </div>
      <div className="p-4">
        <h2 className="mt-20 text-2xl font-bold">Top 5 sản phẩm yêu thích</h2>
        <ProductFavorite />
      </div>
      <div className="grid grid-cols-2 items-center gap-5">
        <div>
          <h1 className="mt-20 text-2xl font-bold">Số lượng sản phẩm theo danh mục</h1>
          <ProductByCate />
        </div>
        <div>
          <h2 className="mt-20 text-2xl font-bold">Số lượng sản phẩm theo thương hiệu</h2>
          <ProductByBrand />
        </div>
      </div>

    </div>
  );
};

export default Statistic;
