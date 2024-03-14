import { MdDateRange } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useGetNewByIdQuery } from "../../api/new";
import { useGetUserByIdQuery } from "../../api/user";
import { useMemo } from "react";

const BlogDetailPage = () => {
  const { id } = useParams<string>();

  const { data: news } = useGetNewByIdQuery<any>(id as string);
  const dataNews = useMemo(() => news?.news, [news]);
  const user_id = dataNews?.user_id?._id;
  const { data: user } = useGetUserByIdQuery(user_id as string);
  const userData: any = user?.user

  const removePTags = (htmlString: any) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div>
      <main className=" w-[1080px] mx-auto my-10">
        <div className="w-[650px] mx-auto">
          <h1 className=" font-medium text-[50px] mb-2">
            {dataNews && dataNews?.news_title}
          </h1>
          <div className="flex items-center gap-3 my-4">
            <div className="w-[40px] h-[40px]">
              <img
                src={userData && userData?.user_avatar?.url}
                className="border bg-white shadow rounded-full w-full h-full object-cover"
                alt="image1"
              />
            </div>
            <h1 className="font-medium"> {userData && userData?.user_username}</h1>
            <div className="date flex items-center gap-2">
              <div className="flex items-center gap-1">
                <MdDateRange />
                <p className="text-gray-700">{new Date(dataNews && dataNews?.createdAt)?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="image">
          <img
            src={dataNews && dataNews?.news_image?.url}
            alt=""
            className="w-full h-full object-cover  rounded-[30px]"
          />
          <p className="text-center py-2">Hình 1 </p>
        </div>
        <p dangerouslySetInnerHTML={{ __html: removePTags(dataNews && dataNews?.news_content) }}></p>
      </main>
    </div>
  );
};
export default BlogDetailPage;
