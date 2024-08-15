import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./App.css";

function App() {
  const ENDPOINT = process.env.REACT_APP_BACKEND_URL;
  console.log(ENDPOINT);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    // Handle real-time updates
    socket.on("update", (data) => {
      setOrders((prevOrders) => {
        const existingOrderIndex = prevOrders.findIndex(
          (order) => order.order_number === data.order_number,
        );

        if (existingOrderIndex > -1) {
          const updatedOrders = [...prevOrders];
          updatedOrders[existingOrderIndex] = data;
          return updatedOrders;
        } else {
          return [data, ...prevOrders];
        }
      });
    });

    // Fetch initial orders
    fetch(`${ENDPOINT}/orders`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));

    // Clean up on component unmount
    return () => socket.disconnect();
  }, []);

  const handleClearOrders = () => {
    if (window.confirm("Do you really want to clear all orders?")) {
      fetch(`${ENDPOINT}/clear_orders`, {
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "All orders cleared") {
            setOrders([]);
          }
        })
        .catch((error) => console.error("Error clearing orders:", error));
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "marketing":
        return "marketing";
      case "packaging":
        return "packaging";
      case "billing":
        return "billing";
      case "dispatch":
        return "dispatch";
      default:
        return "";
    }
  };

  // Render table headers with resizable columns
  const renderHeader = () => {
    const headers = [
      "Order Number",
      "Party Name",
      "Station Name",
      "Division",
      "Transport",
      "Promotional Material",
      "Date and Time",
      "Total Shipper",
      "Packed",
      "Packed Time",
      "Billed",
      "Billed Time",
      "Dispatched",
      "Dispatched Time",
    ];

    return headers.map((header, index) => (
      <th key={index}>
        <ResizableBox width={100} height={20} axis="x" resizeHandles={["e"]}>
          <span>{header}</span>
        </ResizableBox>
      </th>
    ));
  };

  return (
    <div className="App">
      <h1>Order Display</h1>
      <button onClick={handleClearOrders} className="clear-button">
        Clear Orders
      </button>
      <table>
        <thead>
          <tr>{renderHeader()}</tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="14" className="no-orders">
                No orders available.
              </td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr key={index} className={getStatusClass(order.status)}>
                <td className="order_number">{order.order_number}</td>
                <td className="party_name">{order.party_name}</td>
                <td className="station_name">{order.station_name}</td>
                <td className="division">{order.division}</td>
                <td className="transport">{order.transport}</td>
                <td className="promotional_material">
                  {order.promotional_material}
                </td>
                <td className="date_and_time">{order.date_and_time}</td>
                <td className="total_shipper">{order.total_shipper || ""}</td>
                <td className="packed">{order.packed || ""}</td>
                <td className="packed_time">{order.packed_time || ""}</td>
                <td className="billed">{order.billed || ""}</td>
                <td className="billed_time">{order.billed_time || ""}</td>
                <td className="dispatched">{order.dispatched || ""}</td>
                <td className="dispatched_time">
                  {order.dispatched_time || ""}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
