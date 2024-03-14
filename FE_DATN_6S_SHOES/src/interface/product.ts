
export interface IProduct {
    id?: string
    product_name?: string;
    product_image?: IImageProduct
    thumbnail: [];
    product_code?: string;
    product_view?: number;
    product_description_short?: string;
    product_description_long?: string;
    product_is_new?: boolean;
    favorite_id?: string;
    category_id?: string;
    group_id?: string
    brand_id?: string
    _id?: string;
    createdAt?: any;
    updatedAt?: string;
    is_on_sale?: boolean
    data: IProduct;
    products: IProduct[],
    variant_products: [],
    product: IProduct
}

export interface IImageProduct {
    publicId: string,
    url: string
}