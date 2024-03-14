import { useState } from 'react'
import image from '../../assets/product.png'
import { formatMoney, renderStartFromNumber } from '../../util/helper'
import { Link } from 'react-router-dom'
import { SelectOption } from '../Product'
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai'
const Product = ({ totalRatings = 5 }: any) => {
  const [isShowOption, setIsShowOption] = useState(false)
  return (
    <div className=''
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

        <Link to={`#`}>
          <img
            src={image || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'} className='w-[250px] h-[234px] hi object-cover p-4'
          />
        </Link>
      </div>

      <div className='flex flex-col pb-2 ml-[20px] items-start gap-1 w-[70%]'>
        <span className='text-gray-400 text-[13px]'>New Blance</span>
        <span className='flex'>{renderStartFromNumber(totalRatings, 14)}</span>
        <span className='line-clamp-1'>Giày New Blance</span>
        <span className='text-red-600 font-bold text-[15px]'>{`${formatMoney(2000000)} VND`}  </span>
        <del className='text-gray-400 text-[13px]'><span className='text-gray-400'>{`${formatMoney(9000000)} VND`}</span></del>

      </div>
    </div>
  )
}

export default Product