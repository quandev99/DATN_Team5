import { Link } from "react-router-dom";
import {
  useDeleteAllProductCartMutation,
  useDeleteOneProductCartMutation,
  useGetCartByUserQuery,
  useUpdateCartMutation,
} from "../../api/cart";
import { getDecodedAccessToken } from "../../decoder";
import { useCallback, useMemo, useState } from "react";
import { message } from "antd";
import Swal from "sweetalert2";

const CartPage = () => {
  const userData:
    | {
      _id: string;
      role_name: string;
      iat: number;
      exp: number;
    }
    | any = getDecodedAccessToken();

  const userId = useMemo(() => userData?._id, [userData]);
  const { data: carts } = useGetCartByUserQuery(userId);
  const [removeAll] = useDeleteAllProductCartMutation();
  const [removeOne] = useDeleteOneProductCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const cartList = useMemo(() => carts?.cart, [carts]);

  const removeAllProductCart = async () => {
    const confirm = window.confirm(
      "Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng"
    );
    if (confirm) {
      setSelectedProducts([]);
      const data: any = await removeAll(userId);
      if (data) {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: "Xóa tất cả sản phẩm khỏi giỏ hàng thành công",
          showConfirmButton: false,
          timer: 2000
        })
        return;
      } else {
        Swal.fire({
          position: 'top',
          title: 'Opps!',
          text: "Xóa tất cả sản phẩm khỏi giỏ hàng thất bại",
          icon: 'error',
          confirmButtonText: 'Quay lại'
        })
      }
    }
  };

  const [selectedProducts, setSelectedProducts] = useState<any>([]);
  localStorage.setItem("carts", JSON.stringify(selectedProducts))

  const totalPrice = selectedProducts.reduce((accumulator: any, product: any) => {
    return accumulator += product.price;
  }, 0);

  let cart_shippingFee = totalPrice < 100000 ? 30000 : 0;

  // Tính totalOrder dựa trên điều kiện cart_shippingFee
  const totalOrder = totalPrice + cart_shippingFee;

  // Hàm xử lý khi checkbox thay đổi trạng thái
  const handleCheckboxChange = async (cartItem: any) => {
    if (isSelected(cartItem)) {
      setSelectedProducts(selectedProducts.filter((item: any) => item._id !== cartItem._id));
    } else {
      setSelectedProducts([...selectedProducts, cartItem]);
    }
  };

  const isSelected = (cartItem: any) => {
    const data = selectedProducts.some((item: any) => item._id === cartItem._id);
    return data;
  };

  const onHandleRemoveCart = async (variant: string | any) => {
    try {
      const formRemove = {
        variant_product_id: variant?._id,
        user_id: userId,
      };

      const confirm = window.confirm("Bạn có chắc chắn muốn xóa");
      if (confirm) {
        setSelectedProducts(selectedProducts.filter((item: any) => item.variant_product_id._id !== variant._id));
        const { data }: any = await removeOne(formRemove);
        if (data.success === true) {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: "Xóa sản phẩm khỏi giỏ hàng thành công",
            showConfirmButton: false,
            timer: 2000
          })
          return;
        } else {
          Swal.fire({
            position: 'top',
            title: 'Opps!',
            text: "Xóa sản phẩm khỏi giỏ hàng thất bại",
            icon: 'error',
            confirmButtonText: 'Quay lại'
          })
        }
      }
    } catch (error: any) {
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: "Opps",
        text: `${error.data.message}`,
        showConfirmButton: false,
        timer: 2000
      })
    }
  };
  // Input
  const increase = useCallback(async (cart: any) => {
    try {
      // Tăng số lượng sản phẩm
      setSelectedProducts((prevSelectedProducts: any) => {
        return prevSelectedProducts.map((item: any) => {
          if (item._id === cart._id) {
            if (item.quantity >= cart.product_quantity) {
              message.error(`Số lượng sản phẩm trong kho có hạn ${cart.product_quantity} `);
              return item;
            }

            const updatedQuantity = item.quantity + 1;
            const updatedPrice = item.product_discount ? item.product_discount * updatedQuantity : item.product_price * updatedQuantity;
            return {
              ...item,
              quantity: updatedQuantity,
              price: updatedPrice,
            };
          }
          return item;
        });
      });
      let quantity = cart.quantity + 1;
      if (quantity > cart.product_quantity) {
        message.error("Sản phẩm vượt quá số lượng bán");
        quantity = cart.quantity
      }

      const formUpdate = {
        user_id: userId,
        variantProductId: cart.variant_product_id._id,
        quantity,
      }
      await updateCart(formUpdate).unwrap();

    } catch (error) {
      console.log(error);
    }
  }, []);

  const decrease = async (cart: any) => {
    const formRemove = {
      variant_product_id: cart?.variant_product_id?._id,
      user_id: userId,
    };

    try {
      const updatedSelectedProducts = await Promise.all(
        selectedProducts.map(async (item: any) => {
          if (item._id === cart._id) {
            const updatedQuantity = item.quantity - 1;
            if (updatedQuantity < 1) {
              const confirm = window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng");
              if (confirm) {
                const { data }: any = await removeOne(formRemove);
                if (data.success) {
                  Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: "Xóa sản phẩm khỏi giỏ hàng thành công",
                    showConfirmButton: false,
                    timer: 2000
                  })
                  return null;
                } else {
                  Swal.fire({
                    position: 'top',
                    title: 'Opps!',
                    text: "Xóa sản phẩm khỏi giỏ hàng thất bại",
                    icon: 'error',
                    confirmButtonText: 'Quay lại'
                  })
                }
              } else {
                return {
                  ...item,
                  quantity: 1,
                  price: item.product_discount ? item.product_discount : item.product_price,
                }
              }
            } else {
              const updatedPrice = item.product_discount ? item.product_discount * updatedQuantity : item.product_price * updatedQuantity;
              return {
                ...item,
                quantity: updatedQuantity,
                price: updatedPrice,
              };
            }
          }
          return item;
        })
      );
      setSelectedProducts(updatedSelectedProducts.filter((item) => item !== null));

      const updateQuantity = cart.quantity - 1;
      if (updateQuantity < 1) {
        const confirm = window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng");
        if (confirm) {
          const { data }: any = await removeOne(formRemove);
          if (data.success) {
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: "Xóa sản phẩm khỏi giỏ hàng thành công",
              showConfirmButton: false,
              timer: 2000
            })
            return null;
          } else {
            Swal.fire({
              position: 'top',
              title: 'Opps!',
              text: "Xóa sản phẩm khỏi giỏ hàng thất bại",
              icon: 'error',
              confirmButtonText: 'Quay lại'
            })
          }
        } else {
          cart.quantity = 1
        }
      }
      const formUpdate = {
        user_id: userId,
        variantProductId: cart.variant_product_id._id,
        quantity: updateQuantity,
      }
      await updateCart(formUpdate).unwrap();
    } catch (error) {
      console.log(error);
    }
  };


  const updateQuantity = async (newQuantity: any, cart: any, product: any) => {
    const formRemove = {
      variant_product_id: cart?.variant_product_id?._id,
      user_id: userId,
    };

    try {
      if (isNaN(newQuantity) || newQuantity < 1) {
        return;
      }
      const updatedSelectedProducts = await Promise.all(
        selectedProducts.map(async (item: any) => {
          if (item._id === cart._id) {
            const quantity = parseInt(newQuantity);
            if (isNaN(quantity) || quantity < 1) {
              return item;
            }

            if (quantity >= cart.product_quantity) {
              message.error(`Số lượng sản phẩm trong kho có hạn ${cart.product_quantity} `);
              return item;
            }

            const updatedQuantity = quantity;

            if (updatedQuantity < 1) {
              const confirm = window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng");
              if (confirm) {
                const { data }: any = await removeOne(formRemove);
                if (data.success) {
                  Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: "Xóa sản phẩm khỏi giỏ hàng thành công",
                    showConfirmButton: false,
                    timer: 2000
                  })
                  return null;
                } else {
                  Swal.fire({
                    position: 'top',
                    title: 'Opps!',
                    text: "Xóa sản phẩm khỏi giỏ hàng thất bại",
                    icon: 'error',
                    confirmButtonText: 'Quay lại'
                  })
                }
              } else {
                return {
                  ...item,
                  quantity: 1,
                  price: item.product_discount ? item.product_discount : item.product_price,
                }
              }
            } else {
              const updatedPrice = item.product_discount ? item.product_discount * updatedQuantity : item.product_price * updatedQuantity;
              return {
                ...item,
                quantity: updatedQuantity,
                price: updatedPrice,
              };
            }
          }
          return item;
        })
      );
      setSelectedProducts(updatedSelectedProducts.filter((item) => item !== null));

      if (newQuantity > product.product_quantity) {
        message.error("Sản phẩm vượt quá số lượng bán");
        newQuantity = product.quantity
      }

      const formUpdate = {
        user_id: userId,
        variantProductId: product && product.variant_product_id._id,
        quantity: Number(newQuantity),
      }

      await updateCart(formUpdate).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 mt-10 max-w-screen-xl w-screen px-2 lg:px-0 lg:grid-cols-3 lg:gap-8">
      <div className="min-h-32 mb-4  rounded-lg  lg:col-span-2">
        <div className="overflow-x-auto bg-gray-100 border border-gray-200 shadow-md">
          <table className="min-w-full  divide-y-2 divide-gray-200 bg-gray-100 text-sm border border-gray-50 shadow-md shadow-gray-300">
            <thead className="ltr:text-left rtl:text-right font-medium text-[12px] lg:text-[16px] uppercase">
              <tr>
                <td className="sticky inset-y-0 start-0 px-2 lg:px-4 py-2">
                  <label htmlFor="SelectAll" className="sr-only">
                    Select All
                  </label>

                  <input
                    type="checkbox"
                    id="SelectAll"
                    className="lg:h-5 lg:w-5 rounded border-gray-300"

                    onChange={() => {
                      // Khi checkbox "Chọn tất cả" thay đổi, cập nhật danh sách sản phẩm được chọn
                      if (selectedProducts.length === cartList?.products?.length) {
                        setSelectedProducts([]);
                      } else {
                        const allProductIds = cartList?.products?.map((product: any) => product) || [];
                        setSelectedProducts(allProductIds);
                      }
                    }}
                    checked={selectedProducts.length === cartList?.products?.length}
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Sản phẩm
                </td>
                <td className=" whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900 hidden lg:table-cell">
                  Đơn giá
                </td>
                <td className=" whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900 hidden lg:table-cell">
                  Số lượng
                </td>
                <td className=" whitespace-nowrap lg:px-4 text-center py-2 font-medium text-gray-900">
                  Số tiền
                </td>
                <td className=" whitespace-nowrap px-1 lg:px-4 py-2 text-center font-medium text-gray-900 hidden lg:table-cell">
                  Thao tác
                </td>
              </tr>
            </thead>
            {cartList?.products?.length > 0 && (
              <tbody className="divide-y divide-gray-200">
                {cartList?.products?.map((product: any) => {
                  const selectQuantity = selectedProducts.find((item: any) => item._id === product._id);

                  return (
                    <tr key={product._id}>
                      <td className="sticky inset-y-0 start-0 px-2 lg:px-4 py-2">
                        <label
                          className="sr-only"
                          htmlFor={`Row${product._id}`}
                        ></label>
                        <input
                          className="lg:h-5 lg:w-5 rounded border-gray-300"
                          type="checkbox"
                          onChange={() => handleCheckboxChange(product)}
                          checked={isSelected(product)}
                        />
                      </td>

                      <td className=" col-span-2 gap-2 flex lg:m-4 lg:space-x-2 w-full">
                        <div className="lg:max-w-[80px] w-[40px] h-[40px] lg:h-[80px] lg:w-full border ">
                          <img
                            src={product?.product_image?.url}
                            alt="No image"
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div className="lg:hidden block">
                          <div className="flex flex-col  lg:gap-y-5">
                            <Link
                              to={`/products/${product?.product_id?._id}`}
                              className="lg:text-[16px] text-[12px]"
                            >
                              <h1>{product?.product_name}</h1>
                            </Link>
                            <div className="flex">
                              <p className="text-black lg:text-[16px] text-[12px] font-medium">
                                {product?.color_name} /{product?.size_name}
                              </p>
                            </div>
                            <div className="lg:hidden block">
                              {product?.product_discount !== 0
                                ? product?.product_discount?.toLocaleString(
                                    "vi-VN",
                                    {
                                      style: "currency",
                                      currency: "VND",
                                    }
                                  )
                                : product?.product_price?.toLocaleString(
                                    "vi-VN",
                                    {
                                      style: "currency",
                                      currency: "VND",
                                    }
                                  )}
                            </div>
                            <div>
                              <div className="flex items-center  cursor-pointer w-full">
                                <p
                                  onClick={() => decrease(product)}
                                  className="px-[12px] bg-white py-[2px] text-[#181819]  text-center text-xl hover:shadow transition-all border border-gray-200 rounded-s"
                                >
                                  -
                                </p>
                                <input
                                  type="text"
                                  value={
                                    selectQuantity
                                      ? selectQuantity.quantity
                                      : product?.quantity
                                  }
                                  name="quantity"
                                  id=""
                                  min={1}
                                  className="inline-block w-10 outline-none h-[35px] text-center border border-gray-200 text-[#171718] text-xl"
                                  onChange={(e) =>
                                    updateQuantity(
                                      e.target.value,
                                      selectQuantity,
                                      product
                                    )
                                  }
                                />
                                <p
                                  onClick={() => increase(product)}
                                  className="px-[12px] bg-white py-[2px] border border-gray-200 hover:shadow transition-all rounded-r text-[#111112] text-xl"
                                >
                                  +
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap  text-center  py-2 font-medium text-gray-900 hidden lg:table-cell">
                        {product?.product_discount !== 0
                          ? product?.product_discount?.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })
                          : product?.product_price?.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                      </td>
                      <td className="whitespace-nowrap py-2 text-gray-700  hidden lg:table-cell">
                        <div className="flex items-center justify-center cursor-pointer w-full">
                          <p
                            onClick={() => decrease(product)}
                            className="px-[12px] bg-white py-[2px] text-[#181819]  text-center text-xl hover:shadow transition-all border border-gray-200 rounded-s"
                          >
                            -
                          </p>
                          <input
                            type="text"
                            value={
                              selectQuantity
                                ? selectQuantity.quantity
                                : product?.quantity
                            }
                            name="quantity"
                            id=""
                            min={1}
                            className="inline-block w-10 outline-none h-[35px] text-center border border-gray-200 text-[#171718] text-xl"
                            onChange={(e) =>
                              updateQuantity(
                                e.target.value,
                                selectQuantity,
                                product
                              )
                            }
                          />
                          <p
                            onClick={() => increase(product)}
                            className="px-[12px] bg-white py-[2px] border border-gray-200 hover:shadow transition-all rounded-r text-[#111112] text-xl"
                          >
                            +
                          </p>
                        </div>
                      </td>
                      <td className="text-center whitespace-nowrap lg:text-[16px]  col-span-1  font-medium ">
                        {selectQuantity
                          ? selectQuantity.price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })
                          : product?.price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                      </td>
                      <td className="whitespace-nowrap px-2 lg:px-4 text-center py-2 text-gray-700">
                        <button
                          className="inline-block"
                          onClick={() =>
                            onHandleRemoveCart(product?.variant_product_id)
                          }
                        >
                          <i className="fa-solid fa-trash text-[#f00a0a]"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
        {cartList?.products?.length < 1 && (
          <div className="  lg:mt-5  lg:mb-4">
            <div className="flex items-center justify-center min-h-[200px] border mb-2">Không có sản phẩm nào trong giỏ hàng</div>
            <Link
              to="/products"
              className="bg-yellow-400 hover:bg-yellow-600 transition-all duration-200 text-white px-4 py-2 rounded-md"
            >
              Quay lại mua hàng
            </Link>
          </div>
        )}
        {cartList?.products?.length > 0 ? (
          <button
            onClick={() => removeAllProductCart()}
            className="bg-red-600 hover:bg-red-700 transition-all duration-200 px-4 lg:px-8 text-white py-1 lg:py-2 mt-5 rounded-sm"
          >
            Xóa tất cả
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="min-h-32 ">
        <div className="bg-gray-100 border border-gray-100 shadow-md">
          <div className="box-header  px-4 py-2">
            <h1 className="uppercase font-medium text-[17px]">Tổng số lượng</h1>
          </div>
          <hr />
          <div className="box-content px-4 py-3">
            <div className=" flex justify-between py-3">
              <h1>Tổng phụ</h1>
              <span className="font-medium">
                {selectedProducts ? totalPrice?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }) : 0}{" "}
              </span>
            </div>
            <hr />
            <div className=" flex justify-between py-3">
              <h1>Phí ship</h1>
              <p>{cart_shippingFee === 0 ? 'Giao hàng miễn phí' : cart_shippingFee?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}</p>
            </div>
            <hr />
            <div className=" flex justify-between py-3">
              <h1>Tổng</h1>
              <span className="font-medium">
                {totalOrder?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }) || 0}{" "}
              </span>
            </div>
            <hr />
            {(cartList && selectedProducts.length !== 0) ? (
              <div className=" bg-[#d26e4b] hover:bg-[#b86142] transition-all duration-200 text-white text-center w-full mt-3">
                <Link
                  to={`/checkouts`}
                  className="uppercase block py-3 font-medium"
                >
                  Tiến hành thanh toán
                </Link>
              </div>
            ) : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
