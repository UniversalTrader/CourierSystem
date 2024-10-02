import express from "express";
import riderController from "../controllers/admin/riderController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import multer from "multer";
const route = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

route.get("/riderSpecific", protect, riderController.riderSpecific);
route.post(
  "/",
  protect,
  upload.array("image", 10),
  riderController.riderInsert
);

route.put(
  "/:id",
  protect,
  upload.array("image", 10),
  authorizeRoles(1),
  riderController.riderUpdate
);
route.delete("/:id", protect, riderController.riderDelete);
route.get("/", protect, authorizeRoles(1), riderController.getAllRiders); // Only admin
route.get("/:id", protect, riderController.getRiderById);
route.post("/login", riderController.riderLogin); // Login route
route.post("/logout", riderController.riderLogout); // Logout route

// Only admin

// Rider Routes
// route.get("specific", protect ,riderController.riderSpecific)

export default route;
