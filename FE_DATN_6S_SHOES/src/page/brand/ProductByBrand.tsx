import { useParams } from "react-router-dom";
import { useGetProductByBrandQuery } from "../../api/product";
import { IProduct } from "../../interface/product";
import { useGetByIdBrandQuery } from "../../api/brand";
import { ProductFeature } from "../../components";
import { Pagination } from "antd";
import { useState } from "react";

const ProductByBrand = () => {
  const { id } = useParams();
  const [currentPages, setCurrentPage] = useState(1);

  // Lấy thông tin thương hiệu
  const { data: brand } = useGetByIdBrandQuery<any>(id || "");
  const brandData = brand?.brand;

  // Lấy tất cả sản phẩm thuộc thương hiệu
  const { data: products } = useGetProductByBrandQuery<any>(id as string | number, { page: currentPages, pageSize: 10 } as any);
  const productsData = products?.productResponse?.docs;

  const totalItems = products?.pagination?.totalItems;

  // XỬ LÝ KHI CHUYỂN TRANG
  const onHandlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-[1280px] mx-auto mt-10">
      <h2 className="text-2xl font-bold">
        Sản phẩm của thương hiệu: {brandData?.brand_name}
      </h2>
      {productsData?.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-4 p-3">
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
        <p>Không có sản phẩm nào thuộc thương hiệu này.</p>
      )}
    </div>
  );
};

export default ProductByBrand;
