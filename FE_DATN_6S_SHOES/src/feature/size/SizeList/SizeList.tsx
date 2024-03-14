import { Button, Pagination, Skeleton, Table } from "antd";
import { ISize } from "../../../interface/size";
import { useSearchSizeQuery } from "../../../api/size";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import { getDecodedAccessToken } from "../../../decoder";

const SizeList = () => {
    const token: any = getDecodedAccessToken();
    const roleId = token?.role_name;
  const [currentPages, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const { data, isLoading } = useSearchSizeQuery<any>({ currentPages, limit });
  const totalItems = data?.paginattion?.totalItems;

  const sizes = data?.sizes;
  const dataSource = sizes?.map(({ _id, size_name, size_code, size_description, size_is_new }: ISize, index: number) => ({
    _id: _id,
    size_name: size_name,
    size_code: size_code,
    size_description: size_description,
    size_is_new: size_is_new,
    STT: index + 1,
  }));

  // XỬ LÝ KHI CHUYỂN TRANG
  const onHandlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const columns: ColumnsType<ISize> = [
    {
      title: "STT",
      dataIndex: "STT",
      render: (index: any) => <a>{index}</a>,
    },
    {
      title: "Kích cỡ",
      dataIndex: "size_name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "mã code kích cỡ",
      dataIndex: "size_code",
    },
    {
      title: "status",
      dataIndex: "size_is_new",
      render: (text: string) => (
        <div
          className={`bg-${
            text ? "green" : "red"
          }-500 w-[50px] text-center rounded-md text-white`}
        >
          <a>{text ? "Mới" : "Cũ"}</a>
        </div>
      ),
    },
    {
      title: "Mô tả kích cỡ",
      dataIndex: "size_description",
    },

    {
      title: "Chức năng",
      dataIndex: "action",
      render: (_id: any, record: ISize) => (
        <div className="flex items-center gap-4">
          {/* <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger>Xoá</Button>
          </Popconfirm> */}
          <Button type="primary" className="bg-blue-300">
            <Link
              to={
                roleId == "Admin"
                  ? `/admin/sizes/${record._id}/update`
                  : `/member/sizes/${record._id}/update`
              }
            >
              Sửa
            </Link>
          </Button>
        </div>
      ),
    },
  ];
  if (isLoading) return <Skeleton />;
  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl font-bold">Danh sách size</h1>
        <button
          type="submit"
          className="bg-green-700 transition-all hover:bg-green-800 px-2 py-1 rounded-lg text-white"
        >
          <Link
            to={roleId == "Admin" ? "/admin/sizes/add" : "/member/sizes/add"}
          >
            Thêm mới
          </Link>
        </button>
      </div>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <div className="text-center">
        <Pagination
          current={currentPages}
          total={totalItems}
          onChange={onHandlePageChange}
          className="mt-5"
        />
      </div>
    </div>
  );
}

export default SizeList
