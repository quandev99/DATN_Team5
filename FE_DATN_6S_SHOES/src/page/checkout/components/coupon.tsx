import { Modal, Spin, message } from 'antd';
import { SetStateAction, useState } from 'react';
import { RiCouponLine } from "react-icons/ri";
import { useApplyCouponMutation, useGetCouponsAllUsersQuery } from '../../../api/coupon';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Radio } from 'antd';
import { ICoupon } from '../../../interface/coupons';

const CouponCheckOut = ({ setCouponCode, setPriceAppLy, shippingFee, setCouponIdRes, user, totalPrice, couponCode, selectedProducts }: any) => {
    const [open, setOpen] = useState(false);
    const [isLoadingApplyButton, setIsloadingApplyButton] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
    const [applyCoupon] = useApplyCouponMutation();

    const { data: DataCoupon } = useGetCouponsAllUsersQuery<ICoupon>();
    const ListCoupon = DataCoupon?.coupon;

    const onChange = (e: any) => {
        const selectedCouponId = e; // Giả sử giá trị value của radio button là id của coupon
        const selected = ListCoupon?.find((item: ICoupon) => item._id === selectedCouponId);
        if (selectedCoupon && selectedCoupon._id === selectedCouponId) {
            setSelectedCoupon(null); // Nếu click lại vào radio đang được chọn, đặt selectedCoupon thành null
        } else {
            setSelectedCoupon(selected || null); // Nếu click vào radio khác, đặt selectedCoupon là item được chọn
        }
    };

    const handleCouponCodeChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setCouponCode(event.target.value);
    };

    const applyCouponItem = async () => {
        setIsloadingApplyButton(true);
        const data = {
            user_id: user?._id,
            cart_id: user?.cart_id,
            totalPrice,
            coupon_code: couponCode,
            products: selectedProducts,
            shippingFee: shippingFee
        };
        try {
            const Coupons: any = await applyCoupon(data as any).unwrap();

            if (Coupons.success) {
                setOpen(false);
                setPriceAppLy(Coupons?.totalOrder);
                message.success(Coupons.message)
            }
        } catch (error: any) {
            message.error(error?.data?.message)
        } finally {
            setIsloadingApplyButton(false);
        }
    };

    const handleAppycouponSelect = async () => {
        setIsloadingApplyButton(true);
        const data = {
            user_id: user?._id,
            cart_id: user?.cart_id,
            totalPrice,
            coupon_code: selectedCoupon?.coupon_code || '',
            products: selectedProducts,
            shippingFee: shippingFee
        };

        try {
            const Coupons: any = await applyCoupon(data as any).unwrap();
            if (Coupons.success) {
                setOpen(false);
                setCouponIdRes(Coupons?.coupon_id);
                setPriceAppLy(Coupons?.totalOrder);
                message.success(Coupons.message)
            }
        } catch (error: any) {
            message.error(error?.data?.message)
        } finally {
            setIsloadingApplyButton(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return <div>
        {isLoadingApplyButton && (
            <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
        )}

        {/* Spin component */}
        {isLoadingApplyButton && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
        )}
        <div
            className='border-2 flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md bg-green-50 transition-all hover:border-green-500 hover:border-2  transition-allcursor-pointer'
            onClick={() => setOpen(true)}>
            <RiCouponLine /> <p>Chọn mã voucher</p>
        </div>
        <Modal
            title="Chọn mã voucher"
            open={open}
            // onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{ disabled: false, className: 'text-black border border-black', style: { display: 'none' } }}
            cancelButtonProps={{ disabled: false, style: { display: 'none' } }}
            width={700}
            className='mt-[-40px]'
        >
            <div className="coupon items-center w-full bg-gray-100 py-5 px-4 grid grid-cols-[13%,60%,auto] gap-3 mb-5">
                <h1 >Mã voucher</h1>
                <input
                    type="text"
                    className="w-full py-2 px-2 border rounded-sm shadow-sm outline-none"
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={handleCouponCodeChange}
                />
                <button
                    className="bg-yellow-700 uppercase text-white rounded-sm py-2 hover:bg-yellow-800 transition-all"
                    onClick={applyCouponItem}
                >
                    Áp dụng
                </button>
            </div>
            <div className='mb-3'>
                <h1>
                    Mã Miễn Phí Vận Chuyển
                </h1>
                <p>Có thể chọn 1 Voucher</p>
            </div>
            <div className=' grid grid-cols-1 gap-y-2 '>
                {ListCoupon && ListCoupon?.map((item: ICoupon) => {
                    const isDate = new Date(item.expiration_date) < new Date()
                    const minPrice = item?.min_purchase_amount > totalPrice
                    const quantityCoupon = item.coupon_quantity === 0
                    const isDisabled = minPrice;
                    return (
                        <div key={item._id}
                            className={`grid grid-cols-[20%,65%,auto] gap-2 text-[14px] items-center hover:shadow-md rounded-md duration-200 bg-gray-100 hover:border-green-200 hover:border-1 shadow-sm transition-all border min-h-[130px] 
                        ${isDisabled ? 'opacity-70  pointer-events-none' : ''}`}>
                            <div className=" bg-[#26aa99] text-center p-4">
                                <p className="w-[100px] text-[20px] text-white font-bold">Voucher</p>
                                <p className="text-[#d4eeeb]">Tất cả hình thức thanh toán</p>
                            </div>
                            <div className=" flex justify-between gap-x-2 items-center px-2 w-auto">
                                <div className="w-full">
                                    <span className=" text-black font-medium text-[15px]">
                                        Giảm  {item?.discount_amount?.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </span>
                                    <h3>Đơn tối thiểu {item?.min_purchase_amount?.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    })}</h3>
                                    <div className='flex items-center gap-2'>
                                        {/* <h3 className="text-[12px]">Đã dùng</h3> */}
                                        <p className="text-[12px]">
                                            HSD: {new Date(item?.expiration_date).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='text-center'>
                                <div className='mb-2'>
                                    {isDate || quantityCoupon ? (
                                        <div className='border rounded-full border-red-700 w-[55px] flex items-center justify-center h-[50px]  text-black'>Đã hết</div>
                                    ) : (
                                        <Radio.Group value={selectedCoupon === null ? selectedCoupon : selectedCoupon._id}>
                                            <Radio onClick={() => onChange(item._id)} value={item._id}></Radio>
                                        </Radio.Group>
                                    )}
                                </div>
                                <div>
                                    <Link to={''}>Điều kiện</Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className='flex justify-between items-center mt-5'>
                <div></div>
                <div className='flex gap-2 items-center '>
                    <button
                        onClick={handleCancel}
                        className={`uppercase hover:bg-gray-100 transition-all border rounded-sm w-[120px] py-2`}
                    >
                        Trở lại
                    </button>
                    <button
                        onClick={handleAppycouponSelect}
                        className={`uppercase bg-red-500 hover:bg-red-600 transition-all rounded-sm text-white w-[120px] py-2`}
                    >
                        OK
                    </button>
                </div>
            </div>
        </Modal >
    </div >;
};

export default CouponCheckOut;
