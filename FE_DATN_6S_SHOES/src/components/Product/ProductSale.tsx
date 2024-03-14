import { Link } from 'react-router-dom'

const ProductSale = () => {
    return (
        <div className="h-min-[70px] w-full rounded-lg bg-gray-100">
            <div
                className="block rounded-lg shadow-sm shadow-indigo-100 hover:shadow-md hover:shadow-green-400 transition-all duration-300">
                <div className="group relative rounded-lg block bg-black">
                    <div className="product-image max-w-[100px]">
                        <img alt="image"
                            src="https://salt.tikicdn.com/cache/w1200/ts/product/b7/25/08/d95f97f9bec3838b371872a32dc98277.jpg"
                            className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50" />
                    </div>
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <p className="font-bold text-white bg-red-400 px-1 rounded-md py-1 text-[13px]">
                                - 14%
                            </p>
                            <p className="bg-green-100 px-2 py-1 rounded-full text-[15px]">
                                <Link to="#">
                                    <i
                                        className="fa-regular transition-all duration-300 fa-heart fa-shake hover:font-bold focus:font-bold text-red-600">
                                    </i>
                                </Link>
                            </p>
                        </div>
                        <div className="icon-cart mt-32 sm:mt-3 lg:mt-[130px] px-2 sm:p-2 lg:pb-6">
                            <div
                                className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                                <p className="text-sm text-white text-center">
                                    <Link to="#"
                                        className="text-[25px] hover:text-yellow-500 transition-all duration-300">
                                        <i className="fa-solid fa-cart-shopping"></i>
                                    </Link>
                                    <Link to="#"
                                        className="text-[25px] hover:text-yellow-500 transition-all duration-300">
                                        <i className="fa-regular fa-eye"></i>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-3 product-content p-4">
                    <div>
                        <div>
                            <Link to="">
                                <h1
                                    className="text-[18px] font-bold text-black hover:text-[#ca6f04] transition-all duration-300">
                                    Sản phẩm 1</h1>
                            </Link>
                        </div>
                        <div className="flex space-x-2 py-2">
                            <div>
                                <h1 className="text-sm text-red-400 font-bold">$240,000</h1>
                            </div>
                            <div>
                                <dt className="sr-only">Price</dt>
                                <dd className="text-sm text-gray-500">$240,000</dd>
                            </div>
                        </div>
                        <div className="pt-4">
                            <span id="ProgressLabel" className="sr-only">Loading</span>
                            <span role="progressbar" aria-labelledby="ProgressLabel" aria-valuenow={75}
                                className="block rounded-full bg-gray-200">
                                <span
                                    className="block h-3 rounded-full w-[75%] bg-[repeating-linear-gradient(45deg,_var(--tw-gradient-from)_0,_var(--tw-gradient-from)_20px,_var(--tw-gradient-to)_20px,_var(--tw-gradient-to)_40px)] from-red-300 to-red-800"
                                ></span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductSale