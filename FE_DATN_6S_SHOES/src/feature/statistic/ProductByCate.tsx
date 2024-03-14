import { useGetProductQuery } from "../../api/product";
import { useGetCategoryQuery } from "../../api/category";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { IProduct } from "../../interface/product";
import { ICategory } from "../../interface/category";
import { useMemo } from "react";

const ProductByCate = () => {
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetProductQuery<any>();
  const productData = useMemo(() => products?.products, [products]);

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoryQuery<any>();
  const categoryData = useMemo(() => categories?.categories, [categories]);

  if (productsLoading || categoriesLoading) {
    return <div>Loading...</div>;
  }

  if (productsError || categoriesError) {
    return <div>Error loading data</div>;
  }

  // Tổng hợp số lượng sản phẩm theo danh mục
  const productsByCategory = categoryData.map((category: ICategory) => ({
    name: category.category_name,
    count: productData.filter(
      (product: IProduct) => product.category_id === category._id
    ).length,
  }));

  // Ví dụ tạo một biểu đồ cột
  const dataProductByCategory = {
    labels: productsByCategory.map((item: any) => item.name),
    datasets: [
      {
        label: "Số lượng sản phẩm",
        data: productsByCategory.map((item: any) => item.count),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };


  return (
    <div>
      <div className="text-center w-[500px] h-[h-500px]"> <Bar data={dataProductByCategory} /></div>
    </div>
  );
};

export default ProductByCate;
