import { useState } from 'react';
import { Table, Pagination, Button, Skeleton, Image, Popconfirm } from 'antd';
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
// import Swal from 'sweetalert2';
import { useGetAllBannerQuery, useRemoveBannerMutation } from '../../api/banner';
import { BannerAdd } from '.';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const BannerList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const pageSize = 5;
    const { data: bannerData, isLoading: isLoadingData } = useGetAllBannerQuery<any>();
    const [deleteBanner] = useRemoveBannerMutation<any>();
    const banners = bannerData?.banners;

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDelete = async (roleId: number) => {
        setIsLoading(true); // Bắt đầu hiển thị trạng thái isLoading
        try {
            const data: any = await deleteBanner(roleId).unwrap();
            if (data.success === true) {
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: `${data.message}`,
                    showConfirmButton: false,
                    timer: 2000
                })
                return;
            } else {
                Swal.fire({
                    title: 'Opps!',
                    text: `${data.message}`,
                    icon: 'error',
                    confirmButtonText: 'Quay lại'
                })

            }
        } catch (error: any) {
            console.log(error);
            Swal.fire({
                title: 'Opps!',
                text: `${error?.data?.message}`,
                icon: 'error',
                confirmButtonText: 'Quay lại'
            })
        } finally {
            setIsLoading(false); // Dừng hiển thị trạng thái isLoading
        }
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "STT",
            key: "STT",
            width: "5%",
        },
        {
            title: 'Ảnh',
            dataIndex: 'banner_image',
            key: 'banner_image',
            render: (image: { publicId: string, url: string }) => {
                return <Image src={image?.url} height={130} width={200} />;
            }
        },
        {
            title: 'Vị trí',
            dataIndex: 'display_order',
            key: 'display_order',
            render: (record: any) => (
                <div>{record}</div>
            ),
        },
        {
            title: 'Link ảnh',
            dataIndex: 'banner_link',
            key: 'banner_link',
            render: (record: any) => (
                <a className='block truncate w-[200px]'>{record}</a>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: any) => (
                <Button.Group>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa?"
                        onConfirm={() => handleDelete(record._id)}
                        okText={<p className='hover:text-blue-400 text-black'>Xóa</p>}
                        okButtonProps={{ className: '!bg-white !border border-gray-300 text-black hover:border-blue-400' }}
                        cancelText="Hủy"
                    >
                        <Button type="default" disabled={isLoading} size="small">
                            <AiFillDelete />
                        </Button>
                    </Popconfirm>
                    <Link
                        to={`/admin/banners/${record._id}/update`}
                        className="ml-2  transition duration-300 ease-in-out"
                    >
                        <Button type="default" size="small">
                            <AiTwotoneEdit />
                        </Button>
                    </Link>
                </Button.Group>
            ),
        },
    ];
    return (
        <div className='grid grid-cols-8 gap-5'>
            <div className='col-span-6 border p-3'>
                <div className='flex items-center justify-between pb-5'>
                    <h2
                        className="max-w-2xl font-semibold mb-4 text-black-500 uppercase text-[30px] border px-3 rounded bg-slate-100">
                        Danh sách banner</h2>
                </div>
                {isLoadingData ? <Skeleton active /> : (
                    <div>
                        <Table dataSource={banners?.map((banner: any, index: string) => ({
                            ...banner,
                            key: banner?._id,
                            STT: index + 1,
                        }))} columns={columns} pagination={false} />
                        <div className='mt-3'>
                            <Pagination
                                current={currentPage}
                                total={banners?.length}
                                pageSize={pageSize}
                                onChange={onPageChange}
                            />
                        </div>
                    </div>
                )}
            </div>
            <BannerAdd />
        </div >
    );
};

export default BannerList;
