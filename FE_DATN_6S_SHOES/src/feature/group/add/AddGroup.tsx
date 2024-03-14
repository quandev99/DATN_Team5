import { Link, useNavigate } from "react-router-dom";
import { DatePicker, DatePickerProps, Spin } from "antd";
import Swal from "sweetalert2";
import { Controller, useForm } from "react-hook-form";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState } from "react";
import { IGroup } from "../../../interface/group";
import { LoadingOutlined } from "@ant-design/icons";
import { useAddGroupMutation } from "../../../api/product";

const AddGroup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm<IGroup>();
  const [editorData, setEditorData] = useState("");
  const [addGroup] = useAddGroupMutation<any>();
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const hasLeadingSpace = (value: any) => /^\s/.test(value);

  const onChangeDateStart: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setStartDate(dateString);
  };
  const onChangeDateEnd: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setEndDate(dateString);
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
        order_sort: values.order_sort ? values.order_sort : undefined,
        group_description: editorData === "" ? undefined : editorData,
        end_date: end_date ? end_date : undefined,
        start_date: start_date ? start_date : undefined,
      };

      const data: any = await addGroup(dataReq).unwrap();
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
          Thêm chiến dịch
        </h1>
      </div>
      <form onSubmit={handleSubmit(onHandleSubmit as any)}>
        <div className="py-10 ">
          <div className="grid grid-cols-2 gap-5 min-h-32">
            <div className="col-span-3 rounded-md ">
              <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-2 lg:gap-4">
                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Tên chiến dịch
                  </label>
                  <br />
                  <input
                    type="text"
                    {...register("group_name", {
                      required: "Tên chiến dịch không được bỏ trống ",
                      minLength: { value: 2, message: "Tối thiểu 2 ký tự" }
                    })}
                    placeholder="Tên chiến dịch..."
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
                      onChange={onChangeDateEnd}
                    />
                  </div>
                  <div className="text-red-500">
                    {errors?.end_date && errors?.end_date?.message}
                  </div>
                </div>
                <div className="col-span-2">
                  <label htmlFor="" className="font-bold text-[19px]">
                    Mô tả chiến dịch
                  </label>
                  <Controller
                    name="group_description"
                    control={control}
                    defaultValue=""
                    render={() => (
                      <CKEditor
                        editor={ClassicEditor}
                        onChange={handleEditorChange}
                      />
                    )}
                  />
                  <div className="text-red-500">
                    {errors?.group_description &&
                      errors?.group_description?.message}
                  </div>
                </div>

                <div className="flex col-span-2 gap-2 ">
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
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddGroup;
