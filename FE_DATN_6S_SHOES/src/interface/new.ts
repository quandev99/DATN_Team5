export interface INew {
  _id?: string;
  news_title?: string;
  news_content: string;
  user_id?: string;
  product_id?: string;
  status?: string;
  news_view?: number;
  createdAt: Date;
  updatedAt?: Date;
  news_image?: IImage;
  data: INew;
  NewList: INew[];
  news: INew[];
  newData: INew[]
}

interface IImage {
  publicId: string;
  url: string;
}
