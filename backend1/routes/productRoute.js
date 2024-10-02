import express from "express";
import productController from "../controllers/admin/producController.js";
import upload from "../middleware/imageUpload.js";
const route = express.Router();

// Insert Product Route
route.post("/",productController.insertProduct);
// Route to fetch all products
route.get("/", productController.fetchProducts);
// Route to delete a product
route.delete("/:id", productController.deleteProduct);
// Update Product Route
route.put("/:id", upload, productController.updateProduct);

export default route;
