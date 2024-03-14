import { message } from "antd";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { IProduct } from "../../../../interface/product";
import { useDeleteProductByGroupMutation } from "../../../../api/product";
import { useSearchSizeQuery } from "../../../../api/size";
import VariantList from "./variantList";
import { useSearchColorsQuery } from "../../../../api/color";
import { useEffect, useState } from "react";
import { getDecodedAccessToken } from "../../../../decoder";

const ProductList = ({ selectedProducts, groupId, setSelectedProducts, setProducts, productResList }: any) => {
  const token: any = getDecodedAccessToken();
  const roleId = token?.role_name;
  const { data: sizeData } = useSearchSizeQuery<any>({ limit: 100 });
  const { data: colorData } = useSearchColorsQuery<any>({ limit: 100 });
  const [deleteProductByGroup] = useDeleteProductByGroupMutation<any>();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const sizes = sizeData?.sizes;
  const colors = colorData?.colors;

  useEffect(() => {
    setProducts(selectedProducts)
  }, [selectedProducts]);

  const onHandleDeletePro = async (idPro: string) => {
    const dataReq: { group_id: string, product_id: string } = {
      group_id: groupId,
      product_id: idPro
    }

    const data = selectedProducts?.filter((item: IProduct) => item._id !== idPro);
    if (data) {
      setSelectedProducts(data);
      const datarRes: any = await deleteProductByGroup(dataReq).unwrap();
      if (datarRes.success) {
        message.success(datarRes.message)
      } else {
        message.error(datarRes.message)
      }
    }
  }

  const onHandleSelectProduct = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = event.target.value; // Lấy giá trị được chọn từ dropdown

    // Kiểm tra xem selectedUserId đã tồn tại trong mảng users chưa
    const productIndex = selectedProducts.findIndex((item: any) => item._id === selectedProductId);
    const product = productResList.find((item: any) => item._id === selectedProductId);

    if (productIndex !== -1) {
      // Nếu selectedUserId đã tồn tại, di chuyển nó lên đầu mảng
      const updatedUsers = [
        selectedProducts[productIndex], // Chọn phần tử cần di chuyển
        ...selectedProducts.slice(0, productIndex), // Lấy các phần tử trước selectedUserId
        ...selectedProducts.slice(productIndex + 1), // Lấy các phần tử sau selectedUserId
      ];
      setSelectedProducts(updatedUsers); // Cập nhật mảng users mới
    } else {
      // Nếu selectedUserId chưa tồn tại, thêm nó vào đầu mảng
      const updatedUsers = [product, ...selectedProducts];

      setSelectedProducts(updatedUsers); // Cập nhật mảng users mới
    }
  };

  const handleEditClick = (_id: string | number | any) => {
    // setIsEditing(!isEditing); // Khi click nút, chuyển đổi trạng thái chỉnh sửa
    setSelectedProductId(_id);
  };

  const handleRemoveClick = (_id: string | number | any) => {
    // setIsEditing(!isEditing); // Khi click nút, chuyển đổi trạng thái chỉnh sửa
    setSelectedProductId(null);
  };

  return <div>
    <div>
      <select
        className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
        onChange={(event) => onHandleSelectProduct(event)}
      >
        {productResList?.map((item: IProduct) => {
          const isSelected = selectedProducts?.some((product: any) => product._id === item._id);
          return (
            <option key={item?._id} value={item?._id}
              className={`${isSelected ? 'bg-gray-200 ' : ''}`}
            >{item?.product_name} {isSelected && ' ✔️'}</option>
          )
        })}
      </select>
    </div>

    <div className='mt-5'>
      {selectedProducts?.length > 0 ? selectedProducts?.map((item: IProduct, index: string) => {
        return (
          <div
            key={item._id}
            className="grid grid-cols-[2%,10%,20%,auto,10%]  w-full p-2"
          >
            <div className="w-full text-center">{index + 1}</div>
            <div className="border w-[70px] h-[70px] mx-auto text-center">
              <img
                src={item?.product_image?.url}
                className="h-full w-full"
                alt="no image"
              />
            </div>
            <div>
              <Link
                to={
                  roleId == "Admin"
                    ? `/admin/products/${item._id}/update`
                    : `/member/products/${item._id}/update`
                }
                className="hover:text-red-500 transition-all"
              >
                {item?.product_name}
              </Link>
            </div>
            <div>
              {selectedProductId === item?._id ? (
                <VariantList
                  item={item}
                  sizes={sizes}
                  colors={colors}
                />
              ) : (
                <button
                  className="border px-2 py-2 bg-white rounded hover:shadow transition-all"
                  onClick={() => handleEditClick(item?._id)}
                >
                  + Biến thể
                </button>
              )}
              {selectedProductId === item?._id && (
                <button
                  className="border px-2 py-2 bg-white rounded hover:shadow transition-all"
                  onClick={() => handleRemoveClick(item?._id)}
                >
                  Thu gọn
                </button>
              )}
            </div>

            <div className="text-center">
              <button
                className="text-red-600"
                onClick={() => onHandleDeletePro(item?._id as string)}
              >
                <AiFillDelete />
              </button>
            </div>
          </div>
        );
      }) : <div>Không có sản phẩm nào</div>}
    </div>
  </div>;
};

export default ProductList;
