import { useEffect, useMemo, useState } from "react";
import { useGetGroupQuery } from "../../../api/product";
import { ProductFeature } from "../../../components";
import { IGroup } from "../../../interface/group";

import { Navigation, Pagination } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import { Swiper } from 'swiper/react';

import "./group.css"
const Group = () => {
    const { data: group } = useGetGroupQuery<IGroup>();
    const groups = useMemo(() => group?.groups, [group]);

    const [timeLeftArray, setTimeLeftArray] = useState<{ [key: string]: { days: number, hours: number, minutes: number, seconds: number } }>({});
    useEffect(() => {
        const timer = setInterval(() => {
            if (groups) {
                const newTimeLeftArray: { [key: string]: { days: number, hours: number, minutes: number, seconds: number } } = {};
                groups.forEach((group: IGroup) => {
                    const endDate = new Date(group?.end_date).getTime();
                    const now = new Date().getTime();
                    const difference = endDate - now;

                    if (difference > 0) {
                        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                        newTimeLeftArray[group?._id as any] = { days, hours, minutes, seconds };
                    } else {
                        newTimeLeftArray[group?._id as any] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
                    }
                });
                setTimeLeftArray(newTimeLeftArray);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [groups]);

    return <div>
        {groups && groups.map((item: any) => {
            console.log(new Date(item?.end_date).toLocaleString() > new Date().toLocaleString());

            const currendate = new Date().toLocaleString();
            const start_date = new Date(item?.start_date).toLocaleString();
            const end_date = new Date(item?.end_date).toLocaleString();
            if (start_date > currendate && currendate > end_date) {
                return null
            }

            return (
                <div key={item?._id}>
                    {item?.key == 0 && (
                        <section className="fash-sale bg-[#DAAD86] w-screen lg:w-[1519px] my-5">
                            <div className=" lg:max-w-[1280px] mx-auto py-4 px-3">
                                <div className="grid grid-cols-[50%,auto,auto] lg:grid-cols-[30%,53%,17%] items-center justify-between">
                                    <div className="title-sale flex items-center space-x-2">
                                        <h1 className="font-bold text-[15px] lg:text-[25px] text-white">{item?.group_name}</h1>
                                        <i className="fa-solid fa-bolt-lightning fa-beat-fade text-[#FFE400]"></i>
                                    </div>
                                    <div className="overflow-x-hidden lg:w-[500px]">
                                        <div className="product-sale-content moveText  w-full bg-black">
                                            <p dangerouslySetInnerHTML={{ __html: item?.group_description }} />
                                        </div>
                                    </div>
                                    <div className="date-sale">
                                        <div className="flex items-center space-x-2 w-full lg:max-w-[200px] text-center">
                                            <div className="bg-red-500 text-white rounded-md px-[3px] py-[3px] text-[10px] lg:px-2 lg:text-[17px] font-medium">
                                                <span id="days">{timeLeftArray[item._id as any]?.days}</span>
                                                <p className="text-[10px]">
                                                    Ngày</p>
                                            </div>
                                            <div className="bg-red-500 text-white rounded-md  px-[3px] py-[3px] text-[10px] lg:px-2 lg:text-[17px] font-medium">
                                                <span id="hours">{timeLeftArray[item._id as any]?.hours}</span>
                                                <p className="text-[10px]">Giờ</p>
                                            </div>
                                            <div className="bg-red-500 text-white rounded-md px-[3px] py-[3px] text-[10px] lg:px-2 lg:text-[17px] font-medium">
                                                <span id="minutes">{timeLeftArray[item._id as any]?.minutes}</span>
                                                <p className="text-[10px]">Phút</p>
                                            </div>
                                            <div className="bg-red-500 text-white rounded-md px-[3px] py-[3px] text-[10px] lg:px-2 lg:text-[17px] font-medium">
                                                <span id="seconds">{timeLeftArray[item._id as any]?.seconds}</span>
                                                <p className="text-[10px]">Giây</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white my-2 py-3 px-3 rounded-xl shadow-md">
                                    {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-4"> */}
                                    <Swiper
                                        breakpoints={{
                                            350: {
                                                slidesPerView: 2,
                                                slidesPerGroup: 1,
                                            },
                                            768: {
                                                slidesPerView: 4,
                                                slidesPerGroup: 1,
                                            },
                                            1023: {
                                                slidesPerView: 4,
                                                slidesPerGroup: 1,
                                            },
                                            1900: {
                                                slidesPerView: 5,
                                                slidesPerGroup: 1,
                                            },
                                        }}
                                        className="swiper-container"
                                        spaceBetween={20}
                                        loop={true}
                                        pagination={{
                                            clickable: true,
                                        }}
                                        navigation={true}
                                        modules={[Navigation, Pagination]}
                                    >
                                        {item?.products.map((product: any) => (
                                            <SwiperSlide key={product?._id}>
                                                <ProductFeature product={product} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    {/* </div> */}
                                </div>
                            </div>
                        </section>
                    )
                    }
                    {(item?.key === 1 && item?.products?.length > 0) && (
                        <section>
                            <div className="w-[200px] lg:max-w-[1280px] mx-auto py-4 my-10">
                                <div className='flex items-center justify-between px-3'>
                                    <div className="flex items-center">
                                        <h1 className="text-[30px] text-[#ca6f04] font-medium ">
                                            Sản phẩm nổi bật
                                        </h1>
                                        <i className="fa-solid fa-fire fa-shake text-red-600 text-[20px]"></i>
                                    </div>
                                </div>
                                <div className="bg-white my-2 py-3 px-3 rounded-xl shadow-md">
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-4">
                                        {item?.products.map((product: any) => (
                                            <div key={product?._id}>
                                                <ProductFeature product={product} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section >
                    )
                    }

                </div >
            )
        })}
    </div >;
};

export default Group;
