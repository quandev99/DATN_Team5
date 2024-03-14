import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddColorMutation } from "../../../api/color";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { Spin } from "antd";
import { IColor } from "../../../interface/color";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { LoadingOutlined } from '@ant-design/icons';
const ColorAdd = () => {
  const [addColor] = useAddColorMutation();
  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [editorData, setEditorData] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm<IColor>();

  const hasLeadingSpace = (value: any) => /^\s/.test(value);

  const onFileChange = async (e: any) => {
    const file = e.target.files[0];
    console.log("file", file);
    const formData = {
      images: file,
    };
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const response = await axios.post(
        "http://localhost:8080/api/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded:", response.data);
      setSelectedImage(response?.data?.urls[0].url);
      setImage(response?.data?.urls[0]);
    } else {
      setSelectedImage("");
    }
  };
  const navigate = useNavigate();

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

  const onHandleSubmit = async (color: any) => {
    setIsLoadingButton(true);

    if (hasLeadingSpace(color.color_name)) {
      setError("color_name", {
        type: "text",
        message: "Tên màu không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (hasLeadingSpace(color.color_code)) {
      setError("color_code", {
        type: "text",
        message: "Mã màu không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (hasLeadingSpace(editorData)) {
      setError("color_description", {
        type: "text",
        message: "Mô tả không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (editorData === "") {
      setError("color_description", {
        type: "text",
        message: "Mô tả không được để trống",
      });
      setIsLoadingButton(false);
      return;
    }

    if (editorData.length < 2) {
      setError("color_description", {
        type: "text",
        message: "Tối thiểu 2 ký tự",
      });
      setIsLoadingButton(false);
      return;
    }

    const formData = {
      ...color,
      color_description: editorData,
      color_image: image,
    };
    try {
      const data: any = await addColor(formData).unwrap();
      if (data.success === true) {
        navigate("/admin/colors");
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
    <div className="flex flex-col items-center w-full p-5 bg-white rounded-lg shadow-lg">
      {isLoadingButton && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}

      {/* Spin component */}
      {isLoadingButton && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <h1 className="flex justify-center mb-5 text-[30px] font-medium">
        Thêm mới màu
      </h1>
      <form
        onSubmit={handleSubmit(onHandleSubmit as any)}
        action=""
        className="grid w-full grid-cols-2 gap-3"
      >
        <div className="mb-4">
          <label htmlFor="" className="font-bold text-[19px]">
            Màu
          </label>
          <br />
          <input
            type="text"
            {...register("color_name", {
              required: "Tên màu không được bỏ trống ",
              minLength: { value: 2, message: "Tối thiểu 2 kí tự" }
            })}
            placeholder="Name color ..."
            className="shadow-sm w-full px-3 py-4  mt-2 focus:border border focus:borderlue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
          />
          <div className="text-red-500">
            {errors?.color_name && errors?.color_name?.message}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="" className="font-bold text-[19px]">
            Mã màu
          </label>
          <br />
          <input
            type="text"
            {...register("color_code", {
              required: "Tên mã màu không được bỏ trống ",
              minLength: { value: 2, message: "Tối thiểu 2 kí tự" },
            })}
            placeholder="Code color ..."
            className="shadow-sm w-full px-3 py-4  mt-2 focus:border border  focus:borderlue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
          />
          <div className="text-red-500">
            {errors?.color_code && errors?.color_code?.message}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="" className="font-bold text-[19px]">
            Mô tả màu
          </label>
          <Controller
            name="color_description"
            control={control}
            defaultValue=""
            render={() => (
              <CKEditor editor={ClassicEditor} onChange={handleEditorChange} />
            )}
          />
          <div className="text-red-500">
            {errors?.color_description && errors?.color_description?.message}
          </div>
        </div>

        <div className="mb-3 w-96">
          <label
            htmlFor="colorImage"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Ảnh màu
          </label>
          <Controller
            name="color_image"
            control={control}
            // defaultValue={ }
            render={() => (
              <>
                <input
                  type="file"
                  id="color_image"
                  className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                  onChange={onFileChange}
                />
                <img
                  src={
                    selectedImage ||
                    "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
                  }
                  className="w-[300px] h-[300px]"
                  alt=""
                />
              </>
            )}
          />
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700">
            Thêm mới
          </button>
          <Link to={`/admin/colors`}>
            <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
              Về list
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};
export default ColorAdd;
