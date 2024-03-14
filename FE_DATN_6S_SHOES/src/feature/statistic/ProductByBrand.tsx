import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import IBrand from "../../interface/brand";
import { IProduct } from "../../interface/product";
import { useGetBrandsQuery } from "../../api/brand";
import { useGetProductQuery } from "../../api/product";
import { useMemo } from "react";

const ProductByBrand = () => {
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetProductQuery<any>();
  const productData = useMemo(() => products?.products, [products]);

  const {
    data: brands,
    isLoading: brandsLoading,
    isError: brandsError,
  } = useGetBrandsQuery<any>();
  const brandData = useMemo(() => brands?.brands, [brands]);

  if (brandsLoading || productsLoading) {
    return <div>Loading...</div>;
  }

  if (brandsError || productsError) {
    return <div>Error loading data</div>;
  }

  const productsByBrand = brandData.map((brand: IBrand) => ({
    name: brand.brand_name,
    count: productData.filter(
      (product: IProduct) => product.brand_id === brand._id
    ).length,
  }));

  const dataProductByBrand = {
    labels: productsByBrand.map((item: any) => item.name),
    datasets: [
      {
        label: "Số lượng sản phẩm",
        data: productsByBrand.map((item: any) => item.count),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  return (
    <div>
      <div className="text-center w-[500px] h-[h-500px]"><Bar data={dataProductByBrand} /></div>
    </div>
  );
};

export default ProductByBrand;
