import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom"
import { ISignin } from "../interface/auth";
import { useLoginMutation } from "../api/auth";
import Swal from "sweetalert2";
import { useState } from "react"
import { Spin } from "antd";
import { getDecodedAccessToken } from "../decoder";

const AuthGuard = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ISignin>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [Login] = useLoginMutation();
    const onHandleSubmit = async (value: any) => {
        setIsLoading(true); // Bắt đầu hiển thị trạng thái isLoading
        try {
            const data: any = await Login(value).unwrap();

            if (data.success === true) {
                await localStorage.setItem("accessToken", JSON.stringify(data.accessToken));

                const token: any = getDecodedAccessToken();
                if (token.role_name === "Admin" ) {
                    navigate("/admin");
                    Swal.fire({
                        position: 'top',
                        icon: 'success',
                        title: `Chào mừng đến trang quản trị`,
                        showConfirmButton: false,
                        timer: 2000
                    })
                } else if(token.role_name === "Member") {
                    navigate("/member");
                    Swal.fire({
                      position: "top",
                      title: "Success!",
                      text: `Chào mừng đến trang quản trị`,
                      icon: "success",
                      showConfirmButton: false,
                      timer: 2000,
                    });
                } else {
                    Swal.fire({
                        title: 'Opps!',
                        text: `Bạn không có quyền truy cập vào trang quản trị`,
                        icon: 'error',
                        confirmButtonText: 'Quay lại'
                    })
                }
            } else {
                Swal.fire({
                    title: 'Opps!',
                    text: `${data.message}`,
                    icon: 'error',
                    confirmButtonText: 'Quay lại'
                })
            }
        } catch (error: any) {
            console.log(error);
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

    return (
        <div className="md:h-[704px] md:bg-[url('https://allimages.sgp1.digitaloceanspaces.com/tipeduvn/2022/08/1660671045_209_Bo-suu-tap-hinh-nen-vu-tru-4K-doc-dao.jpg')]">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-lg">
                    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
                        Chào bạn tôi là quản trị viên
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
                        Bạn đang muốn truy cập vào trang quản trị? Vui lòng điền thông tin bên dưới
                    </p>

                    <form
                        onSubmit={handleSubmit(onHandleSubmit)}
                        action=""
                        className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
                    >
                        <p className="text-center text-lg font-medium text-gray-100">Đăng nhập</p>

                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>

                            <div className="relative">
                                <input
                                    {...register("user_email", {
                                        required: "Email không được bỏ trống ",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Email Không đúng định rạng"
                                        }
                                    })}
                                    type="email"
                                    className="w-full outline-none hover:border border focus:duration-200 focus:border-b-green-300 focus:shadow-md rounded-lg  p-4 pe-12 text-sm shadow-sm"
                                    placeholder="Enter email"
                                />
                                <div className="text-red-500">{errors?.user_email && errors?.user_email.message}</div>
                                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
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
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>

                            <div className="relative">
                                <input
                                    {...register("user_password", { required: "Password không được bỏ trống ", minLength: { value: 6, message: "Tối thiểu 6 kí tự " } })}
                                    type="password"
                                    className="w-full outline-none hover:border border focus:duration-200 focus:border-b-green-300 focus:shadow-md rounded-lg  p-4 pe-12 text-sm shadow-sm"
                                    placeholder="Enter password"
                                />
                                <div className="text-red-500">{errors?.user_password && errors?.user_password.message}</div>
                                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
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
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="block w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 animation-all duration-300 px-5 py-3 text-sm font-medium text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (<>
                                Đang đăng nhập <Spin />
                            </>) : "Đăng nhập"}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Bạn chưa có tài khoản admin?
                            <Link className="underline" to="/">Trang chủ</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AuthGuard