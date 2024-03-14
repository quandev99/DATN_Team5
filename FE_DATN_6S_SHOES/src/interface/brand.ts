export default interface IBrand {
  _id?: string | number;
  brand_name?: string;
  brand_image?: object;
  brand_description?: string;
  product_id?: string[];
  category_id?: string[];
  brand_is_new?: boolean;
  brand_status?: boolean;
  brand_default?: boolean;
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
  data: IBrand;
  brands: IBrand[];
}
