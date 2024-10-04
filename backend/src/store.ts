export const store = {
  cartData: {}, // { userId: [ { productId, quantity }, ... ] }
  ordersData: [], // [ { orderId, userId, items, totalAmount, discountApplied } ]
  discountCodes: {}, // { code: { isUsed: false, discount: 10 } }
  orderCount: 0, //
};
