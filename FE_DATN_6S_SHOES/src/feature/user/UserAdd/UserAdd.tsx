import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAdduserMutation } from "../../../api/user";
import { Link, useNavigate } from "react-router-dom";
import IRole from "../../../interface/role";
import { IUser } from "../../../interface/user";
import { useUploadImageMutation } from "../../../api/upload";
import { Spin } from "antd";
import { useGetRolesQuery } from "../../../api/role";
import { LoadingOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
// validate email
const validateEmail = (value: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return "Email không hợp lệ";
  }
  return true;
};

const UserAdd = () => {
  const [imagesLarge, setImageLarge] = useState<any>({});
  const [addUser] = useAdduserMutation<any>();
  const navigate = useNavigate();
  const genderOptions = ["Nam", "Nữ", "Khác"];
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<IUser>();
  const { data: roleData } = useGetRolesQuery<any>();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [uploadImage] = useUploadImageMutation();

  const hasLeadingSpace = (value: any) => /^\s/.test(value);

  const handleFileChangeImage = async (event: any) => {
    const newImages = event.target.files[0];
    const urlImage = URL.createObjectURL(newImages);
    try {
      const imagereq: any = { files: newImages, url: urlImage };
      setImageLarge(imagereq);
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
      };
      const data: any = await addUser(formData).unwrap();
      if (data.success === true) {
        navigate("/admin/users");
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

      {/* Spin component */}
      {isLoadingButton && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <div>
        <h1 className="text-center font-medium text-gray-900 uppercase text-[28px]">
          Thêm tài khoản
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
                    Ngày sinh
                  </label>
                  <br />
                  <input
                    type="date" // Loại input cho ngày sinh
                    {...register("user_date_of_birth", {
                      required: "Ngày sinh không được bỏ trống",
                    })}
                    className=" shadow-sm w-full px-3 py-3 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                  />
                  {errors.user_date_of_birth && (
                    <span className="text-red-700">
                      {errors.user_date_of_birth.message as any}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Mật khẩu
                  </label>
                  <br />
                  <input
                    type="password"
                    {...register("user_password", {
                      required: "Mật khẩu không được bỏ trống",
                      minLength: { value: 6, message: "Tối thiểu 6 kí tự" },
                    })}
                    className=" shadow-sm w-full px-3 py-3 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                    placeholder="*********"
                  />
                  {errors.user_password && (
                    <span className="text-red-700">
                      {errors.user_password.message as any}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Xác nhận mật khẩu
                  </label>
                  <br />
                  <input
                    type="password"
                    {...register("user_confirmPassword", {
                      required: "Xác nhận mật khẩu không được bỏ trống",
                      validate: value =>
                        value === watch("user_password") ||
                        "Mật khẩu xác nhận không trùng khớp",
                    })}
                    className=" shadow-sm w-full px-3 py-3 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                    placeholder="*********"
                  />
                  {errors.user_confirmPassword && (
                    <span className="text-red-700">
                      {errors.user_confirmPassword.message as any}
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
                      minLength: { value: 2, message: "Tối thiểu #{limit} ký tự" }
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
                  to="/admin/users"
                  className="px-2 py-2 text-white transition-all duration-200 bg-gray-500 rounded-sm right-10 hover:bg-gray-600"
                >
                  Quay lại
                </Link>

                <button className="px-6 mr-auto text-white transition-all duration-200 bg-green-500 rounded-sm hover:bg-green-600">
                  {isLoadingButton ? (
                    <div>
                      Đang lưu <Spin />
                    </div>
                  ) : (
                    <div>Lưu</div>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-1 ">
            <label
              htmlFor="dropzone-file"
              className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-100 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              {imagesLarge && imagesLarge.url && (
                <div className="absolute top-0 bottom-0 left-0 right-0 rounded-lg">
                  <span
                    className="absolute px-2 text-white transition-all duration-300 bg-red-400 border rounded-full cursor-pointer hover:bg-red-500"
                    onClick={() => onHandleRemoveImagelarge(imagesLarge?.url)}
                  >
                    x
                  </span>
                  <img
                    src={imagesLarge?.url}
                    className="object-cover w-full h-full"
                    alt="Uploaded"
                  />
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
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                onChange={handleFileChangeImage}
                multiple
                className="hidden"
              />
            </label>
            <div>
              <select
                {...register("role_id", { required: "Vui lòng chọn quyền" })}
                className=" shadow-sm w-full px-3 py-3 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
              >
                <option value="">Chọn vai trò</option>
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

export default UserAdd;
