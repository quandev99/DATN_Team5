import { useState } from 'react';
import { Table, Pagination, Button, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { useGetAllRoleQuery } from '../../../api/role';
import { AiTwotoneEdit } from "react-icons/ai";
import { IoAddOutline } from "react-icons/io5";
// import Swal from 'sweetalert2';
import IRole from '../../../interface/role';

const RoleList = () => {
  const [currentPages, setCurrentPage] = useState(1);
  // const [isLoading, setIsLoading] = useState(false);

  const { data: roleData, isLoading: isLoadingData } = useGetAllRoleQuery<any>(currentPages);
  // const [deleteRole] = useRemoveRoleMutation<any>();

  const roles = roleData?.role;
  const totalItems = roleData?.pagination?.totalItems;
  // const handleDelete = async (roleId: number) => {
  //   setIsLoading(true); // Bắt đầu hiển thị trạng thái isLoading
  //   try {
  //     const data: any = await deleteRole(roleId).unwrap();
  //     if (data.success === true) {
  //       Swal.fire({
  //         position: 'top',
  //         icon: 'success',
  //         title: `${data.message}`,
  //         showConfirmButton: false,
  //         timer: 2000
  //       })
  //       return;
  //     } else {
  //       Swal.fire({
  //         title: 'Opps!',
  //         text: `${data.message}`,
  //         icon: 'error',
  //         confirmButtonText: 'Quay lại'
  //       })

  //     }
  //   } catch (error: any) {
  //     console.log(error);
  //     Swal.fire({
  //       title: 'Opps!',
  //       text: `${error?.data?.message}`,
  //       icon: 'error',
  //       confirmButtonText: 'Quay lại'
  //     })
  //   } finally {
  //     setIsLoading(false); // Dừng hiển thị trạng thái isLoading
  //   }
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
      title: 'Tên vai trò',
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'role_description',
      key: 'role_description',
      render: (record: any) => (
        <div dangerouslySetInnerHTML={{ __html: record }} className="w-full" />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: any) => {
        return (
          (
            <Button.Group>
              {/* {record.role_name && (record.role_name === "Customer" || record.role_name === "Admin" || record.role_name === "Member") ? null : (
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
                to={`/admin/roles/${record._id}/update`}
                className="ml-2  transition duration-300 ease-in-out"
              >
                <Button type="default" size="small">
                  <AiTwotoneEdit />
                </Button>
              </Link>
            </Button.Group>
          )
        )
      },
    },
  ];

  return (
    <div>
      <div className='flex items-center justify-between pb-5'>
        <h2 className="max-w-2xl font-semibold mb-4 text-black-500 uppercase text-[30px] border px-3 rounded bg-slate-100">Danh sách vai trò</h2>
        <Link to="/admin/roles/add" className="text-white px-4 rounded-md py-2 bg-green-600 hover:bg-green-700 no-underline hover:text-white-700 transition duration-300 ease-in-out">
          <IoAddOutline />
        </Link>
      </div>
      {isLoadingData ? <Skeleton active /> : (
        <div>
          <Table dataSource={roles?.map((role: IRole, index: string) => ({
            ...role,
            key: role?._id,
            STT: (currentPages - 1) * 10 + index + 1,
          }))} columns={columns} pagination={false} />
          <Pagination current={currentPages} total={totalItems} onChange={onHandlePageChange} className="mt-5" />
        </div>
      )}
    </div>
  );
};

export default RoleList;
