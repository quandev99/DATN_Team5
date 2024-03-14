import { useEffect, useState } from "react";
import { Rate, Tabs, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import {
  useGetProductByCategoryQuery,
  useGetProductByIdQuery,
  useGetVariantProductIDQuery,
} from "../../../api/product";
import { useGetBrandsQuery } from "../../../api/brand";

import clsx from "clsx";
import { formatMoney } from "../../../util/helper";
import { useAddToCartMutation } from "../../../api/cart";
import { getDecodedAccessToken } from "../../../decoder";
import { ProductFeature } from "../../../components";
import { Reviews } from "./components";
import Swal from "sweetalert2";
import { IVariant } from "../../../interface/variant";

const ProductDetailPage = () => {
  const [disabled, setDisabled] = useState<any>(false);
  let idVariant: string;
  const { id }: any = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data }: any = useGetProductByIdQuery<any>(id || "");

  const productDeatail = data?.product;

  const categoryId = data?.product?.category_id;
  const { data: dataProductByCategory } =
    useGetProductByCategoryQuery<any>(categoryId);

  const { data: variantGetOne } = useGetVariantProductIDQuery<any>(id);
  useEffect(() => {
    if (variantGetOne?.VariantProductId?.length < 1) {
      setDisabled(true);
    }
  }, [variantGetOne?.VariantProductId]);
  const productCategory = dataProductByCategory?.productResponse?.docs?.filter(
    (item: any) => item?._id !== id
  );
  const colorNames = variantGetOne?.VariantProductId?.map(
    (variant: any) => variant?.color_id?.color_name
  );
  const uniqueColorNames = [...new Set(colorNames)].sort();
  const sizeNames = variantGetOne?.VariantProductId?.map(
    (variant: any) => variant?.size_id?.size_name
  );
  const uniqueSizeNames = [...new Set(sizeNames)].sort();

  const availableSizes = variantGetOne?.VariantProductId?.map(
    (variant: any) => variant.size_id?.size_name
  );
  const colorDefault = variantGetOne?.VariantProductId[0]?.color_id?.color_name;
  const sizeDefault = variantGetOne?.VariantProductId[0]?.size_id?.size_name;

  const listOneData = data?.product;
  let dataImage = listOneData?.thumbnail;

  // --------------------------
  const { data: brands }: any = useGetBrandsQuery();
  const brandList = brands?.brands;
  const brandListOne = brandList?.find(
    (brandList: any) => brandList?._id === listOneData?.brand_id
  )?.brand_name;

  /// slick der
  const totalImages = dataImage?.length || 0;

  const desiredColumns = 4;

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(desiredColumns, totalImages),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    initialSlide: 0,
    centerMode: false, // Ensure slides are left-aligned
  };

  // Input
  const [count, setCount] = useState(1);
  const handleIncrement = () => {
    setCount(count => count + 1);
  };
  const handleDecrement = () => {
    if (count <= 0) return;
    setCount(count => count - 1);
  };
  //ant
  const [activeTab, setActiveTab] = useState("description");
  const handleTabChange = (key: any) => {
    setActiveTab(key);
  };
  const [largeImage, setLargeImage] = useState("");

  const handleThumbnailClick = (item: any) => {
    setLargeImage(item?.url);
  };
  //------------------------------------------------------------------------
  //--------------------Phần xử lí chọn biến thể --------------------------
  const [selectedColor, setSelectedColor] = useState(colorDefault);
  const [selectedSize, setSelectedSize] = useState(sizeDefault);

  useEffect(() => {
    if (colorDefault && sizeDefault) {
      setSelectedColor(colorDefault);
      setSelectedSize(sizeDefault);
    }
  }, [colorDefault, sizeDefault]);

  const handleColorClick = (colorId: any) => {
    setSelectedColor(colorId);
  };

  const handleSizeClick = (sizeId: any) => {
    setSelectedSize(sizeId);
  };

  // lấy giá của sản phẩm biến thể
  const getPriceForSelection = () => {
    if (!selectedColor || !selectedSize) {
      return " ";
    }
    // Tìm variant phù hợp với selectedColor và selectedSize
    const selectedVariant = variantGetOne?.VariantProductId?.find(
      (variant: any) => {
        return (
          variant.color_id?.color_name === selectedColor &&
          variant.size_id?.size_name === selectedSize
        );
      }
    );
    if (selectedVariant) {
      idVariant = selectedVariant?._id;
      return <span>{`${formatMoney(selectedVariant.variant_price)} đ`}</span>;
    } else {
      return " ";
    }
  };
  // lấy giá của sản phẩm biến thể
  const getQuantityForSelection: any = () => {
    if (!selectedColor || !selectedSize) {
      return " ";
    }
    // Tìm variant phù hợp với selectedColor và selectedSize
    const selectedVariant = variantGetOne?.VariantProductId?.find(
      (variant: any) => {
        return (
          variant.color_id?.color_name === selectedColor &&
          variant.size_id?.size_name === selectedSize
        );
      }
    );
    if (selectedVariant) {
      idVariant = selectedVariant?._id;
      return <span>{`${selectedVariant.variant_quantity}`}</span>;
    } else {
      return " ";
    }
  };

  //lấy số lượng của sản phẩm còn hàng hay hết hàng
  const getStockStatusForSelection = () => {
    if (!selectedColor || !selectedSize) {
      return " ";
    }
    const selectedVariant = variantGetOne?.VariantProductId?.find(
      (variant: any) => {
        return (
          variant.color_id?.color_name === selectedColor &&
          variant.size_id?.size_name === selectedSize
        );
      }
    );

    if (selectedVariant) {
      if (selectedVariant?.variant_quantity > 0) {
        return (
          <span className="text-white p-1 rounded-sm bg-green-500 text-[11px] ml-2">
            Còn hàng
          </span>
        );
      } else {
        return (
          <span className="text-white p-1 rounded-sm bg-red-500 text-[11px] ml-2">
            Hết hàng
          </span>
        );
      }
    } else {
      return " ";
    }
  };

  const getDiscoutForSelection = () => {
    if (!selectedColor || !selectedSize) {
      return 0;
    }
    // Tìm variant phù hợp với selectedColor và selectedSize
    const selectedVariant = variantGetOne?.VariantProductId?.find(
      (variant: any) => {
        return (
          variant.color_id?.color_name === selectedColor &&
          variant.size_id?.size_name === selectedSize
        );
      }
    );

    if (selectedVariant) {
      return selectedVariant?.variant_discount !== 0
        ? formatMoney(selectedVariant?.variant_discount) + " đ"
        : 0;
    } else {
      return 0;
    }
  };
  const validateValue = () => {
    if (!selectedColor || !selectedSize) {
      return (
        <div className="text-red-500  ml-[90px] p-2 mb-5">
          "Sản phẩm đang cập nhật size với màu"
        </div>
      );
    }
    const selectedVariant = variantGetOne?.VariantProductId?.find(
      (variant: any) => {
        return (
          variant.color_id?.color_name === selectedColor &&
          variant.size_id?.size_name === selectedSize
        );
      }
    );
    if (!selectedVariant) {
      return (
        <div className="text-red-500  ml-[90px] p-2 mb-5">
          Tạm thời hết hàng
        </div>
      );
    }
  };

  const updateQuantity = async (newQuantity: string) => {
    const quantityForSelection = getQuantityForSelection()?.props?.children;
    if (newQuantity >= quantityForSelection) {
      message.error(
        `Số lượng sản phẩm trong kho có hạn ${quantityForSelection} `
      );
      return;
    }
  };

  const quantity = getQuantityForSelection()?.props?.children == 0;
  console.log(quantity);

  const [addToCart] = useAddToCartMutation();
  const navigate = useNavigate();
  const userData:
    | {
      _id: string;
      role_name: string;
      iat: number;
      exp: number;
    }
    | any = getDecodedAccessToken();
  //----------------------------------------------------------------

  const addToCartItem = async () => {
    const dataCart = {
      user_id: userData?._id,
      quantity: count,
      variantProductId: idVariant,
    };
    try {
      const responsive = await addToCart(dataCart).unwrap();
      if (responsive.success === true) {
        navigate("/carts");
        Swal.fire({
          position: "top",
          icon: "success",
          title: `${responsive.message}`,
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      } else {
        Swal.fire({
          position: "top",
          title: "Opps!",
          text: `${responsive.message}`,
          icon: "error",
          confirmButtonText: "Quay lại",
        });
      }
    } catch (error: any) {
      const loginResult = await Swal.fire({
        position: "top",
        title: "Opps!",
        text: `${error.data.message}`,
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Quay lại",
      });

      if (loginResult.isConfirmed) {
        navigate("/login");
      }
    }
  };

  const addToCartItemBuy = async () => {
    const current = variantGetOne?.VariantProductId?.find(
      (item: IVariant) => item._id === idVariant
    );

    const dataCart = [
      {
        ...current,
        product_name: productDeatail?.product_name,
        product_image: productDeatail?.product_image,
        quantity: count,
        color_name: current?.color_id?.color_name,
        product_price: current?.variant_price,
        product_quantity: current?.variant_quantity,
        size_id: current?.size_id?._id,
        size_name: current?.size_id?.size_name,
        color_id: current?.color_id?._id,
        product_discount: current?.variant_discount,
        price: count * current?.variant_price,
        variant_product_id: current?._id,
        user_id: userData?._id
      },
    ];
    if (!userData?._id) {
      const loginResult = await Swal.fire({
        position: "top",
        title: "Opps!",
        text: "Bạn cần đăng nhập để thực hiện chức năng này",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Quay lại",
      });

      if (loginResult.isConfirmed) {
        // Nếu người dùng nhấn "Đăng nhập", điều này có thể chuyển hướng đến trang đăng nhập
        navigate("/login");
      }
    }
    if (userData?._id) {
      // Nếu đã đăng nhập, thực hiện các bước khác
      Swal.fire({
        position: "top",
        title: `Mua hàng thành công`,
        icon: "success",
      });

      window.location.href = `/checkouts?products=${encodeURIComponent(
        JSON.stringify(dataCart)
      )}`;
    }
  };
  //----------------------------------------------------------------
  return (
    <div className="container mx-auto px-[50px]">
      <nav aria-label="Breadcrumb" className="w-full my-5">
        <div className="flex">
          <span className="text-gray-500">Trang chủ</span>
          <span className="mx-2 text-gray-400"> / </span>
          <span className="text-gray-500">Sản phẩm</span>
          <span className="mx-2 text-gray-400"> / </span>
          <span className="text-blue-700 font-medium  ">
            {listOneData?.product_name}
          </span>
        </div>
      </nav>
      <div className="grid md:grid-cols-7 gap-8 mb-10">
        <div className="col-span-3 w-full">
          <div className=" w-full p-4 rounded-lg shadow  border border-gray-50 min-h-[360px]  bg-white">
            <div className="w-[360px] h-[400px] mx-auto text-center">
              <img
                src={
                  largeImage
                    ? largeImage
                    : listOneData?.product_image?.url
                      ? listOneData.product_image.url
                      : "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
                }
                className="w-full h-full object-cover block"
              />
            </div>
          </div>
          <div className="col-span-3">
            <ul className="w-full gird gap-x-5">
              <Slider {...settings} className="image-slider">
                {dataImage?.map((item: any, index: any) => (
                  <li
                    key={index}
                    className="image-slide p-4 mt-2"
                    onClick={() => handleThumbnailClick(item)}
                  >
                    <img
                      src={item?.url}
                      className="image-container h-[100px] cursor-pointer bg-white p-4 bg-cover bg-center rounded-sm shadow-md"
                      alt={`Image ${index + 1}`}
                    />
                  </li>
                ))}
              </Slider>
            </ul>
          </div>
        </div>
        <div className="col-span-4  p-4  ">
          <h1 className="text-[30px] font-medium">
            {listOneData?.product_name}
            <span className="text-white p-1 rounded-sm text-[11px] ml-2">
              {getStockStatusForSelection()}
            </span>
          </h1>
          <div className="flex items-center gap-2 my-2">
            <div>
              <Rate
                disabled
                value={productDeatail?.average_score}
                className="text-sm"
              />
              <span className="ml-2 text-sm">
                ({productDeatail?.review_count || 0} )
              </span>
            </div>
            <div className="text-[#4a9352] font-medium">
              {productDeatail?.product_view} Lượt xem
            </div>
            <div className="text-[#7a7b43] font-medium">
              {productDeatail?.sold_quantity} Lượt bán
            </div>
          </div>
          <div className="flex items-center mb-2">
            <div className="">
              <span>Thương hiệu: </span>
              <a className="text-black font-medium" href="#">
                {brandListOne}
              </a>
            </div>
            <span className="mx-3">|</span>
            <div className="">
              <span>Loại giày: </span>
              <a className="text-black font-medium" href="#">
                Giày Sneaker
              </a>
            </div>
            <span className="mx-3">|</span>
            <div className="">
              <span>MSP: </span>
              <a className="text-black font-medium" href="#">
                {listOneData?.product_code}
              </a>
            </div>
            <span className="mx-3">|</span>
            <div className="">
              <span>Số lượng: </span>
              <a className="text-black font-medium" href="#">
                {getQuantityForSelection()}
              </a>
            </div>
          </div>

          <div className="my-10">
            {getDiscoutForSelection() !== 0 ? (
              <div>
                <span className="text-red-500 font-medium text-xl mr-3 ">
                  {getDiscoutForSelection()}
                </span>
                <span className="text-gray-300 font-medium text-xl mr-3 line-through">
                  {getPriceForSelection()}
                </span>
              </div>
            ) : (
              <span className="text-red-500 font-medium text-xl mr-3">
                {getPriceForSelection()}
              </span>
            )}
          </div>

          {/* <span
              className="text-black p-1 rounded-sm"
              onChange={handleSelectionChange}
            >
              {getDiscountPercentageForSelection()}
            </span> */}
          <div className="mb-4">
            <div className="  text-[#6a6a6a] font-medium mb-2">Chọn màu </div>
            <ul className="flex flex-wrap gap-2">
              {uniqueColorNames?.map((colorName: any, index) => (
                <li
                  key={index}
                  className={clsx(
                    "h-[40px] w-[90px] flex items-center justify-center text-[#57575a] border-2  cursor-pointer transition-all duration-300 rounded-md",
                    selectedColor === colorName &&
                    "border-blue-500 border-2 text-blue-600 font-medium"
                  )}
                  onClick={() => handleColorClick(colorName)}
                >
                  {colorName}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <div className="  text-[#6a6a6a] font-medium mb-2">
              Kích thước:{" "}
            </div>
            <ul className="flex flex-wrap  gap-2">
              {uniqueSizeNames?.map((size, index) => (
                <li
                  key={index}
                  className={clsx(
                    "px-3 py-1 flex items-center justify-center text-[#57575a]  border cursor-pointer transition-all duration-300 rounded-md",
                    selectedSize === size &&
                    "border-blue-500 border-2 text-blue-600 font-medium",
                    // Kiểm tra xem kích thước có sẵn cho màu đã chọn
                    !availableSizes.includes(size) && "cursor-not-allowed" // Thêm class để ẩn kích thước không có sẵn
                  )}
                  onClick={() => {
                    if (availableSizes.includes(size)) {
                      handleSizeClick(size);
                    }
                  }}
                >
                  {size as any}
                </li>
              ))}
            </ul>
          </div>
          <div>{validateValue()}</div>
          <div className="grid grid-cols-6 w-[700px] items-center gap-x-2">
            <div className="col-span-1 flex items-center text-center cursor-pointer">
              <p
                onClick={handleDecrement}
                className="px-[15px] hover:shadow py-1 text-[#181819] text-xl border border-gray-300  rounded-s"
              >
                -
              </p>
              <input
                type="text"
                value={count}
                name="quantity"
                onChange={e => updateQuantity(e.target.value)}
                id=""
                className="inline-block outline-none w-10 h-[38px] text-center border border-t-gray-300  text-[#171718] text-xl "
              />

              <p
                onClick={handleIncrement}
                className="px-[12px] py-1 hover:shadow  border border-gray-300 rounded-r text-[#111112] text-xl"
              >
                +
              </p>
            </div>
            <button
              disabled={(validateValue() || quantity as any) || disabled || false}
              onClick={addToCartItem}
              className={`col-span-2 hover:shadow-md bg-[#1f66ef] rounded-full transition-all hover:bg-blue-800 text-white font-medium w-full p-2 text-center ${validateValue() || disabled ? "bg-sky-700" : ""
                }`}
            >
              {(validateValue() || disabled || quantity)
                ? "Sản phẩm đang cập nhật"
                : "Thêm vào giỏ hàng"}
            </button>
            <div>
              <button
                disabled={(validateValue() || quantity as any) || disabled || false}
                onClick={addToCartItemBuy}
                className={`col-span-3 hover:shadow-md bg-[#1f66ef] rounded-full transition-all hover:bg-blue-800 text-white font-medium w-full p-2 text-center ${validateValue() || disabled ? "bg-sky-700" : ""
                  }`}
              >
                {(validateValue() || disabled || quantity)
                  ? "Sản phẩm đang cập nhật"
                  : "Mua ngay"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="  mb-5">
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <Tabs.TabPane tab="MÔ TẢ" key="description">
            <div className="tab-content" id="descriptionContent">
              <div className="product-box">
                <div className="product-title">
                  <h3 className="text-xl text-red font-medium">
                    Chi tiết sản phẩm
                  </h3>
                </div>
                <div className="product-content">
                  <p>{listOneData?.product_description_long}</p>
                </div>
              </div>
            </div>
          </Tabs.TabPane>
          {/* reviews */}
          <Tabs.TabPane tab="ĐÁNH GIÁ" key="evaluate">
            <Reviews idProduct={id} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="BÌNH LUẬN" key="comment">
            <Comment idProduct={id} />
          </Tabs.TabPane> */}
        </Tabs>
      </div>
      <div className="grid w-full mb-5">
        <h3 className="text-xl font-medium">Sản phẩm liên quan</h3>
        <div className=" mt-[15px] grid grid-cols-5 gap-5">
          {productCategory?.map((item: any) => {
            return <ProductFeature key={item._id} product={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
