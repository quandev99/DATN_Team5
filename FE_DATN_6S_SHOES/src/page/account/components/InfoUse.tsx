import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { IUser } from "../../../interface/user";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../../api/user";
import Swal from "sweetalert2";
import { Spin } from "antd";
import { getDecodedAccessToken } from "../../../decoder";

const InfoUser = () => {
  const [token, setToken] = useState<any>({});
  const { data: userData } = useGetUserByIdQuery<any>(token?._id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response: any = await getDecodedAccessToken();
        setToken(response);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng: ", error);
      }
    };
    fetchUser(); // Gọi hàm fetchUser khi component được tạo ra
  }, [userData]);

  const auth = userData?.user;
  const userId = auth?._id;
  const [selectedImage, setSelectedImage] = useState("");
  const [image, setImage] = useState("");
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<IUser>();
  const [isLoading, setIsLoading] = useState(false);
  const { data: user, isLoading: isLoadingData } = useGetUserByIdQuery<any>(userId);
  console.log(isLoadingData);

  const [updateUser] = useUpdateUserMutation();
  const infoUser = user?.user;
  // Khởi đầu giá trị mặc định bằng dữ liệu từ API
  React.useEffect(() => {
    if (infoUser) {
      setValue("user_fullname", infoUser.user_fullname);
      setValue("user_username", infoUser.user_username);
      setValue("user_email", infoUser.user_email);
      setValue("user_gender", infoUser.user_gender);
      setValue("user_phone", infoUser.user_phone);
    }
  }, [infoUser]);

  const onFileChange = async (e: any) => {
    const file = e.target.files[0];
    const formData = {
      images: file,
    };
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
      setSelectedImage(response?.data?.urls[0].url);
      setImage(response?.data?.urls[0]);
    } else {
      setSelectedImage("");
    }
  };
  const validateEmail = (value: string) => {
    // Điều kiện kiểm tra email ở đây
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(value)) {
      return "Email không hợp lệ";
    }
    return true;
  };

  // Hàm xử lý gửi form
  const onSubmit = async (data: IUser) => {
    setIsLoading(true); // Bắt đầu hiển thị trạng thái isLoading
    const formData = {
      ...data,
      _id: userId,
      role_id: infoUser.role_id,
      user_avatar: image || infoUser?.user_avatar,
    };

    try {
      const data: any = await updateUser(formData).unwrap();

      if (data.success === true) {
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
        title: 'Opps!',
        text: `${error?.data?.message}`,
        icon: 'error',
        confirmButtonText: 'Quay lại'
      })
    } finally {
      setIsLoading(false); // Dừng hiển thị trạng thái isLoading
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-bold text-3xl text-center">Thông tin tài khoản</h1>
      <div className="mt-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-y-5 gap-x-5"
        >
          <div className="">
            <label
              htmlFor="user_fullname"
              className="font-bold text-[19px]  mr-5"
            >
              Họ và tên
            </label>
            <Controller
              {...register("user_fullname", {
                required: "Tên danh mục không được bỏ trống ",
                minLength: { value: 3, message: "Tối thiểu 3 kí tự" },
              })}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border border-gray-200  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                />
              )}
            />
            <div className="text-red-500">
              {errors?.user_fullname && errors?.user_fullname?.message}
            </div>
          </div>
          <div className="">
            <label
              htmlFor="user_username"
              className="font-bold text-[19px]  mr-5"
            >
              Tên đăng nhập
            </label>
            <Controller
              {...register("user_username", {
                required: "Tên danh mục không được bỏ trống ",
                minLength: { value: 3, message: "Tối thiểu 3 kí tự" },
              })}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border border-gray-200  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                />
              )}
            />
            <div className="text-red-500">
              {errors?.user_username && errors?.user_username?.message}
            </div>
          </div>
          <div className="">
            <label htmlFor="user_email" className="font-bold text-[19px]  mr-5">
              Email
            </label>
            <Controller
              {...register("user_email", {
                required: "Email không được bỏ trống",
                validate: validateEmail,
              })}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  disabled
                  type="email"
                  className="shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border border-gray-200  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                />
              )}
            />
            <div className="text-red-500">
              {errors?.user_email && errors?.user_email?.message}
            </div>
          </div>
          <div className="">
            <label htmlFor="user_phone" className="font-bold text-[19px]  mr-5">
              Số điện thoại
            </label>
            <Controller
              {...register("user_phone", {
                required: "Số điện thoại không được bỏ trống ",
                minLength: { value: 3, message: "Tối thiểu 3 kí tự" },
              })}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border border-gray-200  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                />
              )}
            />
            <div className="text-red-500">
              {errors?.user_phone && errors?.user_phone?.message}
            </div>
          </div>
          <article
            aria-label="File Upload Modal"
            className="relative h-full col-span-2 flex flex-col bg-white shadow-xl rounded-md"
          >
            <section className="h-full p-8 w-full grid grid-cols-3 gap-10">
              <header className="border-dashed col-span-2 border-2 border-gray-400 flex flex-col justify-center items-center">
                <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                  <span>Vui lòng chọn ảnh đại diện</span>&nbsp;
                </p>

                <input
                  id="hidden-input"
                  name="user_avatar"
                  type="file"
                  onChange={onFileChange}
                />
              </header>
              <ul id="gallery" className="h-auto max-w-[200px] w-full -m-1">
                <div className="h-[200px]">
                  <img
                    src={selectedImage || infoUser?.user_avatar.url}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              </ul>
            </section>
          </article>
          <div>
            <Controller
              name="user_gender"
              control={control}
              defaultValue="Khác" // Đặt giá trị mặc định nếu cần
              render={({ field }) => (
                <div>
                  <label className="font-bold text-[19px]  mr-5">
                    Giới tính
                  </label>
                  <input
                    type="checkbox"
                    checked={field.value === "Nam"} // Kiểm tra giá trị của field
                    onChange={() => {
                      // Thực hiện cập nhật giới tính
                      field.onChange("Nam");
                    }}
                  />
                  <label>Nam</label>

                  <input
                    type="checkbox"
                    checked={field.value === "Nữ"} // Kiểm tra giá trị của field
                    onChange={() => {
                      // Thực hiện cập nhật giới tính
                      field.onChange("Nữ");
                    }}
                  />
                  <label>Nữ</label>

                  <input
                    type="checkbox"
                    checked={field.value === "Khác"} // Kiểm tra giá trị của field
                    onChange={() => {
                      // Thực hiện cập nhật giới tính
                      field.onChange("Khác");
                    }}
                  />
                  <label>Khác</label>
                </div>
              )}
            />
          </div>

          <button
            disabled={isLoading}
            className="border w-52 h-10 col-span-2 rounded-lg bg-green-400 font-bold text-white"
          >
            {isLoading ? (
              <>
                Đang chờ <Spin />
              </>
            ) : (
              " Cập nhật tài khoản"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InfoUser;
