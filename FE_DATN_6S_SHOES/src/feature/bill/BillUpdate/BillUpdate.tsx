import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { useAbortBillMutation, useGetBillByIdQuery, useUpdateBillStatusMutation } from "../../../api/bill";

import type { StepsProps } from 'antd';
import { Popconfirm, Popover, Spin, Steps, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const customDot: StepsProps['progressDot'] = (dot, { status, index }) => (
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
const description = '';

const BillUpdate = React.memo(() => {
  const {
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<any>();

  const { id } = useParams<{ id: any }>();
  const [isLoading, setIsloading] = useState(false);
  const [isLoadingUpdate, setIsloadingUpdate] = useState(false);
  const { data: billData } = useGetBillByIdQuery(id);

  const [updateBill] = useUpdateBillStatusMutation<any>();
  const billList = useMemo(() => billData?.bill || {}, [billData]);

  let totalQuantity = 0;

  if (billList && billList.products && Array.isArray(billList.products)) {
    billList.products?.forEach((product: any) => {
      const productQuantity = product.quantity || 0;
      totalQuantity += productQuantity;
    });
  }

  useEffect(() => {
    reset(billData);
    setValue('status', billList?.status);
  }, [billData?.bill, setValue, reset]);

  // Hàm xử lý gửi form
  const onHandleSubmit = async () => {
    setIsloadingUpdate(true);
    const selectedStatus2 = watch("status");
    const formData = {
      payment_status: billList?.payment_status?._id,
      status: selectedStatus2,
      _id: id,
    };
    try {
      const response = await updateBill(formData).unwrap();

      if (response.success) {
        message.success("Cập nhật trạng thái đơn hàng!");
        // navigate("/admin/bills");
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error: any) {
      message.error(`${error.data.message}`);
    } finally {
      setIsloadingUpdate(false);
    }
  };

  const [removeBill] = useAbortBillMutation();

  const handleDelete = async (_id: string) => {
    setIsloading(true);
    try {
      const { data }: any = await removeBill(_id);
      if (data) {
        message.success(`${data.message}`)
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}

      {/* Spin component */}
      {isLoading && (
        <div className="fixed z-50 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      {isLoadingUpdate && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}

      {/* Spin component */}
      {isLoadingUpdate && (
        <div className="fixed z-50 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <div className="bg-gray-50 pt-10 shadow-sm">
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
              title: 'Đơn hàng đã đặt',
              description,
            },
            {
              title: 'Đã xác nhận',
              description,
            },
            {
              title: 'Đang vận chuyển',
              description,
            },
            {
              title: 'Đã nhận được hàng',
              description,
            },
            {
              title: 'Đánh giá',
              description,
            },
            {
              title: 'Đã hủy',
              description,
            },
          ]}
        />
      </div>
      <form onSubmit={handleSubmit(onHandleSubmit as any)}>
        <div className=" py-10">
          <div className="min-h-32 grid grid-cols-2 gap-5">
            <div className="shadow-md col-span-2 rounded-md">
              <div className="grid grid-cols-1  gap-2 lg:grid-cols-4 lg:gap-4 ">
                {/*  */}
                <div className="col-span-3">
                  {/*  */}
                  <div className="flex items-center bg-gray-50  p-4 gap-5  border border-gray-200">
                    <div className="w-[60px] h-[60px] border rounded-full">
                      <img src={billList?.user_avatar?.url} className="w-full h-full  rounded-full" alt="" />
                    </div>
                    <div className="max-w-[400px] w-full">
                      <div className="grid grid-cols-2">
                        <h1>Họ tên khách hàng:</h1> <p className="font-medium"> {billList?.bill_fullName}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <h1>Tên đăng nhập: </h1> <p className="font-medium">{billList?.user_username}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <h1>Email khách hàng:</h1> <p className="font-medium"> {billList?.user_email}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <h1>Số lượng sản phẩm:</h1> <p className="font-medium"> {totalQuantity}</p>
                      </div>
                    </div>
                  </div>
                  <div className="  bg-gray-50  p-4  mt-5 border border-gray-200">
                    <div>
                      <h1 className="font-bold text-[20px] mb-2">Địa chỉ</h1>
                    </div>
                    <div className="grid grid-cols-2 w-[300px] gap-1 items-center ">
                      <div>
                        <p>Số điện thoại:</p>
                        <p>Địa chỉ nhận hàng:</p>
                      </div>
                      <div>
                        <p>{billList?.bill_phone}</p>
                        <p>{billList?.bill_shippingAddress}</p>
                      </div>
                    </div>
                  </div>
                  {/*  */}
                  <div className="flex items-center bg-gray-50 w-full  p-4 gap-5 mt-5 border border-gray-200 mb-5">
                    <div className="mb-5 shadow-sm">
                      <div className="bg-white p-5 border border-gray-50">
                        <div className="flex md:text-[14px] text-[12px] items-center justify-between">
                          <div className="flex items-center gap-2 ">
                            <div className="font-bold px-2  bg-red-600 text-white py-1">Store</div>
                            <div className="border border-gray-100  px-2 py-1">Mã đơn hàng: {billList?.bill_code}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-green-700">{billList?.status === "Unpaid" ? "Chưa thanh toán" : "Đã thanh toán"}</p> <p>|</p>
                            <p className="text-red-600">{billList?.payment_status?.pStatus_description}</p>
                          </div>
                        </div>
                        <hr className="mt-3" />
                        <div>
                          {billList?.products?.map((pro: any, index: string) => {
                            return (
                              <div key={index} className="cart-List grid md:grid-cols-[670px,auto] items-center">
                                <div className="py-3 flex gap-2">
                                  <div className="max-w-[100px] border w-[80px] h-[80px]">
                                    <img src={pro?.product_image?.url} className="w-full h-full" alt="image" />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <div>
                                      <h1 className="hover:text-red-400 transition-all"><Link to="">{pro?.product_name}</Link></h1>
                                    </div>
                                    <div className="flex">
                                      <p className="text-gray-500 font-medium">
                                        {pro?.color_name} / {pro?.size_name}
                                      </p>
                                    </div>
                                    <div className="flex">
                                      <div className="flex items-center">
                                        <p>x</p> <span className=" font-medium">{pro?.quantity}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {pro?.product_discount > 0 ? (
                                  <div className="flex items-center text-[15px] gap-2">
                                    <span><del>{pro?.product_price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} </del></span>
                                    <span className="text-red-500">{pro?.product_discount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} </span>
                                  </div>
                                ) : <span>{pro?.product_price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} </span>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="bg-[#fffefb] border border-gray-50 py-4 px-4">
                        <div className="flex justify-between items-center">
                          <div></div>
                          <div className="flex items-center gap-2">
                            <div>{ }</div>
                            <span className="flex gap-3 items-center">Thành tiền: <p className="text-red-500 text-[20px]">{billList?.bill_totalOrder?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p></span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <div></div>
                            <div className=" mt-2 rounded px-2 py-2 flex items-center gap-2">
                              Phương thức thanh toán: <p className="text-yellow-500">{billList?.payment_method?.pMethod_description}</p>
                            </div>
                          </div>
                          {/* <div className="flex gap-2  mb-5">
                            {billList?.payment_status?.status_name === "Delivered" ? (
                              <Link to="/products"
                                className="bg-red-500 text-center text-white hover:text-white max-w-[140px] border-gray-300 hover:bg-red-600 transition-all rounded-md w-full  py-2">
                                Mua lại</Link>
                            ) : ''}
                            {billList?.payment_status?.status_name !== "Delivering" || billList?.payment_status?.status_name !== "Delivered" || item?.payment_status?.status_name !== "Abort" ? <button
                              onClick={() => onHandRemoveBill(billList?._id)}
                              className="bg-red-500 text-white max-w-[140px] border-2 border-gray-100 hover:border-green-300  transition-all rounded-md w-full  py-2"
                            >Hủy</button> : ''}
                            {billList?.payment_status?.status_name === "Delivered" ? (
                              <Link
                                to="/"
                                className="bg-white text-center border-2 max-w-[140px]  border-gray-100 hover:border-green-300 transition-all rounded-md w-full  py-2"
                              >Đánh giá</Link>
                            ) : ''}
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" bg-gray-50  p-4 gap-5 border border-gray-200 mb-5">
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Trạng thái đơn hàng
                    </label>
                    <br />

                    <div>
                      <p className=" w-full px-3 py-4 border  rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]">
                        {billList?.payment_status?.pStatus_description}</p>
                    </div>

                  </div>
                  <div className="mt-5">
                    <label htmlFor="" className="font-bold text-[19px]">
                      Thanh toán
                    </label>
                    <br />
                    {/* <select
                      {...register("status", {
                        required: "Vui lòng chọn trạng thái đơn hàng",
                      })}
                      value={watch("status")} // Lấy giá trị hiện tại của category_id
                      onChange={(e) => setValue("status", e.target.value)} // Cập nhật giá trị khi người dùng thay đổi select
                      className=" w-full px-3 py-4 border rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                    >
                      <option value="Unpaid">{billList?.status === "Unpaid" ? (billList?.status === "Unpaid" ? "Chưa thanh toán" : "Đã thanh toán") : "Chưa thanh toán"}</option>
                      <option value="Paid">{billList?.status === "Paid" ? (billList?.status === "Paid" ? "Đã thanh toán" : "Chưa trả") : "Đã thanh toán"}</option>
                    </select> */}
                    <div>
                      <p className=" w-full px-3 py-4 border  rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]">
                        {billList && billList?.status === "Unpaid" ? "Chưa thanh toán" : "Đã thanh toán"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 items-center">
                    {billList?.payment_status?.pStatus_name !== "Delivered" && billList?.payment_status?.pStatus_name !== "Abort" ? (
                      <button className="bg-green-500 px-6 mt-5  py-2 mb-2  rounded-sm mr-auto   text-white hover:bg-green-600 transition-all duration-200">
                        Cập nhật
                      </button>
                    ) : ''}
                    {billList?.payment_status?.pStatus_name === "Pending" && (
                      <Popconfirm
                        title="Hủy đơn hàng"
                        description="Bạn có chắc chắn muốn hủy?"
                        className="text-black"
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => handleDelete(billList?._id)}
                      >
                        <p className="text-center cursor-pointer text-white hover:bg-red-600 transition-all px-8 mt-5  py-2 mb-2  rounded-sm  bg-red-500" >Hủy</p>
                      </Popconfirm>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
})

export default BillUpdate