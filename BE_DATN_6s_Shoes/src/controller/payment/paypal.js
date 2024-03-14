import paypal from "paypal-rest-sdk";
import Bill from "../../model/bill.js";
import Coupon from "../../model/coupon.js";
import Product from "../../model/product.js";
import Variant_product from "../../model/variant_product.js";

paypal.configure({
  mode: "sandbox",
  client_id:
    "ATFR1DxLbdZBOfpuui_Ebru0r__bc1G2iD3dGGBToLX40A0HoTctGd3nMDzTf-A1WZgWJf4lF31NVgr3",
  client_secret:
    "EB7lcwF38VybqQpMUJ9sfmObC8sbKofUZ5F4SRQf5fL8M4oFzhJ31yNu75s3HePLbHGYt5SKknvDZRvx",
});

export const PayPal = (req, res) => {
  const { products, user_id, coupon_id, bill_phone, bill_shippingAddress } =
    req.body;
  const exchangeRate = 1 / 24057;
  const transformedProducts = products.map((product) => {
    const classOption = `Price=${product.product_price}&&Color=${product.color_id}&&Size=${product.size_id}`;
    const priceUsd = (product.product_price * exchangeRate).toFixed(2);
    return {
      sku: product.product_id,
      name: product.product_name,
      quantity: product.product_quantity,
      image_url: product.product_image,
      description: classOption,
      price: priceUsd,
      currency: "USD",
    };
  });
  const totalMoney = transformedProducts.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `http://localhost:8080/api/success`,
      cancel_url: `http://localhost:5173/carts`,
    },
    transactions: [
      {
        item_list: {
          items: transformedProducts,
        },
        amount: {
          currency: "USD",
          total: totalMoney.toString(),
        },
        description: "Hat for the best team ever",
        custom: JSON.stringify({
          bill_phone: bill_phone,
          bill_shippingAddress: bill_shippingAddress,
          user_id: user_id,
          coupon_id: coupon_id,
        }),
      },
    ],
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      res.status(400).json(error);
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.json({ approval_url: payment.links[i].href });
          return;
        }
      }
    }
  });
};

export const PayPalSuccess = (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const token = req.query.token;
  const execute_payment_json = {
    payer_id: payerId,
  };
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async (error, payment) => {
      if (error) {
        console.log(error.response);
      } else {
        const productList = payment.transactions[0].item_list.items.map(
          (item) => {
            const classOption = item.description.split("&&");

            let color = "";
            let size = "";
            let material = "";
            let price = "";
            classOption.forEach((info) => {
              if (info.includes("Color=")) {
                color = info.replace("Color=", "");
              }
              if (info.includes("Size=")) {
                size = info.replace("Size=", "");
              }
              if (info.includes("Price=")) {
                price = info.replace("Price=", "");
              }
            });
            return {
              product_name: item.name,
              quantity: item.quantity,
              product_price: Number(price),
              product_id: item.sku,
              product_image: item.image_url,
              color_id: color,
              size_id: size,
            };
          }
        );
        const customData = JSON.parse(payment.transactions[0].custom);
        const bill_phone = customData.bill_phone;
        const bill_shippingAddress = customData.bill_shippingAddress;
        const user_id = customData.user_id;
        const coupon_id = customData.coupon_id;
        const totalMoney = productList.reduce((acc, product) => {
          return acc + product.product_price * product.quantity;
        }, 0);
        const formattedData = {
          products: productList,
          total: totalMoney,
          bill_phone,
          bill_shippingAddress,
          user_id,
          coupon_id,
          paymentId,
          paymentCode: token,
          payerId,
        };
        if (formattedData.coupon_id !== null) {
          const coupon = await Coupon.findById(formattedData.coupon_id);
          if (coupon && coupon.coupon_quantity > 0) {
            coupon.coupon_quantity -= 1;
            await coupon.save();
          } else {
            res.send("Đã hết phiếu giảm giá");
            return;
          }
        }
        for (const item of formattedData.products) {
          const product = await Product.findById(item.product_id);
          const childProduct = await Variant_product.findOne({
            product_id: item.product_id,
            color_id: item.color_id,
            size_id: item.size_id,
          });
          if (product && childProduct) {
            childProduct.variant_quantity -= item.quantity;
            product.sold_quantity += item.quantity;
            await childProduct.save();
            await product.save();
          }
        }
        await Bill.create(formattedData);
        res.redirect("http://localhost:5173/checkout");
      }
    }
  );
};
