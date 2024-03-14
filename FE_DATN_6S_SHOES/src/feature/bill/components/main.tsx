import { Button, Pagination, Popconfirm, Skeleton, Table } from "antd";
import { Link, useParams } from "react-router-dom";
import { useAbortBillMutation, useGetBillByDStatusQuery } from "../../../api/bill";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { getDecodedAccessToken } from "../../../decoder";
const MainBillStatus = () => {
  const token: any = getDecodedAccessToken();
  const roleId = token?.role_name;
  const { id } = useParams<any>();
  const [state, setState] = useState({});
  const [currentPages, setCurrentPage] = useState(1);
  const billreq: any = { ...state, currentPages, id }
  const { data: billData, isLoading, error } = useGetBillByDStatusQuery<any>(billreq as any);
  const billList = billData?.bills?.map((bill: any, index: number) => {

    return {
      STT: index + 1,
      key: bill?._id,
      user_email: bill?.user_email,
      user_username: bill?.user_username,
      user_fullname: bill?.user_fullname,
      user_avatar: bill?.user_avatar,
      bill_totalOrder: bill?.bill_totalOrder,
      bill_totalPrice: bill?.bill_totalPrice,
      bill_shippingAddress: bill?.bill_shippingAddress,
      bill_phone: bill?.bill_phone,
      updatedAt: bill?.updatedAt,
      createdAt: bill?.createdAt,
      products: bill?.products,
      payment_method: bill?.payment_method,
      payment_status: bill?.payment_status,
      status: bill?.status,
      user_id: bill?.user_id?._id,
      bill: bill,
      bill_code: bill?.bill_code,
    }
  });

  const {
    register,
    handleSubmit,
  } = useForm<any>();


  const totalItems = billData?.pagination?.totalItems
  // XỬ LÝ KHI CHUYỂN TRANG
  const onHandlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const [removeBill] = useAbortBillMutation();
  const handleDelete = async (_id: string) => {
    const data: any = await removeBill(_id);
    if (data) {
      alert(`${data.message}`)
    }
  };

  const onHandleSearch = async (value: any) => {
    try {
      const searchOptions: any = {
        bill_code: value.bill_code,
      }
      setState(searchOptions);
    } catch (error) {
      console.log(error);
    }
  }

  const columns: any = [
    {
      title: "STT",
      dataIndex: "STT",
      render: (index: any) => <div>{index}</div>,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "bill_code",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Khách hàng",
      dataIndex: "user_username",
      render: (text: string) => text,
    },
    // {
    //     title: "Email",
    //     dataIndex: "user_email",
    // },
    // {
    //     title: "Tên đăng nhập",
    //     dataIndex: "user_username",
    // },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "payment_status",
      render: (text: any) => (
        <div
          className={` py-2 border  border-gray-300 text-center rounded-md font-medium shadow`}
        >
          <div>{text.pStatus_name}</div>
        </div>
      ),
    },
    // {
    //     title: "Số lượng sản phẩm",
    //     dataIndex: "products",
    //     render: (record: string) => <p>{record.length}</p>,
    // },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (record: any) => <div>{record}</div>,
    },
    {
      title: "Chức năng",
      dataIndex: "bill",
      render: (record: any) => (
        <div className="flex items-center gap-4">
          <Link
            to={
              roleId == "Admin"
                ? `/admin/bills/${record?._id}/update`
                : `/member/bills/${record?._id}/update`
            }
            className="border hover:border-yellow-500 transition-all rounded-full text-[18px] px-[11px] hover:text-yellow-500"
          >
            <i className="fa-solid fa-info"></i>
          </Link>
          {record?.payment_status?.pStatus_name === "Pending" && (
            <Popconfirm
              title="Hủy đơn hàng"
              description="Bạn có chắc chắn muốn hủy?"
              className="text-black"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handleDelete(record?._id)}
            >
              <Button danger>Hủy</Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];
  return (
    <div>
      <form
        onSubmit={handleSubmit(onHandleSearch as any)}
        className="box-search flex items-center space-x-2 mb-3 bg-[#eaeaea] w-full py-3 ">
        <i className="fa-solid fa-magnifying-glass  pl-4"></i>
        <input type="text"  {...register("bill_code")} className="border-none outline-none w-full  bg-[#eaeaea]" placeholder="Tìm kiếm" />
      </form>
      {error ? <div className="text-center">Không tìm thấy đơn hàng nào</div> : (
        <div>
          {isLoading ? <Skeleton /> : <Table columns={columns} dataSource={billList} />}
          <div className="text-center">
            <Pagination current={currentPages} total={totalItems} onChange={onHandlePageChange} className="mt-5" />
          </div>
        </div>
      )}
    </div>
  )
}

export default MainBillStatus