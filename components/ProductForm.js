import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  properties: existingProperties,
  main: existingMain,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(existingCategory || "");
  const [productProperties, setProductProperties] = useState(existingProperties || {});
  const [price, setPrice] = useState(existingPrice || "");
  const [main, setMain] = useState(existingMain || false);
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { 
      title, description, price, images, category,
      properties:productProperties, main
    };
    if (_id) {
      // update
      await axios.put("/api/products", { ...data,_id });
    } else {
      // create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;

    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function setProductProp(propName,value) {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <div className="flex flex-col">
        <label>Nombre del Producto</label>
        <input
          type="text"
          placeholder="Nombre del Producto"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Categoria</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Sin categoria</option>
          {categories.length > 0 &&
            categories.map((c) => <option value={c._id}>{c.name}</option>)}
        </select>
        {propertiesToFill.length > 0 &&
          propertiesToFill.map((p) => (
            <div className="">
              <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
              <div>
                <select
                  value={productProperties[p.name]}
                  onChange={(ev) => setProductProp(p.name, ev.target.value)}
                >
                  {p.values.map((v) => (
                    <option value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}

        <label>Fotos</label>
        <div className="mb-2 flex flex-wrap gap-2">
          <ReactSortable
            list={images}
            className="flex flex-wrap gap-2"
            setList={updateImagesOrder}
          >
            {!!images?.length &&
              images.map((link) => (
                <div key={link} className="h-24 bg-white p-4 shadow-md rounded-sm">
                  <img src={link} alt="Producto" className="rounded-md" />
                </div>
              ))}
          </ReactSortable>

          {isUploading && (
            <div className="h-24 w-24 p-1 flex items-center">
              <Spinner />
            </div>
          )}
          <label className="cursor-pointer w-24 h-24 text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-md border border-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            <div>Subir</div>
            <input type="file" className="hidden" onChange={uploadImages} />
          </label>
        </div>
        <label>Descripcion</label>
        <textarea
          placeholder="Descripcion"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label>Precio $</label>
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Guardar
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
