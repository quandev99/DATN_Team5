import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useAddProductsMutation, useGetAllGroupQuery } from "../../../api/product";
import { IProduct } from "../../../interface/product";
import { useGetBrandsQuery } from "../../../api/brand";
import { useGetCategoryQuery } from "../../../api/category";
import IBrand from "../../../interface/brand";
import { ICategory } from "../../../interface/category";
import { useUploadImageMutation } from "../../../api/upload";
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { IGroup } from "../../../interface/group";
import Swal from "sweetalert2";

const ProductAdd = () => {
  // event
  const [uploadImageMutation] = useUploadImageMutation();
  const [addProduct] = useAddProductsMutation()
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [editorDataShort, setEditorDataShort] = useState("");
  const [editorDataLong, setEditorDataLong] = useState("");

  const { data: dataBrand } = useGetBrandsQuery<any>();
  const { data: dataCategory } = useGetCategoryQuery<ICategory>();
  const { data: dataGroup } = useGetAllGroupQuery<IGroup>();
  const brandList = dataBrand?.brands;
  const categoryList: any = dataCategory?.categories;
  const groupList = dataGroup?.groups;


  // image
  const [imagesUpload, setImageUpload] = useState<{ files: File[], url: string[] } | any>(null);
  const [imagesLarge, setImageLarge] = useState<any>({});

  //react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setError
  } = useForm<IProduct>();

  const hasLeadingSpace = (value: any) => /^\s/.test(value);

  const handleShortDescriptionChange = (_event: any, editor: any) => {
    const data = editor.getData();
    const withoutParagraphTags = removeParagraphTags(data);
    setEditorDataShort(withoutParagraphTags);
  };

  const handleLongDescriptionChange = (_event: any, editor: any) => {
    const data = editor.getData();
    const withoutParagraphTags = removeParagraphTags(data);
    setEditorDataLong(withoutParagraphTags);
  };

  const removeParagraphTags = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Lấy nội dung trong thẻ body, loại bỏ thẻ p
    const bodyContent = doc.body.textContent || "";

    return bodyContent
  };

  const handleFileChangeImage = (event: any) => {
    const newImages = event.target.files[0];
    const urlImage = URL.createObjectURL(newImages);
    const imagereq: any = { files: newImages, url: urlImage };
    setImageLarge(imagereq)
  };

  const handleFileChange = async (event: any) => {
    const newImages = event.target.files ? Array.from(event.target.files) : []
    const oldImages = imagesUpload ? imagesUpload.files : [];
    // Kết hợp danh sách ảnh cũ với danh sách ảnh mới
    const combinedImages = [...oldImages, ...newImages];

    if (combinedImages.length > 12) {
      const sliceImage = combinedImages.slice(0, 12);
      message.error("Số lượng chỉ cho phép 12 ảnh. Nếu vượt quá số ảnh cho phép thì chỉ lấy được 12 ảnh đầu tiên");
      const imageUrls = sliceImage.map((file: any) => URL.createObjectURL(file));
      const imagereq: any = { files: sliceImage, url: imageUrls };
      setImageUpload(imagereq);
    } else {
      const imageUrls = combinedImages.map((file: any) => URL.createObjectURL(file));
      const imagereq: any = { files: combinedImages, url: imageUrls };
      setImageUpload(imagereq);
    }
  };

  const onHandleRemoveImage = async (index: number) => {
    try {
      const fileImage = [...imagesUpload.files];
      const urlImage = [...imagesUpload.url];
      fileImage.splice(index, 1);
      urlImage.splice(index, 1);
      const updatedImages = { files: fileImage, url: urlImage };
      setImageUpload(updatedImages);

    } catch (error) {
      console.log(error);
    }
  }

  const onHandleRemoveImagelarge = (event: any) => {
    event.stopPropagation();
    setImageLarge({});
  }

  const onHandleSubmit = async (product: any) => {
    setIsLoading(true);

    if (hasLeadingSpace(product.product_name)) {
      setError("product_name", {
        type: "text",
        message: "Tên sản phẩm không được bắt đầu bằng khoảng trắng",
      });
      setIsLoading(false);
      return;
    }

    if (hasLeadingSpace(product.product_code)) {
      setError("product_code", {
        type: "text",
        message: "Mã sản phẩm không được bắt đầu bằng khoảng trắng",
      });
      setIsLoading(false);
      return;
    }

    if (hasLeadingSpace(editorDataShort)) {
      setError("product_description_short", {
        type: "text",
        message: "Mô tả không được bắt đầu bằng khoảng trắng",
      });
      setIsLoading(false);
      return;
    }

    if (editorDataShort === "") {
      setError("product_description_short", {
        type: "text",
        message: "Mô tả không được để trống",
      });
      setIsLoading(false);
      return;
    }

    if (editorDataShort.length < 2) {
      setError("product_description_short", {
        type: "text",
        message: "Tối thiểu 2 ký tự",
      });
      setIsLoading(false);
      return;
    }

    if (editorDataShort.length > 255) {
      setError("product_description_short", {
        type: "text",
        message: "Tối thiểu 2 ký tự",
      });
      setIsLoading(false);
      return;
    }


    if (hasLeadingSpace(editorDataLong)) {
      setError("product_description_long", {
        type: "text",
        message: "Mô tả dài không được bắt đầu bằng khoảng trắng",
      });
      setIsLoading(false);
      return;
    }

    if (editorDataLong === "") {
      setError("product_description_long", {
        type: "text",
        message: "Mô tả không được để trống",
      });
      setIsLoading(false);
      return;
    }

    if (editorDataLong.length < 2) {
      setError("product_description_long", {
        type: "text",
        message: "Tối thiểu 2 ký tự",
      });
      setIsLoading(false);
      return;
    }

    if (editorDataLong.length > 5000) {
      setError("product_description_long", {
        type: "text",
        message: "Tối đa 5000 ký tự",
      });
      setIsLoading(false);
      return;
    }

    const selectedCategoryId = watch("category_id");
    const selectedBrandId = watch("brand_id");
    const selectedGroupId = watch("group_id");

    const uploadPromises = imagesUpload?.files?.map((file: any) => {
      const formData = new FormData();
      formData.append("images", file);
      return uploadImageMutation(formData);
    });

    let updatedImages = []; // Default to an empty array

    if (uploadPromises) {
      const data = await Promise.all(uploadPromises);
      updatedImages = data.map((item: any) => item?.data?.urls[0]);
    }

    // upload image main
    let imageLargeReq = {};
    if (imagesLarge) {
      const formDataImage = new FormData();
      formDataImage.append("images", imagesLarge.files);
      const db: any = await uploadImageMutation(formDataImage);
      imageLargeReq = db?.data?.urls[0];
    }

    try {
      const formData: IProduct = {
        ...product,
        brand_id: selectedBrandId === "" ? undefined : selectedBrandId,
        category_id: selectedCategoryId === "" ? undefined : selectedCategoryId,
        group_id: selectedGroupId === "" ? undefined : selectedGroupId,
        product_image: imageLargeReq,
        thumbnail: updatedImages,
        product_description_short: editorDataShort,
        product_description_long: editorDataLong
      };

      const data: any = await addProduct(formData).unwrap();
      if (data.success === true) {
        navigate(`/admin/products/${data?.product?._id}/update`)
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
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}

      {/* Spin component */}
      {isLoading && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <div className="overflow-x-auto ">
        <div>
          <h1 className="text-center font-medium text-gray-900 text-[30px]">
            Thêm sản phẩm
          </h1>
        </div>
        <form onSubmit={handleSubmit(onHandleSubmit)}>
          <div className="py-10 ">
            <div className="w-full gap-5 min-h-32">
              <div className="border border-gray-100 rounded-md shadow-md bg-gray-50">
                <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-2 lg:gap-4">
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Tên sản phẩm
                    </label>
                    <br />
                    <input
                      type="text"
                      {...register("product_name", {
                        required: "Tên sản phẩm không được bỏ trống ",
                        minLength: { value: 2, message: "Tên sản phẩm tối thiểu 2 kí tự" },
                      })}
                      placeholder="Tên sản phẩm ..."
                      className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                    />
                    <div className="text-red-500">
                      {errors?.product_name && errors?.product_name?.message}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Mã sản phẩm
                    </label>
                    <br />
                    <input
                      type="text"
                      {...register("product_code", {
                        required: "Tên sản phẩm không được bỏ trống ",
                        minLength: { value: 3, message: "Tối thiểu 3 kí tự" },
                      })}
                      placeholder="Tên sản phẩm ..."
                      className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                    />
                    <div className="text-red-500">
                      {errors?.product_code && errors?.product_code?.message}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Mô tả ngắn
                    </label>
                    <Controller
                      name="product_description_short"
                      control={control}
                      defaultValue=""
                      render={() => (
                        <CKEditor
                          editor={ClassicEditor}
                          onChange={handleShortDescriptionChange}
                        />
                      )}
                    />
                    <div className="text-red-500">
                      {errors?.product_description_short && errors?.product_description_short?.message}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Mô tả dài
                    </label>
                    <br />
                    <Controller
                      name="product_description_long"
                      control={control}
                      defaultValue=""
                      render={() => (
                        <CKEditor
                          editor={ClassicEditor}
                          onChange={handleLongDescriptionChange}
                        />
                      )}
                    />
                    <div className="text-red-500">
                      {errors?.product_description_long && errors?.product_description_long?.message}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Danh mục
                    </label>
                    <br />
                    <select
                      {...register("category_id")}
                      className="shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                    >
                      <option value="">Chọn</option>
                      {categoryList?.map((cate: ICategory) => (
                        <option key={cate._id} value={cate._id}>
                          {cate.category_name}
                        </option>
                      ))}
                    </select>
                    <div className="text-red-500">
                      {errors?.category_id && errors?.category_id?.message}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Thương hiệu
                    </label>
                    <br />
                    <select
                      {...register("brand_id")}
                      className="shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                    >
                      <option value="">Chọn</option>
                      {brandList?.map((brand: IBrand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.brand_name}
                        </option>
                      ))}
                    </select>
                    <div className="text-red-500">
                      {errors?.brand_id && errors?.brand_id?.message}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Nhóm sản phẩm
                    </label>
                    <br />
                    <select
                      {...register("group_id")}
                      className="shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                    >
                      <option value="">Chọn</option>
                      {groupList?.map((group: IGroup) => (
                        <option key={group._id} value={group._id}>
                          {group.group_name}
                        </option>
                      ))}
                    </select>
                    <div className="text-red-500">
                      {errors?.brand_id && errors?.brand_id?.message}
                    </div>
                  </div>
                  {/* {isDateSale ? (
                    <div>
                      <label htmlFor="" className="font-bold text-[19px]">
                        Thời gian hết hạn
                      </label>
                      <br />
                      <div className="">
                        <DatePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          className="shadow-sm bg-white w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                          onChange={onChangeDate} />
                      </div>
                      <div className="text-red-500">
                        {errors?.product_name && errors?.product_name?.message}
                      </div>
                    </div>
                  ) : <div></div>} */}
                  <div >
                    <label htmlFor="" className="font-bold text-[19px]">Ảnh chính</label>
                    <input
                      className="shadow-sm bg-white w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"

                      id="dropzone-file" type="file" onChange={handleFileChangeImage} />
                  </div>
                  <div
                  >
                    <label htmlFor="" className="font-bold text-[19px]">Ảnh con</label>
                    <input
                      id="hidden-input"
                      type="file"
                      multiple
                      className="shadow-sm bg-white w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="grid grid-cols-10 col-span-2 bg-white">
                    <div className="col-span-3 w-full bg-gray-100  h-[250px]">
                      {(imagesLarge && imagesLarge.url) && (
                        <div className="top-0 bottom-0 left-0 right-0 h-full rounded-lg">
                          <span
                            className="absolute px-2 text-white transition-all duration-300 bg-red-400 border rounded-full cursor-pointer hover:bg-red-500"
                            onClick={onHandleRemoveImagelarge}
                          >
                            x
                          </span>
                          <img src={imagesLarge?.url} className="object-cover w-full h-full" alt="Uploaded" />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-6 col-span-7 ">
                      {imagesUpload && imagesUpload.url.map((image: any, index: number) => {
                        return (
                          <div key={index} className="min-h-[100px]  border shadow-sm bg-gray-200 ">
                            <span
                              className="absolute px-2 text-white transition-all duration-300 bg-red-400 border rounded-full cursor-pointer hover:bg-red-500 " onClick={() => onHandleRemoveImage(index)}>x</span>
                            <img
                              src={image}
                              className="object-cover w-full h-full"
                              alt="Image"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2 ">
                    <Link
                      to="/admin/products"
                      className="px-2 py-2 text-white transition-all duration-200 bg-gray-500 rounded-sm right-10 hover:bg-gray-600"
                    >
                      Quay lại
                    </Link>
                    <button className="px-6 mr-auto text-white transition-all duration-200 bg-green-500 rounded-sm hover:bg-green-600">
                      Thêm
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductAdd