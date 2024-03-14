import { useMemo, useState } from "react";
import { useGetProductTopBestSaleQuery } from "../../../api/product";
import { IBill } from "../../../interface/bill";
import ProductSale from "./components/ProductSale";

const GroupTopBestSale = () => {
    const {
        data: topSellingDat,
    } = useGetProductTopBestSaleQuery<IBill>();

    const topSellingData = useMemo(() => topSellingDat, [topSellingDat]);
    const [visibleProduct, setVisibleProduct] = useState(10);
    const hanleLoadMore = () => {
        setVisibleProduct(prevCount => prevCount + 10)
    }
    const handleHidden = () => {
        setVisibleProduct(10)
    }
    const productToShow = topSellingData?.slice(0, visibleProduct)
    return (
        <section className="product-feature">
            <div className="w-full lg:max-w-[1280px] mx-auto py-4 my-10">
                <div className='flex items-center justify-between px-3'>
                    <div className="flex items-center w-full justify-between">
                        <h1 className="text-[30px] text-[#ca6f04] font-medium ">
                            Sản phẩm bán chạy
                        </h1>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-4 p-3">
                    {/* {productList?.map((product: IProduct) => {
                        return <ProductFeature product={product} isLoading={isLoadingProduct} />
                    })} */}
                    {productToShow && productToShow.map((item: IBill, index: number) => {
                        return (
                            <ProductSale item={item} index={index} />
                        )
                    })}


                </div>

                <div className="flex items-center gap-2 justify-center">
                    <div> {(topSellingData && topSellingData?.length > 10) && (
                        <button
                            onClick={hanleLoadMore}
                            className='text-gray-600 shadow-sm font-medium border hover:border-green-400 transition-all border-green-200 px-4 py-2 rounded-full'>
                            Xem thêm
                        </button>
                    )}
                    </div>
                    <div> {topSellingData && visibleProduct >= 11 && (
                        <button
                            onClick={handleHidden}
                            className='text-gray-600 shadow-sm font-medium border hover:border-gray-400 transition-all border-gray-200 px-4 py-2 rounded-[30px]'>
                            Ẩn
                        </button>
                    )}
                    </div>
                </div>
            </div >
        </section >
    );
};

export default GroupTopBestSale;
