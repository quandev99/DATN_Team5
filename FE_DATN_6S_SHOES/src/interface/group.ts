export interface IGroup {
    _id?: string,
    group_name: string,
    group_description: string,
    group_link: string,
    end_date: Date,
    start_date: Date,
    createdAt: Date,
    updatedAt: Date,
    status: boolean,
    key: number,
    order_sort: number,
    products?: [],
    favorite_is_new?: string,
    group_background: IIMage,
    groups: IGroup[],
    group: IGroup,
    data: IGroup
}

interface IIMage {
    url: string,
    publicId: string
}
