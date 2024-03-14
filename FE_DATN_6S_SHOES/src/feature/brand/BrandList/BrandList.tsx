import { SearchOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import type { InputRef } from "antd";
import { Button, Input, Space, Table, Image } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import { Link } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import IBrand from "../../../interface/brand";
import { useGetBrandsQuery } from "../../../api/brand";
import { getDecodedAccessToken } from "../../../decoder";
// import Swal from "sweetalert2";

interface DataType {
  key: string;
  brand_name: string;
  brand_image: object;
  brand_description: string;
  brand_status: boolean;
}
type DataIndex = keyof DataType;

const BrandList: React.FC = () => {
  const token: any = getDecodedAccessToken();
  const roleId = token?.role_name;

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const { data: brands, isLoading } = useGetBrandsQuery<any>();
  // const [removeBrand] = useRemoveBrandMutation();
  const dataBrand = brands?.brands;

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  // const handleDeleteBrand = async (brandId: string | number | any) => {
  //   try {
  //     const data: any = await removeBrand(brandId).unwrap();
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
  //     message.error(`${error.data.message}`);
  //   }
  // };
  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      width: "5%",
    },
    {
      title: "Tên Thương hiệu",
      dataIndex: "brand_name",
      key: "1",
      width: "20%",
      ...getColumnSearchProps("brand_name"),
    },
    {
      title: "Ảnh thương hiệu",
      dataIndex: "brand_image",
      key: "2",
      width: "20%",
      render: (record: { url: string }) => {
        return <Image width={150} height={100} src={record?.url} />;
      },
    },
    {
      title: "Sản phẩm",
      dataIndex: "brand",
      render: (record) => {
        return record?.products?.length;
      },
    },
    {
      title: "Mô tả",
      dataIndex: "brand_description",
      key: "3",
      sorter: (a: any, b: any) =>
        a?.brand_description?.length - b?.brand_description?.length,
      sortDirections: ["descend", "ascend"],
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "brand_status",
    //   key: "4",
    //   render: (record: any) => {
    //     return <Switch checked={record} onChange={onChange} />;
    //   },
    // },
    {
      title: "Action",
      key: "5",
      render: ({ _id }) => (
        <Space size="middle">
          {/* {brand_name !== "Chưa phân loại" && (
            <Popconfirm
              title="Bạn có chắc muốn xóa?"
              onConfirm={() => handleDeleteBrand(_id)}
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
                ? `/admin/brands/${_id}/update`
                : `/member/brands/${_id}/update`
            }
            className=" transition duration-300 ease-in-out"
          >
            <Button type="default" size="small">
              <AiFillEdit />
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link
        to={roleId == "Admin" ? "/admin/brands/add" : "/member/brands/add"}
        className="bg-green-500 px-2 py-2 rounded-sm mr-auto absolute right-10 text-white hover:bg-green-600 transition-all duration-200"
      >
        Thêm mới
      </Link>
      <h1 className="text-center py-5 font-medium text-[20px]">
        Quản lý thương hiệu
      </h1>
      {/* <form onSubmit={handleSubmit(onHandleSubmit as any)} className="w-full bg-gray-50 py-2 px-2 mb-5 text-gray-600 shadow grid grid-cols-6">
        <div className="max-w-[200px] bg-black">
          <input
            {...register("product_name")}
            className="py-2 w-full outline-none border px-2"
            type="text"
            placeholder="Tên sản phẩm" />
        </div>
        <div className="max-w-[70px]">
          <button className="py-2 w-full rounded-full hover:bg-gray-100 transition-all h-full outline-none border px-2 ">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </form> */}
      <Table
        columns={columns}
        dataSource={dataBrand?.map((brand: IBrand, index: string) => ({
          ...brand,
          brand,
          key: brand?._id,
          STT: index + 1,
        }))}
      />
    </div>
  );
};

export default BrandList;
