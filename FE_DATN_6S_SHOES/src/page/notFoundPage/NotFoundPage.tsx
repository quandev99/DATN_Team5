import { Result } from "antd"
import { Link } from "react-router-dom"

const NotFoundPage = () => {
    return (
        <div>
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi! Không thể tìm thấy trang này"
                extra={<Link to={'/'} className="bg-blue-600 hover:bg-blue-800 transition-all px-4 py-2 text-white rounded-md">Trang chủ</Link>}
            />
        </div>
    )
}

export default NotFoundPage