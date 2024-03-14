import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useAddVariantMutation,
  useGetProductByIdQuery,
} from "../../../../api/product";
import { useGetColorsQuery } from "../../../../api/color";
import { useGetSizesQuery } from "../../../../api/size";
import { IColor } from "../../../../interface/color";
import { ISize } from "../../../../interface/size";
import { Spin, message } from "antd";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const VariantProductAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [addvariant] = useAddVariantMutation();
  const [isLoading, setIsLoading] = useState(false);

  // use get data
  const { data: productData } = useGetProductByIdQuery<any>(id as string);
  const { data: colorData } = useGetColorsQuery<any>();
  const { data: sizeData } = useGetSizesQuery<any>();
  const product = productData?.product;
  const colors = colorData?.colors;
  const sizes = sizeData?.sizes;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>();

  const onHandleAdd = async (value: any) => {
    setIsLoading(true);
    try {
      const formReq = {
        ...value,
        product_id: id,
        variant_discount: Number(value.variant_discount === "" || null)
          ? undefined
          : Number(value.variant_discount),
        variant_price: Number(value.variant_price),
        variant_quantity: Number(value.variant_quantity),
        variant_stock: Number(value.variant_stock),
      };

      if (value.variant_discount > value.variant_price) {
        message.error("Giá khuyến mãi không được lớn hơn giá gốc");
      } else {
        const data: any = await addvariant(formReq).unwrap();
        if (data.success === true) {
          navigate(`/admin/products/${id}/update`);
          Swal.fire({
            position: "top",
            icon: "success",
            title: `${data.message}`,
            showConfirmButton: false,
            timer: 2000,
          });
          return;
        } else {
          Swal.fire({
            title: "Opps!",
            text: `${data.message}`,
            icon: "error",
            confirmButtonText: "Quay lại",
          });
        }
      }
    } catch (error: any) {
      message.error(error?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto ">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}

      {/* Spin component */}
      {isLoading && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <div>
        <h1 className="text-center font-medium text-gray-900 text-[30px]">
          Thêm biến thể
        </h1>
      </div>
      <div className="py-10 ">
        <div className="grid grid-cols-4 gap-5 min-h-32">
          {/*  */}
          <div>
            <div className="min-h-[100px] bg-gray-100 p-5 rounded-md shadow-md ">
              <div className="flex items-center gap-5">
                <div className="min-h-[50px] max-w-[70px]  h-[60px] min-w-[50px] bg-white">
                  <img
                    src={product?.product_image?.url}
                    alt=""
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <h1 className="text-[13px] font-medium">
                    {product?.product_name}
                  </h1>
                  <span className="text-[13px]">
                    {product?.variant_products?.length} Chi tiết biến thể
                  </span>{" "}
                  <br />
                  <Link
                    to={`/admin/products/${id}/update`}
                    className="text-[13px] text-blue-600"
                  >
                    Quay về chi tiết sản phẩm
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          <form
            onSubmit={handleSubmit(onHandleAdd as any)}
            className="col-span-3 rounded-md shadow-md bg-gray-50"
          >
            <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-2 lg:gap-4">
              <div>
                <label htmlFor="" className="font-bold text-[19px]">
                  Màu
                </label>
                <br />
                <select
                  {...register("color_id", {
                    required: "màu sắc không được bỏ trống",
                  })}
                  value={watch("color_id")}
                  className="shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                >
                  <option value="">Chọn</option>
                  {colors?.map((color: IColor) => (
                    <option key={color._id} value={color._id}>
                      {color.color_name}
                    </option>
                  ))}
                </select>
                <div className="text-red-500">
                  {errors?.color_id && (errors?.color_id?.message as any)}
                </div>
              </div>
              <div>
                <label htmlFor="" className="font-bold text-[19px]">
                  Size
                </label>
                <br />
                <select
                  {...register("size_id", {
                    required: "Kích cỡ không được bỏ trống",
                  })}
                  className="shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                >
                  <option value="">Chọn</option>
                  {sizes?.map((size: ISize) => (
                    <option key={size._id} value={size._id}>
                      {size.size_name}
                    </option>
                  ))}
                </select>
                <div className="text-red-500">
                  {errors?.size_id && (errors?.size_id?.message as any)}
                </div>
              </div>
              <div>
                <label htmlFor="" className="font-bold text-[19px]">
                  Giá gốc
                </label>
                <br />
                <input
                  type="number"
                  {...register("variant_price", {
                    required: "Giá gốc không được bỏ trống ",
                  })}
                  placeholder="Giá gốc ..."
                  className=" shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                />
                <div className="text-red-500">
                  {errors?.variant_price &&
                    (errors?.variant_price?.message as any)}
                </div>
              </div>
              <div>
                <label htmlFor="" className="font-bold text-[19px]">
                  Giá sau khi giảm (nếu có)
                </label>
                <br />
                <input
                  type="number"
                  {...register("variant_discount")}
                  placeholder="Giá sau khi giảm ..."
                  className=" shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                />
              </div>
              <div>
                <label htmlFor="" className="font-bold text-[19px]">
                  Số lượng bán ra
                </label>
                <br />
                <input
                  type="number"
                  {...register("variant_quantity", {
                    required: " Số lượng bán ra không được bỏ trống ",
                  })}
                  placeholder=" Số lượng bán ra ..."
                  className=" shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                />
                <div className="text-red-500">
                  {errors?.variant_quantity &&
                    (errors?.variant_quantity?.message as any)}
                </div>
              </div>

              <div>
                <label htmlFor="" className="font-bold text-[19px]">
                  Số lượng hàng trong kho
                </label>
                <br />
                <input
                  type="number"
                  {...register("variant_stock", {
                    required: "   Số lượng hàng trong kho không được bỏ trống ",
                  })}
                  placeholder="   Số lượng hàng trong kho ..."
                  className=" shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                />
                <div className="text-red-500">
                  {errors?.variant_stock &&
                    (errors?.variant_stock?.message as any)}
                </div>
              </div>

              <div className="flex gap-2 ">
                <Link
                  to={`/admin/products/${id}/update`}
                  className="px-2 py-2 text-white transition-all duration-200 bg-gray-500 rounded-sm right-10 hover:bg-gray-600"
                >
                  Quay lại
                </Link>
                <button className="px-6 mr-auto text-white transition-all duration-200 bg-green-500 rounded-sm hover:bg-green-600">
                  Thêm
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VariantProductAdd;
