export interface IUser {
    _id?: string;
    user_fullname: string;
    user_username: string;
    user_email: string;
    user_avatar?: object;
    user_phone?: number;
    user_address?: string;
    verifyToken?: object;
    isVerified?: boolean;
    user_password?: string;
    user_confirmPassword?: string;
    user_gender?: string;
    user_status: boolean;
    user_date_of_birth?: Date;
    role_id?: string;
    favorite_id?: string;
    cart_id?: string;
    slug?: string;
    bill?: [];
    createdAt?: any;
    updatedAt?: string;
    data: IUser;
    users: IUser[]
    user: IUser[]
}