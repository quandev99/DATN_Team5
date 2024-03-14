export default interface IBanner {
  _id?: string | number;
  brand_name?: string;
  banner_image?: object;
  banner_link?: string;
  display_order?: number;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
