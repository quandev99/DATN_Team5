import { Button, Empty, Image, Popconfirm, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetAllGroupQuery, usePatchProductsMutation, useRemoveProductSoftMutation, useSearchProductQuery } from "../../../api/product";
import { useGetCategoryQuery } from "../../../api/category";
import { useGetBrandsQuery } from "../../../api/brand";
import { Switch } from 'antd';

// import { Carousel } from 'antd';
import { IProduct } from "../../../interface/product";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ICategory } from "../../../interface/category";
import IBrand from "../../../interface/brand";
import React, { useState } from "react";
import { Pagination } from 'antd';
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import { IGroup } from "../../../interface/group";
import Swal from "sweetalert2";
// import Swal from "sweetalert2";
import { PrinterOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { getDecodedAccessToken } from "../../../decoder";
const ProductList = () => {
  //react-hook-form
  const { register, handleSubmit } = useForm<IProduct>();
  const [state, setState] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // path admin and member
  const token: any = getDecodedAccessToken();
  const roleId = token?.role_name;

  const [currentPages, setCurrentPage] = useState(1);
  const productreq = { ...state, currentPages };

  const { data: dataProduct, isError } = useSearchProductQuery<any>(productreq);
  const { data: dataBrand } = useGetBrandsQuery<any>();
  const { data: dataCategory } = useGetCategoryQuery<any>();
  const { data: cateData } = useGetCategoryQuery<any>();
  const { data: brandData } = useGetBrandsQuery<any>();
  const { data: groupData } = useGetAllGroupQuery<any>();
  const [removeProduct] = useRemoveProductSoftMutation<any>();
  const [updateProduct] = usePatchProductsMutation<any>();

  const products = dataProduct?.products;
  const brandList = dataBrand?.brands;
  const categoryList = dataCategory?.categories;
  const brands = brandData?.brands;
  const categories = cateData?.categories;
  const groups = groupData?.groups;
  const totalItems = dataProduct?.pagination?.totalItems;
  const data = products?.map((product: any, index: number) => {
    return {
      STT: index + 1,
      product: product,
      ...product,
      _id: product._id,
      product_status: product.product_status,
      product_name: product.product_name,
      product_image: product.product_image,
      thumbnail: product.thumbnail,
      product_description_short: product.product_description_short,
      product_description_long: product.product_description_long,
      category_id: product.category_id,
      brand_id: product.brand_id,
      product_code: product.product_code,
      product_is_new: product.product_is_new,
      variant_count:
        product.variant_products?.length > 0 &&
        product.variant_products?.length,
    };
  });

  // xóa ẩn
  const onChange = async (product: any) => {
    const newStatus = !product?.product_status;

    const formData = {
      ...product,
      product_status: newStatus,
      is_on_sale: undefined
    };

    try {
      await updateProduct(formData).unwrap();
      if (product?.product_status) {
        message.success(`Mở sản phẩm`);
      } else {
        message.success(`Ẩn sản phẩm  `);
      }
    } catch (error: any) {
      message.error(`${error.data.message}`);
    }
  };

  const handleDelete = async (_id: string) => {
    setIsLoading(true);
    try {
      const data: any = await removeProduct(_id).unwrap();
      if (data.success === true) {
        Swal.fire({
          position: "top",
          icon: "success",
          title: `${data.message}`,
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      } else {
        Swal.fire({
          title: "Opps!",
          text: `${data.message}`,
          icon: "error",
          confirmButtonText: "Quay lại",
        });
      }
    } catch (error: any) {
      message.error(`${error?.data?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // XỬ LÝ KHI CHUYỂN TRANG
  const onHandlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handlePrint = useReactToPrint({
    content: () => printRef?.current as any,
  });
  const printRef: any = React.useRef();
  const onHandleSubmit = async (value: any) => {
    try {
      const searchOptions: any = {
        product_name: value.product_name,
        product_code: value.product_code,
        category_id: value.category_id,
        brand_id: value.brand_id,
      };
      setState(searchOptions);
    } catch (error: any) {
      message.error(error);
    }
  };

  const columns: ColumnsType<IProduct> = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      width: "10px",
      render: (index: any) => <a>{index}</a>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      className: "w-[20%]",
      render: (record) => {
        return record;
      },
    },
    {
      title: "Ảnh sản phẩm",
      dataIndex: "product_image",
      render: (image) => {
        return <Image src={image?.url} height={130} width={100} />;
      },
    },
    {
      title: "Biến thể",
      dataIndex: "variant_count",
    },
    {
      title: "Danh mục",
      dataIndex: "category_id",
      render: (record: any) => {
        const catename = categories?.find((cate: any) => cate._id === record);
        return catename?.category_name;
      },
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand_id",
      render: (record: any) => {
        const brandName = brands?.find((cate: any) => cate._id === record);
        return brandName?.brand_name;
      },
    },
    {
      title: "Nhóm sản phẩm",
      dataIndex: "group_id",
      render: (record: any) => {
        const groupName: IGroup = groups?.find(
          (item: IGroup) => item._id == record
        );
        return groupName?.group_name;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "product",
      render: (record: any) => {
        return (
          <Switch
            defaultChecked={!record.product_status}
            onClick={() => onChange(record)}
          />
        );
      },
    },
    {
      title: "Chức năng",
      render: (record: { _id: string }) => (
        <div className="flex items-center gap-4">
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record._id)}
            okText={<p className="hover:text-blue-400 text-black">Xóa</p>}
            okButtonProps={{
              className:
                "!bg-white !border border-gray-300 text-black hover:border-blue-400",
            }}
            cancelText="Hủy"
          >
            <Button type="default" disabled={isLoading} size="small">
              <AiFillDelete />
            </Button>
          </Popconfirm>
          <Link to={roleId === "Admin" ? `/admin/products/${record?._id}/update` : `/member/products/${record?._id}/update`}>
            <Button type="default" size="small">
              <AiTwotoneEdit />
            </Button>
          </Link>
        </div>
      ),
    },
    {
      title: (
        <Button onClick={handlePrint}>
          <PrinterOutlined />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">Danh sách sản phẩm</h1>
        <div className="flex items-center gap-2">
          <button className="bg-green-600 hover:bg-green-700 hover:text-white text-white transition-all  px-2 py-1 rounded-lg">
            <Link to={roleId === "Admin" ? "/admin/products/add" : "/member/products/add"}>Thêm mới</Link>
          </button>
          <Link
            to="/admin/products/listDelete"
            className="flex items-center gap-1 text-white cursor-pointer bg-gray-700 hover:bg-gray-800  transition-all  px-2 py-1 rounded-lg"
          >
            <h1>Thùng rác</h1>
            <i className="fa-solid fa-trash"></i>
          </Link>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onHandleSubmit as any)}
        className="w-full bg-gray-50 py-2 px-2 mb-5 text-gray-600 shadow grid grid-cols-6"
      >
        <div className="max-w-[200px] bg-black">
          <input
            {...register("product_name")}
            className="py-2 w-full outline-none border px-2"
            type="text"
            placeholder="Tên sản phẩm"
          />
        </div>
        <div className="max-w-[200px] bg-black">
          <input
            {...register("product_code")}
            className="py-2 w-full outline-none border px-2"
            type="text"
            placeholder="Mã sản phẩm"
          />
        </div>
        <div className="max-w-[200px] bg-black">
          <select
            {...register("category_id")}
            className="py-2 w-full h-full outline-none border px-2"
            id=""
          >
            <option value="">Danh mục</option>
            {categoryList?.map((cate: ICategory) => (
              <option key={cate._id} value={cate._id}>
                {cate.category_name}
              </option>
            ))}
          </select>
        </div>
        <div className="max-w-[200px] bg-black">
          <select
            {...register("brand_id")}
            className="py-2 w-full h-full outline-none border px-2"
            id=""
          >
            <option value="">Thương hiệu</option>
            {brandList?.map((brand: IBrand) => (
              <option key={brand._id} value={brand._id}>
                {brand.brand_name}
              </option>
            ))}
          </select>
        </div>
        <div className="max-w-[70px]">
          <button className="py-2 w-full rounded-full hover:bg-gray-100 transition-all h-full outline-none border px-2 ">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </form>

      {isError ? (
        <>
          <div>
            <Empty />
          </div>
        </>
      ) : (
        <div
          ref={printRef}
          className=" shadow-lg border border-gray-100 rounded-[30px] bg-white  p-5"
        >
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      )}
      <Pagination
        current={currentPages}
        total={totalItems}
        onChange={onHandlePageChange}
        className="mt-5"
      />
    </div>
  );
};

export default ProductList;
