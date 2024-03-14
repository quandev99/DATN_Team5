import { Skeleton } from "antd";
import { Link } from "react-router-dom";

const Brand = ({ brand, isLoading }: any) => {

  if (isLoading) {
    return <Skeleton />
  }

  if (brand.brand_name === "Chưa phân loại") {
    return null
  }

  return (
    <Link to={`/brands/${brand._id}`}
      className="flex items-center h-[100px] lg:h-[170px] border shadow-sm justify-center hover:shadow-md rounded-md transition-all duration-200">
      <img src={brand?.brand_image?.url} alt="image" className="h-full w-full" />
    </Link>
  )
}

export default Brand