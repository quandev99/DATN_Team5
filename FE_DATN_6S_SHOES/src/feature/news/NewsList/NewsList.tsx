import { useState } from "react";
import { INew } from "../../../interface/new";
import { useGetProductQuery } from "../../../api/product";
import { IProduct } from "../../../interface/product";
import { useGetusersQuery } from "../../../api/user";
import { IUser } from "../../../interface/user";
import {
  useDeleteNewsMutation,
  useGetNewsQuery,
  useUpdateNewsMutation,
} from "../../../api/new";
import {
  Button,
  Image,
  Popconfirm,
  Switch,
  message,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getDecodedAccessToken } from "../../../decoder";

const NewsList = () => {
      const token: any = getDecodedAccessToken();
      const roleId = token?.role_name;
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: newsData } = useGetNewsQuery<INew>({
    page: currentPage,
    limit: pageSize,
  });

  const { data: productData } = useGetProductQuery<IProduct>();
  const { data: userData } = useGetusersQuery<IUser>();
  const [removeNews] = useDeleteNewsMutation<INew>();
  const [updateNews] = useUpdateNewsMutation<INew>();

  const products = productData?.products;
  const userList = userData?.users;
  const newsList = newsData?.news;

  const data = newsList?.map((news: INew, index: number) => {
    return {
      STT: index + 1,
      news: news,
      _id: news._id,
      news_title: news.news_title,
      news_content: news.news_content,
      news_image: news.news_image,
      product_id: news.product_id,
      user_id: news.user_id,
      status: news.status,
    };
  });

  const onChange = async (news: INew) => {
    const newStatus = !news?.status;

    const formData: any = {
      ...news,
      status: newStatus,
    };

    try {
      await updateNews(formData).unwrap();
      if (news?.status) {
        message.success(`Mở bài viết`);
      } else {
        message.success(`Ẩn bài viết`);
      }
    } catch (error: any) {
      message.error(`${error.data.message}`);
    }
  };

  const handleDelete = async (_id: string) => {
    setIsLoading(true);
    try {
      const data: any = await removeNews(_id).unwrap();
      if (data) {
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
      message.error(`${error?.data?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      width: "10px",
      render: (index: any) => <a>{index}</a>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "news_title",
      className: "w-[20%]",
      render: (record) => {
        return record;
      },
    },
    {
      title: "Ảnh bài viết",
      dataIndex: "news_image",
      render: (image) => {
        return <Image src={image?.url} height={130} width={100} />;
      },
    },
    {
      title: "Nội dung bài viết",
      dataIndex: "news_content",
      render: (record: any) => (
        <div dangerouslySetInnerHTML={{ __html: record }} className="w-full" />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "product_id",
      render: (record: any) => {
        const product_name = products?.find(
          (product: IProduct) => product._id === record
        );
        return product_name?.product_name;
      },
    },
    {
      title: "Tài khoản",
      dataIndex: "user_id",
      render: (record: any) => {
        const user_username = userList?.find(
          (user: IUser) => user._id === record
        );
        return user_username?.user_username;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (record: any) => {
        return (
          <Switch
            defaultChecked={!record.status}
            onClick={() => onChange(record)}
          />
        );
      },
    },
    {
      title: "Chức năng",
      render: (record: { _id: string }) => (
        <div className="flex items-center gap-4">
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record._id)}
            okText={<p className="text-black hover:text-blue-400">Xóa</p>}
            okButtonProps={{
              className:
                "!bg-white !border border-gray-300 text-black hover:border-blue-400",
            }}
            cancelText="Hủy"
          >
            <Button type="default" disabled={isLoading} size="small">
              <AiFillDelete />
            </Button>
          </Popconfirm>
          <Link
            to={
              roleId == "Admin"
                ? `/admin/news/${record?._id}/update`
                : `/member/news/${record?._id}/update`
            }
          >
            <Button type="default" size="small">
              <AiTwotoneEdit />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">Danh sách bài viết</h1>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 text-white transition-all bg-green-600 rounded-lg hover:bg-green-700 hover:text-white">
            <Link
              to={roleId == "Admin" ? "/admin/news/add" : "/member/news/add"}
            >
              Thêm mới
            </Link>
          </button>
        </div>
      </div>

      <div className="shadow-lg border border-gray-100 rounded-[30px] bg-white p-5">
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default NewsList;
