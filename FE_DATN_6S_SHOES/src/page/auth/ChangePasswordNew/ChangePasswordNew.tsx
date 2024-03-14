import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useChangePasswordNewMutation } from "../../../api/auth"; // Đảm bảo import đúng hàm mutation
import Swal from "sweetalert2";
import { IChangePasswordNew } from "../../../interface/auth";
import { getDecodedAccessToken } from "../../../decoder";
import { useGetUserByIdQuery } from "../../../api/user";

const ChangePasswordNew = () => {
  const navigate = useNavigate();
  const [ChangePassword] = useChangePasswordNewMutation<any>(); // Sử dụng hàm mutation cho chức năng đổi mật khẩu
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<any>();
  const token: any = getDecodedAccessToken();

  const { data: userData } = useGetUserByIdQuery<any>(token?._id)
  const userDetail = useMemo(() => userData?.user, [userData]);
  console.log(userData);

  useEffect(() => {
    if (userData) {
      setValue("user_email", userDetail.user_email)
    }
  }, [userData, setValue])


  const onSubmit: any = async (data: IChangePasswordNew) => {
    try {
      const result: any = await ChangePassword(data); // Gọi hàm mutation cho chức năng đổi mật khẩu
      if (result.error) {
        Swal.fire({
          title: "Oops!",
          text: "Lỗi khi cập nhật mật khẩu",
          icon: "error",
          confirmButtonText: "Quay lại",
        });
      } else {
        setIsSuccess(true);
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Đổi mật khẩu thành công, bạn có thể đăng nhập!",
          showConfirmButton: false,
          timer: 2000,
        });

        setTimeout(() => {
          localStorage.removeItem("accessToken");
          window.location.reload();
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      Swal.fire({
        title: "Oops!",
        text: `${error?.data?.message}`,
        icon: "error",
        confirmButtonText: "Quay lại",
      });
    }
  };

  return (
    <div className="mx-auto max-w-1280px h-screen px-4 py-16 sm:px-6 lg:px-8 ">
      <div className="mx-auto max-w-lg bg-white">
        <h1 className="text-center uppercase text-2xl py-2 border border-gray-100 shadow-sm font-bold text-black-600 sm:text-3xl">
          Đổi mật khẩu
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-0 mt-6 rounded-lg p-4 shadow-lg sm:p-6 "
        >

          <div>
            <label htmlFor="user_email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              {...register("user_email", {
                required: "Email không được bỏ trống",
              })}
              disabled
              className={`w-full outline-none border my-2 rounded-lg border-gray-200 p-4 text-sm shadow-sm ${errors.user_email ? "border-red-500" : ""
                }`}
              placeholder="Email"
            />
            {errors.user_email && (
              <p className="text-sm text-red-500">
                {errors.user_email.message as any}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="user_password" className="sr-only">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              {...register("user_password", {
                required: "Mật khẩu hiện tại không được bỏ trống",
              })}
              className={`w-full outline-none border my-2 rounded-lg border-gray-200 p-4 text-sm shadow-sm ${errors.user_password ? "border-red-500" : ""
                }`}
              placeholder="Mật khẩu hiện tại"
            />
            {errors.user_password && (
              <p className="text-sm text-red-500">
                {errors.user_password.message as any}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="newPassword" className="sr-only">
              Mật khẩu mới
            </label>
            <input
              type="password"
              {...register("newPassword", {
                required: "Mật khẩu mới không được bỏ trống",
              })}
              className={`w-full outline-none border my-2 rounded-lg border-gray-200 p-4 text-sm shadow-sm ${errors.newPassword ? "border-red-500" : ""
                }`}
              placeholder="Mật khẩu mới"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message as any}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="rePassword" className="sr-only">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              {...register("rePassword", {
                required: "Xác nhận mật khẩu mới không được bỏ trống",
                validate: (value) =>
                  value === watch("newPassword") ||
                  "Mật khẩu mới và xác nhận không trùng khớp",
              })}
              className={`w-full outline-none border my-2 rounded-lg border-gray-200 p-4 text-sm shadow-sm ${errors.rePassword ? "border-red-500" : ""
                }`}
              placeholder="Xác nhận mật khẩu mới"
            />
            {errors.rePassword && (
              <p className="text-sm text-red-500">
                {errors.rePassword.message as any}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="block w-full outline-none border my-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
          >
            {isSuccess ? "Hoàn tất" : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordNew;
