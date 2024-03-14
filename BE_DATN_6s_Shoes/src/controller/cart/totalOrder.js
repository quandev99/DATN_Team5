export const totalOrder = async (cart) => {
  try {
    const total = cart.products.reduce((accumulator, product) => {
      if (product) {
        return accumulator + product.price;
      }
      return accumulator;
    }, 0);
    cart.cart_totalPrice = total;
    if (cart.cart_totalPrice < 100000) {
      cart.shippingFee = 30000;
      cart.cart_totalOrder = cart.cart_totalPrice + cart.shippingFee;
    } else {
      cart.shippingFee = 0;
      cart.cart_totalOrder = cart.cart_totalPrice;
    }
    await cart.save();
    return cart;
  } catch (error) {
    return error.message;
  }
};
