

import { useMemo } from 'react';
import { useGetNewsQuery } from '../../api/new';
import { BannerMain, News } from '../../components'
import { Group, GroupBrand, GroupProductNew } from './components';
import GroupTopBestSale from './components/group-to-best-sale';

const HomePage = () => {
    const { data: newsData, isLoading: isLoadingNews } = useGetNewsQuery<any>({ limit: 4 as any });
    const newsList = useMemo(() => newsData?.news, [newsData]);

    return (
        <div className="">
            {/* banner */}
            <section className='w-[390px] md:w-[1519px] '>
                <BannerMain />
            </section>
            {/* brand */}
            <div className='w-full lg:max-w-[1280px] px-2 mx-auto bg-white mt-10 rounded-sm'>
                <GroupBrand />
            </div>
            {/* coupon */}
            <Group />
            <GroupTopBestSale />
            <GroupProductNew />
            {/* news */}
            <section className="news">
                <div className="w-full lg:max-w-[1280px] mx-auto py-4  my-10">
                    <div className="flex items-center border-b-2 border-red-600 ml-4 max-w-[270px]">
                        <h1 className="text-[20px] lg:text-[30px] text-[#ca6f04] font-medium px-2">
                            Tin tức mới nhất
                        </h1>
                        <i className="fa-solid fa-fire-flame-curved fa-fade text-red-600 lg:text-[20px]"></i>
                    </div>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-4 p-3">
                        {newsList?.map((item: any) => {
                            return <News new={item} isLoading={isLoadingNews} />
                        })}
                    </div >
                </div >
            </section >
        </div >
    )
}

export default HomePage