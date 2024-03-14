export interface ISize {
  _id: string;
  id?: string
  size_name?: string;
  size_description?: string;
  size_is_new?: string;
  size_code?: string;
  data: ISize;
  sizes: ISize[]
}

