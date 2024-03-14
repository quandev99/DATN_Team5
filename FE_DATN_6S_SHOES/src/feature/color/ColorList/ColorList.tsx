import { Button, Image, Pagination, Skeleton, Table } from "antd";
import { IColor } from "../../../interface/color";
import { useSearchColorsQuery } from "../../../api/color";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { getDecodedAccessToken } from "../../../decoder";

const ColorList = () => {
    const token: any = getDecodedAccessToken();
    const roleId = token?.role_name;

  const [currentPages, setCurrentPage] = useState(1);

  const { data, isLoading } = useSearchColorsQuery<any>({ currentPages });
  const colors = useMemo(() => data?.colors, [data]);
  const totalItems = data?.paginattion?.totalItems;

  const dataSource = colors?.map(({ _id, color_name, color_code, color_image, color_description, variant_products, color_is_new }: IColor, index: string) => ({
    _id: _id,
    color_name: color_name,
    color_code: color_code,
    color_image: color_image,
    color_description: color_description,
    variant_products: variant_products,
    color_is_new: color_is_new,
    STT: index + 1
  }));


  const columns: any = [
    {
      title: "Số thứ tự",
      dataIndex: "STT",
    },
    {
      title: "Màu",
      dataIndex: "color_name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Ảnh Màu",
      dataIndex: "color_image",
      render: (color_image: { url: string }) => (
        <Image width={150} height={100} src={color_image?.url} />
      ),
    },
    {
      title: "Mã code màu",
      dataIndex: "color_code",
      render: (record: string) => <div>{record}</div>,
    },
    // {
    //   title: "Sản phẩm biến thể",
    //   dataIndex: "variant_products",
    // },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "color_is_new",
    // },
    {
      title: "Mô tả",
      dataIndex: "color_description",
    },
    {
      title: "Chức năng",
      dataIndex: "action",
      render: (_id: any, record: IColor) => (
        <div className="flex items-center gap-4">
          {/* <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => handleDelete(record._id as any)}
          >
            <Button danger>Xoá</Button>
          </Popconfirm> */}
          <Button type="primary" className="bg-blue-300">
            <Link
              to={
                roleId == "Admin"
                  ? `/admin/colors/${record._id}/update`
                  : `/member/colors/${record._id}/update`
              }
            >
              Sửa
            </Link>
          </Button>
        </div>
      ),
    },
  ];
  // XỬ LÝ KHI CHUYỂN TRANG
  const onHandlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  return (
    <div>
      <div>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Danh sách color</h1>
          <Button type="primary" className="bg-green-400">
            <Link
              to={roleId == "Admin" ? "/admin/colors/add" : "/member/colors/add"}
            >
              Thêm mới
            </Link>
          </Button>
        </div>
        {isLoading ? (
          <Skeleton />
        ) : (
          <Table columns={columns} dataSource={dataSource} />
        )}
        <div className="text-center">
          <Pagination
            current={currentPages}
            total={totalItems}
            onChange={onHandlePageChange}
            className="mt-5"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorList;