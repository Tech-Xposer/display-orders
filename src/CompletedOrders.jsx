import React, { useEffect, useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./App.css";
import { NavLink } from "react-router-dom";

function CompletedOrders() {
	const ENDPOINT = process.env.REACT_APP_BACKEND_URL;
	console.log(ENDPOINT);
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		// Fetch initial orders
		fetch(`${ENDPOINT}/completed_orders`)
			.then((response) => response.json())
			.then((data) => setOrders(data))
			.catch((error) => console.error("Error fetching orders:", error));
	}, []);

	

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
			"Order No.",
			"Party Name",
			"Station Name",
			"Division",
			"Order By",
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
			<h1 className="text-3xl font-bold">Completed Orders</h1>
            <div className="flex justify-center items-center">
				<NavLink
					to={"/"}
					className={"bg-yellow-500 p-2 rounded-md text-white mt-4"}>
					View Live Orders
				</NavLink>
			
			</div>
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
								<td className="order_by">{order.order_by || "N/A"}</td>
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

export default CompletedOrders;
