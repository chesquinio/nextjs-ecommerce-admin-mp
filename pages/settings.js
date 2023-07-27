import Layout from "@/components/Layout";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Settings() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    }
    fetchProducts();
  }, []);

  const handleSaveFeaturedProduct = async () => {
    if (!selectedProduct) {
      alert("Selecciona un producto antes de guardar.");
      return;
    }
    try {
        await axios.put("/api/products", { _id: selectedProduct._id, action: "updateMain" });
        console.log("Producto seleccionado y guardado correctamente.");
      } catch (error) {
        console.error("Error al guardar el producto:", error);
    }
    
  };


  return (
    <Layout>
      <h2>Producto principal destacado:</h2>
      <select
        value={selectedProduct ? selectedProduct._id : ""}
        onChange={(e) => {
          const productId = e.target.value;
          const product = products.find((p) => p._id === productId);
          setSelectedProduct(product);
        }}
      >
        <option value="">Producto</option>
        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.title}
          </option>
        ))}
      </select>
      {selectedProduct && (
        <>
          <button onClick={handleSaveFeaturedProduct}>Guardar</button>
        </>
      )}
    </Layout>
  );
}

export default Settings;
