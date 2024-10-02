import Product from "../../models/productModel.js";
import fs from "fs";
import path from "path";
import upload from "../../middleware/imageUpload.js";

// Insert Product
const insertProduct = (req, res) => {
  // Pehle file upload hoti hai, agar file upload me error aata hai to wahi handle hoga
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Phir fields ko validate karte hain
    const { name, des, brand, price, Qty } = req.body;

    if (!name || !des || !brand || !price || !Qty) {
      // Agar validation fail hoti hai to uploaded file ko delete kar dete hain
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error removing file:", err);
        });
      }
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const newProduct = new Product({
        name,
        des,
        image: req.file ? req.file.path : null, // Agar file upload hui hai to path save karte hain
        brand,
        price,
        Qty,
      });

      const product = await newProduct.save();
      res.status(201).json(product);
    } catch (error) {
      // Agar save operation fail hota hai, to file delete kar dete hain
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error removing file:", err);
        });
      }
      res.status(400).json({ error: error.message });
    }
  });
};

// fetch Product
const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Sare products fetch karne ke liye
    res.status(200).json({
      success: "Successfully",
      count: products.length, // Count of total
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Product ID ko route se lena

    // Product ko find karna
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Agar product ke sath image hai, usko delete karna
    if (product.image) {
      // Ensure the file path is correctly joined
      const filePath = path.resolve("uploads", path.basename(product.image));
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error removing file:", err);
        }
      });
    }

    // Product ko delete karna
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    // Product ko find karna
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Agar file upload hui hai aur purani image ko delete karna
    if (req.file && product.image) {
      const oldFilePath = path.resolve("uploads", path.basename(product.image));
      fs.unlink(oldFilePath, (err) => {
        if (err) console.error("Error removing old file:", err);
      });
    }

    // Sirf wahi fields update karna jo provided hain
    product.name = req.body.name || product.name;
    product.des = req.body.des || product.des;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price || product.price;
    product.Qty = req.body.Qty || product.Qty;
    product.image = req.file ? req.file.path : product.image; // Agar nayi image upload hui hai to update karo

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the product" });
  }
};

export default {
  insertProduct,
  fetchProducts,
  deleteProduct,
  updateProduct,
};
