import { useForm } from "react-hook-form";
import { ISignup } from "../../../interface/auth";
import { useRegisterMutation } from "../../../api/auth";
import Swal from 'sweetalert2';
import { useState } from "react";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import VerifyEmail from "./VerifyEmail";

const RegisterPage = () => {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ISignup>();

  const [Register] = useRegisterMutation();

  // validate email
  const validateEmail = (value: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(value)) {
      return "Email không hợp lệ";
    }
    return true;
  };

  const onSubmit = async (value: ISignup) => {
    setSpinning(true);
    try {
      const data: any = await Register(value).unwrap();
      if (data.success === true) {
        setEmail(value?.user_email);
        setOpen(true)
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
      setSpinning(false);
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
                <h1 className="font-bold text-[27px]">Chào người mới</h1>
                <div className="flex items-center gap-2 text-[15px] mt-2 mb-5">
                  <p className="font-[300] text-gray-500">Bắt đầu trang web của bạn trong vài giây. Bạn đã có tài khoản?</p>
                  <Link className="text-blue-700" to={'/login'}>Đăng nhập</Link>
                </div>
              </div>
            </div>
            <VerifyEmail setOpen={setOpen} open={open} email={email} />
            <form action="#" className=" grid grid-cols-6 gap-6" onSubmit={handleSubmit(onSubmit)}>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="user_fullname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Họ tên
                </label>

                <input
                  type="text"
                  id="FirstName"
                  {...register("user_fullname", {
                    required: "Họ và tên không được bỏ trống",
                  })}
                  name="user_fullname"
                  placeholder="Họ tên"
                  className="py-3 bg-gray-50 mt-2 outline-none border px-2 w-full rounded-md border-gray-200  text-sm text-gray-700 shadow-sm"
                />
                <div className="text-red-500 text-[14px] absolute">
                  {errors?.user_fullname && errors?.user_fullname?.message}
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="user_username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên đăng nhập
                </label>

                <input
                  type="text"
                  id="user_username"
                  {...register("user_username", {
                    required: "Tên đăng nhập không được bỏ trống",
                  })}
                  name="user_username"
                  placeholder="Tên đăng nhập"
                  className="py-3 bg-gray-50 mt-2 outline-none border px-2 w-full rounded-md border-gray-200  text-sm text-gray-700 shadow-sm"
                />
                <div className="text-red-500 text-[14px] absolute">
                  {errors?.user_username && errors?.user_username?.message}
                </div>
              </div>
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

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="user_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="user_password"
                  {...register("user_password", {
                    required: "Mật khẩu không được để trống!",
                    minLength: { value: 6, message: "Tối thiểu 6 kí tự" },
                  })}
                  name="user_password"
                  placeholder="******"
                  className="py-3 bg-gray-50 mt-2 outline-none border px-2 w-full rounded-md border-gray-200  text-sm text-gray-700 shadow-sm"
                />
                <div className="text-red-500 text-[14px] absolute">
                  {errors?.user_password && errors?.user_password?.message}
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="user_confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  ConfirmPassword
                </label>

                <input
                  type="password"
                  id="user_confirmPassword"
                  {...register("user_confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu",
                    validate: (value) =>
                      value === watch("user_password") || "Mật khẩu xác nhận không trùng khớp",
                  })}
                  name="user_confirmPassword"
                  placeholder="******"
                  className="py-3 bg-gray-50 mt-2 outline-none border px-2 w-full rounded-md border-gray-200  text-sm text-gray-700 shadow-sm"
                />
                <div className="text-red-500 text-[14px] absolute ">
                  {errors?.user_confirmPassword && errors?.user_confirmPassword?.message}
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
                    Đang đăng ký <Spin />
                  </>) : "Đăng ký"}
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

export default RegisterPage;
