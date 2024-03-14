import { Outlet } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { checkAndRemoveExpiredData } from "../../util/checkAndRemoveExpiredData"
import { useLayoutEffect } from "react"
const ClientLayout = () => {
    useLayoutEffect(() => {
        checkAndRemoveExpiredData();
    }, [])


    return (
        <div className="">
            <div className=" ">
                {/* <div className="flex items-center justify-between gap-4 bg-[#DAAD86] px-4 py-3 text-white">
                    <p className="text-sm font-medium">
                        Love Alpine JS?
                        <a href="#" className="inline-block underline">Check out this new course!</a>
                    </p>

                    <button aria-label="Dismiss" className="shrink-0 rounded-lg bg-black/10 p-1 transition hover:bg-black/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div> */}
                <Header />
                <div className="mt-24">
                    <div className=" flex flex-col items-center">
                        <Outlet />
                    </div>
                </div>
                <Footer />
            </div>
        </div >
    )
}

export default ClientLayout