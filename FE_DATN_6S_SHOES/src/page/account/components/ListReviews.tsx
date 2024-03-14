import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pagination, message } from "antd";
import { useAddToCartMutation } from "../../../api/cart";
import { getDecodedAccessToken } from "../../../decoder";
import { useGetUserByIdQuery } from "../../../api/user";
import { useGetBillByIdUserReviewsQuery } from "../../../api/bill";

const ListReviews = () => {
  const navigate = useNavigate();
  const [filterBill, setFilterBill] = useState([]);
  const [addToCart] = useAddToCartMutation();
  const [searchValue, setSearchValue] = useState("");
  const token: any = getDecodedAccessToken();

  const { data: userData } = useGetUserByIdQuery<any>(token?._id);
  const userId = userData?.user?._id;
  const [currentPage, setCurrentPage] = useState(1);

  const req = {
    userId,
    currentPages: currentPage,
    bill_code: searchValue,
  };

  const { data: billData, error } = useGetBillByIdUserReviewsQuery(req);

  const Bill = billData?.bills;

  const itemsPerPage = 4;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const displayedOrders: any = filterBill?.slice(startIndex, endIndex);

  useEffect(() => {
    if (searchValue) {
      filterData(searchValue);
    }
    setFilterBill(Bill);
  }, [Bill, searchValue]);

  const onHandleSearch = (event: any) => {
    const value = event.target.value;
    setSearchValue(value);
    filterData(value);
  };

  const filterData = (value: any) => {
    if (value === "" || !value) {
      setFilterBill(Bill);
    } else {
      const filtered = Bill?.filter((item: any) =>
        item.bill_code.toLowerCase().includes(value)
      );
      setFilterBill(filtered);
    }
  };

  const onHandleRepurchase = async (bill: any) => {
    if (bill) {
      bill.products.map(async (item: any) => {
        const dataCart = {
          user_id: bill?.user_id?._id,
          quantity: item?.quantity,
          variantProductId: item?.variant_product_id,
        };

        if (item.product_quantity === 0) {
          message.error("Sản phẩm đã hết hàng");
        }
        try {
          const responsive = await addToCart(dataCart).unwrap();
          if (responsive.success) {
            message.success(`${responsive.message}`);
            navigate("/carts");
          } else {
            message.error(`${responsive.message}`);
          }
        } catch (error: any) {
          message.error(error.data.message);
        }
      });
    } else {
      message.error("Đơn hàng không tồn tại");
    }
  };
  return (
    <div>
      <div className="box">
        {/* <SearchBill /> */}
        <form className="box-search flex items-center space-x-2 mb-3 bg-[#eaeaea] w-full py-3 ">
          <i className="fa-solid fa-magnifying-glass  pl-4"></i>
          <input
            type="text"
            onChange={() => onHandleSearch(event)}
            className="border-none outline-none w-full  bg-[#eaeaea]"
            placeholder="Tìm kiếm"
          />
        </form>
        <div>
          {error ? (
            <div>Không tìm thấy đơn hàng nào</div>
          ) : (
            <div>
              {displayedOrders?.length < 1 || displayedOrders === undefined ? (
                <div className="w-full flex items-center justify-center h-[200px] bg-gray-100">
                  Bạn chưa mua đơn hàng nào
                </div>
              ) : (
                <div>
                  {displayedOrders?.map((item: any, index: string) => {
                    return (
                      <div key={index} className="mb-5 shadow-sm">
                        <div className="bg-white p-5 border border-gray-50">
                          <div className="flex md:text-[14px] text-[12px] items-center justify-between">
                            <div className="flex items-center gap-2 ">
                              <div className="font-bold px-2  bg-red-600 text-white py-1">
                                Store
                              </div>
                              <div className="border border-gray-100  px-2 py-1">
                                Mã đơn hàng: {item?.bill_code}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <p className="text-green-700">
                                {item?.status === "Unpaid"
                                  ? "Chưa thanh toán"
                                  : "Đã thanh toán"}
                              </p>{" "}
                              <p>|</p>
                              <p className="text-red-600">
                                {item?.payment_status?.pStatus_description}
                              </p>
                            </div>
                          </div>
                          <hr className="mt-3" />
                          <div>
                            {item?.products?.map((pro: any, index: string) => {
                              return (
                                <Link
                                  to={`/account/bills/${item?._id}`}
                                  key={index}
                                  className="cart-List hover:bg-gray-50 transition-all grid md:grid-cols-[800px,auto] items-center"
                                >
                                  <div className="py-3 flex gap-2">
                                    <div className="max-w-[100px] border w-[80px] h-[80px]">
                                      <img
                                        src={pro?.product_image?.url}
                                        className="w-full h-full"
                                        alt="image"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <div>
                                        <h1 className="hover:text-red-400 transition-all">
                                          <Link
                                            to={`/products/${pro.product_id}`}
                                          >
                                            {pro?.product_name}
                                          </Link>
                                        </h1>
                                      </div>
                                      <div className="flex">
                                        <p className="text-gray-500 font-medium">
                                          {pro?.color_name} / {pro?.size_name}
                                        </p>
                                      </div>
                                      <div className="flex">
                                        <p className="flex items-center">
                                          <p>x</p>{" "}
                                          <span className=" font-medium">
                                            {pro?.quantity}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <span>
                                      {pro?.product_price?.toLocaleString(
                                        "vi-VN",
                                        { style: "currency", currency: "VND" }
                                      )}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                        <div className="bg-[#fffefb] border border-gray-50 py-4 px-4">
                          <div className="flex justify-between items-center">
                            <div></div>
                            <span className="flex gap-3 items-center">
                              Thành tiền:{" "}
                              <p className="text-red-500 text-[20px]">
                                {item?.bill_totalOrder?.toLocaleString(
                                  "vi-VN",
                                  { style: "currency", currency: "VND" }
                                )}
                              </p>
                            </span>
                          </div>
                          <div>
                            <div className="flex gap-2  mb-5">
                              {item?.payment_status?.pStatus_name ===
                                "Delivered" ||
                                item?.payment_status?.pStatus_name ===
                                "Reviews" ? (
                                <button
                                  onClick={() => onHandleRepurchase(item)}
                                  className="bg-red-500 text-center text-white hover:text-white max-w-[140px] border-gray-300 hover:bg-red-600 transition-all rounded-md w-full  py-2"
                                >
                                  Mua lại
                                </button>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {(displayedOrders?.length > 1 ||
                displayedOrders !== undefined) && (
                  <div className="text-center">
                    <Pagination
                      current={currentPage}
                      total={filterBill?.length}
                      pageSize={itemsPerPage}
                      onChange={handlePageChange}
                    />
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListReviews;
