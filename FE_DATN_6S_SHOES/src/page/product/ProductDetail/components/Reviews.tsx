import { useState } from "react";
import { useGetReviewProductIdQuery } from "../../../../api/review";
import { Pagination, Rate } from "antd";

const Reviews = ({ idProduct }: { idProduct: string }) => {
    const [currentPages, setCurrentPage] = useState(1);
    const dataReq: any = {
        currentPages,
        productId: idProduct
    }

    const { data: reviewsRes, error } = useGetReviewProductIdQuery<any>(dataReq);

    const totalItems = reviewsRes?.pagination?.totalItems
    // XỬ LÝ KHI CHUYỂN TRANG
    const onHandlePageChange = (page: number) => {
        setCurrentPage(page);
    }
    return <div>
        {error ? 'Sản phẩm chưa có đánh giá nào' : (
            <div>
                <div className="grid grid-cols-2 bg-white p-4 shadow-md">
                    {reviewsRes &&
                        reviewsRes?.review.map((review: any, index: string) => {
                            return (
                              <div
                                key={index}
                                className="p-3 border shadow border-gray-50  grid grid-cols-7 gap-1"
                              >
                                <div>
                                  <img
                                    className="w-10 h-10 rounded-full border"
                                    src={
                                      review?.user_id?.user_avatar?.url ||
                                      "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg"
                                    }
                                    alt=""
                                  />
                                </div>
                                <div className="col-span-6">
                                  <h1 className="font-medium  text-[17px]">
                                    {
                                      review?.user_fullname || review
                                        ?.user_id?.user_fullname
                                    }
                                  </h1>
                                  <div>
                                    <Rate
                                      allowHalf
                                      value={review?.review_rating}
                                    />
                                  </div>

                                  <span className="text-gray-500 text-[13px]">
                                    {new Date(
                                      review?.createdAt
                                    ).toLocaleString()}
                                  </span>
                                  <p>{review?.review_content}</p>
                                  <div className="flex gap-2 mt-2">
                                    {review?.review_image?.map(
                                      (image: {
                                        url: string;
                                        publicId: string;
                                      }) => {
                                        return (
                                          <div className="w-[60px] h-[60px] border">
                                            <img
                                              src={image?.url}
                                              alt="No Image"
                                              className="w-full h-full"
                                            />
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                        })}
                </div>
                <div className="text-center">
                    <Pagination current={currentPages} total={totalItems} onChange={onHandlePageChange} className="mt-5" />
                </div>
            </div>
        )}


    </div>;
};

export default Reviews;
