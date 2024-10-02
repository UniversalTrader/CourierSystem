import cron from "node-cron";
import Order from "../models/orderModel.js"; // Order model import

// 2 months purane orders delete karne wali cron job
const deleteOldOrders = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      await Order.deleteMany({ createdAt: { $lt: twoMonthsAgo } });

      console.log("2 months se purane orders delete ho gaye.");
    } catch (error) {
      console.error("Error while deleting old orders:", error);
    }
  });
};


// Initialize the cron job
deleteOldOrders(); // Ye line cron job ko initialize karegi

export { deleteOldOrders };
