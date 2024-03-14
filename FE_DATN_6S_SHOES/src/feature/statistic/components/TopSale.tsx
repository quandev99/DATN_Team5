import { useGetProductByIdQuery } from "../../../api/product";

const TopSale = ({ item, index }: any) => {
    const { data: productDetail } = useGetProductByIdQuery(item?.product_id);
    const product = productDetail?.product;

    return <tr key={index}>
        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
            {index + 1}
        </td>
        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
            {product?.product_name}
        </td>
        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
            {item?.quantity}
        </td>
    </tr>;
};

export default TopSale;
