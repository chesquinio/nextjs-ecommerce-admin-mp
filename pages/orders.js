import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
  return (
    <Layout>
      <h1>Pedidos</h1>
      <table className="basic">
        <thead>
          <tr>
            <td>Fecha</td>
            <th>Pago</th>
            <th>Destino</th>
            <th>Productos</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr>
                <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                <td className={order.paid ? 'text-green-600' : 'text-red-500'}>
                  {order.paid ? 'PAGADO' : 'NO PAGADO'}
                </td>
                <td>
                  {order.name} {order.email}
                  <br />
                  {order.city} {order.postalCode} {order.country}
                  <br />
                  {order.streetAddress}
                </td>
                <td>
                    {order.line_items.map(l => (
                        <>
                            {l.title} x {l.quantity} <br />
                        </>
                    ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default OrdersPage;
