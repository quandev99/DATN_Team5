import image2 from '../../assets/brandNike (2).png'
import { Product } from '.'
import { Link } from 'react-router-dom'
const ComponetBrand3 = () => {
  return (
    <div>
      <div className='flex items-center justify-between p-4 w-full border-b-8'>
        <h1 className='uppercase text-[25px] font-bold'>NIKE</h1>
        <span></span>
        <span className='hover:text-red-600 '><Link to={`all-product`}>xem tất cả</Link> </span>
      </div>
      <div className='flex'>
        <img src={image2} className='p-2' alt="" />
        <Product />
        <Product />
      </div>
    </div>
  )
}

export default ComponetBrand3