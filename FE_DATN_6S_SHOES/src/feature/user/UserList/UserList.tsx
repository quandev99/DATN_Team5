import { useMemo, useState } from 'react';
import { Table, Button, Input, Pagination, Image } from 'antd';
import { Link } from 'react-router-dom';
import { useGetUserAdminQuery } from '../../../api/user';
import { AiTwotoneEdit } from "react-icons/ai";
import { IoAddOutline } from "react-icons/io5";
// import { FaBan } from "react-icons/fa";
import { IUser } from '../../../interface/user';
import { useGetRolesQuery } from '../../../api/role';
// import { toast } from 'react-toastify';

const UserList = () => {
  const { data: users } = useGetUserAdminQuery<any>({ _limit: 100 } as any);
  const { data: roles } = useGetRolesQuery<any>();
  const dataUsers = useMemo(() => users?.users, [users]);
  const dataRole = useMemo(() => roles?.role, [users]);
  console.log(dataRole);

  // const [banUser] = useBanUserMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Số dòng trên mỗi trang
  const [searchText, setSearchText] = useState('');

  // const handleDeleteUser = async (userId: string) => {
  //   try {
  //     const data: any = await banUser(userId).unwrap();
  //     if (data.success) {
  //       toast.success(data.message)
  //     } else {
  //       toast.error(data.message)
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.data?.message)
  //   }
  // };

  const filteredUsers = dataUsers
    ? dataUsers.filter((user: { user_fullname: string; user_username: string; user_email: string }) => {
      const search = searchText.toLowerCase();
      return (
        user.user_fullname.toLowerCase().includes(search) ||
        user.user_username.toLowerCase().includes(search) ||
        user.user_email.toLowerCase().includes(search)
      );
    })
    : [];

  const totalRecords = filteredUsers.length;
  // const totalPages = Math.ceil(totalRecords / pageSize);

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      width: "5%",
    },
    {
      title: 'Avatar',
      dataIndex: 'user_avatar',
      key: 'avatar',
      render: (record: { url: string }) => (
        <Image width={80} height={80} src={record?.url} />
      ),
    },
    {
      title: 'Họ Tên',
      dataIndex: 'user_fullname',
      key: 'fullname',
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'user_username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'user_email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'user_phone',
      key: 'phone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'user_gender',
      key: 'gender',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role_id',
      key: 'role_id',
      render: (items: any) => {
        const Rolename = dataRole?.find((item: any) => item._id == items)
        return Rolename?.role_description;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'user_status',
      key: 'gender',
      render: (record: any) => {
        const statusName = record === false ? 'Khóa' : 'Đang mở'
        return statusName
      },
    },
    // {
    //   title: 'Ngày sinh',
    //   dataIndex: 'user_date_of_birth',
    //   key: 'birthday',
    //   render: (record: any) => {
    //     return <div>{record}</div>
    //   }
    // },
    // {
    //   title: 'Địa chỉ',
    //   dataIndex: 'user_address',
    //   key: 'address',
    // },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: any) => (
        <Button.Group>
          {/* <Popconfirm
            title="Bạn có chắc muốn khóa tài khoản?"
            onConfirm={() => handleDeleteUser(record._id)}
            okText={<p className='hover:text-blue-400 text-black'>Đồng ý</p>}
            okButtonProps={{ className: '!bg-white !border border-gray-300 text-black hover:border-blue-400' }}
            cancelText="Hủy"
          >
            <Button type="default" disabled={isLoading} size="small">
              <FaBan />
            </Button>
          </Popconfirm> */}
          <Link to={`/admin/users/${record._id}/update`} className="text-blue-500 ml-2 underline hover:text-blue-700 transition duration-300 ease-in-out">
            <Button type="default" size="small">
              <AiTwotoneEdit />
            </Button>
          </Link>
        </Button.Group>
      ),
    },
  ];

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div>
      <div className='flex items-center justify-between pb-5'>
        <h2 className="max-w-2xl font-semibold text-black-500 uppercase text-[30px] border px-3 rounded bg-slate-100">Danh sách tài khoản</h2>
        <Link to="/admin/users/add" className="text-white px-4 rounded-md py-2 bg-green-600 hover:bg-green-700 no-underline hover:text-white-700 transition duration-300 ease-in-out">
          <IoAddOutline />
        </Link>
      </div>
      <div className="mb-2">
        <Input
          placeholder="Tìm kiếm theo Họ tên, tên đăng nhập hoặc email "
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Table
        // dataSource={currentUsers}
        dataSource={currentUsers?.map((brand: IUser, index: string) => ({
          ...brand,
          key: brand?._id,
          STT: index + 1 + (currentPage - 1) * 10,
        }))}
        columns={columns}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        total={totalRecords}
        pageSize={pageSize}
        onChange={onPageChange}
      />
    </div>
  );
};

export default UserList;
