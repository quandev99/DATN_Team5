import { Button, Empty, Image, Popconfirm, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Switch } from 'antd';

// import { Carousel } from 'antd';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Pagination } from 'antd';
import { IProduct } from "../../../../interface/product";
import { useGetBrandsQuery } from "../../../../api/brand";
import { useGetCategoryQuery } from "../../../../api/category";
import { ICategory } from "../../../../interface/category";
import IBrand from "../../../../interface/brand";
import { useGetProductAllDeleteQuery, useRemoveProductForceMutation, useRestoreProductMutation, useUpdateProductsMutation } from "../../../../api/product";
import Swal from "sweetalert2";
const ListProductDelete = () => {
    //react-hook-form
    const {
        register,
        handleSubmit,
    } = useForm<IProduct>();

    const { data: dataBrand } = useGetBrandsQuery<any>();
    const { data: dataCategory } = useGetCategoryQuery<any>();
    const { data: dataProduct, error: isErrorProductDelete } = useGetProductAllDeleteQuery<any>("")
    const [currentPages, setCurrentPage] = useState(1);

    const { data: cateData } = useGetCategoryQuery<any>()
    const { data: brandData } = useGetBrandsQuery<any>()
    const [removeForceProduct] = useRemoveProductForceMutation<any>();
    const [updateProduct] = useUpdateProductsMutation<any>();
    const [restoreProduct] = useRestoreProductMutation<any>();

    const products = dataProduct?.products;
    const brandList = dataBrand?.brands;
    const categoryList = dataCategory?.categories;
    const brands = brandData?.brands
    const categories = cateData?.categories
    const totalItems = dataProduct?.pagination?.totalItems
    const data = products?.map((product: any, index: number) => {
        return {
            STT: index + 1,
            product: product,
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
        }
    })

    const onChange = async (product: any) => {
        const newStatus = !product?.product_status; // Đảo ngược trạng thái

        const formData = {
            ...product,
            product_status: newStatus, // Gán giá trị mới cho product_status
        };

        try {
            await updateProduct(formData).unwrap();
            if (product?.product_status) {
                message.success(`Mở sản phẩm`)
            } else {
                message.success(`Ẩn sản phẩm  `)
            }
        } catch (error: any) {
            message.error(`${error.data.message}`)
        }
    };

    const handleDelete = async (_id: string) => {
        try {
            const data: any = await removeForceProduct(_id).unwrap();
            if (data.success === true) {
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: `${data.message}`,
                    showConfirmButton: false,
                    timer: 2000
                })
                return;
            } else {
                Swal.fire({
                    title: 'Opps!',
                    text: `${data.message}`,
                    icon: 'error',
                    confirmButtonText: 'Quay lại'
                })
            }
        } catch (error: any) {
            message.error(error.data.message);
        }
    };

    const onHandleRestore = async (_id: string) => {
        const data: any = await restoreProduct(_id);

        if (data.success === true) {
            Swal.fire({
                position: 'top',
                icon: 'success',
                title: `${data.message}`,
                showConfirmButton: false,
                timer: 2000
            })
            return;
        } else {
            Swal.fire({
                title: 'Opps!',
                text: `${data.message}`,
                icon: 'error',
                confirmButtonText: 'Quay lại'
            })
        }
    }

    // XỬ LÝ KHI CHUYỂN TRANG
    const onHandlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const onHandleSubmit = async () => {
        try {
            // const searchOptions: any = {
            //     product_name: value.product_name,
            //     product_code: value.product_code,
            //     category_id: value.category_id,
            //     brand_id: value.brand_id,
            // }
            // setState(searchOptions);
        } catch (error) {
            console.log(error);
        }
    }

    const columns: ColumnsType<IProduct> = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            render: (index: any) => <a>{index}</a>,
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "product_name",
            render: (record) => {
                if (record?.length > 15) {
                    return record.slice(0, 15).concat("...");
                } else {
                    return record;
                }
            },
        },
        {
            title: "Ảnh sản phẩm",
            dataIndex: "product_image",
            render: (image) => {
                return <Image src={image?.url} height={130} width={100} />;
            }
        },
        {
            title: "Mô tả ngắn",
            dataIndex: "product_description_short",
        },
        {
            title: "Danh mục",
            dataIndex: "category_id",
            render: (record: any) => {
                const catename = categories?.find((cate: any) => cate._id === record);
                return catename?.category_name || "Chưa phân loại";
            }
        },
        {
            title: "Thương hiệu",
            dataIndex: "brand_id",
            render: (record: any) => {
                const brandName = brands?.find((cate: any) => cate._id === record);
                return brandName?.brand_name || "Chưa phân loại";
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "product",
            render: (record: any) => {
                return <Switch checked={!record.product_status} onClick={() => onChange(record)} />;
            }
        },
        {
            title: "Chức năng",

            render: (record: { _id: string }) => (
                <div className="flex items-center gap-4">
                    <Popconfirm
                        title="Xóa sản phẩm"
                        description="Bạn có chắc chắn muốn xóa?"
                        okText={<span style={{ color: 'white', backgroundColor: 'red', }}>Xóa</span>}
                        cancelText="Không"
                        onConfirm={() => handleDelete(record?._id)

                        }
                    >
                        <Button className="text-red-500">Xoá vĩnh viễn</Button>
                    </Popconfirm>
                    <Button type="primary" className="bg-blue-300" onClick={() => onHandleRestore(record?._id)}>
                        Khôi phục
                    </Button>
                </div>
            ),
        },
    ];
    return <div>
        <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold">Thùng rác</h1>
            <button className="bg-green-400 hover:bg-green-500 hover:text-white text-white transition-all  px-2 py-1 rounded-md">
                <Link to="/admin/products">Quay lại</Link>
            </button>
        </div>
        <form onSubmit={handleSubmit(onHandleSubmit as any)} className="w-full bg-gray-50 py-2 px-2 mb-5 text-gray-600 shadow grid grid-cols-6">
            <div className="max-w-[200px] bg-black">
                <input
                    {...register("product_name")}
                    className="py-2 w-full outline-none border px-2"
                    type="text"
                    placeholder="Tên sản phẩm" />
            </div>
            <div className="max-w-[200px] bg-black">
                <input
                    {...register("product_code")}
                    className="py-2 w-full outline-none border px-2"
                    type="text"
                    placeholder="Mã sản phẩm" />
            </div>
            <div className="max-w-[200px] bg-black">
                <select
                    {...register("category_id")}
                    className="py-2 w-full h-full outline-none border px-2"
                    id="">
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
                    id="">
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
        {isErrorProductDelete ? <Empty /> : (
            <div>
                <Table columns={columns} dataSource={data} pagination={false} />
                <Pagination current={currentPages} total={totalItems} onChange={onHandlePageChange} className="mt-5" />
            </div>
        )}

    </div>;
};

export default ListProductDelete;
