/* eslint-disable no-var */
// import banner from '../../assets/2bbcfa99737217 1.png'
import Slider from 'react-slick'
import { useGetAllBannerQuery } from '../../../api/banner';
import { Skeleton } from 'antd';
import { useMemo } from 'react';
const BannerMain = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Bật chế độ tự động chuyển đổi slide
    autoplaySpeed: 3000, // Thời gian giữa các slide (đơn vị là mili giây)
  };
  const { data: bannerData, isLoading: isLoadingBanner } = useGetAllBannerQuery<any>();
  const bannerList = useMemo(() => bannerData?.banners, [bannerData]);
  return (
    <div className='mt-2'>
      {isLoadingBanner ? (
        <Skeleton active />
      ) : (
        <Slider {...settings} >
          {bannerList?.map((banner: any) => {
            return (
              <div
                className="aspect-w-16 h-[200px] lg:h-[600px] aspect-h-9"
              >
                <img src={banner?.banner_image?.url} className='object-cover w-full h-full object-center' alt="" />
              </div>
            )
          })}
        </Slider>
      )}
    </div>
  )
}

export default BannerMain