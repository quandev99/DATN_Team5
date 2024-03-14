

import { Product } from '.'
import Slider from 'react-slick'
import { Link } from 'react-router-dom';
const ComponetBrand1 = () => {
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
    };
    return (
        <div className=''>
            <div className='flex items-center justify-between p-4 w-full border-b-8'>
                <h1 className='uppercase text-[25px] font-bold'>NIKE</h1>
                <span></span>
                <span className='hover:text-red-600 '><Link to={`all-product`}>xem tất cả</Link> </span>
            </div>
            {/* <img src={image2} className='p-2'  alt="" /> */}

            <div className=''>
                <div className='' >
                    <Slider {...settings}>
                        <Product />
                        <Product />
                        <Product />
                        <Product />
                    </Slider>
                </div>
            </div>



        </div>
    )
}

export default ComponetBrand1