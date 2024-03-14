import React from "react";
import { PrinterOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { Button } from "antd";
const BillCheckout = ({ bill }: any) => {
  const handlePrint = useReactToPrint({
    content: () => printRef?.current as any,
  });
  const printRef: any = React.useRef();
  return (
    <div className="w-full p-5" ref={printRef}>
      <div className="flex items-center justify-between">
        <div className="w-[100px] h-[100px]">
          <img
            className="w-full h-full object-cover"
            src="https://res.cloudinary.com/djlylbhrb/image/upload/v1697640078/obebs4rwv41zfkcvl4ig.png"
            alt=""
          />
        </div>
        <div>
          <Button onClick={handlePrint}>
            <PrinterOutlined />
          </Button>
        </div>
      </div>
      <div className="flex  justify-between mb-5">
        <div>
          <p>Ngày tạo đơn: {new Date(bill?.createdAt)?.toLocaleString()}</p>
          <p>ID: {bill?._id}</p>
        </div>
        <div className="text-right">
          <h5 className="text-xl font-medium">6s Shoes</h5>
          <p>13 Trịnh Văn Bô</p>
          <p>Nam Từ Liêm , Hà Nội</p>
          <p>Email: nguyenvietquan2605@gmail.com</p>
        </div>
      </div>
      <div className="w-full mb-12">
        <table className="w-full text-sm text-gray-500 mb-10">
          <thead className="w-full text-xs text-gray-900 uppercase text-left border-b-2">
            <tr className="w-full ">
              <th scope="col" className="pb-4">
                STT
              </th>
              <th scope="col" className="pb-4">
                Tên
              </th>
              <th scope="col" className="pb-4">
                Màu
              </th>
              <th scope="col" className="pb-4">
                Số lượng
              </th>
              <th scope="col" className="pb-4">
                Giá
              </th>
            </tr>
          </thead>
          <tbody className="w-full text-left">
            {bill?.products &&
              bill?.products.map((item: any, index: number) => (
                <tr className="bg-white " key={item?._id}>
                  <td className="pt-4">{index + 1}</td>
                  <td className="pt-4">{item?.product_name}</td>
                  <td className="pt-4">{item?.color_name}</td>
                  <td className="pt-4">{item?.quantity}</td>
                  <td className="pt-4">
                    {item?.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                </tr>
              ))}

            {/* <tr className="bg-white ">
              <td className="pt-4">1</td>
              <th
                scope="row"
                className="pt-4 font-medium text-gray-900 whitespace-nowrap "
              >
                Apple MacBook Pro 17"
              </th>
              <td className="pt-4">Silver</td>
              <td className="pt-4">2</td>
              <td className="pt-4">$2999</td>
            </tr> */}
          </tbody>
        </table>
        <table className="w-full text-sm text-gray-500">
          <thead className="w-full text-xs text-gray-900 uppercase text-left border-b-2">
            <tr className="w-full ">
              <th scope="col" className="pb-4">
                Mã đơn hàng
              </th>
              <th scope="col" className="pb-4">
                Tên khách hàng
              </th>
              <th scope="col" className="pb-4">
                Địa chỉ
              </th>
              <th scope="col" className="pb-4 text-right">
                Tổng tiền
              </th>
            </tr>
          </thead>
          <tbody className="w-full text-left">
            <tr className="bg-white ">
              <td className="pt-4">{bill?.bill_code}</td>
              <td className="pt-4">{bill?.user_username}</td>
              <td className="pt-4">{bill?.bill_shippingAddress}</td>
              <td className="pt-4 text-4xl font-bold text-red-500 text-right">
                {bill?.bill_totalOrder.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-between">
        <div className="text-2xl">
          <i className="pr-5 fa-solid transition-all duration-300 fa-heart fa-shake ml-2 hover:font-bold focus:font-bold text-red-600"></i>
          Cảm ơn quý khách
        </div>
        <div className="flex item-center text-base">
          <div className="border-r-2 pr-2">nguyenvietquan2605@gmail.com</div>
          <div className="border-r-2 px-2">0932307248</div>
          <div className="pl-2">6s Shoes.com</div>
        </div>
      </div>
    </div>
  );
};

export default BillCheckout;
