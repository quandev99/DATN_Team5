import { Link, useNavigate, useParams } from "react-router-dom";
import {
  DatePicker,
  DatePickerProps,
  Spin,
} from "antd";
import Swal from "sweetalert2";
import { Controller, useForm } from "react-hook-form";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useEffect, useState } from "react";
import { IGroup } from "../../../interface/group";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import moment from "moment";
import { IProduct } from "../../../interface/product";
import {
  useGetAllProductClientGroupQuery,
  useGetGroupByIdQuery,
  useUpdateGroupMutation,
} from "../../../api/product";
import ProductList from "./components/productList";

const UpdateGroup = () => {
  const { id } = useParams<{ id: string | number | any }>();
  const { data: group } = useGetGroupByIdQuery(id);
  const groupData = group?.group;
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
    setError,
    control,
    reset,
  } = useForm<IGroup>({
    defaultValues: {
      group_description: groupData?.group_description,
    },
  });

  const navigate = useNavigate();
  const [updateGroup] = useUpdateGroupMutation<any>();
  const [end_Date, setEndDate] = useState("");
  const [start_Date, setStartDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const productMap: any = group?.group?.products;
  const { data: productData } = useGetAllProductClientGroupQuery<IProduct>({ limit: 100 });
  const productResList = productData?.products;
  const [editorData, setEditorData] = useState("");

  const [selectedProducts, setSelectedProducts] = useState<any>([]);

  const hasLeadingSpace = (value: any) => /^\s/.test(value);

  useEffect(() => {
    reset(groupData);
    setProducts(productMap);
    setSelectedProducts(groupData?.products);
    setValue("group_name", groupData?.group_name || "");
    setValue("group_description", groupData?.group_description || "");
  }, [groupData, reset, setValue]);

  // const onHandleDeletePro = async (idPro: string) => {
  //   const dataReq: { group_id: string; product_id: string } = {
  //     group_id: id,
  //     product_id: idPro,
  //   };

  //   const data = selectedProducts?.filter(
  //     (item: IProduct) => item._id !== idPro
  //   );
  //   if (data) {
  //     setSelectedProducts(data);
  //     const datarRes: any = await deleteProductByGroup(dataReq).unwrap();
  //     if (datarRes.success) {
  //       message.success(datarRes.message);
  //     } else {
  //       message.error(datarRes.message);
  //     }
  //   }
  // };

  // const handleProductSelect = async (value: any) => {
  //   setIsloadingProduct(true);
  //   for (const selectedValue of value) {
  //     const product = productResList.find(item => item._id === selectedValue);

  //     let formData: any = {
  //       ...product,
  //       group_id: id,
  //       is_on_sale: undefined,
  //     };

  //     try {
  //       await patchProduct(formData).unwrap();
  //       // if (dataRes.success) {
  //       //     message.success(`${dataRes.message}`);
  //       // }
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setIsloadingProduct(false);
  //     }
  //   }
  // };

  // const handleDeselect = async (deselectedValue: any) => {
  //   const dataReq: { group_id: string; product_id: string } = {
  //     group_id: id,
  //     product_id: deselectedValue,
  //   };

  //   const data = selectedProducts?.filter(
  //     (item: IProduct) => item._id !== deselectedValue
  //   );
  //   if (data) {
  //     setSelectedProducts(data);
  //     const datarRes: any = await deleteProductByGroup(dataReq).unwrap();
  //     if (datarRes.success) {
  //       message.success(datarRes.message);
  //     } else {
  //       message.error(datarRes.message);
  //     }
  //   }

  //   // const updatedSelectedProducts = selectedProducts.filter(
  //   //     (product: any) => product._id !== deselectedValue
  //   // );
  //   // setSelectedProducts(updatedSelectedProducts);
  // };

  const defaultValueEnd = dayjs(
    moment(group?.group?.end_date).toLocaleString()
  );
  const defaultValueStart = dayjs(
    moment(group?.group?.start_date).toLocaleString()
  );

  const onChangeDateEnd: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setEndDate(dateString);
  };

  const onChangeDateStart: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setStartDate(dateString);
  };

  const handleEditorChange = (_event: any, editor: any) => {
    const data = editor.getData();
    const withoutParagraphTags = removeParagraphTags(data);
    setEditorData(withoutParagraphTags);
  };

  const removeParagraphTags = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Lấy nội dung trong thẻ body, loại bỏ thẻ p
    const bodyContent = doc.body.textContent || "";

    return bodyContent;
  };

  const onHandleSubmit = async (values: any) => {
    setIsLoading(true);

    if (hasLeadingSpace(values.group_name)) {
      setError("group_name", {
        type: "text",
        message: "Tên chiến dịch không được bắt đầu bằng khoảng trắng",
      });
      setIsLoading(false);
      return;
    }

    if (hasLeadingSpace(editorData)) {
      setError("group_description", {
        type: "text",
        message: "Mô tả không được bắt đầu bằng khoảng trắng",
      });
      setIsLoading(false);
      return;
    }

    if (editorData === "") {
      setError("group_description", {
        type: "text",
        message: "Mô tả không được để trống",
      });
      setIsLoading(false);
      return;
    }

    if (editorData.length < 2) {
      setError("group_description", {
        type: "text",
        message: "Tối thiểu 2 ký tự",
      });
      setIsLoading(false);
      return;
    }

    try {
      const dataReq = {
        ...values,
        group_description: editorData,
        end_date: end_Date ? end_Date : group?.group?.end_date,
        start_date: start_Date ? start_Date : group?.group?.start_date,
        products: products ? products : values.products,
        key: Number(values?.key) && Number(values?.key),
        order_sort: Number(values?.order_sort) && Number(values?.order_sort),
      };

      const data: any = await updateGroup(dataReq).unwrap();

      if (data.success === true) {
        navigate("/admin/product-group");
        Swal.fire({
          position: "top",
          icon: "success",
          title: `${data.message}`,
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      } else {
        Swal.fire({
          title: "Opps!",
          text: `${data.message}`,
          icon: "error",
          confirmButtonText: "Quay lại",
        });
      }
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        title: "Opps!",
        text: `${error?.data?.message}`,
        icon: "error",
        confirmButtonText: "Quay lại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto ">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}

      {/* Spin component */}
      {isLoading && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <div>
        <h1 className="text-center border shadow-sm border-gray-100 py-1 font-medium text-gray-900 uppercase text-[28px]">
          Cập nhật chiến dịch
        </h1>
      </div>
      <div>
        <form onSubmit={handleSubmit(onHandleSubmit as any)} className="py-10 ">
          <div className="flex justify-between gap-2 mt-3">
            <div></div>
            <div className="flex gap-2 ">
              <Link
                to="/admin/product-group"
                className="px-2 py-2 text-white transition-all duration-200 bg-gray-500 rounded-sm right-10 hover:bg-gray-600"
              >
                Quay lại
              </Link>
              <button className="px-6 mr-auto text-white transition-all duration-200 bg-green-500 rounded-sm hover:bg-green-600">
                Lưu
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 min-h-32">
            <div className="col-span-3 rounded-md ">
              <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-2 lg:gap-4">
                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Tên nhóm
                  </label>
                  <br />
                  <input
                    type="text"
                    {...register("group_name", {
                      required: "Tên nhóm không được bỏ trống ",
                      minLength: { value: 2, message: "Tối thiểu 2 ký tự" },
                    })}
                    placeholder="Tên nhóm..."
                    className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                  />
                  <div className="text-red-500">
                    {errors?.group_name && errors?.group_name?.message}
                  </div>
                </div>

                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Vị trí
                  </label>
                  <br />
                  <input
                    type="text"
                    {...register("order_sort")}
                    placeholder="Vị trí..."
                    className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                  />
                  <div className="text-red-500">
                    {errors?.order_sort && errors?.order_sort?.message}
                  </div>
                </div>

                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Thời gian bắt đầu
                  </label>
                  <br />
                  <div className="">
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      className="shadow-sm bg-white w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                      defaultValue={defaultValueStart}
                      onChange={onChangeDateStart}
                    />
                  </div>
                  <div className="text-red-500">
                    {errors?.end_date && errors?.end_date?.message}
                  </div>
                </div>
                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Thời gian kết thúc
                  </label>
                  <br />
                  <div className="">
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      className="shadow-sm bg-white w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                      defaultValue={defaultValueEnd}
                      onChange={onChangeDateEnd}
                    />
                  </div>
                  <div className="text-red-500">
                    {errors?.end_date && errors?.end_date?.message}
                  </div>
                </div>
                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Từ khóa hiển thị
                  </label>
                  <br />
                  <input
                    type="number"
                    {...register("key")}
                    placeholder="Từ khóa hiển thị..."
                    className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                  />
                  <div className="text-red-500">
                    {errors?.key && errors?.key?.message}
                  </div>
                </div>
                <div className="col-span-2">
                  <label htmlFor="" className="font-bold text-[19px]">
                    Mô tả chiến dịch
                  </label>
                  <Controller
                    name="group_description"
                    control={control}
                    render={({ field }) => (
                      <CKEditor
                        editor={ClassicEditor}
                        data={groupData?.group_description || ""}
                        onChange={(e, editor) => {
                          handleEditorChange(e, editor);
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  <div className="text-red-500">
                    {errors?.group_description &&
                      errors?.group_description?.message}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="w-full col-span-2 p-4 rounded-md shadow-md bg-gray-50">
          <div>
            <h1 className="font-medium text-[20px] mb-3">Sản phẩm</h1>
          </div>
          {/* <div className="flex items-center gap-2">
            <Select
              mode="multiple"
              style={{ width: "100%", transition: "all" }}
              value={selectedProducts?.map((product: any) => product._id)}
              onChange={handleProductSelect}
              className="w-[50%]  bg-white text-gray-800 border"
              placeholder="Chọn sản phẩm"
              virtual // Sử dụng thuộc tính virtual để tạo thanh cuộn tự động
              onDeselect={handleDeselect}
            >
              {productResList?.map((item: IProduct) => {
                const isSelected = selectedProducts?.includes(item._id);
                return (
                  <Option
                    className={isSelected ? "selectedOption" : ""}
                    key={item?._id}
                    value={item?._id}
                  >
                    {item?.product_name}{" "}
                  </Option>
                );
              })}
            </Select>
          </div> */}

          <div className="mt-5">
            <ProductList
              selectedProducts={selectedProducts}
              groupId={id}
              setSelectedProducts={setSelectedProducts}
              setProducts={setProducts}
              productResList={productResList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateGroup;
