import { Link, useParams } from "react-router-dom";

import type { StepsProps } from "antd";
import { Popover, Spin, Steps, message } from "antd";
import {
  useAbortBillMutation,
  useCreatePaymentMutation,
  useGetBillByIdQuery,
} from "../../../../api/bill";
import { useMemo, useState } from "react";
import { LoadingOutlined } from '@ant-design/icons';

const customDot: StepsProps["progressDot"] = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

const BillDetail = () => {
  const { idBill } = useParams<{ idBill: any }>();
  const { data: billData } = useGetBillByIdQuery(idBill);
  const [createPayment] = useCreatePaymentMutation();
  const billList = useMemo(() => billData?.bill, [billData]);
  const [isLoading, setIsloading] = useState(false);
  const [isLoadingPay, setIsloadingPay] = useState(false);

  let totalQuantity = 0;

  if (billList && billList.products && Array.isArray(billList.products)) {
    billList.products?.forEach((product: any) => {
      const productQuantity = product.quantity || 0;
      totalQuantity += productQuantity;
    });
  }

  const [removeBill] = useAbortBillMutation();
  const onHandRemoveBill = async (_id: string) => {
    setIsloading(true);
    try {
      const { data }: any = await removeBill(_id);
      if (data) {
        message.success(`${data.message}`);
      }
    } catch (error: any) {
      message.error(error.response.data.message)
    } finally {
      setIsloading(false)
    }
  };


  const onHandlePayment = async (value: any) => {
    setIsloadingPay(true);
    try {
      const formCheckout: any = {
        user_id: value?.user_id?._id,
        bill_phone: value.bill_phone,
        bill_shippingAddress: value.bill_shippingAddress,
        coupon_id: value.coupon_id ? value.coupon_id : undefined,
        bill_note: value.bill_note ? value.bill_note : undefined,
        products: value.products,
        payment_method: value.payment_method._id || undefined,
        bill_totalPrice: value.bill_totalPrice,
        bill_totalOrder: value.bill_totalOrder,
        bill_shippingFee: value.bill_shippingFee,
      };

      const data: any = await createPayment(formCheckout).unwrap();
      if (data) {
        window.location.href = data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloadingPay(false);
    }
  }

  return (
    <div className="overflow-x-auto">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}

      {/* Spin component */}
      {isLoading && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      {isLoadingPay && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}

      {/* Spin component */}
      {isLoadingPay && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <div className="bg-white pt-10 shadow-sm">
        <Steps
          current={
            billList
              ? billList?.payment_status?.pStatus_name === "Pending"
                ? 0
                : billList?.payment_status?.pStatus_name === "Confirmed"
                  ? 1
                  : billList?.payment_status?.pStatus_name === "Delivering"
                    ? 2
                    : billList?.payment_status?.pStatus_name === "Delivered" &&
                      billList?.isReview === false
                      ? 3
                      : billList?.payment_status?.pStatus_name === "Delivered" &&
                        billList?.isReview === true
                        ? 4
                        : billList?.payment_status?.pStatus_name === "Abort"
                          ? 5
                          : 1
              : 1
          }
          progressDot={customDot}
          items={[
            {
              title: "Đơn hàng đã đặt",
            },
            {
              title: "Đã xác nhận thông tin thanh toán",
            },
            {
              title: "Đang vận chuyển",
            },
            {
              title: "Đã nhận được hàng",
            },
            {
              title: "Đánh giá",
            },
            {
              title: "Đã hủy",
            },
          ]}
        />
      </div>
      <form>
        <div className=" py-10">
          <div className="min-h-32 grid grid-cols-2 gap-5">
            <div className="shadow-md col-span-2 rounded-md">
              {/*  */}
              <div className=" bg-white p-4 mb-5">
                <div className="flex gap-2  mb-5">
                  {billList?.payment_status?.pStatus_name === "Delivered" ? (
                    <Link
                      to="/products"
                      className="bg-red-500 text-center text-white hover:text-white max-w-[140px] border-gray-300 hover:bg-red-600 transition-all rounded-md w-full  py-2"
                    >
                      Mua lại
                    </Link>
                  ) : (
                    ""
                  )}
                  {(billList?.payment_status?.pStatus_name !== "Delivering" && billList?.status === "Unpaid" && billList?.payment_status?.pStatus_name !== "Delivered" && billList?.payment_status?.pStatus_name !== "Reviews" && billList?.payment_status?.pStatus_name !== "Abort") ? (
                    <button
                      onClick={() => onHandRemoveBill(billList?._id)}
                      className="bg-red-500 text-white max-w-[140px] border-2 border-gray-100 hover:border-green-300  transition-all rounded-md w-full  py-2"
                    >
                      Hủy
                    </button>
                  ) : (
                    ""
                  )}
                  {billList?.payment_status?.pStatus_name === "Delivered" ? (
                    <Link
                      to="/"
                      className="bg-white text-center border-2 max-w-[140px]  border-gray-100 hover:border-green-300 transition-all rounded-md w-full  py-2"
                    >
                      Đánh giá
                    </Link>
                  ) : (
                    ""
                  )}
                  {(billList?.status === "Unpaid" && billList?.payment_method?.pMethod_name !== "offline") && (
                    <div>
                      <p
                        className=" cursor-pointer px-5 max-w-[200px] text-black bg-white border-2 border-green-100 hover:border-green-300  transition-all rounded-md w-full  py-2"
                        onClick={() => onHandlePayment(billList)}>
                        Thanh toán
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                {/*  */}
                <div className="col-span-2 bg-white shadow-sm  p-4 border border-gray-100">
                  <h1 className="font-medium uppercase mb-5 text-center text-shadow border py-1 shadow-sm">
                    Thông tin khách hàng{" "}
                  </h1>
                  {/* <div className="w-[60px] h-[60px] border rounded-full">
                                        <img src={billList?.user_id?.user_avatar?.url} className="w-full h-full  rounded-full" alt="" />
                                    </div> */}
                  <div className="max-w-[300px] w-full">
                    <div className="grid grid-cols-2">
                      <h1>Họ tên khách hàng:</h1>{" "}
                      <p className="font-medium">
                        {" "}
                        {billList?.user_id?.user_fullname}
                      </p>
                    </div>
                    {/* <div className="grid grid-cols-2">
                                            <h1>Tên đăng nhập: </h1> <p className="font-medium">{billList?.user_id?.user_username}</p>
</div> */}
                    {/* <div className="grid grid-cols-2">
                                            <h1>Email khách hàng:</h1> <p className="font-medium"> {billList?.user_id?.user_email}</p>
                                        </div> */}
                    <div className="grid grid-cols-2">
                      <h1>Số lượng sản phẩm:</h1>{" "}
                      <p className="font-medium"> {totalQuantity}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 bg-white shadow-sm  p-4 gap-5  border border-gray-100">
                  <h1 className="font-medium uppercase mb-5 text-center text-shadow border py-1 shadow-sm">
                    Địa chỉ nhận hàng{" "}
                  </h1>
                  <div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1>Họ tên người nhận:</h1>{" "}
                        <p className="font-medium">
                          {billList?.bill_fullName ||
                            billList?.user_id?.user_fullname}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <h1>Số điện thoại người nhận:</h1>{" "}
                        <p className="font-medium">
                          {billList?.bill_phone ||
                            billList?.user_id?.user_phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <h1>Địa chỉ người nhận:</h1>{" "}
                        <p className="font-medium">
                          {billList?.bill_shippingAddress}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <h1>Ghi chú của người nhận:</h1>{" "}
                        <p className="font-medium">
                          {billList?.bill_note || "Người nhận không viết gì"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*  */}
              <div className="flex items-center bg-white w-full  p-4 gap-5 mt-5 border border-gray-200">
                <div className=" shadow-sm w-full">
                  <div className=" ">
                    <div className="flex bg-gray-50 py-3 px-2 md:text-[14px] text-[12px] items-center justify-between">
                      <div className="flex items-center gap-2 ">
                        <div className="font-bold px-2  bg-red-600 text-white py-1">
                          Store
                        </div>
                        <div className="border border-gray-100  px-2 py-1">
                          Mã đơn hàng: {billList?.bill_code}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-green-700">
                          {billList?.status === "Unpaid"
                            ? "Chưa thanh toán"
                            : "Đã thanh toán"}
                        </p>{" "}
                        <p>|</p>
                        <p className="text-red-600">
                          {billList?.payment_status?.pStatus_description}
                        </p>
                      </div>
                    </div>
                    <hr className="mt-3" />
                    <div className="px-2">
                      {billList?.products?.map((pro: any, index: string) => {
                        return (
                          <div
                            key={index}
                            className="cart-List flex md:justify-between items-center"
                          >
                            <div className="py-3 flex gap-2">
                              <div className="max-w-[100px] border w-[80px] h-[80px]">
                                <img
                                  src={pro?.product_image?.url}
                                  className="w-full h-full border"
                                  alt="image"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <div>
                                  <h1 className="hover:text-red-400 transition-all">
                                    <Link to="">{pro?.product_name}</Link>
                                  </h1>
                                </div>
                                <div className="flex">
                                  <p className="text-gray-500 font-medium">
                                    {pro?.color_name} / {pro?.size_name}
                                  </p>
                                </div>
                                <div className="flex">
                                  <p className="flex items-center">
                                    <p>x</p>{" "}
                                    <span className=" font-medium">
                                      {pro?.quantity}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            {pro?.product_discount > 0 ? (
                              <div className="flex items-center text-[15px] gap-2">
                                <span>
                                  <del>
                                    {pro?.product_price?.toLocaleString(
                                      "vi-VN",
                                      { style: "currency", currency: "VND" }
                                    )}{" "}
                                  </del>
                                </span>
                                <span className="text-red-500">
                                  {pro?.product_discount?.toLocaleString(
                                    "vi-VN",
                                    { style: "currency", currency: "VND" }
                                  )}{" "}
                                </span>
                              </div>
                            ) : (
                              <span>
                                {pro?.product_price?.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}{" "}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div
                    className="bg-[#fafafa] border border-gray-50 my-2 grid text-right"
                    style={{ borderCollapse: "collapse" }}
                  >
                    <div
                      className="border py-2 px-4 grid grid-cols-4"
                      style={{ border: "1px solid #eeeeee" }}
                    >
                      <h1 className="col-span-3 ">Tổng tiền hàng:</h1>{" "}
                      <p>
                        {billList?.bill_totalPrice?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>
                    <div
                      className="border py-2 px-4 grid grid-cols-4"
                      style={{ border: "1px solid #eeeeee" }}
                    >
                      <h1 className="col-span-3">Phí vận chuyển:</h1>{" "}
                      <p> 30.000 đ </p>
                    </div>
                    {billList?.bill_totalPrice > 100000 && (
                      <div
                        className="border py-2 px-4 grid grid-cols-4"
                        style={{ border: "1px solid #eeeeee" }}
                      >
                        <h1 className="col-span-3">Giảm giá phí vận chuyển:</h1>{" "}
                        <p>{billList?.bill_totalPrice > 100000 && "- 30.000 đ"}</p>
                      </div>
                    )}

                    <div
                      className="border py-2 px-4 grid grid-cols-4"
                      style={{ border: "1px solid #eeeeee" }}
                    >
                      <h1 className="col-span-3">Tiền giảm khi áp dụng mã:</h1>{" "}
                      <p>
                        {"-"}
                        {(
                          billList?.bill_totalPrice - billList?.bill_totalOrder
                        )?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>
                    <div
                      className="border py-2 px-4 grid grid-cols-4"
                      style={{ border: "1px solid #eeeeee" }}
                    >
                      <h1 className="col-span-3">Thành tiền:</h1>{" "}
                      <p>
                        {billList?.bill_totalOrder?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>
                  </div>
                  {/* <div className="border border-yellow-300 px-4 text-[12px] py-3 flex items-center gap-2">
                    <i className="fa-regular fa-bell fa-shake border rounded-full p-1 text-[10px] text-yellow-400 border-yellow-400"></i>
                    <p>
                      Vui lòng thanh toán{" "}
                      <span className="text-red-400">10k</span> khi nhận hàng
                    </p>
                  </div> */}

                  <div className="bg-[#fffefb] border border-gray-50 py-4 px-4">
                    <div className="flex justify-between items-center">
                      <div></div>
                      <span className="flex gap-3 items-center">
                        Phương thức thanh toán:{" "}
                        <p>{billList?.payment_method?.pMethod_description}</p>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BillDetail;
