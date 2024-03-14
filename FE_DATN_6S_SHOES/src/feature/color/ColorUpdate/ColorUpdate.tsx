import { useNavigate, useParams } from "react-router-dom";
import { useGetColorQuery, useUpdateColorMutation } from "../../../api/color";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { IColor } from "./../../../interface/color";
import { LoadingOutlined } from "@ant-design/icons";
import {
  useRemoveImageMutation,
  useUploadImageMutation,
} from "../../../api/upload";
import { Spin, message } from "antd";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ColorUpdate = () => {
  const { id } = useParams<{ id: string | any }>();
  const [isLoadingImage, setIsLoadingImage] = useState<any>(false);
  const [imagesLarge, setImageLarge] = useState<any>({});
  const [publicId, setPublicId] = useState<any>("");
  // useRef
  const fileInputRef = useRef<any>(null);
  const [updateColor] = useUpdateColorMutation();
  const [uploadImageMutation] = useUploadImageMutation();
  const [removeImage] = useRemoveImageMutation();
  const [updateImage] = useUploadImageMutation();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [editorData, setEditorData] = useState("");
  const { data: color } = useGetColorQuery<any>(id);
  const colorData = color?.color;

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
    setError,
    control,
  } = useForm<any>();

  const hasLeadingSpace = (value: any) => /^\s/.test(value);

  useEffect(() => {
    // Thiết lập giá trị mặc định khi có dữ liệu được trả về từ API
    if (colorData) {
      setValue("color_name", colorData.color_name);
      setValue("color_code", colorData.color_code);
      setValue("color_description", colorData.color_description);
      setValue("color_image", colorData.color_image); // Giả sử `color_image` là URL ảnh
    }
    setImageLarge(colorData?.color_image);
  }, [colorData, setValue]);

  const handleFileChangeImage = async (event: any) => {
    const newImages = event.target.files[0];
    const urlImage = URL.createObjectURL(newImages);
    setIsLoadingImage(true);
    try {
      const imagereq: any = { files: newImages, url: urlImage };
      if (publicId && fileInputRef.current) {
        const formDataImageUpdate = new FormData();
        formDataImageUpdate.append("images", newImages);
        const data = await updateImage({
          publicId,
          formDataImageUpdate,
        }).unwrap();
        const result: any = await updateColor({
          ...colorData,
          color_image: data,
        });
        if (result.success) {
          message.success(`${result.message}`);
        }
      }
      setImageLarge(imagereq);
    } catch (error) {
      console.log("Error uploading images: ", error);
    } finally {
      setIsLoadingImage(false);
    }
  };
  const onHandleRemoveImageLarge = async (_id: any) => {
    try {
      const image: any = { ...colorData, color_image: {} };

      const data = await removeImage(_id).unwrap();
      if (data.result) {
        const data: any = await updateColor(image);
        if (data?.data) {
          message.success(`${data.data.message}`);
          await setImageLarge({});
        } else {
          message.error(`${data.message}`);
        }
      } else {
        const data: any = await updateColor(image);
        if (data?.data) {
          message.success(`${data.data.message}`);
        } else {
          await setImageLarge({});
          message.error(`${data.message}`);
        }
      }
    } catch (error: any) {
      message.error(error);
    }
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

  const onHandleUpdateImageLarge = (id: any) => {
    setPublicId(id);
    try {
      if (fileInputRef.current) {
        fileInputRef.current?.click();
      }
    } catch (error: any) {
      message.error(error);
    }
  };

  const navigate = useNavigate();

  const onHandleSubmit = async (color: IColor) => {
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
      color_image: color.color_image ? color.color_image : imagesLarge,
      _id: id,
    };
    // Upload main image if available
    if (imagesLarge && imagesLarge.files) {
      const formDataImage = new FormData();
      formDataImage.append("images", imagesLarge.files);
      const db: any = await uploadImageMutation(formDataImage);
      formData.color_image = db?.data?.urls[0]
        ? db.data.urls[0]
        : colorData.color_image;
    }

    try {
      // Gọi API để cập nhật màu sắc
      const data: any = await updateColor({ ...formData }).unwrap();
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
    <div>
      {isLoadingImage && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}

      {/* Spin component */}
      {isLoadingImage && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}

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
        <h1 className="">Cập nhật Màu sắc</h1>
        <form
          action=""
          className="w-[800px] p-6 bg-slate-100 rounded-xl"
          onSubmit={handleSubmit(onHandleSubmit)}
        >
          {/* Trường nhập liệu cho Tên màu */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Tên màu
            </label>
            <input
              type="text"
              {...register("color_name", {
                required: "Tên màu được bỏ trống ",
                minLength: { value: 2, message: "Tối thiểu 3 kí tự" },
              })}
              className="w-full px-3 py-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Tên màu"
            />
            <div className="text-red-500">
              {errors?.color_name &&
                typeof errors.color_name.message === "string" && (
                  <span>{errors.color_name.message}</span>
                )}
            </div>
          </div>

          {/* Trường nhập liệu cho Mã màu */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Mã màu
            </label>
            <input
              type="text"
              {...register("color_code", {
                required: "Mã màu không được bỏ trống ",
                minLength: { value: 2, message: "Tối thiểu 2 kí tự" },
              })}
              className="w-full px-3 py-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Mã màu"
            />
            <div className="text-red-500">
              {errors?.color_code &&
                typeof errors.color_code.message === "string" && (
                  <span>{errors.color_code.message}</span>
                )}
            </div>
          </div>

          {/* Trường nhập liệu cho Mô tả màu */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Mô tả màu
            </label>
            <Controller
              name="color_description"
              control={control}
              render={({ field }) => (
                <CKEditor
                  editor={ClassicEditor}
                  data={colorData?.color_description || ""}
                  onChange={(e, editor) => {
                    handleEditorChange(e, editor);
                    field.onChange(e);
                  }}
                />
              )}
            />
            <div className="text-red-500">
              {errors?.color_description &&
                typeof errors.color_description.message === "string" && (
                  <span>{errors.color_description.message}</span>
                )}
            </div>
          </div>

          {/* Trường chọn hình ảnh */}
          <article
            aria-label="File Upload Modal"
            className="flex justify-center h-full "
          >
            {imagesLarge && imagesLarge ? (
              <div className="relative w-[300px] h-[250px] col-span-3 border shadow-md bg-gray-200 rounded-lg ">
                <span
                  className="absolute px-2 text-white transition-all duration-300 bg-red-400 border rounded-full cursor-pointer top-2 right-2 hover:bg-red-500"
                  onClick={() =>
                    onHandleRemoveImageLarge(colorData?.color_image?.publicId)
                  }
                >
                  x
                </span>
                <span
                  className="absolute px-2 text-white transition-all duration-300 bg-red-400 border rounded-full cursor-pointer top-2 left-2 hover:bg-red-500"
                  onClick={() => {
                    onHandleUpdateImageLarge(colorData?.color_image?.publicId);
                  }}
                >
                  edit
                </span>
                <input
                  type="file"
                  onChange={handleFileChangeImage}
                  ref={fileInputRef}
                  className="hidden"
                />
                <img
                  src={imagesLarge?.url}
                  className="object-cover w-full h-full"
                  alt="Image"
                />
              </div>
            ) : (
              ""
            )}
            {!imagesLarge && (
              <div className="relative w-[300px] h-[250px] col-span-3 flex justify-center ">
                <div className="w-full px-2 m-4 rounded-lg shadow-xl bg-gray-50">
                  <label className="block mb-2 text-gray-500">
                    File Upload
                  </label>
                  <div className="flex items-center justify-center px-2">
                    <label className="flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                      <div className="flex flex-col items-center justify-center pt-7">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                          Upload Images
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileChangeImage}
                        ref={fileInputRef}
                        className="opacity-0"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </article>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Độ hot
            </label>
            <Controller
              name="color_is_new"
              control={control}
              render={({ field }) => (
                <select {...field}>
                  <option value="true">Bật</option>
                  <option value="false">Tắt</option>
                </select>
              )}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Trạng thái
            </label>
            <Controller
              name="color_status"
              control={control}
              render={({ field }) => (
                <select {...field}>
                  <option value="true">Bật</option>
                  <option value="false">Tắt</option>
                </select>
              )}
            />
          </div>

          {/* Nút gửi form */}
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
          >
            Lưu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ColorUpdate;
