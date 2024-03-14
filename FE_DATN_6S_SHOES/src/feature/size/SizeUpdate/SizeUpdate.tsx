import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetSizeByIdQuery, useUpdateSizeMutation } from "../../../api/size";
import { ISize } from "../../../interface/size";
import Swal from "sweetalert2";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const SizeUpdate = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
    setError,
    control,
  } = useForm<ISize>();
  const { id } = useParams<{ id: any }>();
  const [isChecked, setIsChecked] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [editorData, setEditorData] = useState("");
  const { data: size } = useGetSizeByIdQuery<any>(id);
  const [updateSize] = useUpdateSizeMutation();
  const dataSize = size?.size;

  const hasLeadingSpace = (value: any) => /^\s/.test(value);

  useEffect(() => {
    if (dataSize) {
      setValue("size_name", dataSize.size_name);
      setValue("size_code", dataSize.size_code);
      setValue("size_description", dataSize.size_description);
      setValue("size_is_new", dataSize.size_is_new);
    }
  }, [dataSize, setValue]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.value === "true" ? true : false);
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

  const onSubmit = async (data: ISize) => {
    setIsLoadingButton(true);

    if (hasLeadingSpace(data.size_name)) {
      setError("size_name", {
        type: "text",
        message: "Tên kích cỡ không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }
    if (hasLeadingSpace(data.size_code)) {
      setError("size_code", {
        type: "text",
        message: "Mã kích cỡ không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (hasLeadingSpace(editorData)) {
      setError("size_description", {
        type: "text",
        message: "Mô tả không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (editorData === "") {
      setError("size_description", {
        type: "text",
        message: "Mô tả không được để trống",
      });
      setIsLoadingButton(false);
      return;
    }

    if (editorData.length < 2) {
      setError("size_description", {
        type: "text",
        message: "Tối thiểu 2 ký tự",
      });
      setIsLoadingButton(false);
      return;
    }

    const formData: any = {
      ...data,
      _id: id,
      size_is_new: !isChecked,
      size_description: editorData,
    };
    try {
      const response: any = await updateSize(formData).unwrap();
      if (response.success === true) {
        navigate("/admin/sizes");
        Swal.fire({
          position: "top",
          icon: "success",
          title: `${response.message}`,
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      } else {
        Swal.fire({
          title: "Opps!",
          text: `${response.message}`,
          icon: "error",
          confirmButtonText: "Quay lại",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Opps!",
        text: `${error.data.message}`,
        icon: "error",
        confirmButtonText: "Quay lại",
      });
    } finally {
      setIsLoadingButton(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center w-full">
        {isLoadingButton && (
          <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
        )}
        {isLoadingButton && (
          <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          </div>
        )}
        <h1 className="text-2xl font-bold">Chỉnh sửa kích cỡ</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-[800px]">
          <div className="mb-4">
            <label htmlFor="size_name" className="font-bold">
              Size <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              {...register("size_name", {
                required: "Tên size không được bỏ trống ",
                minLength: { value: 2, message: "Tối thiểu 2 ký tự" },
              })}
              placeholder="Name size ..."
              className=" shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
            />
            <div className="text-red-500">
              {errors?.size_name && errors?.size_name?.message}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="size_code" className="font-bold">
              Size Code <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              {...register("size_code", {
                required: "Mã size không được bỏ trống ",
                minLength: { value: 2, message: "Tối thiểu 2 ký tự" },
              })}
              placeholder="Code size ..."
              className=" shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
            />
            <div className="text-red-500">
              {errors?.size_code && errors?.size_code?.message}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="size_description" className="font-bold">
              Size Description <span className="text-red-700">*</span>
            </label>
            <Controller
              name="size_description"
              control={control}
              render={({ field }) => (
                <CKEditor
                  editor={ClassicEditor}
                  data={dataSize?.size_description || ""}
                  onChange={(e, editor) => {
                    handleEditorChange(e, editor);
                    field.onChange(e);
                  }}
                />
              )}
            />
            <div className="text-red-500">
              {errors?.size_description && errors?.size_description?.message}
            </div>
          </div>
          <label className="block mb-2 text-sm font-bold text-gray-700">
            status size
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="text-blue-500 form-radio"
                value="true"
                checked={isChecked}
                onChange={handleRadioChange}
              />
              <span className="ml-2">Cũ</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                className="text-blue-500 form-radio"
                value="false"
                checked={!isChecked}
                onChange={handleRadioChange}
              />
              <span className="ml-2">Mới</span>
            </label>
          </div>
          <div className="flex gap-3 mt-10">
            <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700">
              Cập nhật
            </button>
            <Link to="/admin/sizes">
              <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
                Về danh sách
              </button>
            </Link>
          </div>
        </form>
        <div className="h-[100px]"></div>
      </div>
    </div>
  );
};

export default SizeUpdate;
