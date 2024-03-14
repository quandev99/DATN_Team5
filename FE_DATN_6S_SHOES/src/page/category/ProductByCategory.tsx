import { useParams } from "react-router-dom";
import { IProduct } from "../../interface/product";
import { ProductFeature } from "../../components";
import { Pagination } from "antd";
import { useState } from "react";
import { useGetCategoryByIdQuery } from "../../api/category";
import { useGetProductByCategoryQuery } from "../../api/product";

const ProductByCategory = () => {
  const { id } = useParams();
  const [currentPages, setCurrentPage] = useState(1);

  // Lấy thông tin thương hiệu
  const { data: category } = useGetCategoryByIdQuery<any>(id || "");
  const categoryData = category?.category;
  console.log(categoryData);


  //   Lấy tất cả sản phẩm thuộc thương hiệu
  const { data: products } = useGetProductByCategoryQuery<any>(id as any, { page: currentPages, pageSize: 10 } as any);
  const productsData = products?.productResponse?.docs;


  const totalItems = products?.pagination?.totalItems;

  // XỬ LÝ KHI CHUYỂN TRANG
  const onHandlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-[1280px] mx-auto mt-10">
      <h2 className="text-2xl font-bold">
        Sản phẩm của danh mục: {categoryData?.category_name}
      </h2>
      {productsData ? (
        <div>
          <div className="grid grid-cols-1 gap-4 p-3 lg:grid-cols-5 lg:gap-4">
            {productsData?.slice((currentPages - 1) * 10, currentPages * 10).map((product: IProduct) => (
              <ProductFeature key={product._id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Pagination
              current={currentPages}
              total={totalItems}
              pageSize={10}
              onChange={onHandlePageChange}
              className="mt-5"
            />
          </div>
        </div>
      ) : (
        <p>Không có sản phẩm nào thuộc danh mục này.</p>
      )}
    </div>
  );
};

export default ProductByCategory;
