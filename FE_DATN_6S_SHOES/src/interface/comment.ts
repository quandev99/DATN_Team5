export interface IComment {
    _id?: string;
    user_avatar: string;
    user_fullname: string;
    comment_content: string;
    product_id?: string;
    createAt: Date;
}