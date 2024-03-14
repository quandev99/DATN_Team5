import { Button, Table, Input, Image } from "antd";
import { useGetCategoryQuery } from "../../../api/category";
import { useGetBrandsQuery } from "../../../api/brand";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getDecodedAccessToken } from "../../../decoder";
// import Swal from "sweetalert2";

const CategoryList = () => {
  const token: any = getDecodedAccessToken();
  const roleId = token?.role_name;

  const { data: dataCategory } = useGetCategoryQuery();
  const { data: brandData } = useGetBrandsQuery<any>();
  // const [removeCategory] = useRemoveCategoryMutation();
  const brands = brandData?.brands;
  const categories = dataCategory?.categories;
  const [pagination, setPagination] = useState({ current: 1, pageSize: 4 });
  const [searchText, setSearchText] = useState("");

  const data = categories
    ?.filter((category: any) =>
      category.category_name?.toLowerCase().includes(searchText?.toLowerCase()) ||
      category.brand_id?.toLowerCase() === searchText?.toLowerCase() ||
      (brands?.find((brand: any) => brand._id === category.brand_id)?.brand_name?.toLowerCase().includes(searchText?.toLowerCase()))
    )
    .map((category: any, index: string) => {
      return {
        STT: index + 1 + (pagination.current - 1) * pagination.pageSize,
        key: category._id,
        category,
        category_name: category.category_name,
        category_description: category.category_description,
        brand_id: category.brand_id,
        category_image: category.category_image,
      };
    });

  // const handleDelete = async (_id: string) => {
  //   try {
  //     const data: any = await removeCategory(_id).unwrap();
  //     if (data.success === true) {
  //       Swal.fire({
  //         position: 'top',
  //         icon: 'success',
  //         title: `${data.message}`,
  //         showConfirmButton: false,
  //         timer: 2000
  //       })
  //       return;
  //     } else {
  //       Swal.fire({
  //         title: 'Opps!',
  //         text: `${data.message}`,
  //         icon: 'error',
  //         confirmButtonText: 'Quay lại'
  //       })
  //     }
  //   } catch (error: any) {
  //     message.error(error.data.message)
  //   }
  // };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (index: any) => <a>{index}</a>,
    },
    {
      title: "Tên danh mục",
      dataIndex: "category_name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Ảnh danh mục",
      dataIndex: "category_image",
      render: (category_image: { url: string }) => (
        <Image src={category_image?.url} height={130} width={100} />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "category",
      render: (record) => {
        return record?.products?.length;
      },
    },
    {
      title: "Mô tả danh mục",
      dataIndex: "category_description",
      render: (record: any) => (
        <div dangerouslySetInnerHTML={{ __html: record }} className="w-full" />
      ),
    },
    // {
    //   title: "Thương hiệu",
    //   dataIndex: "brand_id",
    //   render: (record: any) => {
    //     const brandName = brands?.find((cate: any) => cate._id === record);
    //     return brandName?.brand_name;
    //   },
    // },
    {
      title: "Chức năng",
      render: ({ key: _id }: any) => (
        <div className="flex items-center gap-4">
          {/* {category_name !== "Chưa phân loại" && (
            <Popconfirm
              title="Xóa danh mục"
              description="Bạn có chắc chắn muốn xóa?"
              okText={<span style={{ color: 'white', backgroundColor: 'red' }}>Xóa</span>}
              cancelText="Không"
              onConfirm={() => handleDelete(_id)}
            >
              <Button danger>Xóa</Button>
            </Popconfirm>
          )} */}
          <Button type="primary" className="bg-blue-300">
            <Link
              to={
                roleId == "Admin"
                  ? `/admin/categories/${_id}/update`
                  : `/member/categories/${_id}/update`
              }
            >
              Sửa
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);

  };

  return (
    <div>
      <div>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold uppercase">Danh sách danh mục</h1>
          <Input
            placeholder="Tìm kiếm theo tên danh mục hoặc tên thương hiệu.."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 350 }} // Đặt độ rộng của ô tìm kiếm ở đây
          />

          <Button type="primary" className="bg-green-400">
            <Link
              to={
                roleId == "Admin"
                  ? "/admin/categories/add"
                  : "/member/categories/add"
              }
            >
              Thêm mới
            </Link>
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default CategoryList;
