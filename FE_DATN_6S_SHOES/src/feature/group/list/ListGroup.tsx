import { useState } from 'react';
import { Table, Pagination, Button, Skeleton, Switch, message } from 'antd';
import { Link } from 'react-router-dom';
import { AiTwotoneEdit } from "react-icons/ai";
import { IoAddOutline } from "react-icons/io5";
// import Swal from 'sweetalert2';
import { useGetAllGroupQuery, useUpdateGroupMutation } from '../../../api/product';
import { getDecodedAccessToken } from '../../../decoder';

const ListGroup = () => {
    const token: any = getDecodedAccessToken();
    const roleId = token?.role_name;
    const [currentPages, setCurrentPage] = useState(1);
    // const [isLoading, setIsLoading] = useState(false);

    const { data: groupData, isLoading: isLoadingData } = useGetAllGroupQuery<any>();
    // const [deleteGroup] = useRemoveGroupMutation<any>();
    const [updateGroup] = useUpdateGroupMutation<any>();
    console.log(groupData);

    const groups = groupData?.groups;

    // xóa ẩn
    const onChange = async (value: any) => {
        const newStatus = !value?.status; // Đảo ngược trạng thái

        const formData = {
            ...value,
            status: newStatus, // Gán giá trị mới cho product_status
        };

        try {
            await updateGroup(formData).unwrap();
            if (value?.status) {
                message.success(`Mở `)
            } else {
                message.success(`Ẩn`)
            }
        } catch (error: any) {
            message.error(`${error.data.message}`)
        }
    };

    const totalItems = groupData?.pagination?.totalItems;
    // const handleDelete = async (groupId: string) => {
    //     setIsLoading(true); // Bắt đầu hiển thị trạng thái isLoading
    //     try {
    //         const data: any = await deleteGroup(groupId).unwrap();
    //         if (data.success === true) {
    //             Swal.fire({
    //                 position: 'top',
    //                 icon: 'success',
    //                 title: `${data.message}`,
    //                 showConfirmButton: false,
    //                 timer: 2000
    //             })
    //             return;
    //         } else {
    //             Swal.fire({
    //                 title: 'Opps!',
    //                 text: `${data.message}`,
    //                 icon: 'error',
    //                 confirmButtonText: 'Quay lại'
    //             })

    //         }
    //     } catch (error: any) {
    //         console.log(error);
    //         Swal.fire({
    //             title: 'Opps!',
    //             text: `${error?.data?.message}`,
    //             icon: 'error',
    //             confirmButtonText: 'Quay lại'
    //         })
    //     } finally {
    //         setIsLoading(false); // Dừng hiển thị trạng thái isLoading
    //     }
    // };

    // XỬ LÝ KHI CHUYỂN TRANG
    const onHandlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const columns = [
        {
            title: "STT",
            dataIndex: "STT",
            key: "STT",
            width: "5%",
        },
        {
            title: 'Tên nhóm',
            dataIndex: 'group_name',
            key: 'group_name',
        },
        {
            title: 'Vị trí',
            dataIndex: 'order_sort',
            key: 'order_sort',
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (record: any) => {
                return <div className="w-full" >{new Date(record).toLocaleString()}</div>
            },
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (record: any) => {
                return <div className="w-full" >{new Date(record).toLocaleString()}</div>
            },
        },
        {
            title: 'Mô tả',
            dataIndex: 'group_description',
            key: 'group_description',
            render: (record: any) => (
                <div dangerouslySetInnerHTML={{ __html: record }} className="w-full" />
            ),
        },
        {
            title: 'Tổng sản phẩm',
            dataIndex: 'products',
            key: 'products',
            render: (record: any) => (
                <div >{record?.length}</div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'group',
            key: 'group',
            render: (record: any) => {
                return <Switch checked={!record?.status} onClick={() => onChange(record)} />
            },
        },
        {
            title: 'key',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: any) => {
                return (
                    <Button.Group>
                        {/* {record.group_name && (record.group_name === "Customer" || record.group_name === "Admin" || record.group_name === "Member") ? null : (
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
                            )} */}
                        <Link
                            to={
                                roleId == "Admin"
                                    ? `/admin/product-group/${record._id}/update`
                                    : `/member/product-group/${record._id}/update`
                            }
                            className="ml-2  transition duration-300 ease-in-out"
                        >
                            <Button type="default" size="small">
                                <AiTwotoneEdit />
                            </Button>
                        </Link>
                    </Button.Group>
                );
            },
        },
    ];

    return (
        <div>
            <div className='flex items-center justify-between pb-5'>
                <h2
                    className="max-w-2xl font-semibold mb-4 text-black-500 uppercase text-[30px] border px-3 rounded bg-slate-100">Chiến dịch Fashsale</h2>
                <Link to={roleId == "Admin" ? "/admin/product-group/add" : "/member/product-group/add"} className="text-white px-4 rounded-md py-2 bg-green-600 hover:bg-green-700 no-underline hover:text-white-700 transition duration-300 ease-in-out">
                    <IoAddOutline />
                </Link>
            </div>
            {isLoadingData ? <Skeleton active /> : (
                <div>
                    <Table dataSource={groups?.map((group: any, index: string) => ({
                        ...group,
                        group,
                        _id: group?._id,
                        STT: (currentPages - 1) * 10 + index + 1,
                    }))} columns={columns} pagination={false} />
                    <Pagination current={currentPages} total={totalItems} onChange={onHandlePageChange} className="mt-5" />
                </div>
            )}
        </div>
    );
};

export default ListGroup;
