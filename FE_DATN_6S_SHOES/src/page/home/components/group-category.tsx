import { useEffect } from "react";
import { useGetCategoryQuery } from "../../../api/category";
import Category from "../../../components/Category";
import { ICategory } from "../../../interface/category";

const GroupCategory = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { data: categoryData, isLoading: isLoadingCategory } = useGetCategoryQuery<any>();
    const categoryList = categoryData?.categories
    return <div>
        <h1 className="text-[30px] font-medium px-2 text-[#ca6f04]">Danh mục nổi bật</h1>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-6 lg:gap-3 py-2 px-2">
            {categoryList?.map((category: ICategory) => {
                return <Category category={category} isLoading={isLoadingCategory} />
            })}
        </div>
    </div>;
};

export default GroupCategory;
