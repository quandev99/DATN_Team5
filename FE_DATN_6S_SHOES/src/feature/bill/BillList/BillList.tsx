import { Link } from "react-router-dom";
import { useGetDstatussQuery } from "../../../api/deliveryStatus";
import { useEffect, useState } from "react";
import { useAbortBillMutation, useGetAllBillsQuery } from "../../../api/bill";
import { Button, Pagination, Popconfirm, Spin, Table, message } from "antd";
import { IBill } from "../../../interface/bill";
import { getDecodedAccessToken } from "../../../decoder";
import { LoadingOutlined } from '@ant-design/icons';

const BillList = () => {
  const token: any = getDecodedAccessToken();
  const roleId = token?.role_name;
  const { data: DStatusData } = useGetDstatussQuery<any>();
  const DStatusList = DStatusData?.dstatus;
  const [currentStatus, setCurrentStatus] = useState('all');
  const [filterBill, setFilterBill] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isloadingAbort, setIsloadingAbort] = useState(false);

  const { data: billData } = useGetAllBillsQuery<any>(1);
  const Bill = billData?.bills;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const onHandleChangeStatus = (status: string) => {
    setCurrentStatus(status);
    if (status === 'all') {
      setFilterBill(Bill);
    } else {
      const filtered = Bill?.filter((item: any) => item.payment_status?._id === status);
      setFilterBill(filtered)
    }
  }

  const displayedOrders: any = filterBill?.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentStatus === 'all') {
      setFilterBill(Bill);
    } else {
      const filtered = Bill?.filter((item: any) => item?.payment_status?._id === currentStatus);
      setFilterBill(filtered);
    }
    if (searchValue) {
      filterData(searchValue);
    }
  }, [currentStatus, Bill, searchValue])

  const onHandleSearch = (event: any) => {
    const value = event.target.value;
    setSearchValue(value);
    filterData(value);
  };

  const filterData = (value: any) => {
    if (value === '' || !value) {
      setFilterBill(Bill);
    } else {
      const filtered = Bill?.filter((item: any) =>
        item.bill_code.toLowerCase().includes(value)
      );
      setFilterBill(filtered);
    }
  };

  const [removeBill] = useAbortBillMutation();
  const handleDelete = async (_id: string) => {
    setIsloadingAbort(true);
    try {
      const data: any = await removeBill(_id);
      if (data) {
        message.success(`${data.message}`)
      }
    } catch (error: any) {
      message.success(`${error?.data?.message}`)
    } finally {
      setIsloadingAbort(false)
    }
  };

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
      dataIndex: "bill_fullName",
      render: (text: string) => text,
    },
    {
      title: "Số điện thoại",
      dataIndex: "bill_phone",
      render: (text: string) => text,
    },

    // {
    //     title: "Số lượng sản phẩm",
    //     dataIndex: "products",
    //     render: (record: string) => <p>{record.length}</p>,
    // },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (record: any) => <div>{new Date(record).toLocaleString()}</div>,
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "payment_status",
      render: (text: any) => (
        <div
          className={` py-2 border  border-gray-300 text-center rounded-md font-medium shadow`}
        >
          <div>{text?.pStatus_description}</div>
        </div>
      ),
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
      {isloadingAbort && (
        <div className="fixed z-50 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      {isloadingAbort && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">Danh sách đơn hàng</h1>
      </div>

      <div className="text-sm font-medium text-center bg-white mb-5 text-gray-500 shadow-sm border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex justify-between">
          <li className="w-full">
            <Link to="#"
              onClick={(e) => {
                e.preventDefault();
                onHandleChangeStatus('all');
                setCurrentStatus('all');
              }}
              className={` block p-4 hover:bg-gray-50 border-b-2  ${currentStatus === 'all' && "border-red-300 text-red-400 "} border-transparent rounded-t-lg hover:text-gray-600  dark:hover:text-gray-300`}>
              Tất cả</Link>
          </li>
          {DStatusList?.map((item: any, index: string) => {

            return (
              <li className="w-full" key={index}>
                <Link
                  to={`/account/bills`}
                  onClick={(e) => {
                    e.preventDefault();
                    onHandleChangeStatus(item?._id);
                  }}
                  className={`block   ${currentStatus === item?._id && "border-red-300 text-red-400 "} p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:text-gray-300`}>
                  {item.pStatus_description}</Link>
              </li>
            )
          })}
        </ul>
      </div>
      <form
        className="box-search flex items-center space-x-2 mb-3 bg-[#eaeaea] w-full py-3 ">
        <i className="fa-solid fa-magnifying-glass  pl-4"></i>
        <input type="text"
          onChange={() => onHandleSearch(event)}
          className="border-none outline-none w-full  bg-[#eaeaea]" placeholder="Tìm kiếm theo mã đơn hàng" />
      </form>
      <Table columns={columns} dataSource={displayedOrders?.map((bill: IBill, index: string) => ({
        ...bill,
        _id: bill?._id,
        bill,
        STT: (currentPage - 1) * 5 + index + 1,
      }))} pagination={false} />
      {(displayedOrders?.length > 1 || displayedOrders !== undefined) && (
        <div className="text-center">
          <Pagination
            current={currentPage}
            total={filterBill?.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
          />
        </div>
      )}

    </div>
  )
}

export default BillList