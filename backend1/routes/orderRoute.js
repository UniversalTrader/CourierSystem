import express from "express";
import orderController from "../controllers/admin/orderController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const route = express.Router();


route.post(
  "/ordersComplete",
  protect,
  authorizeRoles(1),
  orderController.ordersComplete
);
route.delete(
  "/multipleDelete",
  protect,
  authorizeRoles(1),
  orderController.multipleDelete
); // deletemany orders /Admin
route.put(
  "/multipleRiderUpdate",
  protect,
  authorizeRoles(1),
  orderController.multipleRiderUpdate
); // deletemany orders /Admin

route.post(
  "/ordersPdf",
  protect,
  authorizeRoles(1),
  orderController.generatePDFEndpoint
); // deletemany orders /Admin

route.post("/", protect, authorizeRoles(1), orderController.createOrder); // Insert /Admin
route.get("/", protect, authorizeRoles(1), orderController.getAllOrders); // ALL Order /admin
route.get("/:id", protect, orderController.getOrderById); // Get Order By Id /both --- FETCH ORDER FOR UPDATE
route.delete("/:id", protect, authorizeRoles(1), orderController.deleteOrder); // Delete Order / Admin
route.put("/:id", protect, orderController.updateOrder); // Update order by ID /both --- UPDATE ORDER ROUTE
route.post("/multipleUpadate", protect, orderController.multipleUpdate); // Update order by ID /both --- UPDATE ORDER ROUTE

export default route;
