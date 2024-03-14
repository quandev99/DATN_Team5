import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaMoneyBill, FaImage } from "react-icons/fa";
import { AiOutlineFileDone, AiOutlineFontSize } from "react-icons/ai";
import { MdDashboard, MdOutlineStarRate } from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io";
import { SiBrandfolder } from "react-icons/si";
import { BiArchive, BiBookAlt } from "react-icons/bi";
import { FaGroupArrowsRotate } from "react-icons/fa6";

const Sidebar = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const path = location.pathname;
    setCurrentPage(path);
  }, [location]);

  return (
    <div className="h-full px-3 pb-4 overflow-y-auto dark:bg-gray-800">
      <ul className="space-y-2  text-gray-800 px-4">
        <li className="group">
          <Link
            to="/member/dashboard"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${
              currentPage === "/member/dashboard"
                ? "text-[#2c7be5]"
                : "group-hover:text-gray-800"
            }`}
          >
            <MdDashboard />
            <span className="ml-3">Quản trị</span>
          </Link>
        </li>
        <li className="group">
          <Link
            to="/member/bills"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${
              currentPage === "/member/bills"
                ? "text-[#2c7be5]"
                : "group-hover:text-gray-800"
            }`}
          >
            <FaMoneyBill />
            <span className="ml-3">Đơn hàng</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/member/products"
            className={`flex items-center p-2 rounded-lg  transition-all dark:text-white  dark:hover:bg-gray-700 group ${
              currentPage === "/member/products" ? "text-[#2c7be5]" : ""
            }`}
          >
            <BiArchive />
            <span className="flex-1 ml-3 whitespace-nowrap">Sản phẩm</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/member/product-group"
            className={`flex items-center p-2 rounded-lg  transition-all dark:text-white  dark:hover:bg-gray-700 group ${
              currentPage === "/member/product-group" ? "text-[#2c7be5]" : ""
            }`}
          >
            <FaGroupArrowsRotate />
            <span className="flex-1 ml-3 whitespace-nowrap">Chiến dịch</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/member/sizes"
            className={`flex items-center p-2 rounded-lg  transition-all dark:text-white  dark:hover:bg-gray-700 group ${
              currentPage === "/member/sizes" ? "text-[#2c7be5]" : ""
            }`}
          >
            <AiOutlineFontSize />
            <span className="flex-1 ml-3 whitespace-nowrap">Kích cỡ</span>
          </Link>
        </li>
        <li className="group">
          <Link
            to="/member/colors"
            className={`flex items-center p-2 rounded-lg  transition-all dark:text-white  dark:hover:bg-gray-700 group ${
              currentPage === "/member/colors" ? "text-[#2c7be5]" : ""
            }`}
          >
            <IoIosColorPalette />
            <span className="flex-1 ml-3 whitespace-nowrap">Màu sắc</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/member/banners"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${
              currentPage === "/member/banners"
                ? "text-[#2c7be5]"
                : "group-hover:text-gray-800"
            }`}
          >
            <FaImage />
            <span className="ml-3">Banner</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/member/categories"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${
              currentPage === "/member/categories"
                ? "text-[#2c7be5]"
                : "group-hover:text-gray-800"
            }`}
          >
            <BiBookAlt />
            <span className="ml-3">Danh mục</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/member/brands"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${
              currentPage === "/member/brands"
                ? "text-[#2c7be5]"
                : "group-hover:text-gray-800"
            }`}
          >
            <SiBrandfolder />
            <span className="ml-3">Thương hiệu</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/member/reviews"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${
              currentPage === "/member/reviews"
                ? "text-[#2c7be5]"
                : "group-hover:text-gray-800"
            }`}
          >
            <MdOutlineStarRate />
            <span className="ml-3">Đánh giá</span>
          </Link>
        </li>

        <li className="group">
          <Link
            to="/member/news"
            className={`flex items-center p-2 rounded-lg transition-all dark:text-white  dark:hover:bg-gray-700 group ${
              currentPage === "/member/news"
                ? "text-[#2c7be5]"
                : "group-hover:text-gray-800"
            }`}
          >
            <AiOutlineFileDone />
            <span className="ml-3">Bài viết</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
