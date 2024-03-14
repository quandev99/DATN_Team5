import { useMemo, useState } from "react";
import { useGetProductNewQuery } from "../../../api/product";
import { IProduct } from "../../../interface/product";
import { ProductFeature } from "../../../components";
import "./group.css"

const GroupProductNew = () => {
    const [stateLimit, setLimit] = useState(10);
    const productreq = { currentPages: 1, _limit: stateLimit }
    const { data: productData, isLoading: isLoadingProduct, error: isErrorProduct } = useGetProductNewQuery<any>(productreq);
    const productList = useMemo(() => productData?.products, [productData]);

    // const totalItems = productData?.pagination?.totalItems
    // // XỬ LÝ KHI CHUYỂN TRANG
    // const onHandlePageChange = (page: number) => {
    //     setCurrentPage(page);
    // }

    const handleLoadMore = () => {
        setLimit(prevLimit => prevLimit + 10); // Tăng stateLimit lên 10 mỗi lần nhấn
        // Các logic khác ở đây nếu cần
    };
    const handleHidden = () => {
        setLimit(10); // Tăng stateLimit lên 10 mỗi lần nhấn
        // Các logic khác ở đây nếu cần
    };

    return (
        <section className="product-feature">
            {!isErrorProduct ? (
                <div className="w-full lg:max-w-[1280px] mx-auto py-4 my-10">
                    <div className='flex items-center justify-between px-3'>
                        <div className="flex items-center w-full justify-between">
                            <h1 className="text-[20px] lg:text-[30px] text-[#ca6f04] font-medium ">
                                Sản phẩm mới
                            </h1>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-4 p-3">
                        {productList?.map((product: IProduct) => {
                            return <ProductFeature product={product} isLoading={isLoadingProduct} />
                        })}
                    </div>
                    <div className='text-center'>
                        {/* {isPaginate && (
                            <Pagination current={currentPages} total={totalItems} onChange={onHandlePageChange} className="mt-5" />
                        )} */}
                        <div className="flex items-center gap-2 justify-center">
                            <div> {(productData?.pagination?.totalItems > 10 && productData?.pagination?.totalItems > stateLimit) && (
                                <button
                                    onClick={handleLoadMore}
                                    className='text-gray-600 shadow-sm font-medium border hover:border-green-400 transition-all border-green-200 px-2 py-1 lg:px-4 lg:py-2 rounded-full'>
                                    Xem thêm
                                </button>
                            )}
                            </div>
                            <div> {stateLimit >= 20 && (
                                <button
                                    onClick={handleHidden}
                                    className='text-gray-600 shadow-sm font-medium border hover:border-gray-400 transition-all border-gray-200 px-4 py-2 rounded-[30px]'>
                                    Ẩn
                                </button>
                            )}
                            </div>
                        </div>
                    </div>
                </div >
            ) : ''}
        </section >
    );
};

export default GroupProductNew;
