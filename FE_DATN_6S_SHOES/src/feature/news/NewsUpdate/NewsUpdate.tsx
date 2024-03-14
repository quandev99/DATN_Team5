import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetNewByIdQuery, useUpdateNewsMutation } from '../../../api/new';
import { useUploadImageMutation } from '../../../api/upload';
import { useGetProductQuery } from '../../../api/product';
import { IProduct } from '../../../interface/product';
import { useGetusersQuery } from '../../../api/user';
import { IUser } from '../../../interface/user';
import { Controller, useForm } from 'react-hook-form';
import { INew } from '../../../interface/new';
import { Spin } from 'antd';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { LoadingOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';

const NewsUpdate = () => {

  const { id } = useParams();
  const [updateNews] = useUpdateNewsMutation();
  const navigate = useNavigate();
  const [imagesLarge, setImageLarge] = useState<any>({});
  const [uploadImage] = useUploadImageMutation();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [editorData, setEditorData] = useState('');
  const { data: products } = useGetProductQuery<IProduct>();
  const { data: users } = useGetusersQuery<IUser>();
  const { data: news } = useGetNewByIdQuery<any>(id as string);
  const productList = products?.products;
  const userList = users?.users;
  const newData = news?.news;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    control,
    setError
  } = useForm<INew>();

  const hasLeadingSpace = (value: any) => /^\s/.test(value);
  
  useEffect(() => {
    reset(newData);
    setImageLarge(newData?.news_image)
    setValue('product_id', newData?.product_id);
    setValue('user_id', newData?.user_id);
    setValue('news_title', newData?.news_title);
    setValue('news_content', newData?.news_content);
  }, [newData, setValue, reset]);

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
    setEditorData(withoutParagraphTags)
  };

  const removeParagraphTags = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Lấy nội dung trong thẻ body, loại bỏ thẻ p
    const bodyContent = doc.body.textContent || "";

    return bodyContent;
  };

  const onHandleSubmit = async (news: INew) => {
    setIsLoadingButton(true);

    if (hasLeadingSpace(news.news_title)) {
      setError("news_title", {
        type: "text",
        message: "Tiêu đề không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (hasLeadingSpace(editorData)) {
      setError("news_content", {
        type: "text",
        message: "Nội dung không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (editorData === "") {
      setError("news_content", {
        type: "text",
        message: "Nội dung không được để trống",
      });
      setIsLoadingButton(false);
      return;
    }

    if (editorData.length < 2) {
      setError("news_content", {
        type: "text",
        message: "Tối thiểu 2 ký tự",
      });
      setIsLoadingButton(false);
      return;
    }
    
    const selectedProductId = watch("product_id");
    const selectedUserId = watch("user_id");
    // upload image main
    let imageLargeReq = {};
    if (imagesLarge) {
      const formDataImage: any = new FormData();
      formDataImage.append("images", imagesLarge.files);
      const db: any = await uploadImage(formDataImage);
      imageLargeReq = db?.data?.urls[0];
    }
    const formData: any = {
      ...news,
      _id: id,
      news_content: editorData === '' ? newData.news_content : editorData,
      news_image: imageLargeReq,
      product_id: selectedProductId === "" ? undefined : selectedProductId,
      user_id: selectedUserId === "" ? undefined : selectedUserId,
    };

    try {
      const data: any = await updateNews(formData).unwrap();
      if (data) {
        navigate("/admin/news")
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
      {isLoadingButton && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}

      {/* Spin component */}
      {isLoadingButton && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <div>
        <h1 className="text-center font-medium text-gray-900 text-[30px]">
          Sửa bài viết
        </h1>
      </div>
      <form onSubmit={handleSubmit(onHandleSubmit as any)}>
        <div className="flex absolute right-10 gap-2 mt-[-10px]">
          <Link
            to="/admin/news"
            className="px-2 py-2 mr-auto text-white transition-all duration-200 bg-gray-500 rounded-sm right-10 hover:bg-gray-600"
          >
            Quay lại
          </Link>
          <button type="submit" className="px-6 mr-auto text-white transition-all duration-200 bg-green-500 rounded-sm hover:bg-green-600">
            Lưu
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 py-10 lg:grid-cols-2 lg:gap-8">
          <div className="min-h-32 lg:col-span-3">
            <div className="rounded-md shadow-md bg-gray-50">
              <div className="grid grid-cols-2 gap-2 p-4 lg:grid-cols-2 lg:gap-4">
                <div className="col-span-1">
                  <label htmlFor="" className="font-bold text-[19px]">
                    Tiêu đề
                  </label>
                  <br />
                  <input
                    defaultValue={newData?.news_title}
                    type="text"
                    {...register("news_title")}
                    placeholder="Tiêu đề bài viết ..."
                    className=" shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                  />
                  <div className="text-red-500">
                    {errors?.news_title && errors?.news_title?.message}
                  </div>
                </div>
                <div className="col-span-2">
                  <label htmlFor="" className="font-bold text-[19px]">
                    Mô tả danh mục
                  </label>
                  <Controller
                    name="news_content"
                    control={control}
                    render={({ field }) => (
                      <CKEditor
                        editor={ClassicEditor}
                        data={newData?.news_content || ""}
                        onChange={(e, editor) => {
                          handleEditorChange(e, editor);
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  <div className="text-red-500">
                    {errors?.news_content && errors?.news_content?.message}
                  </div>
                </div>
                <div className="col-span-1">
                  <label htmlFor="" className="font-bold text-[19px]">
                    Sản phẩm
                  </label>
                  <br />
                  <select
                    {...register("product_id")}
                    value={watch("product_id")} // Lấy giá trị hiện tại của brand_id
                    onChange={(e) => setValue("product_id", e.target.value)}
                    className="shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                  >
                    <option value="">Chọn</option>
                    {productList?.map((product: IProduct) => (
                      <option key={product._id} value={product._id}>
                        {product.product_name}
                      </option>
                    ))}
                  </select>
                  <div className="text-red-500">
                    {errors?.product_id && errors?.product_id?.message}
                  </div>
                </div>
                <div className="col-span-1">
                  <label htmlFor="" className="font-bold text-[19px]">
                    Tài khoản
                  </label>
                  <br />
                  <select
                    {...register("user_id")}
                    value={watch("user_id")} // Lấy giá trị hiện tại của brand_id
                    onChange={(e) => setValue("user_id", e.target.value)}
                    className="shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                  >
                    <option value="">Chọn</option>
                    {userList?.map((user: IUser) => (
                      <option key={user._id} value={user._id}>
                        {user.user_username}
                      </option>
                    ))}
                  </select>
                  <div className="text-red-500">
                    {errors?.user_id && errors?.user_id?.message}
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
  )
}

export default NewsUpdate