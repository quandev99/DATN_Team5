
import { message } from "antd";
import { formatDate } from "../../util/helper";
import { Link } from "react-router-dom";
const Coupon = ({ coupon, user_id }: any) => {
  const handleCopy = () => {
    const inputElement: any = document.getElementById(`myInput_${coupon?._id}`);
    if (
      !coupon?.used_by_users?.includes(user_id) &&
      inputElement !== "Đã sử dụng" &&
      !isCouponExpired(coupon?.expiration_date) &&
      coupon?.coupon_quantity > 0
    ) {
      inputElement.select();
      document.execCommand("copy");
      message.success("Đã sao chép giá trị vào clipboard!");
    }
  };
  const isCouponExpired = (expirationDate: Date) => {
    const expirationTime = new Date(expirationDate);
    const currentTime = new Date();
    return expirationTime < currentTime;
  };

  return (
    <div>
      <div className="flex justify-between text-[14px] hover:shadow-md rounded-md duration-200 bg-gray-100 hover:border-green-200 hover:border-1 shadow-sm transition-all border min-h-[130px] ">
        <div className="w-[40%] bg-[#26aa99] text-center p-4">
          <p className="w-[100px] text-[20px] text-white font-bold">Voucher</p>
          <p className="text-[#d4eeeb]">{coupon?.coupon_content}</p>
        </div>
        <div className=" flex justify-between gap-x-2  items-center px-2 w-auto">
          <div className="w-full">
            <span className=" text-black font-medium text-[15px]">
              {coupon?.coupon_name}
            </span>
            <h3>Đơn tối thiểu {coupon?.min_purchase_amount}</h3>
            <p className="text-[12px]">
              HSD:
              {isCouponExpired(coupon?.expiration_date)
                ? "Đã hết hạn"
                : formatDate(coupon?.expiration_date)}
            </p>
          </div>
          <div className="">
            <input
              type="text"
              value={
                coupon?.used_by_users?.includes(user_id) ||
                  coupon?.coupon_quantity == 0
                  ? "Đã sử dụng"
                  : coupon?.coupon_code
              }
              id={`myInput_${coupon?._id}`}
              readOnly
              className="max-w-[80px] p-1 text-[12px] text-center outline-none cursor-pointer border border-gray-200 hover:border-green-300 rounded-md mb-2"
              onClick={handleCopy}
            />

            <Link to={``}>Điều kiện</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coupon;
