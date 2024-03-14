import { Link } from 'react-router-dom'

const News = ({ new: data }: any) => {
  return (
    <div className="rounded-sm bg-white border border-gray-100 ">
      <Link to="#" className="block overflow-hidden group rounded-sm">
        <div className="group relative rounded-sm block  overflow-hidden">
          <span
            className="font-bold absolute mx-[1px] lg:mx-2 mt-1 text-white bg-red-700 px-1 rounded-lg py-1 text-[9px] lg:text-[13px] z-10">
            {data?.createdAt?.slice(0, 10).concat("")}</span>
          <Link to="" className="h-[150px] lg:h-[200px] bg-black text-white mx-auto mb-2 block overflow-hidden ">
            <img src={data?.news_image?.url}
              alt="Ảnh 1"
              className=" w-full object-cover transition-all duration-300 delay-100 opacity-90 group-hover:opacity-60 group-hover:scale-110 h-full" />
          </Link>
        </div>
        <div className="relative  bg-white">
          <h3>
            <Link
              to={`/blog/${data._id}`}
              className="text-[18px] hover:text-[#ca6f04] transition-all duration-300
                                        text-gray-700 font-medium">
              {data?.news_title?.length > 39 ? data?.news_title?.slice(0, 40).concat("...") : data?.news_title}
            </Link>
          </h3>
          <p className="text-[15px]" dangerouslySetInnerHTML={{ __html: data?.news_content?.length > 60 ? data?.news_content?.slice(0, 67).concat("...") : data?.news_content }}>
          </p>
          <p className="mt-2 mb-3 flex justify-between items-center">
            <Link
              to={`/blog/${data._id}`}
              className="border-2 px-3 py-1 transition-all duration-200 rounded-md border-red-600 hover:bg-red-600 hover:text-gray-100">
              Đọc tiếp</Link>
          </p>
        </div>
      </Link>
    </div>

  )
}

export default News