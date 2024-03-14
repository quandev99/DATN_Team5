import { useGetAllBillAdminQuery } from "../../api/bill";
import { useGetProductQuery } from "../../api/product";
import { useGetCountBillTodayQuery } from "../../api/statistic";
import { useGetusersQuery } from "../../api/user";

const DashboardMember = () => {
  const { data: dataProduct } = useGetProductQuery<any>();
  const { data: dataBill } = useGetAllBillAdminQuery<any>(2);
  const { data: dataUser } = useGetusersQuery<any>();
  const { data: dataCountBillToday } = useGetCountBillTodayQuery<any>();
  const productCount = dataProduct?.pagination?.totalItems;
  const billCount = dataBill?.pagination?.totalItems;
  const userCount = dataUser?.pagination?.totalItems;

  return (
    <section>
      <div>
        <h1 className="text-[30px] mb-4">Trang nhân viên</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
        <div className=" rounded-lg bg-blue-900 text-white border text-center py-10">
          <div className=" ">
            <h1 className="text-[22px]">Tổng đơn hàng trong ngày</h1>
          </div>
          <div>
            <span className="text-[22px] font-bold">
              {dataCountBillToday?.billsCount || 0}
            </span>
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
    </section>
  );
};

export default DashboardMember;
