import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetByIdBrandQuery,
  useUpdateBrandMutation,
} from "../../../api/brand";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import IBrand from "../../../interface/brand";
import axios from "axios";
import Swal from "sweetalert2";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const BrandAdd = () => {
  const { id } = useParams<{ id: string | any }>();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [updateBrands] = useUpdateBrandMutation();
  const { data: brand } = useGetByIdBrandQuery<any>(id);
  const brandData = brand?.brand;
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [editorData, setEditorData] = useState("");

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
    setError,
    control,
  } = useForm<IBrand>();

  const hasLeadingSpace = (value: any) => /^\s/.test(value);

  useEffect(() => {
    // Thiết lập giá trị mặc định khi có dữ liệu được trả về từ API
    if (brandData) {
      setValue("brand_name", brandData.brand_name);
      setValue("brand_description", brandData.brand_description);
    }
  }, [brandData, setValue]);

  const onFileChange = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("images", file);

    if (file) {
      const response = await axios.post(
        "http://localhost:8080/api/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSelectedImage(response?.data?.urls[0]?.url);
      setImage(response?.data?.urls[0]);
      // Thêm dòng sau để cập nhật giá trị của trường brand_image
      setValue("brand_image", response?.data?.urls[0]?.url);
    } else {
      setSelectedImage("");
    }
  };

  const handleEditorChange = (_event: any, editor: any) => {
    const data = editor.getData();
    const withoutParagraphTags = removeParagraphTags(data);
    setEditorData(withoutParagraphTags)
  };

  const removeParagraphTags = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Lấy nội dung trong thẻ body, loại bỏ thẻ p
    const bodyContent = doc.body.textContent || "";

    return bodyContent;
  };

  const onHandleSubmit = async (brand: IBrand) => {
    setIsLoadingButton(true);

    if (hasLeadingSpace(brand.brand_name)) {
      setError("brand_name", {
        type: "text",
        message: "Tên thương không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (hasLeadingSpace(editorData)) {
      setError("brand_description", {
        type: "text",
        message: "Mô tả không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (editorData === "") {
      setError("brand_description", {
        type: "text",
        message: "Mô tả không được để trống",
      });
      setIsLoadingButton(false);
      return;
    }

    if (editorData.length < 2) {
      setError("brand_description", {
        type: "text",
        message: "Tối thiểu 2 ký tự",
      });
      setIsLoadingButton(false);
      return;
    }

    const formData = {
      ...brand,
      brand_description: editorData,
      brand_image: image || brandData?.brand_image,
      _id: id,
    };
    try {
      // Gọi API để cập nhật màu sắc
      const data: any = await updateBrands({ ...formData }).unwrap();
      if (data.success === true) {
        navigate("/admin/brands");
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
    <div className="overflow-x-auto ">
      {isLoadingButton && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}
      {isLoadingButton && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <div>
        <h1 className="text-center font-medium text-gray-900 text-[30px]">
          Cập nhật thương hiệu
        </h1>
      </div>
      <form
        action=""
        onSubmit={handleSubmit(onHandleSubmit)}
        onChange={onFileChange}
      >
        <div className="flex absolute right-10 gap-2 mt-[-10px]">
          <Link
            to="/admin/brands"
            className="bg-gray-500 px-2 py-2 rounded-sm mr-auto  right-10 text-white hover:bg-gray-600 transition-all duration-200"
          >
            Quay lại
          </Link>
          <button className="bg-green-500 px-6   rounded-sm mr-auto   text-white hover:bg-green-600 transition-all duration-200">
            Cập nhật
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 py-10">
          <div className="min-h-32 lg:col-span-3">
            <div className=" rounded-md">
              <div className="grid grid-cols-1  gap-2 lg:grid-cols-2 lg:gap-4 p-4">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-gray-700">
                    Tên thương hiệu
                  </label>
                  <input
                    type="text"
                    {...register("brand_name", {
                      required: "Tên thương hiệu không được bỏ trống ",
                      minLength: { value: 3, message: "Tối thiểu 3 kí tự" },
                    })}
                    className="w-full px-3 py-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    placeholder="Tên thương hiệu"
                  />
                  <div className="text-red-500">
                    {errors?.brand_name && errors?.brand_name?.message}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-gray-700">
                    Mô tả thương hiệu
                  </label>
                  <Controller
                    name="brand_description"
                    control={control}
                    render={({ field }) => (
                      <CKEditor
                        editor={ClassicEditor}
                        data={brandData?.brand_description || ""}
                        onChange={(e, editor) => {
                          handleEditorChange(e, editor);
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  <div className="text-red-500">
                    {errors?.brand_description &&
                      errors?.brand_description?.message}
                  </div>
                </div>

                <article
                  aria-label="File Upload Modal"
                  className="relative h-full flex flex-col bg-white shadow-xl rounded-md col-span-2"
                >
                  <section className="h-full p-8 w-full grid grid-cols-3 gap-10">
                    <header className="border-dashed col-span-2 border-2 border-gray-400 flex flex-col justify-center items-center">
                      <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                        <span>Vui lòng chọn ảnh thương hiệu</span>&nbsp;
                      </p>

                      <input
                        id="hidden-input"
                        name="brand_image"
                        type="file"
                        onChange={onFileChange}
                      />
                    </header>
                    <ul
                      id="gallery"
                      className="h-auto max-w-[200px] w-full -m-1"
                    >
                      <div className="h-[200px]">
                        <img
                          src={selectedImage || brandData?.brand_image?.url}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                    </ul>
                  </section>
                </article>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BrandAdd;
