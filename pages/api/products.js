import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query?.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    const { title, description, price, images, category, properties, main } =
      req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
      main,
    });
    res.json(productDoc);
  }

  if (method === "PUT") {
    const {
      _id,
      action,
      title,
      description,
      price,
      images,
      category,
      properties,
    } = req.body;
    if (action === "updateMain") {
      await Product.updateOne({ _id }, { main: true });
      await Product.updateMany({ _id: { $ne: _id } }, { main: false });
    } else if (action !== "updateMain") {
      await Product.updateOne(
        { _id },
        { title, description, price, images, category, properties }
      );
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
