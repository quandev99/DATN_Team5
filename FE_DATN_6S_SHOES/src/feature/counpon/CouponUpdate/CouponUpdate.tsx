import {
  useGetByIdCouponQuery,
  useUpdateCouponMutation,
} from "../../../api/coupon";
import dayjs from "dayjs";
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  Checkbox,
  DatePicker,
  DatePickerProps,
  Spin,
  Switch,
} from "antd";
import { useGetusersQuery } from "../../../api/user";
import { IUser } from "../../../interface/user";
import { ICoupon } from "../../../interface/coupons";
import UserCoupon from "../CouponAdd/components/UserCoupon";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { LoadingOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CouponUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string | any }>();
  const [updateCoupon] = useUpdateCouponMutation();

  const { data: Coupon } = useGetByIdCouponQuery<ICoupon>(id);
  const dataCoupon: any = Coupon?.coupon;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    setError,
    control,
  } = useForm<ICoupon>();
  const [start_date, setStartDate] = useState("");
  const [Special, SetSpecial] = useState(false);
  const [Status, SetStatus] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [editorData, setEditorData] = useState("");
  const [users, setUsers] = useState<any>([]);
  const { data: dataUser } = useGetusersQuery<IUser>();
  const userList = dataUser?.users;

  const hasLeadingSpace = (value: any) => /^\s/.test(value);

  useEffect(() => {
    if (Coupon) {
      setUsers(dataCoupon?.users);
      SetStatus(dataCoupon?.status);
      SetSpecial(dataCoupon?.isSpecial);
      setValue("coupon_name", dataCoupon?.coupon_name);
      setValue("coupon_code", dataCoupon?.coupon_code);
      setValue("coupon_content", dataCoupon?.coupon_content);
    }
    reset(dataCoupon);
  }, [Coupon, dataCoupon, setValue]);
  const defaultValueStart = dayjs(
    moment(dataCoupon?.expiration_date).toLocaleString()
  );

  const onChangeDateStart: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setStartDate(dateString);
  };

  const onChangeSpecial = () => {
    SetSpecial(prevSpecial => !prevSpecial);
  };

  const onChangeStatus = () => {
    SetStatus(prevStatus => !prevStatus);
  };

  const onHandleSelectUser = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = event.target.value; // Lấy giá trị được chọn từ dropdown
    // Tạo một bản sao mới của mảng users và thêm selectedUserId vào đó

    const isUserIdExist = users?.includes(selectedUserId);
    if (isUserIdExist) {
      const updateUsers = users.filter((item: any) => item !== selectedUserId);
      setUsers(updateUsers);
    } else {
      const updatedUsers: any = [...users, selectedUserId];
      setUsers(updatedUsers); // Cập nhật mảng users mới
    }
  };

  const handleEditorChange = (_event: any, editor: any) => {
    const data = editor.getData();
    const withoutParagraphTags = removeParagraphTags(data);
    setEditorData(withoutParagraphTags);
  };

  const removeParagraphTags = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Lấy nội dung trong thẻ body, loại bỏ thẻ p
    const bodyContent = doc.body.textContent || "";

    return bodyContent;
  };

  const onHandleSubmit = async (coupon: ICoupon) => {
    setIsLoadingButton(true);

    if (hasLeadingSpace(coupon.coupon_name)) {
      setError("coupon_name", {
        type: "text",
        message: "Tên mã giảm giá không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (hasLeadingSpace(coupon.coupon_code)) {
      setError("coupon_code", {
        type: "text",
        message: "Mã code giảm giá không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (hasLeadingSpace(editorData)) {
      setError("coupon_content", {
        type: "text",
        message: "Mô tả không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (editorData === "") {
      setError("coupon_content", {
        type: "text",
        message: "Mô tả không được để trống",
      });
      setIsLoadingButton(false);
      return;
    }

    if (editorData.length < 2) {
      setError("coupon_content", {
        type: "text",
        message: "Tối thiểu 2 ký tự",
      });
      setIsLoadingButton(false);
      return;
    }

    const dataForm: ICoupon = {
      ...coupon,
      coupon_code: coupon.coupon_code,
      coupon_content: editorData,
      coupon_name: coupon.coupon_name,
      coupon_quantity: coupon.coupon_quantity,
      discount_amount: coupon.discount_amount,
      expiration_date: start_date
        ? start_date
        : (coupon?.expiration_date as any),
      min_purchase_amount: +coupon.min_purchase_amount,
      isSpecial: Special,
      status: Status,
      users: users ? users : coupon?.users,
    };

    try {
      const data: any = await updateCoupon(dataForm).unwrap();
      if (data.success === true) {
        navigate("/admin/coupons");
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
        <h1 className="text-center uppercase font-medium text-gray-900 text-[30px]">
          Cập nhật mã giảm giá
        </h1>
      </div>
      <form onSubmit={handleSubmit(onHandleSubmit as any)}>
        <div className="flex justify-between">
          <div></div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/coupons"
              className="px-2 py-2 mr-auto text-white transition-all duration-200 bg-gray-500 rounded-sm right-10 hover:bg-gray-600"
            >
              Quay lại
            </Link>
            <button className="px-6 py-2 mr-auto text-white transition-all duration-200 bg-green-500 rounded-sm hover:bg-green-600">
              Cập nhật
            </button>
          </div>
        </div>
        <div className="grid grid-cols-[auto,35%] gap-3  mt-[10px]">
          <div className="grid grid-cols-1 gap-4 m-2 shadow-lg lg:grid-cols-2 lg:gap-8">
            <div className="min-h-32 lg:col-span-3">
              <div className="rounded-sm shadow-sm bg-gray-50">
                <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-2 lg:gap-4">
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Tên mã giảm giá
                    </label>
                    <br />
                    <input
                      type="text"
                      {...register("coupon_name", {
                        required: "Tên mã giảm giá không được bỏ trống ",
                        minLength: { value: 3, message: "Tối thiểu 3 kí tự" },
                      })}
                      placeholder="Name coupon ..."
                      className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                    />
                    <div className="text-red-500">
                      {errors?.coupon_name && errors?.coupon_name?.message}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Mã code giảm giá
                    </label>
                    <br />
                    <input
                      type="text"
                      {...register("coupon_code", {
                        required: "Mã code giảm giá không được bỏ trống ",
                        minLength: { value: 5, message: "Tối thiểu 5 kí tự" },
                      })}
                      placeholder="Mã voucher ..."
                      className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                    />
                    <div className="text-red-500">
                      {errors?.coupon_code && errors?.coupon_code?.message}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-2 lg:gap-4">
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Mô tả mã giảm giá
                    </label>
                    <br />
                    <Controller
                      name="coupon_content"
                      control={control}
                      render={({ field }) => (
                        <CKEditor
                          editor={ClassicEditor}
                          data={dataCoupon?.coupon_content || ""}
                          onChange={(e, editor) => {
                            handleEditorChange(e, editor);
                            field.onChange(e);
                          }}
                        />
                      )}
                    />
                    <div className="text-red-500">
                      {errors?.coupon_content &&
                        errors?.coupon_content?.message}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Số lượng
                    </label>
                    <br />
                    <input
                      type="number"
                      {...register("coupon_quantity", {
                        required: "Số lượng không được bỏ trống ",
                      })}
                      placeholder="Số lượng ..."
                      className="shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                    />
                    <div className="text-red-500">
                      {errors?.coupon_quantity &&
                        errors?.coupon_quantity?.message}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-3 xs:grid-cols-1 lg:gap-3">
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Số tiền giảm
                    </label>
                    <br />
                    <input
                      type="number"
                      {...register("discount_amount", {
                        required: "Số tiền giảm không được bỏ trống ",
                      })}
                      placeholder="Số tiền giảm ..."
                      className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                    />
                    <div className="text-red-500">
                      {errors?.discount_amount &&
                        errors?.discount_amount?.message}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Ngày hết hạn
                    </label>
                    <br />
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      className="shadow-sm bg-white w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                      defaultValue={defaultValueStart}
                      onChange={onChangeDateStart}
                    />
                    <div className="text-red-500">
                      {errors?.expiration_date &&
                        errors?.expiration_date?.message}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="" className="font-bold text-[19px]">
                      Giá tiền tối thiểu
                    </label>
                    <br />
                    <input
                      type="text"
                      {...register("min_purchase_amount", {
                        required: "Giá tiền tối thiểu không được bỏ trống ",
                      })}
                      placeholder="Giá tiền tối thiểu ..."
                      className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                    />
                    <div className="text-red-500">
                      {errors?.min_purchase_amount &&
                        errors?.min_purchase_amount?.message}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 m-2 rounded-sm shadow-lg bg-gray-50">
            <div className="grid items-center grid-cols-2 gap-2">
              <div className="bg-white shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]">
                <Checkbox onChange={onChangeSpecial} checked={Special}>
                  Đặc biệt
                </Checkbox>
              </div>
              <div className="bg-white flex items-center gap-2 shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]">
                <h1>Trạng thái</h1>
                <Switch
                  checkedChildren="Đóng"
                  unCheckedChildren="Mở"
                  checked={Status}
                  onChange={onChangeStatus}
                />
              </div>
            </div>
            <div>
              <select
                className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                onChange={event => onHandleSelectUser(event)}
              >
                <option value="">Chọn tài khoản</option>
                {userList?.map((item: IUser) => {
                  return (
                    <option value={item?._id}>{item?.user_fullname}</option>
                  );
                })}
              </select>
            </div>
            <div className="mt-3">
              <h1>Danh sách tài khoản được thêm</h1>
              {users?.map((item: any) => {
                return (
                  <UserCoupon item={item} setUsers={setUsers} users={users} />
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CouponUpdate;
