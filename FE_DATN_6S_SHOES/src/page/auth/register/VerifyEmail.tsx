import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { GrPowerReset } from "react-icons/gr"
import { useResetTokenMutation, useVerifyUserMutation } from "../../../api/auth";
import { LoadingOutlined } from '@ant-design/icons';

interface IVerifyEmail {
    user_email: string,
    verifyToken: object,
}

const VerifyEmail = ({ setOpen, open, email }: any) => {
    const [spinning, setSpinning] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IVerifyEmail>();

    const navigate = useNavigate();
    const [verifyEmail] = useVerifyUserMutation();
    const [resetToken] = useResetTokenMutation();

    useEffect(() => {
        setValue("user_email", email)
    }, [email])

    // validate email
    const validateEmail = (value: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(value)) {
            return "Email không hợp lệ";
        }
        return true;
    };

    const onReset = async () => {
        try {
            const user_email = { user_email: email }
            await resetToken(user_email).unwrap();
        } catch (error) {
            console.log(error);
        }
    }

    const onSubmit = async (value: IVerifyEmail) => {
        setSpinning(true);
        try {
            const data: any = await verifyEmail(value).unwrap();
            console.log(data);
            if (data.success === true) {
                navigate("/login");
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
            console.log(error);
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
    const handleCancel = () => {
        setOpen(false);
    };
    return (
        <Modal
            open={open}
            // onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{ disabled: false, className: 'text-black border border-black', style: { display: 'none' } }}
            cancelButtonProps={{ disabled: false, style: { display: 'none' } }}
            width={600}
            className='mt-[-40px]'
        >
            {spinning && (
                <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
            )}

            {/* Spin component */}
            {spinning && (
                <div className="fixed top-1/2 left-1/2 bg-white rounded-full  transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
            )}

            <div className="max-w-[500px] mx-auto bg-white p-10  shadow rounded-md">
                <div>
                    <div>
                        <img src="" alt="" />
                    </div>
                    <div className="text-center">
                        <h1 className="font-bold text-[27px] text-center">Kích hoạt tài khoản</h1>
                        <div className=" text-[15px] mt-2 mb-5">
                            <p className="font-[300] text-gray-500">Vui lòng kích hoạt tài khoản để có thể sử dụng</p>
                        </div>
                    </div>
                </div>
                <form action="#" className=" grid grid-cols-6 gap-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-span-3 sm:col-span-6">
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
                            disabled
                            name="user_email"
                            placeholder="ngoc@gmail.com"
                            className="py-3 bg-gray-50 mt-2 outline-none border px-2 w-full rounded-md border-gray-200  text-sm text-gray-700 shadow-sm"
                        />
                        <div className="text-red-500 text-[14px] absolute">
                            {errors?.user_email && errors?.user_email?.message}
                        </div>
                    </div>

                    <div className="col-span-6">
                        <div className=" sm:flex sm:items-center sm:gap-4">
                            <p>Mã xác minh</p>
                            <input type="text"
                                {...register("verifyToken")}
                                className="border outline-none px-2 py-1 w-[150px] rounded-sm shadow"
                                placeholder="Mã xác minh " />
                            <p className="cursor-pointer" onClick={onReset}><GrPowerReset /></p>
                        </div>
                    </div>

                    <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                        <button
                            disabled={spinning}
                            className="inline-block w-full shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                        >
                            {spinning ? (<>
                                Đang xác minh <Spin />
                            </>) : "Xác minh"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal >

    );
};

export default VerifyEmail;
