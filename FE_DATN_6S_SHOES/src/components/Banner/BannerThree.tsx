import image1 from '../../assets/Rectangle 4226.png'
import image2 from '../../assets/Rectangle 4227.png'
const BannerThree = () => {
    return (
        <div className='w-full'>
            <div className='w-full flex'>
                <div className='w-[50%] overflow-hidden'>
                    <img src={image1} className='object-contain transition-transform hover:scale-125' alt="" />
                </div>
                <div className='w-[50%] text-center flex flex-col items-center justify-center'>
                    <h1 className='text-[25px] pb-4 '>Thời trang phong cách SneakerSneaker</h1>
                    <button className='bg-black p-5 border-collapse rounded-md text-cyan-50 hover:bg-blue-900 transtition ease-out duration-400'> mua ngay </button>
                </div>
            </div>
            <div className='w-full flex'>
                <div className='w-[50%] text-center flex flex-col items-center justify-center'>
                    <h1 className='text-[25px] pb-4 '>Thời trang phong cách SneakerSneaker</h1>
                    <button className='bg-black p-5 border-collapse rounded-md text-cyan-50 hover:bg-blue-900 transtition ease-out duration-400'> mua ngay </button>
                </div>
                <div className='w-[50%] overflow-hidden'>
                    <img src={image2} className='object-contain transition-transform hover:scale-125' alt="" />
                </div>
            </div>
        </div>
    )
}

export default BannerThree