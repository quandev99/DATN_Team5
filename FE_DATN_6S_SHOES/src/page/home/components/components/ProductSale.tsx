import { useAddToFavoriteMutation, useGetFavoriteByUserQuery } from "../../../../api/favorite";
import { useGetProductByIdQuery } from "../../../../api/product";
import { useGetUserByIdQuery } from "../../../../api/user";
import { getDecodedAccessToken } from "../../../../decoder";
import { Link, useNavigate } from 'react-router-dom'
import BuySpeed from "../../../../components/Product/components/BuySpeed";
import Swal from "sweetalert2";
import { useAddToCartMutation } from "../../../../api/cart";
import { message } from "antd";

const ProductSale = ({ item }: any) => {
    const navigate = useNavigate();
    const { data: productDetail } = useGetProductByIdQuery<any>(item?.product_id);
    const product = productDetail?.product;
    const [addToCart] = useAddToCartMutation();
    const [addToFavorite] = useAddToFavoriteMutation();

    // giải mã lấy ra user id
    const response: any = getDecodedAccessToken();
    const { data: userData } = useGetUserByIdQuery<any>(response?._id);
    const user = userData?.user;

    // Xử lý giá
    let priceProduct = product?.variant_products && product?.variant_products[0]?.variant_price;
    let discountProduct = product?.variant_products && product?.variant_products[0]?.variant_discount;
    let percentPrice;

    if (priceProduct !== undefined && discountProduct !== undefined && priceProduct !== 0) {
        percentPrice = ((priceProduct - discountProduct) / priceProduct) * 100;

        // Format the percentage with two decimal places
        percentPrice = percentPrice.toFixed(2);

        // Add commas as the thousands separator
        percentPrice = percentPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const { data: FavoriteData } = useGetFavoriteByUserQuery<any>(user?._id);
    const productByFavorite = FavoriteData?.favorite.products
    const pro = productByFavorite?.some((item: any) => item?._id === product?._id);

    // Thêm sản phẩm yêu thích
    const onHandleSubmit = async (_id: string) => {
        const formData: any = {
            product_id: _id,
            user_id: user?._id
        }
        try {
            const favorite: any = await addToFavorite(formData).unwrap();
            if (favorite.success === true) {
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: `${favorite.message}`,
                    showConfirmButton: false,
                    timer: 2000
                })
                return;
            } else {
                Swal.fire({
                    position: 'top',
                    title: 'Opps!',
                    text: `${favorite.message}`,
                    icon: 'error',
                    confirmButtonText: 'Quay lại'
                })
            }
        } catch (error: any) {
            const loginResult = await Swal.fire({
                position: 'top',
                title: 'Opps!',
                text: `${error.data.message}`,
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Đăng nhập',
                cancelButtonText: 'Quay lại'
            });

            if (loginResult.isConfirmed) {
                navigate("/login");
            }
        }
    };

    // Thêm vào giỏ hàng
    const addToCartItem = async (value: any) => {
        // const current = variantGetOne?.VariantProductId?.find((item: IVariant) => item._id === idVariant);
        if (!response) {
            message.error("Bạn cần đăng nhập để thực hiện chức năng này");
            return;
        }
        if (!value.variant_products[0]) {
            message.error("Rất xin lỗi vì bất tiện này! Sản phẩm này hiện chưa cập nhật hàng")
            return;
        }

        if (value.variant_products[0]?.variant_quantity === 0) {
            message.error("Sản phẩm tạm thời đang hết hàng");
            return
        }

        let quantity = 1

        if (quantity > value.variant_products[0]?.variant_quantity) {
            message.error("Sản phẩm đã vượt quá số lượng trong kho");
            return
        }

        const dataCart = {
            user_id: user?._id,
            quantity,
            variantProductId: value?.variant_products[0]?._id,
        };

        try {
            const responsive = await addToCart(dataCart).unwrap();
            if (responsive.success) {
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: `${responsive.message}`,
                    showConfirmButton: false,
                    timer: 2000
                })
                return null;
            } else {
                Swal.fire({
                    position: 'top',
                    title: `${responsive.message}`,
                    text: "Xóa sản phẩm khỏi giỏ hàng thất bại",
                    icon: 'error',
                    confirmButtonText: 'Quay lại'
                })
            }
        } catch (error: any) {
            Swal.fire({
                position: 'top',
                title: 'Opps!',
                text: `${error.data.message}`,
                icon: 'error',
                cancelButtonText: 'Quay lại'
            })
        };
    }
    return (
        <div
            className="relative   rounded-sm bg-gray-100 border border-gray-100 hover:shadow-md shadow hover:shadow-green-300 transition-all duration-300">
            <Link to="#" className="block  overflow-hidden group rounded-md">
                <div className="group relative rounded-lg block  overflow-hidden">
                    {product?.variant_products && product?.variant_products[0]?.variant_discount ? (
                        <span
                            className="font-bold absolute text-white bg-red-400 px-1 rounded-br-xl py-1 text-[13px] z-10">
                            {percentPrice} %</span>
                    ) : ''}

                    <Link to=""
                        className="max-w-[200px] h-[200px] bg-black text-white mx-auto my-2 block overflow-hidden ">
                        <img src={product?.product_image?.url} alt="Không có ảnh"
                            className=" w-full object-cover transition-all duration-300 opacity-90 group-hover:opacity-60 group-hover:scale-110 h-full" />
                    </Link>
                    <div className="relative">
                        <div className="icon-cart px-2  mt-[-30px]">
                            <div
                                className="translate-y-8 transform opacity-0 transition-all duration-300 group-hover:translate-y-[-100px] group-hover:opacity-100">
                                <p className="text-sm text-white flex items-center justify-center gap-1">
                                    <div>
                                        {/* <AddToCart product={product} user={user} /> */}
                                        <Link to="#"
                                            className='outline-none border-none text-white text-[20px]  rounded-full  hover:text-yellow-500 transition-all duration-300'
                                            onClick={() => addToCartItem(product)}>
                                            <i className="fa-solid fa-cart-shopping"></i>
                                        </Link>
                                    </div>
                                    <div>
                                        <BuySpeed product={product} user={user} />
                                    </div>

                                    <div>
                                        <Link to="#" className="block text-[20px] overflow-hidden group rounded-md" onClick={() => onHandleSubmit(product?._id)}>
                                            <i
                                                className={` ${!pro ? 'fa-regular' : 'fa-solid'
                                                    } transition-all duration-300 fa-heart fa-shake  hover:font-bold focus:font-bold text-red-600`}>
                                            </i>
                                        </Link>
                                    </div>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" bg-gray-100 px-3 mb-10">
                    <h3>
                        <Link
                            to={`/products/${product?._id}`}
                            className="text-[18px] hover:text-[#ca6f04] transition-all duration-300 text-gray-700 font-medium">
                            {product?.product_name}
                        </Link>
                    </h3>
                    <p className="absolute inset-x-0 px-3 pb-3 bottom-0 h-23  flex justify-between items-center">
                        {product?.variant_products?.length > 0 ? (
                            product?.variant_products[0]?.variant_discount !== 0 ? (
                                <div className='flex items-center gap-1'>
                                    <span className="tracking-wider text-[13px] text-red-600 font-medium">
                                        {product?.variant_products && product?.variant_products[0].variant_discount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                    <del className="tracking-wider text-[13px] text-gray-400 font-medium">
                                        {product?.variant_products && product?.variant_products[0].variant_price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</del>
                                </div>
                            ) : (
                                <span className="tracking-wider text-[15px] text-red-600 font-medium">
                                    {product?.variant_products && product?.variant_products[0]?.variant_price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                            )
                        ) : <div className='text-red-400'>Đang cập nhật</div>}
                        <span className=" text-gray-900 text-[12px]"> Đã bán: {product?.sold_quantity || 0}</span>
                    </p>
                </div>
            </Link >
        </div >
    )
}

export default ProductSale;
