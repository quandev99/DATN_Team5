import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IForgetPassword } from "../../../interface/auth";
import Swal from "sweetalert2";
import { useForgetPasswordMutation } from "../../../api/auth";
import { useState } from "react";
import { Spin } from "antd";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [ForgetPassword] = useForgetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgetPassword>();
  const [isLoadingButton, setIsloadingButton] = useState(false);

  const onSubmit = async (data: IForgetPassword) => {
    setIsloadingButton(true)
    try {
      const action: any = await ForgetPassword(data);

      if (action.error) {
        if (action.error?.data?.message === "Tài khoản người dùng không tồn tại!") {
          Swal.fire({
            title: "Opps!",
            text: "Email không tồn tại. Vui lòng kiểm tra lại!",
            icon: "error",
            confirmButtonText: "Quay lại",
          });
        } else {
          Swal.fire({
            title: "Opps!",
            text: `Lỗi khi gửi email xác nhận: ${action.error.message}`,
            icon: "error",
            confirmButtonText: "Quay lại",
          });
        }
      } else {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Email xác nhận đã được gửi có hạn là 3 phút, bạn hãy kiểm tra nhé.",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/verify-token");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Opps!",
        text: `${error?.data?.message}`,
        icon: "error",
        confirmButtonText: "Quay lại",
      });
    }
    finally {
      setIsloadingButton(false)
    }
  };


  return (
    <div className="mx-auto max-w-1280px h-screen px-4 py-16 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-lg shadow-md border border-gray-100 bg-gray-50 p-4">
        <h1 className="text-center border  py-2 shadow-sm uppercase text-2xl font-bold text-black-600 sm:text-3xl">
          Lấy lại mật khẩu
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-0 mt-6 rounded-lg "
        >
          <div>
            <label htmlFor="user_email" className="sr-only">
              Email
            </label>
            <div className="relative ">
              <input
                type="email"
                {...register("user_email", {
                  required: "Email không được bỏ trống",
                })}
                className={`w-full rounded-sm border mb-5 outline-none border-gray-200 p-4 text-sm shadow-sm ${errors.user_email ? "border-red-500" : ""
                  }`}
                placeholder="Email đã đăng ký"
              />
            </div>
            {errors.user_email && (
              <p className="text-sm text-red-500">{errors.user_email.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="block w-full rounded-lg bg-gray-700 hover:bg-gray-800 transition-all px-5 py-3 text-sm font-medium text-white"
          >
            {isLoadingButton ? (<>
              Đang xử lý <Spin />
            </>) : "Lấy lại mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
