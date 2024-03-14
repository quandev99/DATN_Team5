import { useMemo } from "react";
import { useGetBrandsQuery } from "../../../api/brand";
import { Brand } from "../../../components";
import IBrand from "../../../interface/brand";

const GroupBrand = () => {
    const { data: brandData, isLoading: isLoadingBrand } = useGetBrandsQuery<any>();
    const brandList = useMemo(() => brandData?.brands, [brandData]);
    return <div>
        <h1 className=" text-[20px] lg:text-[30px] font-medium px-2 text-[#ca6f04]">Thương hiệu nổi bật</h1>
        <div className="grid grid-cols-4 lg:grid-cols-6  lg:gap-3 py-2 px-2">
            {brandList?.map((brand: IBrand) => {
                return <Brand brand={brand} isLoading={isLoadingBrand} />
            })}
        </div>
    </div>;
};

export default GroupBrand;
