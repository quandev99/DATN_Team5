import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"
import { FaChartPie } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa";
import { AiFillTag } from "react-icons/ai";
import { AiOutlineFileDone } from "react-icons/ai";
import { MdOutlineStarRate } from "react-icons/md";
import { AiOutlineFontSize } from "react-icons/ai";
import { IoIosColorPalette } from "react-icons/io";
import { FaImage } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { RiAccountBoxLine } from "react-icons/ri";
import { BsFillKeyFill } from "react-icons/bs";
import { BiArchive } from "react-icons/bi";
import { BiBookAlt } from "react-icons/bi";
import { FaGroupArrowsRotate } from "react-icons/fa6";

const Sidebar = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    // Lấy path của trang hiện tại từ location
    const path = location.pathname;

    // Cập nhật trạng thái của trang hiện tại
    setCurrentPage(path);
  }, [location]);

  return (
    <div className="h-full px-3 pb-4 overflow-y-auto dark:bg-gray-800">
      <ul className="space-y-2  text-gray-800 px-4">
        <li className="group">
          <Link
            to="/admin/products"
            className={`flex items-center p-2 rounded-lg  transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/member/products" ? "text-[#2c7be5]" : ""
              }`}
          >
            <BiArchive />
            <span className="flex-1 ml-3 whitespace-nowrap">Sản phẩm</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/admin/statistics"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/admin/statistics" ? "text-[#2c7be5]" : "group-hover:text-gray-800"}`}
          >
            <FaChartPie />
            <span className="ml-3">Thống kê</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/admin/bills"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/admin/bills" ? "text-[#2c7be5]" : "group-hover:text-gray-800"}`}
          >
            <FaMoneyBill />
            <span className="ml-3">Đơn hàng</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/admin/product-group"
            className={`flex items-center p-2 rounded-lg  transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/admin/product-group" ? "text-[#2c7be5]" : ""}`}
          >
            <FaGroupArrowsRotate />
            <span className="flex-1 ml-3 whitespace-nowrap">Chiến dịch</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/admin/coupons"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/admin/coupons" ? "text-[#2c7be5]" : "group-hover:text-gray-800"}`}
          >
            <AiFillTag />
            <span className="ml-3">Mã giảm giá</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/admin/sizes"
            className={`flex items-center p-2 rounded-lg  transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/admin/sizes" ? "text-[#2c7be5]" : ""}`}
          >
            <AiOutlineFontSize />
            <span className="flex-1 ml-3 whitespace-nowrap">Kích cỡ</span>
          </Link>
        </li>
        <li className="group">
          <Link
            to="/admin/colors"
            className={`flex items-center p-2 rounded-lg  transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/admin/colors" ? "text-[#2c7be5]" : ""}`}
          >
            <IoIosColorPalette />
            <span className="flex-1 ml-3 whitespace-nowrap">Màu sắc</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/admin/banners"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/admin/banners" ? "text-[#2c7be5]" : "group-hover:text-gray-800"}`}
          >
            <FaImage />
            <span className="ml-3">Banner</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/admin/categories"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/admin/categories" ? "text-[#2c7be5]" : "group-hover:text-gray-800"}`}
          >
            <BiBookAlt />
            <span className="ml-3">Danh mục</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/admin/brands"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/admin/brands" ? "text-[#2c7be5]" : "group-hover:text-gray-800"}`}
          >
            <SiBrandfolder />
            <span className="ml-3">Thương hiệu</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/admin/users"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/admin/users" ? "text-[#2c7be5]" : "group-hover:text-gray-800"}`}
          >
            <RiAccountBoxLine />
            <span className="ml-3">Tài khoản</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/admin/roles"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/admin/roles" ? "text-[#2c7be5]" : "group-hover:text-gray-800"}`}
          >
            <BsFillKeyFill />
            <span className="ml-3">Vai trò</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/admin/reviews"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/admin/reviews" ? "text-[#2c7be5]" : "group-hover:text-gray-800"}`}
          >
            <MdOutlineStarRate />
            <span className="ml-3">Đánh giá</span>
          </Link>
        </li>



        <li className="group">
          <Link
            to="/admin/news"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${currentPage === "/admin/news" ? "text-[#2c7be5]" : "group-hover:text-gray-800"}`}
          >
            <AiOutlineFileDone />
            <span className="ml-3">Bài viết</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar