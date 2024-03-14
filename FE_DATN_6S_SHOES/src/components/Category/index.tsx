import { Skeleton } from "antd";
import { Link } from "react-router-dom";

const Category = ({ category, isLoading }: any) => {

  if (isLoading) {
    return <Skeleton />
  }

  if (category.category_name === "Chưa phân loại") {
    return null
  }

  return (
    <div
      className="rounded-lg bg-gray-100 hover:border-green-200 hover:border-1 shadow-sm transition-all border h-[170px] ">
      <Link to={`/categories/${category._id}`}
        className="flex items-center h-full justify-center hover:shadow-md rounded-md transition-all duration-200">
        <div className="category-image max-w-[100px]">
          <div className=" min-h-[70px] min-w-[60px] border ">
            <img src={category?.category_image?.url} alt="image" />
          </div>
          <h1 className="text-center text-[20px]">{category?.category_name}</h1>
        </div>
      </Link>
    </div>
  )
}

export default Category