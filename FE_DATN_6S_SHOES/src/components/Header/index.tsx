import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css"
import { useEffect, useRef, useState } from "react";
import { getDecodedAccessToken } from "../../decoder";
import { useGetUserByIdQuery } from "../../api/user";
import { useGetCartByUserQuery } from "../../api/cart";
import { formatMoney } from "../../util/helper";
import { useGetFavoriteByUserQuery } from "../../api/favorite";
import { SearchHeader } from "./components";
import { useGetCategoryQuery } from "../../api/category";
import { ICategory } from "../../interface/category";
import Swal from "sweetalert2";
const Header = () => {
  const token: any = getDecodedAccessToken();
  const navigate = useNavigate();

  const { data: userData } = useGetUserByIdQuery<any>(token?._id);
  const user = userData?.user;
  const { data: carts } = useGetCartByUserQuery(token?._id);
  const cartList = carts?.cart;
  const [status, setStatus] = useState(false);

  const { data: FavoriteUser } = useGetFavoriteByUserQuery<any>(token?._id);
  const favoriteData = FavoriteUser?.favorite;
  const roleId = token?.role_name;

  const handleLogout = () => {
    localStorage.removeItem("status");
    localStorage.removeItem("accessToken");
    setStatus(true);
    window.location.reload();
  };

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<any>(null);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: any) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [showMenu, setShowMenu] = useState(true); // Khai báo state để ẩn/hiện thanh menu

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setShowMenu(position < 100); // Khi vị trí cuộn dưới 100px, hiển thị menu
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const headerClass = showMenu ? "py-3 transition-all duration-300" : " transition-all duration-300";

  const { data: categoryData } = useGetCategoryQuery<any>();
  const categoryList = categoryData?.categories;


  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    // Lấy path của trang hiện tại từ location
    const path = location.pathname;

    // Cập nhật trạng thái của trang hiện tại
    setCurrentPage(path);
  }, [location]);

  const handleClick = async () => {
    if (!user?._id) {
      const loginResult = await Swal.fire({
        position: 'top',
        title: 'Opps!',
        text: "Bạn cần đăng nhập để thực hiện chức năng này",
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Đăng nhập',
        cancelButtonText: 'Quay lại'
      });

      if (loginResult.isConfirmed) {
        navigate("/login");
      }
    }
  };
  return (
    <div>
      <nav
        className={`bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-100 dark:border-gray-600 ${headerClass}`}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto  h-[80px]">
          <Link to="/" className="flex items-center  max-w-[50px]">
            <img
              src="https://res.cloudinary.com/djlylbhrb/image/upload/v1697640078/obebs4rwv41zfkcvl4ig.png"
              className="h-full w-full mr-3"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              6s Shoes
            </span>
          </Link>
          <div className="flex items-center md:order-2">
            <div className="header-icon flex items-center space-x-3">
              <div className="nav-search text-[20px] cursor-pointer relative">
                <SearchHeader />
              </div>
              <div className="nav-user flex items-center menu-item text-[20px] cursor-pointer relative">
                {user && !status ? (
                  <ul className="submenu">
                    <li>
                      <Link
                        to="account"
                        className="text-red-500 text-lg font-medium"
                      >
                        {user?.user_fullname}
                      </Link>
                    </li>
                    {roleId === "Admin" ? (
                      <li>
                        <Link to="/admin">Trang quản trị</Link>
                      </li>
                    ) : roleId === "Member" ? (
                      <li>
                        <Link to="/member">Trang nhân viên</Link>
                      </li>
                    ) : (
                      ""
                    )}
                    <li>
                      <Link to="account">Thông tin tài khoản</Link>
                    </li>
                    <li>
                      <Link to="/account/change-password-new">Đổi mật khẩu</Link>
                    </li>
                    <li>
                      <Link to="" onClick={handleLogout}>
                        Đăng xuất
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <ul className="submenu">
                    <li>
                      <Link
                        to="login"
                        className="hover:text-[#9c5727] transition-all block"
                      >
                        Đăng nhập
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="register"
                        className="hover:text-[#9c5727] transition-all block"
                      >
                        Đăng ký
                      </Link>
                    </li>
                  </ul>
                )}

                <div className="icon-search group">
                  {user && !status ? (
                    <div className="w-5 h-5">
                      <img
                        className="w-full h-full rounded-full"
                        src={user?.user_avatar?.url}
                        alt=""
                      />
                    </div>
                  ) : (
                    <i className="fa-regular fa-user hover:text-[#ca6f04] transition-all"></i>
                  )}
                </div>
              </div>
              <div className="nav-heart text-[20px] cursor-pointer relative">
                {user ? (
                  <Link to={`/account/favorites`} className="icon-heart">
                    <i className="fa-regular fa-heart hover:text-[#ca6f04] transition-all"></i>
                    <span className="absolute bg-[#ca6f04] right-[-8px] text-white rounded-full px-[5px] text-[10px]">
                      {favoriteData ? favoriteData?.products?.length : 0}
                    </span>
                  </Link>
                ) : (
                  <span className="icon-heart disabled" onClick={handleClick}>
                    <i className="fa-regular fa-heart"></i>
                    <span className="absolute bg-[#ca6f04] right-[-8px] text-white rounded-full px-[5px] text-[10px]">
                      {favoriteData ? favoriteData?.products?.length : 0}
                    </span>
                  </span>
                )}
              </div>
              <div className="nav-cart cart-menu-item text-[20px] w-[30px]  cursor-pointer relative">
                <ul className="cart-submenu left-[-270px] lg:left-[-340px]  ">
                  <h1 className="text-gray-400 mb-2">Sản phẩm mới thêm</h1>
                  <div className="">
                    {cartList && cartList?.products.length > 0 ? (
                      cartList?.products.slice(0, 4).map((item: any) => {
                        return (
                          <li className="mb-4" key={item?._id}>
                            <div>
                              <Link
                                to={`/products/${item?.product_id?._id}`}
                                className="grid grid-cols-[auto,30%] gap-1 px-2 items-center justify-between hover:bg-gray-200 py-3 transition-all duration-300 cursor-help"
                              >
                                <div className=" flex items-center gap-2">
                                  <div className="max-w-[50px] h-[5opx]">
                                    <img src={item?.product_image?.url} className="w-full h-full" alt="" />
                                  </div>
                                  <h1 className="font-bold">
                                    {item?.product_name}
                                  </h1>
                                </div>
                                <div>
                                  <span className="text-red-500 ">
                                    {item?.quantity}
                                  </span>
                                  <span className="text-red-500 font-medium px-2 text-[12px]">
                                    {"X"}
                                  </span>
                                  <span className="text-red-500">
                                    {formatMoney(
                                      item?.product_discount === 0
                                        ? item?.product_price
                                        : item?.product_discount
                                    ) + "K"}
                                  </span>
                                </div>
                              </Link>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <div className="text-xl font-medium">Giỏ hàng trống</div>
                    )}
                  </div>
                  <div className="flex justify-between gap-2 items-center mt-3">
                    <span className="flex justify-between gap-1 items-center">
                      <p>Thêm</p>
                      {cartList?.products?.reduce((i: number, a: any) => {
                        return i + a?.quantity;
                      }, 0) || 0}
                      <p> sản phẩm vào giỏ hàng</p>
                    </span>
                    <Link
                      to="/carts"
                      className="bg-[#ca6f04] text-white px-8 text-[16px] py-2 rounded-sm transition-all hover:bg-yellow-800 duration-300"
                    >
                      Giỏ hàng
                    </Link>
                  </div>
                </ul>
                <Link to="/" className="" onClick={handleClick}>
                  <div className="icon-cart">
                    <i className="fa-solid fa-bag-shopping fa-bounce hover:text-[#ca6f04] transition-all"></i>
                    <span className="absolute bg-[#ca6f04] right-[-8px] text-white rounded-full px-[5px] text-[10px]">
                      {user && cartList ? cartList?.products?.length || 0 : 0}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
            <button
              onClick={toggleDropdown}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          <div
            className={`hidden lg:flex items-center justify-between w-full   md:w-auto md:order-1`}
            id="navbar-sticky"
          >
            <ul
              className={`flex flex-col md:p-0  font-medium border border-gray-100 rounded-lg lg:flex-row lg:space-x-8  lg:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700`}
            >
              <li className="lg:py-8">
                <Link
                  to="/"
                  className={` ${currentPage === "/" ? "text-[#ca6f04]" : ""
                    } block py-2 pl-3 pr-4 uppercase font-medium text-[17px] duration-300  rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                  aria-current="page"
                >
                  Trang chủ
                </Link>
              </li>
              <li className="lg:py-8">
                <Link
                  to="/products"
                  className={` ${currentPage === "/products" ? "text-[#ca6f04]" : ""
                    } block py-2 pl-3 pr-4 uppercase font-medium text-[17px] duration-300  rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                >
                  Sản phẩm
                </Link>
              </li>
              {/* <li className="group [&_summary::-webkit-details-marker]:hidden lg:category-menu lg:py-8 group relative">
                <Link
                  to="#"
                  className=" cursor-pointer block h-full pl-3 pr-4 uppercase font-medium text-[17px] duration-300 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Danh mục
                </Link>
                <ul className="lg:category-submenu  group-focus:block hidden">
                  <li>
                    {categoryList?.map((category: ICategory) => {
                      if (category?.category_name == "Chưa phân loại") {
                        return null
                      }
                      return <Link to={`/categories/${category._id}`} className="block px-4 py-2 hover:bg-gray-200">{category?.category_name}</Link>
                    })}
                  </li>
                </ul>
              </li> */}

              <li className="flex lg:py-8">
                <div className="relative">
                  <details className="group [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer  pl-3 pr-4 uppercase font-medium text-[17px] duration-300 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                      <span className=" cursor-pointer block h-full pl-3 pr-4 uppercase font-medium text-[17px] duration-300 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                        {" "}
                        Danh mục{" "}
                      </span>
                      <span className="transition group-open:-rotate-180">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-4 w-4 mt-[6px]"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </summary>

                    <div className="z-50 group-open:absolute  group-open:start-0 group-open:top-auto group-open:mt-2">
                      <div className="w-96 rounded border border-gray-200 bg-white">
                        <ul className="lg:category-submenu ">
                          <li>
                            {categoryList?.map((category: ICategory) => {
                              if (category?.category_name == "Chưa phân loại") {
                                return null;
                              }
                              return (
                                <Link
                                  key={category._id}
                                  to={`/categories/${category._id}`}
                                  className="block px-4 py-2 hover:bg-gray-200"
                                >
                                  {category?.category_name}
                                </Link>
                              );
                            })}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </details>
                </div>
              </li>

              <li className="lg:py-8">
                <Link
                  to="/about"
                  className={` ${currentPage === "/about" ? "text-[#ca6f04]" : ""
                    } block py-2 pl-3 pr-4 uppercase font-medium text-[17px] duration-300  rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                >
                  Giới thiệu
                </Link>
              </li>
              <li className="lg:py-8">
                <Link
                  to="/blog"
                  className={` ${currentPage === "/blog" ? "text-[#ca6f04]" : ""
                    } block py-2 pl-3 pr-4 uppercase font-medium text-[17px] duration-300  rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                >
                  Tin tức
                </Link>
              </li>
              <li className="lg:py-8">
                <Link
                  to="/contact"
                  className={` ${currentPage === "/contact" ? "text-[#ca6f04]" : ""
                    } block py-2 pl-3 pr-4 uppercase font-medium text-[17px] duration-300  rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div
            ref={menuRef}
            className={`items-center justify-between w-full    lg:flex md:w-auto md:order-1`}
            id="navbar-sticky"
          >
            <ul
              className={`menu-bar lg:flex lg:transition-none lg:transform-none lg:relative ${isOpen ? "menu-transition active bg-white " : "menu-transition"
                } flex-col md:p-0 lg:mt-4 font-medium border border-gray-100 rounded-lg lg:flex-row lg:space-x-8  lg:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700`}
            >
              <li className="lg:py-8">
                <Link
                  to="/"
                  className={` ${currentPage === "/" ? "text-[#ca6f04]" : ""
                    } block py-2 pl-3 pr-4 uppercase font-medium text-[17px] duration-300  rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                  aria-current="page"
                >
                  Trang chủ
                </Link>
              </li>
              <li className="lg:py-8">
                <Link
                  to="/products"
                  className={` ${currentPage === "/products" ? "text-[#ca6f04]" : ""
                    } block py-2 pl-3 pr-4 uppercase font-medium text-[17px] duration-300  rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                >
                  Sản phẩm
                </Link>
              </li>
              <li className="lg:category-menu group lg:py-8 group relative">
                <Link
                  to="#"
                  className=" cursor-pointer block h-full pl-3 pr-4 uppercase font-medium text-[17px] duration-300 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Danh mục
                </Link>
                <ul className="lg:category-submenu  group-hover:block hidden">
                  <li>
                    {categoryList?.map((category: ICategory) => {
                      if (category?.category_name == "Chưa phân loại") {
                        return null;
                      }
                      return (
                        <Link key={category._id}
                          to={`/categories/${category._id}`}
                          className="block px-4 py-2 hover:bg-gray-200"
                        >
                          {category?.category_name}
                        </Link>
                      );
                    })}
                  </li>
                </ul>
              </li>
              <li className="lg:py-8">
                <Link
                  to="/about"
                  className={` ${currentPage === "/about" ? "text-[#ca6f04]" : ""
                    } block py-2 pl-3 pr-4 uppercase font-medium text-[17px] duration-300  rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                >
                  Giới thiệu
                </Link>
              </li>
              <li className="lg:py-8">
                <Link
                  to="/blog"
                  className={` ${currentPage === "/blog" ? "text-[#ca6f04]" : ""
                    } block py-2 pl-3 pr-4 uppercase font-medium text-[17px] duration-300  rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                >
                  Tin tức
                </Link>
              </li>
              <li className="lg:py-8">
                <Link
                  to="/contact"
                  className={` ${currentPage === "/contact" ? "text-[#ca6f04]" : ""
                    } block py-2 pl-3 pr-4 uppercase font-medium text-[17px] duration-300  rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-[#ca6f04] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header