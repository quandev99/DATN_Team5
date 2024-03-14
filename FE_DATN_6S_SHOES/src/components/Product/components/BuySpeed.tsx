import clsx from "clsx";
import { useEffect, useState } from "react";
import { Modal, message } from "antd";
import { formatMoney } from "../../../util/helper";
import {
  useGetProductByIdQuery,
  useGetVariantProductIDQuery,
} from "../../../api/product";
import { IProduct } from "../../../interface/product";
import { IVariant } from "../../../interface/variant";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useGetUserByIdQuery } from "../../../api/user";
import { getDecodedAccessToken } from "../../../decoder";

const BuySpeed = ({ product }: any) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { data: variantGetOne } = useGetVariantProductIDQuery<any>(
    product?._id
  );
  const { data: productDetail } = useGetProductByIdQuery<IProduct>(
    selectedProductId as any
  );
  const response: any = getDecodedAccessToken();
  const { data: userData } = useGetUserByIdQuery<any>(response?._id);
  const user = userData?.user;
  const showModal = (productId: any) => {
    setSelectedProductId(productId);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const [disabled, setDisabled] = useState<any>(false);
  useEffect(() => {
    if (variantGetOne?.VariantProductId?.length < 1) {
      setDisabled(true);
    }
  }, [variantGetOne?.VariantProductId]);

  const colorNames = variantGetOne?.VariantProductId?.map(
    (variant: any) => variant?.color_id?.color_name
  );
  const uniqueColorNames = [...new Set(colorNames)].sort();
  const sizeNames = variantGetOne?.VariantProductId?.map(
    (variant: any) => variant?.size_id?.size_name
  );
  const uniqueSizeNames = [...new Set(sizeNames)].sort();
  // const availableColors = variantGetOne?.VariantProductId?.map(
  //   (variant: any) => variant.color_id?.color_name
  // );
  const availableSizes = variantGetOne?.VariantProductId?.map(
    (variant: any) => variant.size_id?.size_name
  );
  const colorDefault = variantGetOne?.VariantProductId[0]?.color_id?.color_name;
  const sizeDefault = variantGetOne?.VariantProductId[0]?.size_id?.size_name;

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
  let idVariant: string;

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
  const getQuantityForSelection = () => {
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
      return selectedVariant?.variant_discount || 0;
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

  const onHandleQuantity = (e: any) => {
    const current = variantGetOne?.VariantProductId?.find(
      (item: IVariant) => item._id === idVariant
    );
    const quantity = e.target.value;
    if (quantity >= current?.variant_quantity) {
      message.success("Số lượng bạn vừa nhập vượt quá số lượng trong kho");
    } else {
      setCount(quantity);
    }
  };

  const [count, setCount] = useState(1);
  const handleIncrement = () => {
    const current = variantGetOne?.VariantProductId?.find(
      (item: IVariant) => item._id === idVariant
    );

    if (count >= current?.variant_quantity) {
      message.success("Số lượng bạn vừa nhập vượt quá số lượng trong kho");
    } else {
      setCount(count => count + 1);
    }
  };

  const handleDecrement = () => {
    if (count <= 1) return;
    setCount(count => count - 1);
  };
  // add to cart

  const addToCartItem = async () => {
    const current = variantGetOne?.VariantProductId?.find(
      (item: IVariant) => item._id === idVariant
    );

    if (current?.variant_quantity === 0) {
      message.error("Sản phẩm tạm thời đang hết hàng");
      return
    }

    if (count > current?.variant_quantity) {
      message.error("Sản phẩm đã vượt quá số lượng trong kho");
      return
    }

    const dataCart = [
      {
        ...current,
        product_name: product?.product_name,
        product_image: product?.product_image,
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
        user_id: user?._id
      },
    ];
    if (!user?._id) {
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
    if (user?._id) {
      // Nếu đã đăng nhập, thực hiện các bước khác
      Swal.fire({
        position: "top",
        title: `Mua hàng thành công`,
        icon: "success",
      });

      // window.location.href = `/checkouts?products=${encodeURIComponent(
      //   JSON.stringify(dataCart)
      // )}`;
      localStorage.setItem("carts", JSON.stringify(dataCart))
      navigate("/checkouts");
    }
  };

  return (
    <div>
      <Modal
        title="Thông tin sản phẩm"
        open={open}
        // onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: false,
          className: "text-black border border-black",
          style: { display: "none" },
        }}
        cancelButtonProps={{ disabled: false, style: { display: "none" } }}
      >
        <div className="flex gap-3">
          <div className="max-h-[80px] max-w-[70px] border  min-h-[80px] min-w-[70px]">
            <img
              src={productDetail?.product?.product_image?.url}
              className="w-full h-full"
              alt="image"
            />
          </div>
          <div>
            <div className="flex gap-2">
              <h1>Tên sản phẩm:</h1>
              <p className="text-black font-medium">
                {productDetail?.product?.product_name}
              </p>
            </div>
            <div>
              <span>Số lượng: </span>
              <a className="text-black font-medium" href="#">
                {getQuantityForSelection()}
              </a>
            </div>
            <div className="h-[20px]">
              {getDiscoutForSelection() !== 0 ? (
                <div>
                  <span className="text-[#131313] font-medium text-[16px] mr-3 ">
                    {getDiscoutForSelection()}
                  </span>
                  <span className="text-gray-300 font-medium text-[16px]  mr-3 line-through">
                    {getPriceForSelection()}
                  </span>
                </div>
              ) : (
                <span className="text-[#131313] font-medium text-[16px]  ">
                  {getPriceForSelection()}
                </span>
              )}
            </div>
            <div>
              <div className="flex gap-2 mt-2">
                <h2>Màu:</h2>
                <div className="flex gap-2 items-center">
                  {uniqueColorNames?.map((colorName: any, index) => (
                    <li
                      key={index}
                      className={clsx(
                        "h-[30px] px-1 flex items-center justify-center text-[#57575a] border-2  cursor-pointer transition-all duration-300 rounded-md",
                        selectedColor === colorName &&
                        "border-blue-500 border-2 text-blue-600 font-medium"
                      )}
                      onClick={() => handleColorClick(colorName)}
                    >
                      {colorName}
                    </li>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <h2 className="py-2">Kích thước:</h2>
                <div className="flex gap-2 items-center">
                  {uniqueSizeNames?.map((size, index) => (
                    <li
                      key={index}
                      className={clsx(
                        "px-2 py-[1px] flex items-center justify-center text-[#57575a]  border-2 cursor-pointer hover:transition-all  rounded-md",
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
                </div>
              </div>
              <div className="col-span-1 flex items-center text-center cursor-pointer">
                <p
                  onClick={handleDecrement}
                  className="px-[8px] hover:shadow text-[#181819] text-xl border border-gray-300  rounded-s"
                >
                  -
                </p>
                <input
                  type="text"
                  value={count}
                  min={1}
                  name="quantity"
                  onChange={onHandleQuantity}
                  id=""
                  className="inline-block outline-none w-[40px] h-[29px] text-center border border-t-gray-300  text-[#171718] text-xl "
                />

                <p
                  onClick={handleIncrement}
                  className="px-[8px] hover:shadow  border border-gray-300 rounded-r text-[#111112] text-xl"
                >
                  +
                </p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {/* <Button type="primary" onClick={handleOk} className={'text-black border hover:bg-yellow-400 border-yellow-400'}>
            Mua hàng
          </Button> */}
          <button
            disabled={(validateValue() as any) || disabled}
            onClick={addToCartItem}
            className={`col-span-2 hover:shadow-md bg-[#1f66ef] rounded-full transition-all hover:bg-blue-800 text-white font-medium w-full p-2 text-center ${validateValue() || disabled ? "bg-sky-700" : ""
              }`}
          >
            {validateValue() || disabled
              ? "Sản phẩm đang cập nhật"
              : "Mua ngay"}
          </button>
        </div>
      </Modal>
      <button
        className="outline-none border-none text-white text-[20px]  rounded-full  hover:text-yellow-500 transition-all duration-300"
        onClick={() => showModal(product._id)}
      >
        <i className="fa-regular fa-eye"></i>
      </button>
    </div>
  );
};

export default BuySpeed;
