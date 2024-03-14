import { useState, useEffect } from 'react';
import { Table, Rate } from 'antd';
import { useGetReviewsQuery } from '../../../api/review';
// import { useGetProductByIdQuery } from '../../../api/product';
import { ColumnsType } from 'antd/es/table';
import { IReview } from '../../../interface/review';
import { Link } from 'react-router-dom';
const ReviewList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [reviews, setReviews] = useState<IReview[]>([]);

    const { data: reviewData } = useGetReviewsQuery<any>({ currentPages: currentPage });
    console.log(reviewData);

    useEffect(() => {
        if (reviewData) {
            setReviews(reviewData.reviews || []);
            setTotalItems(reviewData.pagination?.totalItems || 0);
        }
    }, [reviewData]);

    const onHandlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const columns: ColumnsType<IReview> = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            width: "1%"
        },
        {
            title: 'Người đánh giá',
            dataIndex: 'user_fullname',
            key: 'user_fullname',
        },
        {
            title: 'Nội dung đánh giá',
            dataIndex: 'review_content',
            key: 'review_content',
        },
        // {
        //     title: 'Ảnh đánh giá',
        //     dataIndex: 'review_image',
        //     key: 'review_image',
        //     render: (reviewImage: { url: string }[]) => (
        //         reviewImage && reviewImage.length > 0
        //             ? <img src={reviewImage[0]?.url} alt="Review Image" style={{ width: '60px', height: '60px' }} />
        //             : 'Không có ảnh'
        //     ),
        // },
        {
            title: 'Sản phẩm',
            dataIndex: 'product_id',
            key: 'product_id',

            render: (record: any) => {
                return <Link to={`/products/${record?._id}`}>{record?.product_name}</Link>
            }
        },
        {
            title: 'Số sao',
            dataIndex: 'review_rating',
            key: 'review_rating',
            width: "15%",
            render: (rating: number) => <Rate disabled value={rating} />,
        },
        {
            title: 'Ngày đánh giá',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (record: number) => new Date(record)?.toLocaleString(),
        },
    ];

    return (
        <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="max-w-2xl font-medium mb-4 text-[#2c7be5] text-[20px]">Danh sách đánh giá</h2>
            <Table
                dataSource={reviews.map((review: IReview, index: number) => ({
                    ...review,
                    STT: index + 1 + (currentPage - 1) * 10,
                }))}
                columns={columns}
                pagination={{
                    current: currentPage,
                    total: totalItems,
                    onChange: onHandlePageChange,
                }}
            />
        </div>
    );
};

export default ReviewList;
