
import { useEffect, useLayoutEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Sidebar } from "./components";
import "./index.css"
import { getDecodedAccessToken } from "../../decoder";
import { useGetUserByIdQuery } from "../../api/user";
import { checkAndRemoveExpiredData } from "../../util/checkAndRemoveExpiredData";

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const token: any = getDecodedAccessToken();
    const { data: userData } = useGetUserByIdQuery<any>(token?._id);
    const userDetail = userData?.user;
    const navigate = useNavigate();
    useEffect(() => {
        if (token === null) {
            navigate("/admin")
        }
    }, [token])

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useLayoutEffect(() => {
        checkAndRemoveExpiredData();
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setHasScrolled(true);
            } else {
                setHasScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="flex w-screen">
            <nav
                className={`fixed top-0 z-50 w-full border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 ${hasScrolled ? "shadow transition-all " : " transition-all py-1"
                    }`}>
                <div className="px-3 py-s3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start">
                            <button
                                data-drawer-target="default-sidebar"
                                data-drawer-toggle="default-sidebar"
                                aria-controls="default-sidebar"
                                type="button"
                                className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>

                            <Link to="/" className="flex ml-2 md:mr-24">
                                <img className="h-14 mr-3" src="https://res.cloudinary.com/djlylbhrb/image/upload/v1697540176/h9ruhsfbuzwuq137kzwo.png" alt="" />
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">6s Shoes</span>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ml-3 group">
                                <div>
                                    <button
                                        aria-expanded={isOpen}
                                        onClick={toggleDropdown}
                                        type="button"
                                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" data-dropdown-toggle="dropdown-user">
                                        <span className="sr-only">Open user menu</span>
                                        <img className="w-8 h-8 rounded-full" src={userDetail?.user_avatar?.url} alt="user photo" />
                                    </button>
                                </div>
                                <div
                                    className={`z-50 ${isOpen ? 'block' : 'hidden'
                                        } my-4 text-base absolute top-10 right-4 list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600`}
                                    id="dropdown-user"
                                >
                                    <div className="px-4 py-3" role="none">
                                        <p className="text-sm text-gray-900 dark:text-white" role="none">
                                            {userDetail?.user_username}
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                            {userDetail?.user_email}
                                        </p>
                                    </div>
                                    <ul className="py-1" role="none">
                                        <li>
                                            <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Quản trị</Link>
                                        </li>
                                        <li>
                                            <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</Link>
                                        </li>
                                        <li>
                                            <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Earnings</Link>
                                        </li>
                                        <li>
                                            <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Trang người dùng</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav >
            <aside
                id="logo-sidebar"
                className="fixed top-0 left-0 z-40 bg-gray-50 w-64 h-screen pt-20 transition-transform translate-x-full  border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 overflow-y-auto"
                aria-label="Sidebar"
            >
                <div className="custom-scrollbar ">
                    <Sidebar />
                </div>
            </aside>
            <div className="p-6 sm:ml-64 w-screen ">
                <div className={`p-4 bg-white    rounded-lg dark:border-gray-700 mt-14`}>
                    <Outlet />
                </div>
            </div>
        </div >
    )
}

export default AdminLayout