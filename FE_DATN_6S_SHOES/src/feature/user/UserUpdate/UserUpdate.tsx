import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../../api/user';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IUser } from '../../../interface/user';
import { useRemoveImageMutation, useUpdateImageMutation, useUploadImageMutation } from '../../../api/upload';

import { DatePicker, DatePickerProps, Spin, message } from 'antd';
import { useGetRolesQuery } from '../../../api/role';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import momment from "moment";
import IRole from '../../../interface/role';
import Swal from 'sweetalert2';

// validate email
const validateEmail = (value: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return "Email không hợp lệ";
  }
  return true;
};

const UserUpdate = () => {
  const { id } = useParams<{ id: any }>();
  const [isLoadingImage, setIsLoadingImage] = useState<any>(false);
  const [imagesLarge, setImageLarge] = useState<any>({});
  const [publicId, setPublicId] = useState<any>("");
  // useRef
  const fileInputRef = useRef<any>(null);
  const [removeImage] = useRemoveImageMutation();
  const [updateImage] = useUpdateImageMutation();

  const [updateUser] = useUpdateUserMutation<any>();
  const [user_date_of_birth, setuser_date_of_birth] = useState('');
  const navigate = useNavigate();
  const genderOptions = ['Nam', 'Nữ', 'Khác'];
  const { data: userData } = useGetUserByIdQuery<any>(id);
  const userDetail = userData?.user;
  const { register, handleSubmit, formState: { errors }, watch, reset, setValue, control, setError } = useForm<IUser>();

  const { data: roleData } = useGetRolesQuery<any>();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [uploadImage] = useUploadImageMutation();

  const defaultValue = dayjs(momment(userDetail?.user_date_of_birth).toLocaleString());

  const hasLeadingSpace = (value: any) => /^\s/.test(value);

  useEffect(() => {
    if (userDetail) {
      setValue('user_date_of_birth', userDetail?.user_date_of_birth);
      setImageLarge(userDetail?.user_avatar)
    }
    setImageLarge(userDetail?.user_avatar);
    reset(userDetail)
  }, [userDetail, reset])

  const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
    setuser_date_of_birth(dateString);
  };

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
        const result: any = await updateUser({
          ...userDetail,
          user_avatar: data,
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
    console.log(_id);

    try {
      const image: any = { ...userDetail, user_avatar: {} };
      const dataImage: any = await removeImage(_id).unwrap();
      console.log(dataImage);

      if (dataImage.result) {
        message.success(`${dataImage?.message}`)
        const data: any = await updateUser(image);
        if (data?.user) {
          await setImageLarge({});
        } else {
          message.error(`${data.message}`);
        }
      } else {
        const data: any = await updateUser(image);
        if (data?.user) {
          message.success(`${data.user.message}`);
        } else {
          await setImageLarge({});
          message.error(`${data.message}`);
        }
      }
    } catch (error: any) {
      message.error(error);
    }
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

  const onHandleSubmit = async (userData: any) => {
    setIsLoadingButton(true);

    if (hasLeadingSpace(userData.user_fullname)) {
      setError("user_fullname", {
        type: "text",
        message: "Họ và tên không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (hasLeadingSpace(userData.user_username)) {
      setError("user_username", {
        type: "text",
        message: "Tên đăng nhập không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (hasLeadingSpace(userData.user_address)) {
      setError("user_address", {
        type: "text",
        message: "Địa chỉ không được bắt đầu bằng khoảng trắng",
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

    try {
      const formData = {
        ...userData,
        user_avatar: imageLargeReq,
        role_id: userData.role_id,
        verifyToken: undefined,
        user_date_of_birth: user_date_of_birth ? user_date_of_birth : userData?.user_date_of_birth,
        used_coupons: undefined
      };
      const data: any = await updateUser(formData).unwrap();
      if (data.success === true) {
        navigate("/admin/users")
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
      message.error("Error: " + error.data.message);
    } finally {
      setIsLoadingButton(false);
    }
  }
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
      {isLoadingImage && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}

      {/* Spin component */}
      {isLoadingImage && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <div>
        <h1 className="text-center font-medium text-gray-900 uppercase text-[28px]">
          Cập nhật tài khoản
        </h1>
      </div>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="grid grid-cols-5 py-10 ">
          <div className="grid grid-cols-2 col-span-4 gap-5 min-h-32">
            <div className="col-span-3 rounded-md ">
              <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-2 lg:gap-4">
                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Họ tên
                  </label>
                  <br />
                  <input
                    type="text"
                    {...register("user_fullname", {
                      required: "Họ và tên không được bỏ trống",
                      minLength: { value: 2, message: "Tối thiểu #{limit} ký tự" }
                    })}
                    placeholder="Họ tên ..."
                    className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                  />
                  <div className="text-red-500">
                    {errors?.user_fullname && errors?.user_fullname?.message}
                  </div>
                </div>
                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Tên đăng nhập
                  </label>
                  <br />
                  <input
                    type="text"
                    {...register("user_username", {
                      required: "Tên đăng nhập không được bỏ trống",
                      minLength: { value: 2, message: "Tối thiểu #{limit} ký tự" }
                    })}
                    placeholder="Tên đăng nhập ..."
                    className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                  />
                  {errors.user_username && (
                    <span className="text-red-700">
                      {errors.user_username.message as any}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Email
                  </label>
                  <br />
                  <input
                    type="text"
                    {...register("user_email", {
                      required: "Tên đăng nhập không được bỏ trống",
                      validate: validateEmail,
                    })}
                    disabled
                    placeholder="Email ..."
                    className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                  />
                  {errors.user_email && (
                    <span className="text-red-700">
                      {errors.user_email.message as any}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Số điện thoại
                  </label>
                  <br />
                  <input
                    type="text"
                    {...register("user_phone", {
                      required: "Số điện thoại không được bỏ trống",
                      pattern: {
                        value: /^\d{10}$/, // Kiểm tra xem số điện thoại có 10 chữ số không
                        message: "Số điện thoại không hợp lệ",
                      },
                    })}
                    placeholder="Số điện thoại ..."
                    className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                  />
                  {errors.user_phone && (
                    <span className="text-red-700">
                      {errors.user_phone.message as any}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Giới tính
                  </label>
                  <br />
                  <select
                    {...register("user_gender", {
                      required: "Vui lòng chọn giới tính",
                    })}
                    value={watch("user_gender")}
                    className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                  >
                    <option value="">Chọn giới tính</option>
                    {genderOptions.map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.user_gender && (
                    <span className="text-red-700">
                      {errors.user_gender.message as any}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Sinh nhật
                  </label>
                  <br />
                  <Controller
                    control={control}
                    name="user_date_of_birth"
                    render={() => (
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD"
                        className="shadow-sm bg-white w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                        onChange={onChangeDate}
                        defaultValue={defaultValue}
                      />
                    )}
                  />
                  {errors.user_date_of_birth && (
                    <span className="text-red-700">
                      {errors.user_date_of_birth.message as any}
                    </span>
                  )}
                </div>

                <div className="col-span-2">
                  <label htmlFor="" className="font-bold text-[19px]">
                    Địa chỉ
                  </label>
                  <br />
                  <textarea
                    {...register("user_address", {
                      required: "Địa chỉ không được bỏ trống",
                      minLength: { value: 2, message: "Tối thiểu 2 ký tự" }
                    })}
                    className=" shadow-sm w-full px-3 py-3 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                    placeholder="Địa chỉ"
                  />

                  {errors.user_address && (
                    <span className="text-red-700">
                      {errors.user_address.message as any}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Link
                  to="/admin/roles"
                  className="px-2 py-2 text-white transition-all duration-200 bg-gray-500 rounded-sm right-10 hover:bg-gray-600"
                >
                  Quay lại
                </Link>

                <button className="px-6 mr-auto text-white transition-all duration-200 bg-green-500 rounded-sm hover:bg-green-600">
                  <div>Lưu</div>
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-1 ">
            {/* Trường chọn hình ảnh */}
            <article
              aria-label="File Upload Modal"
              className="flex justify-center"
            >
              {imagesLarge && imagesLarge ? (
                <div className="relative w-full col-span-3 bg-gray-200 border rounded-lg shadow-md ">
                  <span
                    className="absolute px-2 text-white transition-all duration-300 bg-red-400 border rounded-full cursor-pointer top-2 right-2 hover:bg-red-500"
                    onClick={() =>
                      onHandleRemoveImageLarge(userDetail?.user_avatar?.publicId)
                    }
                  >
                    x
                  </span>
                  <span
                    className="absolute px-2 text-white transition-all duration-300 bg-red-400 border rounded-full cursor-pointer top-2 left-2 hover:bg-red-500"
                    onClick={() => {
                      onHandleUpdateImageLarge(userDetail?.user_avatar?.publicId);
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
                <div className="relative w-full h-[250px] col-span-3 flex justify-center ">
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
            <div>
              <select
                {...register("role_id", { required: "Vui lòng chọn quyền" })}
                value={watch("role_id")}
                className=" shadow-sm w-full px-3 py-3 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
              >
                <option>Chọn vai trò</option>
                {roleData?.role?.length > 0 ? (
                  roleData?.role?.map((role: IRole) => (
                    <option key={role._id} value={role._id}>
                      {role.role_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Đang tải danh sách vai trò...
                  </option>
                )}
              </select>
              {errors.role_id && (
                <span className="text-red-700">
                  {errors.role_id.message as any}
                </span>
              )}
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default UserUpdate;
