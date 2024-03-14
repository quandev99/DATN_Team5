import { useEffect, useState } from "react";
import { useSearchProductQuery } from "../../api/product";
import { ProductFeature } from "../../components";
import { IProduct } from "../../interface/product";
import { Empty, Pagination } from "antd";
import qs from 'query-string';

const SearchPage = () => {
    const [currentPages, setCurrentPage] = useState(1);
    const [parsed, setParsed] = useState<any>({});
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        const parsedQuery: any = qs.parse(location.search);
        setParsed(parsedQuery);
        setSearchQuery(parsedQuery.product_name || "");
    }, [location.search])
    console.log("parseda", parsed);
    console.log("searchQuery", searchQuery);


    // console.log(location.hash);

    // const parsedHash = qs.parse(location.hash);
    // console.log(parsedHash);

    const productreq = { currentPages, ...parsed }
    console.log("productreq", productreq);

    const { data: productData, isLoading: isLoadingProduct, error: isErorProduct } = useSearchProductQuery<any>(productreq);
    console.log(productData);

    const productList = productData?.products;
    const totalItems = productData?.pagination?.totalItems

    // XỬ LÝ KHI CHUYỂN TRANG
    const onHandlePageChange = (page: number) => {
        setCurrentPage(page);
    }
    return <section className="product-feature">
        <div className=" max-w-[1280px] min-w-[1280px] mx-auto py-4 bg-white my-10">
            <div className='flex items-center justify-between px-3'>
                <h1 className="text-[30px] text-[#ca6f04] font-medium">
                    Tìm kiếm: {parsed?.product_name}
                </h1>
            </div>
            {!isErorProduct ? (
                <div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-4 p-3">
                        {productList?.map((product: IProduct) => {
                            return <ProductFeature product={product} isLoading={isLoadingProduct} />
                        })}
                        {/* <Swiper
                breakpoints={{
                    350: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                    },
                    768: {
                        slidesPerView: 4,
                        slidesPerGroup: 4,
                    },
                    1023: {
                        slidesPerView: 5,
                        slidesPerGroup: 5,
                    },
                }}
                slidesPerView={slidesPerView}
                modules={[Navigation]}
                spaceBetween={10}
                // slidesPerGroup={5}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
            // modules={[Navigation, Pagination]}
            >
                {productList && productList.map((product: any) => (
                    <SwiperSlide key={product?._id}>
                        {isLoadingProduct ? (<Skeleton active paragraph={{ rows: 6 }} />) : (
                            <ProductFeature product={product} />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper> */}
                    </div>
                    <div className='text-center'>
                        <Pagination current={currentPages} total={totalItems} onChange={onHandlePageChange} className="mt-5" />
                    </div>
                </div>
            ) : <div><Empty /></div>}
        </div >
    </section >;
};

export default SearchPage;
