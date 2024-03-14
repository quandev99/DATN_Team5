import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useAddBrandMutation } from "../../../api/brand";
import IBrand from "../../../interface/brand";
import { useUploadImageMutation } from "../../../api/upload";
import { Spin } from "antd";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const BrandAdd = () => {
  const [addBrand] = useAddBrandMutation();
  const navigate = useNavigate();
  const [imagesLarge, setImageLarge] = useState<any>({});
  const [uploadImage] = useUploadImageMutation();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [editorData, setEditorData] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm<IBrand>();

  const hasLeadingSpace = (value: any) => /^\s/.test(value);

  const handleFileChangeImage = async (event: any) => {
    const newImages = event.target.files[0];
    const urlImage = URL.createObjectURL(newImages);
    try {
      const imagereq: any = { files: newImages, url: urlImage };
      setImageLarge(imagereq)
    } catch (error) {
      console.log("Error uploading images: ", error);
    }
  };

  const onHandleRemoveImagelarge = async (url: string) => {
    try {
      if (url) {
        setImageLarge({});
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleEditorChange = (_event: any, editor: any) => {
    const data = editor.getData();
    const withoutParagraphTags = removeParagraphTags(data);
  setEditorData(withoutParagraphTags);
  };

  const removeParagraphTags = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    // Lấy nội dung trong thẻ body, loại bỏ thẻ p
    const bodyContent = doc.body.textContent || "";
    
    return bodyContent
  };

  const onHandleSubmit = async (brand: any) => {
    setIsLoadingButton(true);

    if (hasLeadingSpace(brand.brand_name)) {
      setError("brand_name", {
        type: "text",
        message: "Tên thương hiệu không được bắt đầu bằng khoảng trắng",
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
    

    // upload image main
    let imageLargeReq = {};
    if (imagesLarge) {
      const formDataImage: any = new FormData();
      formDataImage.append("images", imagesLarge.files);
      const db: any = await uploadImage(formDataImage);
      imageLargeReq = db?.data?.urls[0];
    }
    const formData = {
      ...brand,
      brand_description: editorData,
      brand_image: imageLargeReq,
    };

    try {
      const data: any = await addBrand(formData).unwrap();
      if (data.success === true) {
        navigate("/admin/brands")
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
      <div>
        <h1 className="text-center font-medium text-gray-900 text-[30px]">
          Thêm thương hiệu
        </h1>
      </div>
      <form onSubmit={handleSubmit(onHandleSubmit as any)}>
        <div className="flex absolute right-10 gap-2 mt-[-10px]">
          <Link
            to="/admin/brands"
            className="px-2 py-2 mr-auto text-white transition-all duration-200 bg-gray-500 rounded-sm right-10 hover:bg-gray-600"
          >
            Quay lại
          </Link>
          <button className="px-6 mr-auto text-white transition-all duration-200 bg-green-500 rounded-sm hover:bg-green-600">
            {isLoadingButton ? <div>Đang lưu <Spin /></div> : <div>Lưu</div>}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 py-10 lg:grid-cols-2 lg:gap-8">
          <div className="min-h-32 lg:col-span-3">
            <div className="rounded-md shadow-md bg-gray-50">
              <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-2 lg:gap-4">
                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Thương hiệu
                  </label>
                  <br />
                  <input
                    type="text"
                    {...register("brand_name", {
                      required: "Tên Thương hiệu không được bỏ trống ",
                      minLength: { value: 3, message: "Tối thiểu 3 kí tự" },
                    })}
                    placeholder="Tên thương hiệu ..."
                    className=" shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                  />
                  <div className="text-red-500">
                    {errors?.brand_name && errors?.brand_name?.message}
                  </div>
                </div>
                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Mô tả thương hiệu
                  </label>
                  <Controller
                    name="brand_description"
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
                    {errors?.brand_description &&
                      errors?.brand_description?.message}
                  </div>
                </div>

                <div className="bg-white h-auto col-span-2 w-[1000px] mx-auto sm:px-8 md:px-16 sm:py-8">
                  <main className="container h-full max-w-screen-lg mx-auto">
                    <label
                      htmlFor="dropzone-file"
                      className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-100 rounded-lg shadow cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      {imagesLarge && imagesLarge.url && (
                        <div className="absolute top-0 bottom-0 left-0 right-0 rounded-lg">
                          <span
                            className="absolute px-2 text-white transition-all duration-300 bg-red-400 border rounded-full cursor-pointer hover:bg-red-500"
                            onClick={() => onHandleRemoveImagelarge(imagesLarge?.url)}
                          >
                            x
                          </span>
                          <img src={imagesLarge?.url} className="object-cover w-full h-full" alt="Uploaded" />
                        </div>
                      )}
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                      </div>
                      <input id="dropzone-file" type="file" onChange={handleFileChangeImage} multiple className="hidden" />
                    </label>
                  </main>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BrandAdd