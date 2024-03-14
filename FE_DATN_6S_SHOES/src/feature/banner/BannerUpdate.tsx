import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetBannerByIdQuery, useUpdateBannerMutation } from "../../api/banner";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import Swal from "sweetalert2";

const BannerUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const { data: banner } = useGetBannerByIdQuery(id || "");
  const bannerData = banner?.banner

  const [updateBanner] = useUpdateBannerMutation();



  const [selectedImage, setSelectedImage] = useState("");

  const { handleSubmit, setValue, register } = useForm<any>();

  useEffect(() => {
    // Thiết lập giá trị mặc định khi có dữ liệu được trả về từ API
    if (bannerData) {
      setValue("banner_image", bannerData?.banner_image);
      setValue("display_order", bannerData?.display_order || "");
      setValue("banner_link", bannerData?.banner_link || "");
    }
  }, [bannerData, setValue]);

  const onFileChange = async (e: any) => {
    const file = e.target.files[0];
    const formData = {
      images: file,
    };

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const response = await axios.post(
        "http://localhost:8080/api/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded:", response.data);
      setSelectedImage(response?.data?.urls[0]?.url);
      setImage(response?.data?.urls[0]);
    } else {
      setSelectedImage("");
    }
  };

  const onHandleSubmit = async (banner: any) => {
    const formData = {
      ...banner,
      banner_image: image || bannerData?.banner_image,
      _id: id,
    };
    try {
      // Gọi API để cập nhật màu sắc
      const data = await updateBanner({ ...formData }).unwrap();


      if (data.success === true) {
        navigate("/admin/banners")
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
      message.error("Cập nhật thất bại")
    }
  };
  return (
    <form className='col-span-3' onSubmit={handleSubmit(onHandleSubmit)}>
      <div className='grid grid-cols-2'>
        <article
          aria-label="File Upload Modal"
          className="relative h-full flex flex-col bg-white shadow-xl rounded-md col-span-2"
        >
          <section className="h-full p-8 w-full grid grid-cols-3 gap-10">
            <header className="border-dashed col-span-2 border-2 border-gray-400 flex flex-col justify-center items-center">
              <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                <span>Vui lòng chọn banner</span>&nbsp;
              </p>

              <input
                id="hidden-input"
                name="banner_image"
                type="file"
                onChange={onFileChange}
              />
            </header>
            <ul
              id="gallery"
              className="h-auto max-w-[200px] w-full -m-1"
            >
              <div className="w-[400px] h-[200px]">
                <img
                  src={selectedImage || bannerData?.banner_image?.url}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </ul>
          </section>
        </article>
        <div className='col-span-3'>
          <div className='flex gap-3 mt-4 items-center'>
            <label htmlFor="">Vị trí: </label>
            <input
              {...register("display_order")}
              type="text"
              className='outline-none border w-[40px] px-2 py-[1px]'
              placeholder='0'
            />
          </div>
        </div>
        <div className='col-span-3'>
          <div className='flex gap-3 mt-4 items-center'>
            <label htmlFor="">Link: </label>
            <input
              {...register("banner_link")}
              type="text"
              className='outline-none border'
              placeholder='..'
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="text-white mt-3 mb-4 px-4 rounded-md py-2 bg-green-600 hover:bg-green-700 no-underline hover:text-white-700 transition duration-300 ease-in-out">
        Cập nhật
      </button>
    </form>
  );
};

export default BannerUpdate;
