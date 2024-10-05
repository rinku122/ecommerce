import React, { useEffect, useState } from "react";
import "./cartstyle.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeToCart,
  removeSingleIteams,
  emptycartIteam,
  setLoader,
} from "../redux/features/cartSlice";
import toast from "react-hot-toast";
import { applyDiscount, confirmOrder } from "../api/api";

const CartDetails = () => {
  const { carts, userId } = useSelector((state) => state.allCart);

  const [totalprice, setPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [totalquantity, setTotalQuantity] = useState(0);
  const [enableDiscount, setEnableDiscount] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  const dispatch = useDispatch();

  // add to cart
  const handleIncrement = (e) => {
    dispatch(addToCart(e));
  };

  // remove to cart
  const handleDecrement = (e) => {
    dispatch(removeToCart(e));
    toast.success("Item Remove From Your Cart");
  };

  // remove single item
  const handleSingleDecrement = (e) => {
    dispatch(removeSingleIteams(e));
  };

  // empty cart
  const confirmOrderAction = async () => {
    try {
      dispatch(setLoader(true));

      const items = carts.map((elem) => {
        return {
          productId: elem.id,
          quantity: elem.qnty,
        };
      });

      const payload = { userId, items };
      await confirmOrder(payload);
      toast.success("Order Confirmed");
      setEnableDiscount(true);
      dispatch(setLoader(false));
    } catch (error) {
      console.log(error);
    }
  };

  // Apply Discount
  const getDiscount = async () => {
    try {
      dispatch(setLoader(true));

      const payload = { userId, discountCode };
      const res = await applyDiscount(payload);
      const price = totalprice - res.data.data.finalAmount;
      setDiscountedPrice(price);
      setDiscountCode("");
      toast.success("Discount Aplied");
      dispatch(setLoader(false));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // count total price
  const total = () => {
    let totalprice = 0;
    carts.map((ele, ind) => {
      totalprice = ele.price * ele.qnty + totalprice;
    });
    setPrice(totalprice);
  };

  // count total quantity
  const countquantity = () => {
    let totalquantity = 0;
    carts.map((ele, ind) => {
      totalquantity = ele.qnty + totalquantity;
    });
    setTotalQuantity(totalquantity);
  };

  useEffect(() => {
    total();
  }, [total]);

  useEffect(() => {
    countquantity();
  }, [countquantity]);

  return (
    <>
      <div className="row justify-content-center m-0">
        <div className="col-md-8 mt-5 mb-5 cardsdetails">
          <div className="card">
            <div className="card-header bg-dark p-3">
              <div className="card-header-flex">
                <h5 className="text-white m-0">
                  Cart Calculation{carts.length > 0 ? `(${carts.length})` : ""}
                </h5>
                {carts.length > 0 ? (
                  <div>
                    {enableDiscount && (
                      <input
                        style={{
                          minHeight: "30px",
                          minWidth: "400px",
                        }}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        value={discountCode}
                        type="text"
                        className="qty-input-box"
                        name=""
                        id=""
                      />
                    )}
                    <button
                      disabled={discountedPrice}
                      className="btn btn-danger mt-0 btn-sm"
                      onClick={
                        enableDiscount ? getDiscount : confirmOrderAction
                      }
                    >
                      <span>
                        {!enableDiscount ? "Confirm order" : "Apply Discount"}{" "}
                      </span>
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="card-body p-0">
              {carts.length === 0 ? (
                <table className="table cart-table mb-0">
                  <tbody>
                    <tr>
                      <td colSpan={6}>
                        <div className="cart-empty">
                          <i className="fa fa-shopping-cart"></i>
                          <p>Your Cart Is Empty</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="table cart-table mb-0 table-responsive-sm">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th className="text-right">
                        {" "}
                        <span id="amount" className="amount">
                          Total Amount
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {carts.map((data, index) => {
                      return (
                        <tr key={`index_${index}`}>
                          <td>
                            <button
                              className="prdct-delete"
                              onClick={() => handleDecrement(data.id)}
                            >
                              <i className="fa fa-trash-alt"></i>
                            </button>
                          </td>
                          <td>
                            <div className="product-img">
                              <img src={data.imgdata} alt="" />
                            </div>
                          </td>
                          <td>
                            <div className="product-name">
                              <p>{data.dish}</p>
                            </div>
                          </td>
                          <td>{data.price}</td>
                          <td>
                            <div className="prdct-qty-container">
                              <button
                                disabled={discountedPrice}
                                className="prdct-qty-btn"
                                type="button"
                                onClick={
                                  data.qnty <= 1
                                    ? () => handleDecrement(data.id)
                                    : () => handleSingleDecrement(data)
                                }
                              >
                                <i className="fa fa-minus"></i>
                              </button>
                              <input
                                type="text"
                                className="qty-input-box"
                                value={data.qnty}
                                disabled
                                name=""
                                id=""
                              />
                              <button
                                disabled={discountedPrice}
                                className="prdct-qty-btn"
                                type="button"
                                onClick={() => handleIncrement(data)}
                              >
                                <i className="fa fa-plus"></i>
                              </button>
                            </div>
                          </td>
                          <td className="text-right">
                            ₹ {data.qnty * data.price}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>&nbsp;</th>
                      <th colSpan={2}>&nbsp;</th>
                      <th>
                        Items In Cart <span className="ml-2 mr-2">:</span>
                        <span className="text-danger">{totalquantity}</span>
                      </th>
                      <th className="text-right">
                        Total Price<span className="ml-2 mr-2">:</span>
                        <span className="text-danger">₹ {totalprice}</span>
                      </th>
                      <th className="text-right">
                        Discount <span className="ml-2 mr-2">:</span>
                        <span className="text-danger">₹ {discountedPrice}</span>
                      </th>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDetails;
