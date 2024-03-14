export interface IFavorite {
    _id?: string,
    user_id: string,
    products?: string,
    favorite_is_new?: string,
    product_image: IIMage
}

interface IIMage {
    url: string,
    publicId:string
}
