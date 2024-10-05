import React, { useEffect, useState } from "react";
import { generateDiscountCode, getAllPurchases } from "../api/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoader } from "../redux/features/cartSlice";

const Admin = () => {
  const [orderNumber, setOrderNumber] = useState();
  const [purchases, setPurchases] = useState([]);
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [discountCodes, setDiscountCodes] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    getPurchases();
  }, []);

  const getPurchases = async () => {
    try {
      dispatch(setLoader(true));

      let res = await getAllPurchases();
      setPurchases(res.data.data.purchases);
      setTotalPurchase(res.data.data.totalPurchaseAmount);
      setTotalDiscount(res.data.data.totalDiscount);
      const _discountCodes = res.data.data.discountCodes;
      let discounts = {};
      for (let key in _discountCodes) {
        discounts[key] = _discountCodes[key];
      }
      setDiscountCodes(discounts);
      dispatch(setLoader(false));
    } catch (error) {
      console.log(error);
    }
  };

  const generateDiscountAction = async () => {
    try {
      if (!orderNumber) return toast.error("Ordernumber required");
      dispatch(setLoader(true));
      await generateDiscountCode(orderNumber);
      toast.success("Discount Generated");
      await getPurchases();
      dispatch(setLoader(false));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div
      className="admin-panel"
      style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Welcome Admin
      </h1>

      <section className="orders-section" style={{ marginBottom: "30px" }}>
        <h2>Purchases</h2>
        <p style={{ fontWeight: "bold" }}>
          Total Purchase Amount: ${totalPurchase}
        </p>
        <p style={{ fontWeight: "bold" }}>
          Total Discount Given: ${totalDiscount}
        </p>

        <table
          border="1"
          style={{
            width: "100%",
            marginBottom: "20px",
            borderCollapse: "collapse",
            padding: "10px",
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: "10px" }}>Order ID</th>
              <th style={{ padding: "10px" }}>User ID</th>
              <th style={{ padding: "10px" }}>Total Amount</th>
              <th style={{ padding: "10px" }}>Discount Applied</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((order) => (
              <tr key={order.orderId}>
                <td style={{ padding: "10px" }}>{order.orderId}</td>
                <td style={{ padding: "10px" }}>{order.userId}</td>
                <td style={{ padding: "10px" }}>${order.totalAmount}</td>
                <td style={{ padding: "10px" }}>${order.discountApplied}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="discount-section" style={{ marginBottom: "30px" }}>
        <h2>Generate Discount Code</h2>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter order number"
            style={{ padding: "10px", marginRight: "10px", width: "200px" }}
          />
          <button
            onClick={generateDiscountAction}
            style={{
              padding: "10px 15px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Generate Discount Code
          </button>
        </div>
      </section>

      <section className="discount-codes-section">
        <h2>Discount Codes</h2>
        <ul style={{ paddingLeft: "20px" }}>
          {Object.keys(discountCodes).map((code) => (
            <li key={code} style={{ marginBottom: "5px" }}>
              {code} - {discountCodes[code].isUsed ? "Used" : "Available"}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Admin;
