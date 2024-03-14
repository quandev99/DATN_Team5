import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useChangePasswordForgetMutation } from "../../../api/auth";
import Swal from "sweetalert2";
import { IChangePasswordForget } from "../../../interface/auth";

const ChangePasswordForget = () => {
  const navigate = useNavigate();
  const [ChangePassword] = useChangePasswordForgetMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IChangePasswordForget>();

  const onSubmit = async (data: IChangePasswordForget) => {
    try {
      const result: any = await ChangePassword(data);

      if (result.error) {
        Swal.fire({
          title: "Oops!",
          text: `Lỗi khi cập nhật mật khẩu: ${result.error.message}`,
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
    <div className="mx-auto max-w-1280px h-screen px-4 py-16 sm:px-6 lg:px-8 bg-gray-100">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-black-600 sm:text-3xl">
          Lấy lại mật khẩu
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-0 mt-6 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-white"
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
              className={`w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm ${errors.user_email ? "border-red-500" : ""
                }`}
              placeholder="Email"
            />
            {errors.user_email && (
              <p className="text-sm text-red-500">
                {errors.user_email.message}
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
              className={`w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm ${errors.newPassword ? "border-red-500" : ""
                }`}
              placeholder="Mật khẩu mới"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
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
              className={`w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm ${errors.rePassword ? "border-red-500" : ""
                }`}
              placeholder="Xác nhận mật khẩu mới"
            />
            {errors.rePassword && (
              <p className="text-sm text-red-500">
                {errors.rePassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="block w-full rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
          >
            {isSuccess ? "Hoàn tất" : "Lấy lại mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForget;
