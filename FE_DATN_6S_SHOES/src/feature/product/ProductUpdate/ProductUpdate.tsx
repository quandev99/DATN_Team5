import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useGetAllGroupQuery, useGetProductByIdQuery, useUpdateProductsMutation } from "../../../api/product";
import { IImageProduct, IProduct } from "../../../interface/product";
import { useGetBrandsQuery } from "../../../api/brand";
import { useGetCategoryQuery } from "../../../api/category";
import IBrand from "../../../interface/brand";
import { useRemoveImageMutation, useUpdateImageMutation, useUploadImageMutation } from "../../../api/upload";
import { VariantProductList } from "../variantProduct";
import { ICategory } from "../../../interface/category";
import { Spin, message } from "antd";
import { LoadingOutlined } from '@ant-design/icons';


import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { IGroup } from "../../../interface/group";
import Swal from "sweetalert2";
const ProductUpdate = () => {
  // navigate
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoadingImageThumbnail, setIsLoadingImageThumbnail] = useState(false);
  // image
  const [imagesUpload, setImageUpload] = useState<{ files: File[], url: string[] } | any>(null);
  const [imagesLarge, setImageLarge] = useState<any>({});
  const [publicId, setPublicId] = useState<any>("");
  const [publicIdThumbnail, setPublicIdThumbnail] = useState<any>("");
  const [thumbnail, setThumbnailRes] = useState<any>([]);

  // useRef
  const fileInputRef = useRef<any>(null);
  const fileInputRefThumbnail = useRef<any>(null);
  const [editorDataShort, setEditorDataShort] = useState("");
  const [editorDataLong, setEditorDataLong] = useState("");
  // use get data
  const { data: productData } = useGetProductByIdQuery<any>(id as string);
  const [uploadImageMutation] = useUploadImageMutation();
  const [removeImage] = useRemoveImageMutation();
  const [updateImage] = useUpdateImageMutation();
  const [updateProduct] = useUpdateProductsMutation();
  const { data: dataBrand } = useGetBrandsQuery<any>();
  const { data: dataCategory } = useGetCategoryQuery();
  const { data: dataGroup } = useGetAllGroupQuery<IGroup>();
  const brandList = dataBrand?.brands;
  const categoryList = dataCategory?.categories;
  const groupList = dataGroup?.groups;
  const product: any = productData?.product;

  // react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors },
    setError
  } = useForm<IProduct>({
    defaultValues: {
      product_description_short: product?.product_description_short || '',
      product_description_long: product?.product_description_long || '',
    },
  });

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


  useEffect(() => {
    reset(productData?.product);
    if (product) {
      setValue('category_id', product?.category_id);
      setValue('product_description_short', product.product_description_short || '');
      setValue('product_description_long', product.product_description_long || '');
      setValue('is_on_sale', product?.is_on_sale || false);
    }
    setImageLarge(productData?.product?.product_image)
    setThumbnailRes(productData?.product?.thumbnail)
  }, [productData?.product, setValue, reset]);


  // event image
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
        const result: any = await updateProduct({
          ...product,
          product_image: data,
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
  const handleFileChange = async (event: any) => {
    const newImages = event.target.files ? Array.from(event.target.files) : []
    const oldImages = imagesUpload ? imagesUpload.files : [];

    // Kết hợp danh sách ảnh cũ với danh sách ảnh mới
    const combinedImages = [...oldImages, ...newImages];
    const imageUrls = combinedImages.map((file: any) => URL.createObjectURL(file));
    const imagereq: any = { files: combinedImages, url: imageUrls };
    setIsLoadingImageThumbnail(true);
    try {
      if (publicIdThumbnail && fileInputRefThumbnail.current) {
        const formDataImageUpdate = new FormData();
        formDataImageUpdate.append("images", event?.target?.files[0]);
        const dataThumbnail = await updateImage({
          publicId: publicIdThumbnail,
          formDataImageUpdate,
        }).unwrap();
        const updateThumbnail = product.thumbnail.filter(
          (item: any) => item.publicId !== publicIdThumbnail
        );
        const updatedProduct = {
          ...product,
          thumbnail: [dataThumbnail, ...updateThumbnail],
        };
        // Sử dụng updatedProduct trong update
        const result: any = await updateProduct(updatedProduct);
        console.log("result", result);
        if (result.success) {
          setImageUpload(imagereq);
          message.success(`${result.message}`);
        }
      } else {
        setImageUpload(imagereq);
      }
    } catch (error) {
      console.log("Error uploading images: ", error);
    } finally {
      setIsLoadingImageThumbnail(false);
    }

  };


  // event remove thumbnail
  const onHandleRemoveImage = async (_id: string) => {
    try {
      const data = await removeImage(_id).unwrap();
      if (data.result) {
        const updatedImages: any = thumbnail.filter(
          (image: any) => image.publicId !== _id
        );
        const data: any = await updateProduct({ ...product, thumbnail: updatedImages });
        if (data.success) {
          message.success(`${data.message}`)
        }
        await setThumbnailRes(updatedImages);
      } else {
        const updatedImages = thumbnail.filter(
          (image: any) => image.publicId !== _id
        );
        const data: any = await updateProduct({ ...product, thumbnail: updatedImages });
        if (data.success) {
          message.success(`${data.message}`)
        }
        await setThumbnailRes(updatedImages);
        // alert(`${data.message}`);
      }
    } catch (error: any) {
      message.error(error);
    }
  }

  const onHandleRemoveImage2 = async (index: number) => {
    try {
      const fileImage = [...imagesUpload.files];
      const urlImage = [...imagesUpload.url];
      fileImage.splice(index, 1);
      urlImage.splice(index, 1);
      const updatedImages = { files: fileImage, url: urlImage };
      setImageUpload(updatedImages);
    } catch (error: any) {
      message.error(error);
    }
  }

  // event remove image
  const onHandleRemoveImagelarge = async (_id: string) => {
    try {
      const image: any = { ...product, product_image: {} }

      const data = await removeImage(_id).unwrap();
      if (data.result) {
        const data: any = await updateProduct(image);
        if (data.success) {
          message.success(`${data.message}`)
          await setImageLarge({});
        } else {
          message.error(`${data.message}`);
        }
      } else {
        const data: any = await updateProduct(image);
        if (data.success) {
          message.success(`${data.message}`)
        } else {
          await setImageLarge({});
          message.error(`${data.message}`);
        }
      }
    } catch (error: any) {
      message.error(error);
    }
  }
  const onHandleUpdateImagelarge = async (id: string) => {
    setPublicId(id);
    try {
      if (fileInputRef.current) {
        fileInputRef.current?.click();
      }
    } catch (error: any) {
      message.error(error);
    }
  };
  const onHandleUpdateImageThumbnail = async (id: string) => {
    // console.log("id", id);
    // console.log("fileInputRefThumbnail.current", fileInputRefThumbnail.current);
    setPublicIdThumbnail(id)
    try {
      if (fileInputRefThumbnail.current) {
        fileInputRefThumbnail.current?.click();
      }
    } catch (error: any) {
      message.error(error);
    }
  };

  const onHandleSubmit = async (pro: any) => {
    setIsLoading(true);

    if (hasLeadingSpace(pro.product_name)) {
      setError("product_name", {
        type: "text",
        message: "Tên sản phẩm không được bắt đầu bằng khoảng trắng",
      });
      setIsLoading(false);
      return;
    }
    
    if (hasLeadingSpace(pro.product_code)) {
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

    let formData: any = {
      ...pro,
      brand_id: selectedBrandId === "" ? undefined : selectedBrandId,
      category_id: selectedCategoryId === "" ? undefined : selectedCategoryId,
      group_id: selectedGroupId === "" ? undefined : selectedGroupId,
      product_image: pro.product_image ? pro.product_image : imagesLarge,
      is_on_sale: undefined,
      expiration_date: undefined,
      product_description_short: editorDataShort,
      product_description_long: editorDataLong
    };

    // Upload thumbnail images if available
    if (imagesUpload && imagesUpload.files.length > 0) {
      const uploadPromises = imagesUpload.files.map((file: any) => {
        const formData = new FormData();
        formData.append("images", file);
        return uploadImageMutation(formData);
      });

      const data = await Promise.all(uploadPromises);
      const updatedImages = data.map((item: any) => item?.data?.urls[0]);
      formData.thumbnail = [...thumbnail, ...updatedImages];
    }

    // Upload main image if available
    if (imagesLarge && imagesLarge.files) {
      const formDataImage = new FormData();
      formDataImage.append("images", imagesLarge.files);
      const db: any = await uploadImageMutation(formDataImage);
      formData.product_image = db?.data?.urls[0] ? db.data.urls[0] : product.product_image;
    }

    try {
      const dataRes: any = await updateProduct(formData).unwrap();
      if (dataRes.success === true) {
        navigate("/admin/products")
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: `${dataRes.message}`,
          showConfirmButton: false,
          timer: 2000
        })
        return;
      } else {
        Swal.fire({
          title: 'Opps!',
          text: `${dataRes.message}`,
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


  // html
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
      {isLoadingImage && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}

      {/* Spin component */}
      {isLoadingImage && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      {isLoadingImageThumbnail && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}

      {/* Spin component */}
      {isLoadingImageThumbnail && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <div className="bg-white shadow-md p-5 border rounded-[50px] border-gray-100">
        <h1 className="text-center font-medium text-gray-900 uppercase text-[28px]">
          Cập nhật sản phẩm
        </h1>
        <form onSubmit={handleSubmit(onHandleSubmit as any)}>
          <div className="py-10 ">
            <div className="grid grid-cols-4 gap-5 min-h-32">
              <div className="col-span-3 rounded-md shadow-md bg-gray-50">
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
                        minLength: {
                          value: 2,
                          message: "Tên sản phẩm tối thiểu 2 kí tự",
                        },
                      })}
                      placeholder="Tên sản phẩm ..."
                      className=" shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
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
                      className=" shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                    />
                    <div className="text-red-500">
                      {errors?.product_code && errors?.product_code?.message}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Mô tả ngắn
                    </label>
                    <br />
                    <Controller
                    name="product_description_short"
                    control={control}
                    render={({ field }) => (
                      <CKEditor
                        editor={ClassicEditor}
                        data={productData?.product?.product_description_short || ""}
                        onChange={(e, editor) => {
                          handleShortDescriptionChange(e, editor);
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                    <div className="text-red-500">
                      {errors?.product_description_short &&
                        errors?.product_description_short?.message}
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
                    render={({ field }) => (
                      <CKEditor
                        editor={ClassicEditor}
                        data={productData?.product?.product_description_long || ""}
                        onChange={(e, editor) => {
                          handleLongDescriptionChange(e, editor);
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                    <div className="text-red-500">
                      {errors?.product_description_long &&
                        errors?.product_description_long?.message}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Danh mục
                    </label>
                    <br />
                    <select
                      {...register("category_id")}
                      value={watch("category_id")} // Lấy giá trị hiện tại của category_id
                      onChange={(e) => setValue("category_id", e.target.value)} // Cập nhật giá trị khi người dùng thay đổi select
                      className="shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                    >
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
                      value={watch("brand_id")} // Lấy giá trị hiện tại của brand_id
                      onChange={(e) => setValue("brand_id", e.target.value)}
                      className="shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                    >
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
                      value={watch("group_id")} // Lấy giá trị hiện tại của brand_id
                      onChange={(e) => setValue("group_id", e.target.value)}
                      className="shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                    >
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
                  <div className="flex gap-2 h-[50px] mt-6">
                    <div className="w-[200px] h-full text-center">
                      <Link
                        to="/admin/products"
                        className="block h-full px-5 pt-3 text-center text-white transition-all duration-200 bg-gray-500 rounded-sm right-10 hover:bg-gray-600 "
                      >
                        Quay lại
                      </Link>
                    </div>
                    <div className="w-[200px] h-full">
                      <button
                        disabled={isLoading}
                        className="w-full h-full px-6 text-white transition-all duration-200 bg-green-500 rounded-sm hover:bg-green-600"
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 bg-[#edf1fa] h-screen overflow-auto rounded-lg dark:border-gray-700`}
              >
                <ul id="gallery" className="grid h-auto grid-cols-3 gap-3">
                  {imagesLarge && imagesLarge ? (
                    <div className="relative w-full h-[250px] col-span-3 border shadow-md bg-gray-200">
                      <span
                        className="absolute px-2 text-white transition-all duration-300 bg-red-400 border rounded-full cursor-pointer top-2 right-2 hover:bg-red-500"
                        onClick={() =>
                          onHandleRemoveImagelarge(
                            product?.product_image?.publicId
                          )
                        }
                      >
                        x
                      </span>
                      <span
                        className="absolute px-2 text-white transition-all duration-300 bg-red-400 border rounded-full cursor-pointer top-2 left-2 hover:bg-red-500"
                        onClick={() => {
                          onHandleUpdateImagelarge(
                            product?.product_image?.publicId
                          );
                        }}
                      >
                        edit
                      </span>
                      <input
                        type="file"
                        onChange={handleFileChangeImage}
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
                    <div className="relative w-full h-[250px] col-span-3 flex justify-center">
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
                  {thumbnail &&
                    thumbnail?.map((image: IImageProduct, index: string) => (
                      <div
                        key={index}
                        className="relative w-full h-[80px] border shadow-md bg-gray-200"
                      >
                        <span
                          className="absolute top-1 right-1 text-[13px] border cursor-pointer hover:bg-red-500 text-white transition-all duration-300 rounded-full bg-red-400 px-[6px]"
                          onClick={() => onHandleRemoveImage(image?.publicId)}
                        >
                          x
                        </span>
                        <span
                          className="absolute top-1 left-1 text-[13px] border cursor-pointer hover:bg-red-500 text-white transition-all duration-300 rounded-full bg-red-400 px-1"
                          onClick={() => {
                            onHandleUpdateImageThumbnail(image?.publicId);
                          }}
                        >
                          edit
                        </span>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          ref={fileInputRefThumbnail}
                          className="hidden"
                        />
                        <img
                          src={image?.url}
                          className="object-cover w-full h-full"
                          alt="Image"
                        />
                      </div>
                    ))}
                  {imagesUpload &&
                    imagesUpload?.url?.map((image: string, index: number) => (
                      <div
                        key={index}
                        className="relative min-h-[100px] border shadow-md bg-gray-200"
                      >
                        <span
                          className="absolute px-2 text-white transition-all duration-300 bg-red-400 border rounded-full cursor-pointer top-2 right-2 hover:bg-red-500"
                          onClick={() => onHandleRemoveImage2(index)}
                        >
                          x
                        </span>
                        <img
                          src={image}
                          className="object-cover w-full h-full"
                          alt="Image"
                        />
                      </div>
                    ))}

                  <div className="w-[150px] h-[150px] col-span-3 flex justify-center">
                    <div className="w-full px-2 m-4 rounded-lg shadow-xl bg-gray-50">
                      <label className="block mb-2 text-gray-500">
                        File Upload
                      </label>
                      <div className="flex items-center justify-center px-2">
                        <label className="flex flex-col w-full h-16 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
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
                            onChange={handleFileChange}
                            multiple
                            className="opacity-0"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* sp biến thể */}
      <div className="bg-white px-5 py-10 border rounded-[40px] shadow-lg my-5">
        <VariantProductList />
      </div>
    </div>
  );
}
export default ProductUpdate;