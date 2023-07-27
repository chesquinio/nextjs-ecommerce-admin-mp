import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get("/api/products").then((response) => {
      setProducts(response.data);
    });
  }, []);
  return (
    <Layout>
      <Link
        href={"/products/new"}
        className="btn-primary"
      >
        Nuevo producto
      </Link>
      <table className="basic">
        <thead>
          <tr>
            <td>Nombre del Producto</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.title}</td>
              <td>
                <Link className="btn-default" href={"/products/edit/" + product._id}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                  Editar
                </Link>
                <Link className="btn-red" href={"/products/delete/" + product._id}>
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAALFJREFUSEtjZKAxYKSx+Qx4Lfj+/bsD0///8xkYGBRwOOTBP0bGRE5OzgO4HIrXgh/fvu1nZGBwIODLB+xcXIpkWfDz27f/II3sXFxYHUJIHqQXrw8IGUBIHsMCmAZKIx7Zxyg+oLkFMJcT43VkX+JTT3bkjVqAN/2jp7LROCCY70aDaAgGEZEVDYrP/jMwHODg4nJE9y7WsghUVTL+/19PRG0GMw9n1TmwlT7B2CVCAQA/TpUZYU/rpgAAAABJRU5ErkJggg=="/>                  
                  Eliminar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default Products;
