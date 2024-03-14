import { useEffect, useState } from "react";
import { ISize } from "../../../../interface/size";
import { IVariant } from "../../../../interface/variant";
import { IColor } from "../../../../interface/color";
import { LuClipboardEdit } from "react-icons/lu";
import { FaSave } from "react-icons/fa";
import { useUpdateVariantMutation } from "../../../../api/product";
import Swal from "sweetalert2";
import { message } from "antd";
const VariantList = ({ sizes, item, colors }: any) => {
    const [variantSlice, setVariantSlice] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const [variantPrice, setVariantPrice] = useState<number>(0);
    const [variantDiscount, setVariantDiscount] = useState<number>(0);
    const [variantQuantity, setVariantQuantity] = useState<number>(0);
    const [variantStock, setVariantStock] = useState<number>(0);

    console.log(variantDiscount);

    // const { register, handleSubmit, watch } = useForm<IVariant>();
    const [updateVariant] = useUpdateVariantMutation();

    useEffect(() => {
        setVariantSlice(item?.variant_products);
    }, [item?.variant_products])


    const handleEditClick = (_id: string | number | any) => {
        // setIsEditing(!isEditing); // Khi click nút, chuyển đổi trạng thái chỉnh sửa
        setSelectedProductId(_id);
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantPrice(Number(event.target.value));
    };
    const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantDiscount(Number(event.target.value));
    };
    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantQuantity(Number(event.target.value));
    };
    const handleQuantityStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantStock(Number(event.target.value));
    };

    const onHandleSubmitSave = async (variant: IVariant) => {
        const updatedVariant: IVariant = {
            ...variant,
            variant_price: variantPrice ? variantPrice : variant?.variant_price,
            variant_discount: variantDiscount ? variantDiscount : variant?.variant_discount,
            variant_quantity: variantQuantity ? variantQuantity : variant?.variant_quantity,
            variant_stock: variantStock ? variantStock : variant?.variant_stock,
        };

        try {
            const data: any = await updateVariant(updatedVariant).unwrap();
            if (data.success === true) {
                setSelectedProductId(null);
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: `${data.message}`,
                    showConfirmButton: false,
                    timer: 2000
                })
                return;
            } else {
                Swal.fire({
                    title: 'Opps!',
                    text: `${data.message}`,
                    icon: 'error',
                    confirmButtonText: 'Quay lại'
                })
            }
        } catch (error: any) {
            message.error(error.data.message);
        }

    };

    return <div>
        {variantSlice?.map((ite: IVariant) => {
            return (
                <form
                    key={ite?._id}
                    className='grid grid-cols-[20%,10%,20%,20%,10%,10%,5%] gap-1 mb-2   items-center'>
                    <div>
                        <select
                            disabled={selectedProductId !== ite?._id}
                            value={ite?.color_id}
                            className="w-full px-1 py-3 rounded-sm  focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                        >
                            <option value="">Chọn</option>
                            {colors?.map((color: IColor) => (
                                <option key={color._id} value={color._id}>
                                    {color.color_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            disabled={selectedProductId !== ite?._id}
                            value={ite?.size_id}
                            className="w-full px-1 py-3 rounded-sm  focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                        >
                            <option value="">Size</option>
                            {sizes?.map((size: ISize) => (
                                <option key={size._id} value={size._id}>
                                    {size.size_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            onChange={handlePriceChange}
                            disabled={selectedProductId !== ite?._id}
                            type="text" defaultValue={ite?.variant_price} className='w-full px-1 py-3 rounded-sm  focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]' />
                    </div>
                    <div>
                        <input
                            onChange={handleDiscountChange}
                            disabled={selectedProductId !== ite?._id}
                            type="text" defaultValue={ite?.variant_discount} className='w-full px-1 py-3 rounded-sm  focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]' />
                    </div>
                    <div>
                        <input
                            onChange={handleQuantityChange}
                            disabled={selectedProductId !== ite?._id}
                            type="text" defaultValue={ite?.variant_quantity} className='w-full px-1 py-3 rounded-sm  focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]' />
                    </div>
                    <div>
                        <input
                            onChange={handleQuantityStockChange}
                            disabled={selectedProductId !== ite?._id}
                            type="text" defaultValue={ite?.variant_stock} className='w-full px-1 py-3 rounded-sm  focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]' />
                    </div>
                    <div>
                        {selectedProductId === ite?._id ? ( // Kiểm tra xem sản phẩm có trong danh sách chỉnh sửa hay không
                            <p className="text-red-500 cursor-pointer text-[20px]"
                                onClick={() => onHandleSubmitSave(ite)}
                            >
                                <FaSave />
                            </p>
                        ) : (
                            <p className="hover:text-yellow-700 cursor-pointer text-[20px]" onClick={() => handleEditClick(ite?._id)}>
                                <LuClipboardEdit />
                            </p>
                        )}
                    </div>
                </form>
            )
        })}
    </div>;
};

export default VariantList;
