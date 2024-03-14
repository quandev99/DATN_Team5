export interface IVariant {
    _id?: string;
    product_id: string;
    color_id: string;
    size_id: string;
    variant_price?: number;
    variant_discount?: number;
    variant_quantity?: number;
    variant_stock?: number;
    // createdAt?: any;
    // updatedAt?: string;
}