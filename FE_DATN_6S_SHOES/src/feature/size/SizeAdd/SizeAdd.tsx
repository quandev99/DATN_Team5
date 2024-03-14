import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useAddSizeMutation } from "../../../api/size";
import { ISize } from "../../../interface/size";
import { Spin } from "antd";
import Swal from "sweetalert2";
import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { LoadingOutlined } from '@ant-design/icons';

const SizeAdd = () => {
  const [addSize] = useAddSizeMutation();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [editorData, setEditorData] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm<ISize>();

  const navigate = useNavigate();
  const hasLeadingSpace = (value: any) => /^\s/.test(value);

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

  const onHandleSubmit = async (size: any) => {
    setIsLoadingButton(true);

    if (hasLeadingSpace(size.size_name)) {
      setError("size_name", {
        type: "text",
        message: "Tên kích cỡ không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }
    if (hasLeadingSpace(size.size_code)) {
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

    const formData = {
      ...size,
      size_description: editorData,
    };

    try {
      const data: any = await addSize(formData).unwrap();
      if (data.success === true) {
        navigate("/admin/sizes");
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
    <div className="flex flex-col items-center w-full">
      {isLoadingButton && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}
      {isLoadingButton && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <h1 className="flex justify-center mb-5 text-2xl font-bold">
        Thêm kích cỡ
      </h1>
      <form
        onSubmit={handleSubmit(onHandleSubmit as any)}
        action=""
        className="w-[800px] "
      >
        <div className="mb-4">
          <label htmlFor="" className="font-bold text-[19px]">
            Tên size
          </label>
          <br />
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
          <label htmlFor="" className="font-bold text-[19px]">
            Mã Size
          </label>
          <br />
          <input
            type="text"
            {...register("size_code", {
              required: "Tên mã màu không được bỏ trống ",
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
          <label htmlFor="" className="font-bold text-[19px]">
            Mô tả size
          </label>
          <Controller
            name="size_description"
            control={control}
            defaultValue=""
            render={() => (
              <CKEditor editor={ClassicEditor} onChange={handleEditorChange} />
            )}
          />
          <div className="text-red-500">
            {errors?.size_description && errors?.size_description?.message}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700">
            Thêm mới
          </button>
          <Link to={`/admin/sizes`}>
            <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
              Về list
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};
export default SizeAdd;
