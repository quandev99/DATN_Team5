import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IVerifyToken } from "../../../interface/auth";
import Swal from "sweetalert2";
import { useVerifyTokenMutation } from "../../../api/auth";

const VerifyToken = () => {
  const navigate = useNavigate();
  const [verifyToken] = useVerifyTokenMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IVerifyToken>();

  const onSubmit = async (data: IVerifyToken) => {
    try {
      const action: any = await verifyToken({
        user_email: data.user_email, // Thêm trường user_email
        verifyToken: data.verifyToken,
      });
      if (action.error) {
        Swal.fire({
          title: "Opps!",
          text: "Mã xác nhận không hợp lệ",
          icon: "error",
          confirmButtonText: "Quay lại",
        });
      } else {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Mã xác nhận hợp lệ. Bạn có thể đặt lại mật khẩu ngay.",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/changepasswordforget");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Opps!",
        text: `${error?.data?.message}`,
        icon: "error",
        confirmButtonText: "Quay lại",
      });
    }
  };

  return (
    <div className="mx-auto max-w-1280px h-screen px-4 py-16 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-lg border p-4 bg-gray-50">
        <h1 className="text-center border py-2 shadow-sm rounded-md uppercase bg-gray-50 text-2xl font-bold text-black-600 sm:text-3xl">
          Xác nhận mã
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-0 mt-6 rounded-lg"
        >
          <div className="mb-5">
            <label htmlFor="user_email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                {...register("user_email", {
                  required: "Email không được bỏ trống",
                })}
                className={`w-full outline-none border border-gray-200 p-4 text-sm shadow-sm ${errors.user_email ? "border-red-500" : ""
                  }`}
                placeholder="Email"
              />
            </div>
            {errors.user_email && (
              <p className="text-sm text-red-500">{errors.user_email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="verifyToken" className="sr-only">
              Mã xác minh
            </label>
            <div className="relative">
              <input
                type="text"
                {...register("verifyToken", {
                  required: "Mã xác minh không được bỏ trống",
                })}
                className={`w-full  outline-none border  border-gray-200 p-4 text-sm shadow-sm ${errors.verifyToken ? "border-red-500" : ""
                  }`}
                placeholder="Mã xác minh"
              />
            </div>
            {errors.verifyToken && (
              <p className="text-sm text-red-500">
                {errors.verifyToken.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="block mt-5 w-full rounded-lg bg-gray-700 hover:bg-gray-800 transition-all px-5 py-3 text-sm font-medium text-white"
          >
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyToken;
