export interface IReview {
    _id?: string;
    user_id?: string;
    product_id?: string;
    bill_id?: string;
    review_rating?: number;
    review_content?: string;
    createdAt?: Date,
    updatedAt?: Date,
    review_image?: object;
  }