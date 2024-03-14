import { Link, useParams } from "react-router-dom"
import { Button, Popconfirm, Skeleton, Table, message } from "antd";
import { useGetVariantProductIDQuery, useRemoveVariantMutation } from "../../../../api/product";
import Swal from "sweetalert2";
const VariantProductList = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetVariantProductIDQuery<any>(id as string);
  const [removeVariant] = useRemoveVariantMutation();
  const variant = data?.VariantProductId

  const dataSource: any = variant?.map(({ _id, color_id, size_id, variant_price, variant_discount, variant_quantity, variant_stock }: any) => ({
    _id: _id,
    color_id: color_id?.color_name,
    size_id: size_id?.size_name,
    variant_price: variant_price,
    variant_discount: variant_discount,
    variant_quantity,
    variant_stock
  }));

  const handleDelete = async (_id: string) => {
    try {
      const data: any = await removeVariant(_id).unwrap();
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
      message.error(`${error?.data?.message}`)
    }
  };

  const columns = [
    {
      title: "Màu",
      dataIndex: "color_id",
    },
    {
      title: "Size",
      dataIndex: "size_id",
    },
    {
      title: "Giá",
      dataIndex: "variant_price",
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "variant_discount",
    },
    {
      title: "Số lượng bán",
      dataIndex: "variant_quantity",
    },
    {
      title: "Kho",
      dataIndex: "variant_stock",
    },
    {
      title: "Chức năng",
      dataIndex: "action",
      render: (_id: any, record: any) => (
        <div className="flex items-center gap-4">
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
          <Button type="primary" className="bg-blue-300">
            <Link to={`/admin/products/${id}/variant/${record._id}/update`}>Sửa</Link>
          </Button>
        </div>
      )
    },
  ];
  if (isLoading) return <Skeleton />;
  if (error) {
    if ("data" in error && "status" in error) {
      return (
        <div>
          {error.status} - {JSON.stringify(error.data)}
        </div>
      );
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold uppercase">Danh sách Sản phẩm biến thể</h1>
        <Button type="primary" className="bg-green-400">
          <Link to={`/admin/products/${id}/variant/add`}>Thêm mới</Link>
        </Button>
      </div>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </div>
  )
}

export default VariantProductList