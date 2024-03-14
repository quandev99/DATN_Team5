import { useState } from "react";
import { useGetProductFeatureQuery } from "../../../api/product";
import { IProduct } from "../../../interface/product";
import { ProductFeature } from "../../../components";
import { Pagination } from "antd";

const GroupProductFeature = () => {
    const [isPaginate, setPaginate] = useState(false);
    const [currentPages, setCurrentPage] = useState(1);
    const productreq = { currentPages }
    const { data: productData, isLoading: isLoadingProduct, error: isErrorProduct } = useGetProductFeatureQuery<any>(productreq);
    const productList = productData?.products;

    const totalItems = productData?.pagination?.totalItems
    // XỬ LÝ KHI CHUYỂN TRANG
    const onHandlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    return (
        <section className="product-feature">
            {!isErrorProduct ? (
                <div className=" max-w-[1280px] mx-auto py-4 my-10">
                    <div className='flex items-center justify-between px-3'>
                        <div className="flex items-center">
                            <h1 className="text-[30px] text-[#ca6f04] font-medium ">
                                Sản phẩm nổi bật
                            </h1>
                            <i className="fa-solid fa-fire fa-shake text-red-600 text-[20px]"></i>
                        </div>
                        <div>
                            {!isPaginate && (<div> {productData?.pagination?.totalItems > 10 && (
                                <button
                                    onClick={() => setPaginate(true)}
                                    className='text-gray-600 shadow-sm font-medium border hover:border-green-400 transition-all border-green-200 px-4 py-2 rounded-full'>
                                    Xem thêm
                                </button>
                            )}
                            </div>

                            )}
                        </div>
                    </div>
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
                        {isPaginate && (
                            <Pagination current={currentPages} total={totalItems} onChange={onHandlePageChange} className="mt-5" />
                        )}
                    </div>
                </div >
            ) : ''}
        </section >
    );
};

export default GroupProductFeature;
