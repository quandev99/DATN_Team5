import { useGetUserByIdQuery } from "../../../api/user";
import { getDecodedAccessToken } from "../../../decoder";
import { useGetCouponsByUsersQuery } from "../../../api/coupon";
import { ICoupon } from "../../../interface/coupons";
import { Coupon } from "../../../components";
import { RiCouponFill } from "react-icons/ri";
const VoucherPage = () => {
  const token: any = getDecodedAccessToken();
  const { data: userData } = useGetUserByIdQuery<any>(token?._id);
  const user = userData?.user;
  const userId = user?._id;

  const { data: voucherData, isLoading: isLoadingCoupon } =
    useGetCouponsByUsersQuery<any>(userId);

  return (
    <div className="w-full  mx-auto rounded-sm p-2">
      <h1 className="mx-auto border w-[400px] text-center text-yellow-700 flex items-center gap-2 justify-center shadow-sm py-2 mb-4 rounded-md bg-white uppercase font-medium text-[23px]">
        Mã giảm giá dành cho bạn  <RiCouponFill /></h1>
      {voucherData?.coupon?.length < 1 ? (
        <div className="text-center w-full h-full">
          Không có mã giảm giá nào
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {voucherData?.coupon?.map((item: ICoupon) => {

            return (
              <Coupon
                coupon={item}
                user_id={userId}
                isLoading={isLoadingCoupon}
                key={item?._id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VoucherPage;
