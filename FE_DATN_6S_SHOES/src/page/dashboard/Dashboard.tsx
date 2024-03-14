import { useGetAllBillAdminQuery } from "../../api/bill";
import { useGetProductQuery } from "../../api/product";
import { useGetCountBillTodayQuery } from "../../api/statistic";
import { useGetusersQuery } from "../../api/user";
import MonthRevenue from "../../feature/statistic/MonthRevenue";
import ProductFavorite from "../../feature/statistic/ProductFavorite";
import TopSelling from "../../feature/statistic/TopSelling";
import WeekRevenue from "../../feature/statistic/WeekRevenue";
import YearRevenue from "../../feature/statistic/YearRevenue";

const Dashboard = () => {
  const { data: dataProduct } = useGetProductQuery<any>();
  const { data: dataBill } = useGetAllBillAdminQuery<any>(2);
  const { data: dataUser } = useGetusersQuery<any>();
  const { data: dataCountBillToday } = useGetCountBillTodayQuery<any>();
  const productCount = dataProduct?.pagination?.totalItems;
  const billCount = dataBill?.pagination?.totalItems;
  const userCount = dataUser?.pagination?.totalItems;

  return (
    <section >
      <div>
        <h1 className="text-[30px] mb-4">Trang quản trị</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
        <div className=" rounded-lg bg-blue-900 text-white border text-center py-10">
          <div className=" ">
            <h1 className="text-[22px]">Tổng đơn hàng trong ngày</h1>
          </div>
          <div>
            <span className="text-[22px] font-bold">{dataCountBillToday?.billsCount || 0}</span>
          </div>
        </div>
        <div className=" rounded-lg bg-yellow-900 text-white border text-center py-10">
          <div className=" ">
            <h1 className="text-[22px]">Tổng đơn hàng</h1>
          </div>
          <div>
            <span className="text-[22px] font-bold">{billCount || 0}</span>
          </div>
        </div>
        <div className=" rounded-lg bg-[#00d27a] text-white border text-center py-10">
          <div className=" ">
            <h1 className="text-[22px]">Tài khoản người dùng</h1>
          </div>
          <div>
            <span className="text-[22px] font-bold">{userCount || 0}</span>
          </div>
        </div>
        <div className=" rounded-lg bg-red-800 text-white border text-center py-10">
          <div className=" ">
            <h1 className="text-[22px]">Tổng sản phẩm</h1>
          </div>
          <div>
            <span className="text-[22px] font-bold">{productCount || 0}</span>
          </div>
        </div>

      </div>

      <div className="mt-10 w-full ">
        <div className="font-bold text-2xl">Thống kê doanh thu</div>
        <div className="grid grid-cols-2 items-center">
          <div>
            <div className="font-bold text-xl">Doanh thu theo tuần</div>
            <WeekRevenue />
          </div>
          <div>
            <div className="font-bold text-xl">Doanh thu theo tháng</div>
            <MonthRevenue />
          </div>
          <div>
            <div className="font-bold text-xl">Doanh thu theo năm</div>
            <YearRevenue />
          </div>
        </div>
      </div>


      <div className="mt-20">
        <div className="font-bold text-2xl">Top sản phẩm bán chạy trong tháng này</div>
        <TopSelling />
      </div>

      <div className="mt-20">
        <div className="font-bold text-2xl">Top 5 sản phẩm được yêu thích nhiều nhất</div>
        <ProductFavorite />
      </div>
    </section>
  );
};

export default Dashboard;
