import { useEffect, useState } from "react";
import { useGetAllProductClientQuery } from "../../../api/product";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import { useGetBrandsQuery } from "../../../api/brand";
import IBrand from "../../../interface/brand";
import { useGetCategoryQuery } from "../../../api/category";
import { ICategory } from "../../../interface/category";
import { useGetColorsQuery } from "../../../api/color";
import { useSearchSizeQuery } from "../../../api/size";
import { IColor } from "../../../interface/color";
import { ISize } from "../../../interface/size";

const dataFakePrice = [
    { value: { maxPrice: 500000 }, title: "Dưới 500,000₫" },
    { value: { minPrice: 500000, maxPrice: 2000000 }, title: "500,0000₫ - 2,000,000₫" },
    {
        value: { minPrice: 2000000, maxPrice: 3000000 },
        title: "2,000,000₫ - 3,000,000₫",
    },
    {
        value: { minPrice: 3000000, maxPrice: 5000000 },
        title: "3,000,000₫ - 5,000,000₫",
    },
    { value: { maxPrice: 10000000 }, title: "Dưới 10 triệu" },
    { value: { minPrice: 10000000 }, title: "Trên 10 triệu" },
];

const SearchHeader = () => {
    const [keys, setKeys] = useState<any>('');
    const [category, setCategory] = useState<any>('');
    const [brand, setBrand] = useState<any>('');
    const [color, setColor] = useState<any>('');
    const [size, setSize] = useState<any>('');
    const [selectedValue, setSelectedValue] = useState<any>([]);
    const [PriceFilter, setPriceFilter] = useState<any>([]);

    const { data: BrandData } = useGetBrandsQuery<IBrand>({ limit: 100 } as any);
    const { data: CategoryData } = useGetCategoryQuery<ICategory>({ limit: 100 } as any);
    const { data: colorData } = useGetColorsQuery<IColor>({ limit: 100 } as any);
    const { data: sizeData } = useSearchSizeQuery<ISize>({ limit: 100 } as any);

    useEffect(() => {
        const queryString: any = Object.entries(selectedValue)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
        setPriceFilter(queryString);
    }, [selectedValue]);

    const datareq = {
        product_name: keys,
        limit: 5,
        brand_id: brand,
        category_id: category,
        color_id: color,
        size_id: size,
        PriceFilter: PriceFilter || 0
    }

    const [open, setOpen] = useState(false);

    const { data: dataProduct, isError } = useGetAllProductClientQuery<any>(datareq);
    const productList = dataProduct?.products;

    const onHandleSearch = async (value: any) => {
        const values: any = value.target.value;
        try {
            setKeys(values)
        } catch (error) {
            console.log(error);
        }
    }

    const onHandleCategory = async (value: any) => {
        const values: any = value.target.value;
        try {
            setCategory(values)
        } catch (error) {
            console.log(error);
        }
    }

    const onHandleBrand = async (value: any) => {
        const values: any = value.target.value;
        try {
            setBrand(values)
        } catch (error) {
            console.log(error);
        }
    }

    const onHandleColor = async (value: any) => {
        const values: any = value.target.value;
        try {
            setColor(values)
        } catch (error) {
            console.log(error);
        }
    }

    const onHandleSize = async (value: any) => {
        const values: any = value.target.value;
        try {
            setSize(values)
        } catch (error) {
            console.log(error);
        }
    }

    const onHandlePrice = (event: any) => {
        const selectedTitle = event.target.value;

        const selectedItem: any = dataFakePrice.find((item) => item.title === selectedTitle);
        if (selectedItem) {
            setSelectedValue(selectedItem.value);
        }
    };
    const handleCancel = () => {
        setOpen(false);
    };

    const onHandleButtonSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const values: any = keys;
        try {
            setKeys(values);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <div
                className="icon-search group"
                onClick={() => setOpen(true)}>
                <i className="fa-solid fa-magnifying-glass hover:text-[#ca6f04] transition-all"></i>
            </div>
            <Modal
                title="Chọn mã voucher"
                open={open}
                // onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{ disabled: false, className: 'text-black border border-black', style: { display: 'none' } }}
                cancelButtonProps={{ disabled: false, style: { display: 'none' } }}
                width={1000}
                className='mt-[-40px]'
            >
                <form
                    onSubmit={onHandleButtonSearch}
                    className="grid grid-cols-5 gap-y-2 gap-x-1 items-center border rounded-md border-gray-200 shadow-sm p-2">
                    <div className="flex items-center border col-span-1">
                        <select
                            onChange={onHandleCategory}
                            className="py-[9px] w-full px-2 bg-gray-100  outline-none">
                            <option value="">Chọn danh mục</option>
                            {CategoryData?.categories?.map((item: ICategory) => {
                                return (
                                    <option key={item._id} value={item._id}>
                                        {item.category_name}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="relative w-full mt-2 sm:mt-0 col-span-4">
                        <input
                            type="search"
                            onChange={() => onHandleSearch(event)}
                            className="block px-2 w-full py-[9px] text-sm text-gray-900 bg-gray-100 rounded-r-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            placeholder="Tên sản phẩm muốn tìm"
                            required
                        />
                        <button
                            type="submit"
                            className="absolute top-0 right-0 h-full py-2 px-4 transition-all text-sm font-medium text-white bg-blue-700 rounded-r-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                        >
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <span className="sr-only">Search</span>
                        </button>
                    </div>
                    <div className="flex items-center border  col-span-1">
                        <select
                            onChange={onHandleBrand}
                            className="py-[9px] w-full px-2 bg-gray-100  outline-none">
                            <option value="">Chọn thương hiệu</option>
                            {BrandData?.brands?.map((item: IBrand) => {
                                return (
                                    <option key={item._id} value={item._id}>
                                        {item.brand_name}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="flex items-center border  col-span-1">
                        <select
                            onChange={onHandleColor}
                            className="py-[9px] w-full px-2 bg-gray-100  outline-none">
                            <option value="">Chọn màu sắc</option>
                            {colorData?.colors?.map((item: IColor) => {
                                return (
                                    <option key={item._id} value={item._id}>
                                        {item.color_name}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="flex items-center border col-span-1">
                        <select
                            onChange={onHandleSize}
                            className="py-[9px] w-full px-2 bg-gray-100  outline-none">
                            <option value="">Chọn kích cỡ</option>
                            {sizeData?.sizes?.map((item: ISize) => {
                                return (
                                    <option key={item._id} value={item._id}>
                                        {item.size_name}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="flex items-center border col-span-1">
                        <select
                            onChange={onHandlePrice}
                            className="py-[9px] w-full px-2 bg-gray-100  outline-none">
                            <option value="">Chọn mức giá</option>
                            {dataFakePrice?.map((item: any) => {
                                return (
                                    <option key={item._id} value={item._id}>
                                        {item.title}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                </form>

                {!isError ?
                    <div className="min-h-[300px]">
                        {dataProduct && (
                            <div>
                                {productList?.map((item: any, index: any) => {
                                    return (
                                        <div key={index} className="flex item-center justify-between mt-4">
                                            <div className="flex item-center gap-2">
                                                <div className="w-[30px] border h-[30px]">
                                                    <img src={item?.product_image?.url} alt="" />
                                                </div>
                                                <h1><Link onClick={() => setOpen(false)} to={`/products/${item?._id}`}>{item?.product_name}</Link></h1>
                                            </div>
                                            <div>
                                                <span>{item?.variant_products ? item?.variant_products[0]?.variant_price?.toLocaleString(
                                                    "vi-VN",
                                                    {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }
                                                ) : ''}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    : <div className="min-h-[200px] flex items-center justify-center border mt-3 bg-gray-100">Không có sản phẩm nào</div>}
            </Modal >
        </div>
    );
};

export default SearchHeader;
