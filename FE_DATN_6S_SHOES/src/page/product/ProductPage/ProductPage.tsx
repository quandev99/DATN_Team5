import { useEffect, useMemo, useState } from "react";
import { ProductFeature } from "../../../components";
import { useGetCategoryQuery } from "../../../api/category";
// import { useGetColorsQuery } from "../../../api/color";
// import { useGetSizesQuery } from "../../../api/size";
import { useGetBrandsQuery } from "../../../api/brand";
import ReactPaginate from 'react-paginate';
import { Skeleton } from "antd";
import { useGetAllProductClientsQuery } from "../../../api/product";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useSearchColorsQuery } from "../../../api/color";
import { useSearchSizeQuery } from "../../../api/size";
import { IoIosSearch } from "react-icons/io";
import "./Product.css";
import { ICategory } from "../../../interface/category";
import IBrand from "../../../interface/brand";

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

const ProductPage = () => {
  const [url, setUrl] = useState("");

  const { data: products, error: isErrorProduct, isLoading: isLoadingProduct } = useGetAllProductClientsQuery(url as any);

  const { data: categories } = useGetCategoryQuery();
  const { data: brands } = useGetBrandsQuery<any>();
  const { data: colors } = useSearchColorsQuery<any>({ limit: 100 });
  const { data: sizes } = useSearchSizeQuery<any>({ limit: 100 });

  const dataProducts = useMemo(() => products?.products, [products]);
  const dataCategories = useMemo(() => categories?.categories, [categories]);
  const dataBrands = useMemo(() => brands?.brands, [brands]);
  const dataColors = useMemo(() => colors?.colors, [colors]);
  const dataSizes = useMemo(() => sizes?.sizes, [sizes]);

  // phan trang
  const pageCount = useMemo(() => products?.pagination?.totalPages, [products]);
  const [limit] = useState(12);
  const [page, setPage] = useState(1);
  const [sortValue, setSortValue] = useState("createdAt");
  const [orderValue, setOrderValue] = useState("asc");

  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [colorId, setColorId] = useState("");
  const [sizeId, setSizeId] = useState("");
  const [search, setSearch] = useState("");
  const [checkboxStates, setCheckboxStates] = useState([]);
  const [priceFilter, setPriceFilter] = useState();

  const handleCheckboxClick = (value: any) => {
    if (checkboxStates === value) {
      setCheckboxStates([]); // Bỏ chọn nếu đã chọn rồi
    } else {
      setCheckboxStates(value); // Chọn checkbox mới
    }
  };

  const handleSortChange = (event: any) => {
    const newSortValue = event.target.value;
    setSortValue(newSortValue);
  };
  const handleSortToggle = () => {
    setOrderValue((prevSortOrder) =>
      prevSortOrder === "asc" ? "desc" : "asc"
    );
  };

  useEffect(() => {
    const queryString: any = Object.entries(checkboxStates)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    setPriceFilter(queryString);
  }, [checkboxStates]);

  useEffect(() => {
    if (products) {
      setUrl(
        `?_page=${page}&_limit=${+limit}&_size_id=${sizeId}&_color_id=${colorId}&_sort=${sortValue}&_order=${orderValue}&_category_id=${categoryId}&_brand_id=${brandId}&_search=${search}&${priceFilter}`
      );
    }
  }, [
    page,
    limit,
    sortValue,
    orderValue,
    categoryId,
    brandId,
    search,
    priceFilter,
    colorId,
    sizeId
  ]);


  ///select option
  const handlePageClick = (event: any) => {
    setPage(event.selected + 1);
  };
  const handleSortCategory = (id: any) => {
    if (categoryId === id) {
      setCategoryId("");
    } else {
      setCategoryId(id);
    }
  };

  const handleSortBrand = (id: any) => {
    if (brandId === id) {
      setBrandId("");
    } else {
      setBrandId(id);
    }
  };
  const handleSortColor = (id: any) => {
    if (colorId === id) {
      setColorId("");
    } else {
      setColorId(id || "");
    }
  };
  const handleSortSize = (id: any) => {
    if (sizeId === id) {
      setSizeId("");
    } else {
      setSizeId(id || "");
    }
  };


  const onHandleSelectCate = (event: any) => {
    setCategoryId(event.target.value);
  };
  const onHandleSelectBrand = (event: any) => {
    setBrandId(event.target.value);
  };
  const handleSearchInputChange = (event: any) => {
    setSearch(event.target.value);
  };

  return (
    <>
      <main className=" lg:w-main mx-auto">
        <div className=" px-2 lg:px-5">
          <nav aria-label="Breadcrumb" className="w-[180px] my-5">
            <div className="flex">
              <span>Trang chủ</span>
              <span className="mx-2 text-gray-400"> / </span>
              <span>Sản phẩm</span>
            </div>
          </nav>
        </div>
        <div className=" product_content page-container px-2 lg:px-5">
          <div className="grid lg:grid-cols-5 gap-4">
            <div className="lg:hidden block">
              <div className="relative border border-gray-100  hover:shadow-sm mb-2 px-2 pr-10 rounded-md">
                <input
                  value={search} // Đặt giá trị trường nhập liệu bằng searchValue
                  onChange={handleSearchInputChange}
                  type="text"
                  placeholder="Tìm kiếm giày..."
                  className="w-full text-[10px] py-2 shadow-sm sm:text-sm outline-none"
                />

                <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                  <button
                    type="button"
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <IoIosSearch />
                  </button>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <select
                  className="px-1 py-2 lg:text-[15px] outline-none transition-all cursor-pointer text-[10px] rounded border"
                  onChange={onHandleSelectCate}
                >
                  <option value="">Chọn danh mục</option>
                  {dataCategories?.map((category: ICategory) => (
                    <option value={category?._id}>{category?.category_name}</option>
                  ))}
                </select>
                <select
                  className="px-1 py-2 lg:text-[15px] outline-none transition-all cursor-pointer text-[10px] rounded border"
                  onChange={onHandleSelectBrand}
                >
                  <option value="">Chọn thương hiệu</option>
                  {dataBrands?.map((brand: IBrand) => (
                    <option value={brand?._id}>{brand?.brand_name}</option>
                  ))}
                </select>

                <select
                  className="px-1 py-2 lg:text-[15px] outline-none transition-all cursor-pointer text-[10px] rounded border"
                  onChange={onHandleSelectCate}
                >
                  <option value="">Chọn giá</option>
                  {dataFakePrice?.map((item: any) => (
                    <option value={item?.value}>{item?.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-span-1 lg:block hidden ">
              <div className="product_category mb-5 border-gray-100 bg-white border shadow rounded-lg py-2">
                <h4 className="text-xl text-center border border-gray-50 bg-gray-50  shadow-sm  mt-3 font-bold">
                  Tìm kiếm sản phẩm
                </h4>
                <ul className="grid grid-cols-4 lg:grid-cols-1 gap-3 w-[350px] lg:w-[200px] lg:ml-3 border-gray-300 pt-3">
                  <li className="cursor-pointer w-full lg:text-[15px] py-1 duration-300 transition-all ">
                    <div className="relative border border-gray-100  hover:shadow-sm ml-4 px-2 pr-10 rounded-md">
                      <input
                        value={search} // Đặt giá trị trường nhập liệu bằng searchValue
                        onChange={handleSearchInputChange}
                        type="text"
                        placeholder="Tìm kiếm giày..."
                        className="w-full  py-2 shadow-sm sm:text-sm outline-none"
                      />

                      <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                        <button
                          type="button"
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <IoIosSearch />
                        </button>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="product_category  mb-5 border-gray-100 bg-white border shadow rounded-lg py-2">
                <h4 className="text-xl  text-center border border-gray-50 bg-gray-50  shadow-sm  mb-5  mt-3 font-bold">
                  Danh mục sản phẩm
                </h4>
                <ul className=" border-gray-300  pt-3">
                  {dataCategories?.map((category: any) => (
                    <li
                      key={category?._id}
                      className="cursor-pointer border border-gray-50 flex gap-2 group items-center hover:text-[#fb7317] hover:shadow-md lg:text-[15px] px-3 py-1 duration-300 transition-all "
                    >
                      <input
                        type="checkbox"
                        name={category?.category_name}
                        className="cursor-pointer "
                        id={category?.category_name}
                        onClick={() => handleSortCategory(category?._id)}
                        checked={categoryId === category?._id}
                      />
                      <label
                        htmlFor={category?.category_name}
                        className="block w-full"
                      >
                        <h1 className="cursor-pointer transition-all group-hover:text-[#fb7317]">
                          {category?.category_name}
                        </h1>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="product_category  mb-5 border-gray-100 bg-white border shadow rounded-lg py-2">
                <h4 className="text-xl  text-center border border-gray-50 bg-gray-50  shadow-sm  mb-5  mt-3 font-bold">
                  Thương hiệu
                </h4>
                <ul className="border-gray-300  pt-3">
                  {dataBrands?.map((brand: any) => (
                    <li
                      key={brand?._id}
                      className="cursor-pointer border border-gray-50 flex gap-2 group items-center hover:text-[#fb7317] hover:shadow-md lg:text-[15px] px-3 py-1 duration-300 transition-all "
                    >
                      <input
                        type="checkbox"
                        className="cursor-pointer "
                        name={brand?.brand_name}
                        id={brand?.brand_name}
                        onClick={() => handleSortBrand(brand?._id)}
                        checked={brandId === brand?._id}
                      />
                      <label
                        htmlFor={brand?.brand_name}
                        className="block w-full"
                      >
                        <h1 className="cursor-pointer transition-all group-hover:text-[#fb7317]">
                          {brand?.brand_name}
                        </h1>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="product_category  mb-5 border-gray-100 bg-white border shadow rounded-lg py-2">
                <h4 className="text-xl  text-center border border-gray-50 bg-gray-50  shadow-sm  mb-5  mt-3 font-bold">
                  Lọc giá
                </h4>
                <ul className="grid grid-cols-4 lg:grid-cols-1 gap-3 w-[350px] lg:w-[200px] lg:ml-3 border-gray-300  pt-3">
                  {dataFakePrice?.map((item) => (
                    <li
                      key={item.title}
                      className="cursor-pointer border border-gray-50 flex gap-2 group items-center hover:text-[#fb7317] hover:shadow-md lg:text-[15px] px-2 py-1 duration-300 transition-all "
                    >
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        name={item.title}
                        id={item.title}
                        onClick={() => handleCheckboxClick(item?.value)}
                        checked={checkboxStates === (item?.value as any)}
                      />
                      <label htmlFor={item?.title} className="block w-full">
                        <h1 className="cursor-pointer">{item?.title}</h1>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="product_category  mb-5 border-gray-100 bg-white border shadow rounded-lg py-2">
                <h4 className="text-xl  text-center border border-gray-50 bg-gray-50  shadow-sm  mb-5  mt-3 font-bold">
                  màu sắc
                </h4>
                <ul className="border-gray-300  h-[200px] overflow-y-auto pt-3">
                  {dataColors?.map((color: any) => (
                    <li
                      key={color?._id}
                      className="cursor-pointer border border-gray-50 flex gap-2 group items-center hover:text-[#fb7317] hover:shadow-md lg:text-[15px] px-3 py-1 duration-300 transition-all "
                    >
                      <input
                        type="checkbox"
                        className="cursor-pointer "
                        name={color?.color_name}
                        id={color?.color_name}
                        onClick={() => handleSortColor(color?._id)}
                        checked={colorId === color?._id}
                      />
                      <label
                        htmlFor={color?.color_name}
                        className="block w-full"
                      >
                        <h1 className="cursor-pointer transition-all group-hover:text-[#fb7317]">
                          {color?.color_name}
                        </h1>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="product_category  mb-5 border-gray-100 bg-white border shadow rounded-lg py-2">
                <h4 className="text-xl  text-center border border-gray-50 bg-gray-50  shadow-sm  mb-5  mt-3 font-bold">
                  Kích cỡ
                </h4>
                <ul className="border-gray-300  h-[200px] overflow-y-auto  pt-3">
                  {dataSizes?.map((size: any) => (
                    <li
                      key={size?._id}
                      className="cursor-pointer border border-gray-50 flex gap-2 group items-center hover:text-[#fb7317] hover:shadow-md lg:text-[15px] px-3 py-1 duration-300 transition-all "
                    >
                      <input
                        type="checkbox"
                        className="cursor-pointer "
                        name={size?.size_name}
                        id={size?.size_name}
                        onClick={() => handleSortSize(size?._id)}
                        checked={sizeId === size?._id}
                      />
                      <label
                        htmlFor={size?.size_name}
                        className="block w-full"
                      >
                        <h1 className="cursor-pointer transition-all group-hover:text-[#fb7317]">
                          {size?.size_name}
                        </h1>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="w-full  lg:w-100% cols-span-1 lg:col-span-4">
              <div className="grid grid-cols-1 w-full">
                <div className="flex justify-between items-center w-full">
                  <div>
                    {/* <span className="text-[30px]">Sneaker</span> */}
                    <span className="lg:ml-5">
                      {!isErrorProduct
                        ? products
                          ? products.pagination.totalItems
                          : 0
                        : 0}{" "}
                      sản phẩm
                    </span>
                  </div>
                  <div className=" flex items-center gap-2 justify-between">
                    <div className="mr-4 lg:block hidden lg:text-[15px] text-[10px]  font-medium">
                      Sắp xếp:
                    </div>
                    <select
                      className="px-2 py-2 lg:text-[15px] outline-none transition-all cursor-pointer text-[12px] rounded border"
                      value={sortValue}
                      onChange={handleSortChange}
                    >
                      <option value="createdAt">Thời gian</option>
                      <option value="product_name">Theo tên sản phẩm</option>
                      <option value="sold_quantity">Theo lượt bán</option>
                      <option value="product_view">Theo lượt xem</option>
                      <option value="average_score">Theo lượt đánh giá</option>
                      <option value="favorite_count">
                        Theo lượt yêu thích
                      </option>
                    </select>

                    <div className="flex items-center">
                      <button
                        onClick={handleSortToggle}
                        className="mr-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      >
                        {orderValue === "asc" ? (
                          <ArrowUpOutlined style={{ fontSize: "16px" }} />
                        ) : (
                          <ArrowDownOutlined style={{ fontSize: "16px" }} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {isErrorProduct ? <div>Không có sản phẩm nào</div> : (
                <div>
                  {!isLoadingProduct ? (
                    <div className="grid grid-cols-1 w-full">
                      <div className="grid grid-cols-1">
                        <ol className="flex items-center justify-center grid-cols-1 gap-1 text-xs font-medium w-full ">
                          <ReactPaginate
                            hrefBuilder={() => {
                              return "#";
                            }}
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageCount={pageCount}
                            disableInitialCallback={true}
                            previousLabel="<"
                            renderOnZeroPageCount={null}
                            className=" mb-2 mt-2 lg:mt-0 lg:mb-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-[6px] text-[15px]  text-gray-500 lg:gap-x-3 lg:text-base  "
                            pageLinkClassName="bg-white bg-opacity-80 border page-link transition-all hover:bg-opacity-100 hover:bg-gray-100 py-1 px-2 rounded-[5px]"
                            previousClassName="bg-white nextPage bg-opacity-80 shadow-sm transition-all hover:bg-gray-600 hover:text-white  block border text-gray-500 transition-all hover:bg-opacity-100 py-1 px-[10px] rounded-md"
                            nextClassName="bg-white nextPage bg-opacity-80 shadow-sm transition-all hover:bg-gray-600 hover:text-white  block border text-gray-500 transition-all hover:bg-opacity-100 py-1 px-[10px] rounded-md"
                            activeClassName="page-active text-primary"
                            disabledClassName="opacity-40"
                            disabledLinkClassName="hover:cursor-default"
                          />
                        </ol>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:my-5">
                        {dataProducts?.map((item: any) => {
                          return <ProductFeature key={item._id} product={item} />
                        })}
                      </div>
                      <div className="grid grid-cols-1">
                        <ol className="flex items-center justify-center grid-cols-1 gap-1 text-xs font-medium w-full py-10">
                          <ReactPaginate
                            hrefBuilder={() => {
                              return "#";
                            }}
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageCount={pageCount}
                            disableInitialCallback={true}
                            previousLabel="<"
                            renderOnZeroPageCount={null}
                            className="mb-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-[6px] text-[15px]  text-gray-500 lg:gap-x-3 lg:text-base lg:mb-0 "
                            pageLinkClassName="bg-white bg-opacity-80 border page-link transition-all hover:bg-opacity-100 hover:bg-gray-100 py-1 px-2 rounded-[5px]"
                            previousClassName="bg-white nextPage bg-opacity-80 shadow-sm transition-all hover:bg-gray-600 hover:text-white  block border text-gray-500 transition-all hover:bg-opacity-100 py-1 px-[10px] rounded-md"
                            nextClassName="bg-white nextPage bg-opacity-80 shadow-sm transition-all hover:bg-gray-600 hover:text-white  block border text-gray-500 transition-all hover:bg-opacity-100 py-1 px-[10px] rounded-md"
                            activeClassName="page-active text-primary"
                            disabledClassName="opacity-40"
                            disabledLinkClassName="hover:cursor-default"
                          />
                        </ol>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-10">
                      <Skeleton active />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductPage;
