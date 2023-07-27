import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { Order } from "@/models/Order";
import { mongooseConnect } from "@/lib/mongoose";

function Home({totalIncome, paidOrdersCount, soldProductsCount}) {
  const { data: session } = useSession();
  if (!session) return;
  return (
    <Layout>
      <div className="text-blue-600 flex justify-between">
        <h2>
          Hola, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img
            src={session?.user?.image}
            className="w-10 h-10"
            alt={session?.user?.name}
          />
          <span className="py-1 px-2">{session?.user?.name}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 mt-9 text-center">
        <div className="bg-gray-100 rounded-lg p-9">
          <h3 className="font-extralight">${totalIncome}</h3>
          <p>Ingresos totales</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-9">
          <h3 className="font-extralight">{paidOrdersCount}</h3>
          <p>Pedidos</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-9">
          <h3 className="font-extralight">{soldProductsCount}</h3>
          <p>Productos vendidos</p>
        </div>
      </div>
    </Layout>
  );
}

export default Home;

export async function getServerSideProps() {
  await mongooseConnect();

  try {
    const paidOrders = await Order.find({ paid: true });

    let totalIncome = 0;
    let soldProductsCount = 0;

    paidOrders.forEach((order) => {
      order.line_items.forEach((lineItem) => {
        totalIncome += lineItem.unit_price * lineItem.quantity;
        soldProductsCount += lineItem.quantity;
      });
    });
    const paidOrdersCount = paidOrders.length;

    return {
      props: {
        totalIncome,
        paidOrdersCount,
        soldProductsCount,
      },
    };
  } catch (error) {
    console.error("Error calculating total income:", error);
    return {
      props: {
        totalIncome: 0,
      },
    };
  }
}
