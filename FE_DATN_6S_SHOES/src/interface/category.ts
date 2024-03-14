export interface ICategory {
    id?: string
    _id?: string;
    category_name?: string;
    category_description?: string;
    category_image?: Object;
    brand_id?: string;
    data?: any,
    categories: ICategory[];
}