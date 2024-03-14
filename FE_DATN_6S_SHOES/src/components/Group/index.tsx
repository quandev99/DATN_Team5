
const ProductGroup = ({ group, products }: any) => {
    return (
        <div className="product-group">
            <h2>{group.group_name}</h2>
            <div className="product-list">
                {products.map((product: any) => (
                    // Render each product within the group
                    <div key={product._id}>
                        {/* Add your product information here */}
                        <h3>{product.product_name}</h3>
                        {/* Add more product details as needed */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductGroup;