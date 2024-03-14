import { Switch, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
// import { MdDelete } from "react-icons/md";
import { useGetCouponsAdminQuery, usePatchCouponMutation } from '../../../api/coupon';
import { Link } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import { RiFileEditFill } from "react-icons/ri";
// import Swal from "sweetalert2";

const CouponList = () => {
  const { data: Coupons } = useGetCouponsAdminQuery<any>();
  // const [removeCoupon] = useRemoveCouponMutation();
  const [patchCoupon] = usePatchCouponMutation();
  const dataCoupons = Coupons?.coupon;

  const data = dataCoupons?.map((coupon: any, index: number) => {
    return {
      STT: index + 1,
      key: coupon._id,
      coupon,
      coupon_name: coupon.coupon_name,
      coupon_code: coupon.coupon_code,
      coupon_content: coupon.coupon_content,
      coupon_quantity: coupon.coupon_quantity,
      discount_amount: coupon.discount_amount,
      expiration_date: coupon.expiration_date,
      min_purchase_amount: coupon.min_purchase_amount,
    };
  });

  // const handleDelete = async (_id: any) => {
  //   const data: any = await removeCoupon(_id).unwrap()
  //   if (data.success === true) {
  //     Swal.fire({
  //       position: 'top',
  //       icon: 'success',
  //       title: `${data.message}`,
  //       showConfirmButton: false,
  //       timer: 2000
  //     })
  //     return;
  //   } else {
  //     Swal.fire({
  //       title: 'Opps!',
  //       text: `${data.message}`,
  //       icon: 'error',
  //       confirmButtonText: 'Quay lại'
  //     })
  //   }
  // };

  const onChangeStatus = async (product: any) => {
    const newStatus = !product?.status; // Đảo ngược trạng thái

    const formData = {
      ...product,
      status: newStatus, // Gán giá trị mới cho product_status
    };

    try {
      await patchCoupon(formData).unwrap();
    } catch (error: any) {
      message.error(`${error.data.message}`)
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (index: any) => <a>{index}</a>,
    },
    {
      title: "Tên mã giảm giá",
      dataIndex: "coupon_name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Tiền giảm",
      dataIndex: "discount_amount",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Số tiền tối thiểu",
      dataIndex: "min_purchase_amount",
      render: (text: string) => <a>{text}</a>,
    },
    // {
    //   title: "Mô tả mã giảm giá",
    //   dataIndex: "coupon_content",
    // },

    {
      title: "Mã code",
      dataIndex: "coupon_code",
      render: (record: any) => <a>{record}</a>,
    },
    {
      title: "Số lượng",
      dataIndex: "coupon_quantity",
      render: (record: any) => <a>{record}</a>,
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiration_date",
      render: (record: any) => <a>{new Date(record)?.toLocaleString()}</a>,
    },
    {
      title: "Trạng thái",
      dataIndex: "coupon",
      render: (record: any) => {
        return <Switch
          checkedChildren="Mở"
          unCheckedChildren="Đóng"
          defaultChecked={!record?.status} onClick={() => onChangeStatus(record)} />;
      }
    },
    {
      title: "Chức năng",
      render: ({ key: _id }: any) => (
        <div className="flex items-center gap-4">
          {/* <Popconfirm
            title="Xóa mã giảm giá"
            description="Bạn có chắc chắn muốn xóa?"
            okText={
              <span style={{ color: "white", backgroundColor: "red" }}>
                Xóa
              </span>
            }
            cancelText="Không"
            onConfirm={() => handleDelete(_id)}
          >
            <div
              className='border-2 flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md bg-red-50 transition-all hover:border-red-500 hover:border-2  transition-allcursor-pointer'>
              <MdDelete />
            </div>
          </Popconfirm> */}
          <button
            className='border-2 flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md bg-green-50 transition-all hover:border-green-500 hover:border-2  transition-allcursor-pointer'
          >
            <Link to={`/admin/coupons/${_id}/update`}> <RiFileEditFill /></Link>
          </button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">Danh sách mã giảm giá</h1>
        <button
          className="bg-green-400 transition-all text-white hover:bg-green-500 px-3 py-2 rounded-md">
          <Link
            className="flex items-center gap-1"
            to="/admin/coupons/add"><IoAddOutline />Thêm mới</Link>
        </button>
      </div>
      <div className="bg-gray-50 p-5 shadow-md">
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
}


export default CouponList