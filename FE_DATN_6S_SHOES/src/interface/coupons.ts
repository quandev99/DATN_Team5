export interface ICoupon {
  _id?: string;
  coupon_name: string;
  coupon_code: string;
  coupon_content: string;
  coupon_quantity: number;
  discount_amount: number;
  expiration_date: Date;
  min_purchase_amount: number;
  createdAt?: Date;
  updatedAt?: Date;
  data: ICoupon;
  cart: any;
  ListCoupon: ICoupon[];
  DataCoupon: ICoupon[];
  coupon: ICoupon[];
  dataCoupon: ICoupon;
  Coupon: ICoupon;
  isSpecial: boolean,
  status: boolean,
  users: any,
  used_by_users: []
}
