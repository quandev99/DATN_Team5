import { Link } from "react-router-dom";
import { useGetNewsQuery } from "../../api/new";
import { INew } from "../../interface/new";
import { useMemo } from "react";

const BlogPage = () => {
  const { data: NewList } = useGetNewsQuery({ limit: 10 });
  const newData = useMemo(() => NewList?.news, [NewList]);

  return (
    <div>
      <main className=" w-[1280px] mx-auto mt-10">
        <div>
          <h1 className="text-center font-medium text-[25px] mb-2">
            Tin tức nổi bật
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          {newData && newData?.map((item: INew) => {
            return (
              <div key={item?._id}>
                <article className="overflow-hidden rounded-lg shadow border-2 hover:border-green-200 transition-all hover:shadow-lg">
                  <Link to={`/blog/${item._id}`} className="hover:opacity-80  transition-all">
                    <img
                      alt="Office"
                      src={item?.news_image?.url}
                      className="h-56 w-full object-cover"
                    />
                  </Link>

                  <div className="bg-white p-4 sm:p-6">
                    <time
                      dateTime="2022-10-10"
                      className="block text-xs text-gray-500"
                    >
                      {new Date(item?.createdAt)?.toLocaleString()}
                    </time>

                    <Link to={`/blog/${item?._id}`}>
                      <h3 className="mt-0.5 text-lg text-gray-900 transition-all hover:underline">
                        {item?.news_title}
                      </h3>
                    </Link>

                    <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500" dangerouslySetInnerHTML={{ __html: item?.news_content }}></p>
                    <Link
                      to={`/blog/${item?._id}`}
                      className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600"
                    >
                      Find out more
                      <span
                        aria-hidden="true"
                        className="block transition-all group-hover:ms-0.5 rtl:rotate-180"
                      >
                        &rarr;
                      </span>
                    </Link>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
