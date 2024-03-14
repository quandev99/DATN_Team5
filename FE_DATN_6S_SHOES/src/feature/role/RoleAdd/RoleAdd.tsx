import { Link, useNavigate } from "react-router-dom";
import { useAddRoleMutation } from "../../../api/role";
import Swal from "sweetalert2";
import { Controller, useForm } from "react-hook-form";
import IRole from "../../../interface/role";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

const RoleUpdate = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm<IRole>();
  const [editorData, setEditorData] = useState("");
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [addRole] = useAddRoleMutation<any>();

  const hasLeadingSpace = (value: any) => /^\s/.test(value);

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

  const onHandleSubmit = async (values: any) => {
    setIsLoadingButton(true);

    if (hasLeadingSpace(values.role_name)) {
      setError("role_name", {
        type: "text",
        message: "Tên vai trò không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (hasLeadingSpace(editorData)) {
      setError("role_description", {
        type: "text",
        message: "Mô tả không được bắt đầu bằng khoảng trắng",
      });
      setIsLoadingButton(false);
      return;
    }

    if (editorData === "") {
      setError("role_description", {
        type: "text",
        message: "Mô tả không được để trống",
      });
      setIsLoadingButton(false);
      return;
    }

    if (editorData.length < 2) {
      setError("role_description", {
        type: "text",
        message: "Tối thiểu 2 ký tự",
      });
      setIsLoadingButton(false);
      return;
    }

    const formData = {
      ...values,
      role_description: editorData,
    };

    try {
      const data: any = await addRole(formData).unwrap();
      if (data.success) {
        navigate("/admin/roles");
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
        text: `${error?.data?.message}`,
        icon: "error",
        confirmButtonText: "Quay lại",
      });
    }finally{
      setIsLoadingButton(false)
    }
  };

  return (
    <div className="overflow-x-auto ">
      {isLoadingButton && (
        <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
      )}
      {isLoadingButton && (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <div>
        <h1 className="text-center font-medium text-gray-900 uppercase text-[28px]">
          Thêm vai trò
        </h1>
      </div>
      <form onSubmit={handleSubmit(onHandleSubmit as any)}>
        <div className="py-10 ">
          <div className="grid grid-cols-2 gap-5 min-h-32">
            <div className="col-span-3 rounded-md ">
              <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-2 lg:gap-4">
                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Tên vài trò
                  </label>
                  <br />
                  <input
                    type="text"
                    {...register("role_name", {
                      required: "Tên vài trò không được bỏ trống ",
                      minLength: { value: 2, message: "Tối thiểu 2 ký tự"}
                    })}
                    placeholder="Tên vài trò ..."
                    className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b  border focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                  />
                  <div className="text-red-500">
                    {errors?.role_name && errors?.role_name?.message}
                  </div>
                </div>
                <div>
                  <label htmlFor="" className="font-bold text-[19px]">
                    Mô tả vài trò
                  </label>
                  <Controller
                    name="role_description"
                    control={control}
                    defaultValue=""
                    render={() => (
                      <CKEditor
                        editor={ClassicEditor}
                        onChange={handleEditorChange}
                      />
                    )}
                  />
                  <div className="text-red-500">
                    {errors?.role_description &&
                      errors?.role_description?.message}
                  </div>
                </div>

                <div className="flex gap-2 ">
                  <Link
                    to="/admin/roles"
                    className="px-2 py-2 text-white transition-all duration-200 bg-gray-500 rounded-sm right-10 hover:bg-gray-600"
                  >
                    Quay lại
                  </Link>
                  <button className="px-6 mr-auto text-white transition-all duration-200 bg-green-500 rounded-sm hover:bg-green-600">
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RoleUpdate;
