import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ISignin } from "../../../interface/auth";
import Swal from "sweetalert2";
import { useState } from "react";
import { useLoginMutation } from "../../../api/auth";
import { Spin } from "antd";
import VerifyEmail from "../register/VerifyEmail";

const LoginPage = () => {
  const navigate = useNavigate();
  const [Login] = useLoginMutation();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignin>();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (value: string) => {
    // Điều kiện kiểm tra email ở đây
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(value)) {
      return "Email không hợp lệ";
    }
    return true;
  };

  const onSubmit = async (value: ISignin) => {
    setSpinning(true); // Bắt đầu hiển thị trạng thái isLoading
    try {
      const data: any = await Login(value).unwrap();
      if (data.success === true) {

        await localStorage.setItem("accessToken", JSON.stringify(data?.accessToken));
        navigate("/");
        // const users = data;
        // await localStorage.setItem("accessToken", JSON.stringify(users));
        // if (users?.user?.user_role === "admin") {
        //     navigate("/admin");
        // } else {
        //     navigate("/");
        // }
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: `${data.message}`,
          showConfirmButton: false,
          timer: 2000
        })
        return;
      } else if (data.success === 1) {
        setEmail(value?.user_email);
        Swal.fire({
          title: "Tài khoản chưa được kích hoạt",
          text: `${data.message}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Đồng ý!"
        }).then((result) => {
          if (result.isConfirmed) {
            setOpen(true)
          }
        });
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
      setSpinning(false); // Dừng hiển thị trạng thái isLoading
    }
  };
  return (
    <section className="bg-gray-50">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <main
          className=" flex items-center  justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl bg-white p-10 mx-7 shadow rounded-md">
            <div>
              <div>
                <img src="" alt="" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h1 className="font-bold text-[12px] lg:text-[27px]">Chào mừng trở lại</h1>
                  <Link className="bg-gray-100 rounded-md px-2 py-1 hover:bg-green-50" to={`/`}>Trang chủ</Link>
                </div>
                <div className="flex items-center gap-2 text-[13px] mt-2 mb-5">
                  <p className="font-[300] text-gray-500 lg:block hidden">Bắt đầu trang web của bạn trong vài giây. Bạn chưa có tài khoản?</p>
                  <p className="font-[300] text-gray-500 block lg:hidden">Bạn chưa có tài khoản?</p>
                  <Link className="text-blue-700 " to={'/register'}>Đăng ký</Link>
                </div>
              </div>
            </div>
            <VerifyEmail setOpen={setOpen} open={open} email={email} />
            <form action="#" className=" grid grid-cols-6 gap-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="col-span-6 sm:col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="user_email"
                  {...register("user_email", {
                    required: "Email không được bỏ trống",
                    validate: validateEmail,
                  })}
                  name="user_email"
                  placeholder="ngoc@gmail.com"
                  className="py-3 bg-gray-50 mt-2 outline-none border px-2 w-full rounded-md border-gray-200  text-sm text-gray-700 shadow-sm"
                />
                <div className="text-red-500 text-[14px] absolute">
                  {errors?.user_email && errors?.user_email?.message}
                </div>
              </div>

              <div className="col-span-6 sm:col-span-6">
                <label
                  htmlFor="user_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="user_password"
                    {...register("user_password", {
                      required: "Mật khẩu không được để trống!",
                      minLength: { value: 6, message: "Tối thiểu 6 kí tự" },
                    })}
                    name="user_password"
                    placeholder="******"
                    className="py-3 bg-gray-50 mt-2 outline-none border px-2 w-full rounded-md border-gray-200  text-sm text-gray-700 shadow-sm"
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 end-0 grid place-content-center px-4 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </svg>
                  </span>
                </div>
                <div className="text-red-500 text-[14px] absolute">
                  {errors?.user_password && errors?.user_password?.message}
                </div>
              </div>


              <div className="flex items-center mt-2 lg:w-[490px] col-span-6">
                <p className="flex-1 border-t-2 border-gray-200  w-full" />
                <div className="mx-4 text-gray-500">or</div>
                <p className="flex-1 border-t-2 border-gray-200" />
              </div>

              <div className="col-span-6 text-center lg:flex items-center justify-between">
                <div></div>
                {/* <label htmlFor="MarketingAccept" className="flex gap-4">
                  <input
                    type="checkbox"
                    id="MarketingAccept"
                    name="marketing_accept"
                    className="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm"
                  />
                  <span className="text-sm text-gray-700">
                    Nhớ tài khoản
                  </span>
                </label> */}
                <Link className="text-blue-600" to={'/forget-password'}>Quên mật khẩu?</Link>
              </div>

              {/* <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
              <p>Mã xác minh</p>
              <input type="text" className="border outline-none px-2 py-1 w-[150px] rounded-sm shadow" placeholder="Mã xác minh " />
              <button><GrPowerReset /></button>
            </div> */}

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  disabled={spinning}
                  className="inline-block w-full shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                >
                  {spinning ? (<>
                    Đang đăng nhập <Spin />
                  </>) : "Đăng nhập"}
                </button>
              </div>
            </form>
          </div>
        </main>
        <section
          className="relative flex  items-end  lg:col-span-5 lg:h-full xl:col-span-5"
        >
          <div className="bg-white">
            <img
              alt="Night"
              src="https://res.cloudinary.com/djlylbhrb/image/upload/v1699719393/fdazcmy28swjvguscnad.png"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
          </div>
        </section>
      </div>
    </section >
  );
};
export default LoginPage;
