import { useState } from 'react'
import image from '../../assets/productCoupon.png'
import { formatMoney, renderStartFromNumber } from '../../util/helper'
import { SelectOption } from '../Product'
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai'
import { Link } from 'react-router-dom'
const ProductCoupon = ({ totalRatings = 5 }) => {
    const [isShowOption, setIsShowOption] = useState(false)
    return (
        <div className='flex'>
            <div className='bg-white rounded-md m-5'
                onMouseEnter={e => {
                    e.stopPropagation()
                    setIsShowOption(true)
                }}
                onMouseLeave={e => {
                    e.stopPropagation()
                    setIsShowOption(false)
                }}
            >
                <div className='w-full relative'>
                    {isShowOption && <div className='absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top'>
                        <SelectOption icon={<AiFillEye />} />
                        <SelectOption icon={<AiOutlineShoppingCart />} />
                        <SelectOption icon={<AiFillHeart />} />
                    </div>}
                    <Link to={`/product-coupon`}>
                        <img
                            src={image || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'} className='object-con p-4'
                        />
                    </Link>
                </div>

                <div className='flex flex-col pb-3 ml-[20px] items-start gap-1 w-full'>
                    <span className='text-gray-400 text-[13px]'>Nike</span>
                    <span className='flex'>{renderStartFromNumber(totalRatings, 14)}</span>
                    <span className='line-clamp-1 hover:text-red-600'><Link to={`/product-coupon`}>Giày Jordan 1</Link></span>
                    <span className='text-red-600 font-bold text-[13px]'>{`${formatMoney(2000000)} VND`} <del className='text-gray-400'><span className='text-gray-400'>{`${formatMoney(9000000)} VND`}</span></del> </span>

                </div>
            </div>

        </div>
    )
}

export default ProductCoupon