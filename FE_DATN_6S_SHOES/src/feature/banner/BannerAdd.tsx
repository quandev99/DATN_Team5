import { useState } from "react";
import { useUploadImageMutation } from "../../api/upload";
import { useForm } from "react-hook-form";
import { useAddBannerMutation } from "../../api/banner";
import { Spin, message } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import Swal from "sweetalert2";
import IBanner from "../../interface/banner";

const BannerAdd = () => {
    const [imagesLarge, setImageLarge] = useState<any>({});
    const [uploadImageMutation] = useUploadImageMutation();
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm < IBanner>();
    const [isLoading, setIsLoading] = useState(false);
    const [addBanner] = useAddBannerMutation();

    const handleFileChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newImages = event.target.files[0];
            const urlImage = URL.createObjectURL(newImages);
            const imagereq: any = { files: newImages, url: urlImage };
            setImageLarge(imagereq);
        }
    };

    const onHandleRemoveImagelarge = (url: string) => {
        if (url) {
            setImageLarge({});
        }
    }

    const onHandleAdd = async (value: any) => {
        setIsLoading(true);
        // upload image main
        let imageLargeReq = {};
        if (imagesLarge) {
            const formDataImage = new FormData();
            formDataImage.append("images", imagesLarge.files);
            const db: any = await uploadImageMutation(formDataImage);
            imageLargeReq = db?.data?.urls[0];
        }

        try {
            const formData = {
                ...value,
                banner_image: imageLargeReq,
            };

            const data: any = await addBanner(formData).unwrap();
            if (data.success === true) {
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
            message.error("Error: " + error?.data?.message);
        } finally {
            setIsLoading(false); // Dừng hiển thị trạng thái isLoading
        }
    }

    return (
      <form className="col-span-2" onSubmit={handleSubmit(onHandleAdd)}>
        {isLoading && (
          <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
        )}

        {/* Spin component */}
        {isLoading && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          </div>
        )}
        <div>
          <div>
            <input
              id="dropzone-file"
              className="border w-full"
              type="file"
              onChange={handleFileChangeImage}
            />
            {imagesLarge && imagesLarge.url && (
              <div className="w-full my-2 border shadow-sm border-gray-200 h-[70px]">
                <div className=" w-full items-center  flex justify-between  ">
                  <div className=" w-[100px] px-2 py-2 h-[70px]">
                    <img
                      src={imagesLarge.url}
                      className="w-full h-full object-cover"
                      alt="Image"
                    />
                  </div>
                  <span
                    className="border cursor-pointer  hover:bg-red-500 mr-2 text-white transition-all duration-300 rounded-full bg-red-400  text-center h-[30px] w-[30px]"
                    onClick={() => onHandleRemoveImagelarge(imagesLarge?.url)}
                  >
                    x
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="grid  gap-2 items-center my-4">
            <div>
              <label htmlFor="">Vị trí: </label>
              <input
                {...register("display_order", {
                  required: "Vị trí không được bỏ trống ",
                })}
                type="number"
                className="outline-none border w-full px-2 py-[2px]"
                placeholder="0"
                min={0}
              />
              {errors.display_order && (
                <div className="text-red-500">
                  {errors.display_order.message}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="">Link ảnh: </label>
              <input
                {...register("banner_link", {
                  required: "Link ảnh không được bỏ trống ",
                })}
                type="text"
                className="outline-none border w-full px-2 py-[2px]"
                placeholder="..."
              />
              <div className="text-red-500">
                {errors?.banner_link && errors?.banner_link?.message}
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="text-white mt-3 mb-4 px-4 rounded-md py-2 bg-green-600 hover:bg-green-700 no-underline hover:text-white-700 transition duration-300 ease-in-out"
        >
          Thêm
        </button>
      </form>
    );
};

export default BannerAdd;
