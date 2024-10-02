import Order from "../../models/orderModel.js"; // Import the Order model
import riderModel from "../../models/riderModel.js";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { io } from "../../server.js"; // Sahi tareeqe se Socket.IO ko import kar rahe hain

// Insert Order
const createOrder = async (req, res) => {
  try {
    // Check agar rider_id front-end se nahi aaya ya empty string hai
    if (!req.body.rider_id || req.body.rider_id === "") {
      // rider_id ko remove kar do taake model me default value use ho
      delete req.body.rider_id;
    }

    // Remove `delivery_charges` if it's not provided, to ensure the default is used
    if (req.body.delivery_charges == null) {
      delete req.body.delivery_charges;
    }

    // Request body se data le kar ek new order create karte hain
    const newOrder = await Order.create(req.body);

    // Agar order successfully create ho jata hai toh response bhejte hain
    res.status(201).json({
      success: "true",
      data: newOrder,
      message: "Order created successfully",
    });
  } catch (err) {
    // Duplicate key error handle karna
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]; // Duplicate field name
      res.status(400).json({
        success: false,
        message: `Duplicate value for field: ${field}. Please use another one.`,
      });
    }
    // Validation errors handle karna
    else if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      res.status(400).json({
        success: false,
        message: messages[0], // Only return the first validation error message
      });
    }
    // Handle CastError for wrong data types (like putting string in a number field)
    else if (err.name === "CastError" && err.path === "amount") {
      res.status(400).json({
        success: false,
        message: "Amount must be a valid Number.", // Custom message for amount field
      });
    }
    // Generic errors handle karna
    else {
      console.error("Server Error:", err); // Error log karna server pe
      res.status(500).json({
        success: false,
        message: "Server Error. Please try again later.",
      });
    }
  }
};

// ALL Fatch Order
const getAllOrders = async (req, res) => {
  try {
    // Sab orders ko find karte hain aur rider ka data bhi populate karte hain
    const orders = await Order.find().populate("rider_id").sort({ _id: -1 });

    // Agar koi order nahi milta
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found.",
      });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    // Agar koi generic error hota hai
    res.status(500).json({
      success: false,
      message: "Server Error. Please try again later.",
    });
  }
};

// Single Fatch Order
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id; // Request me se ID lete hain

    const order = await Order.findById(orderId).populate("rider_id"); // ID se specific order ko find karte hain

    // Agar order nahi milta toh
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Agar order mil jata hai toh response bhejte hain
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    // Agar ID ka format galat hai toh CastError handle karte hain
    if (err.name === "CastError" && err.path === "_id") {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID.",
      });
    }

    // Agar koi generic error hota hai
    res.status(500).json({
      success: false,
      message: "Server Error. Please try again later.",
    });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id; // Request params se order ID lete hain

    const deletedOrder = await Order.findByIdAndDelete(orderId); // ID se order ko delete karte hain

    // Agar order nahi milta delete karne ke liye
    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found. Cannot delete.",
      });
    }

    // Agar order delete ho jata hai toh response
    res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (err) {
    // Invalid ID ke case me CastError handle karte hain
    if (err.name === "CastError" && err.path === "_id") {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID.",
      });
    }

    // Agar koi aur error hota hai toh generic server error
    res.status(500).json({
      success: false,
      message: "Server Error. Please try again later.",
    });
  }
};

// Update Order
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updates = req.body;

    const allowedUpdates = [
      "cust_name",
      "cust_city",
      "cust_address",
      "cust_town",
      "cust_number",
      "amount",
      "feedback",
      "status",
      "delivery_charges",
      "rider_id",
    ];

    const updateFields = {};

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        updateFields[field] = updates[field];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    const oldOrder = await Order.findById(orderId);
    if (!oldOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (
      oldOrder.status !== "delivered" &&
      updateFields.status === "delivered"
    ) {
      const rider = await riderModel.findById(updatedOrder.rider_id);
      if (rider) {
        rider.remaining_balance += updatedOrder.amount;
        await rider.save();
      }
    } else if (
      oldOrder.status !== "complete" &&
      updateFields.status === "complete"
    ) {
      const rider = await riderModel.findById(updatedOrder.rider_id);
      if (rider) {
        rider.remaining_balance -= updatedOrder.amount; // Rider ka remaining balance kam kar raha hai
        await rider.save(); // Rider ka updated data save ho raha hai
      }
    }

    io.emit("orderUpdated", {
      orderId: updatedOrder._id,
      status: updatedOrder.status,
      message: "Order updated :" + updatedOrder.status,
    });

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully.",
    });
  } catch (err) {
    if (err.name === "CastError" && err.path === "_id") {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID.",
      });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error. Please try again later.",
    });
  }
};

// Multiple Update operations
const multipleUpdate = async (req, res) => {
  const { ordersId } = req.body; // req.body se ordersId array le rahe hain

  try {
    // MongoDB me un saare orders ko update karna jinke IDs ordersId array me hain
    const result = await Order.updateMany(
      { _id: { $in: ordersId } }, // ordersId array ke hisaab se filter karna
      { $set: { status: "inprocess" } } // status ko 'inprocess' set karna
    );

    // Agar update successful hota hai to response me success message bhejo
    res.json({ success: true, message: "Status updated to inprocess", result });
  } catch (error) {
    // Agar koi error aata hai to error response bhejo
    res
      .status(500)
      .json({ success: false, message: "Failed to update status", error });
  }
};

// Multiple Delete operations
const multipleDelete = async (req, res) => {
  const { ids } = req.body; // Expecting { ids: [array of order IDs] }

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No order IDs provided." });
  }

  try {
    // Replace with your actual database deletion logic
    await Order.deleteMany({ _id: { $in: ids } });

    return res
      .status(200)
      .json({ success: true, message: "Orders deleted successfully." });
  } catch (error) {
    console.error("Error deleting orders:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete orders." });
  }
};

const multipleRiderUpdate = async (req, res) => {
  const { ordersId, selectedRider } = req.body;

  // Check if both ordersId and selectedRider are provided
  if (!ordersId || !selectedRider) {
    return res.status(400).json({
      success: false,
      message: "Order IDs or rider ID not provided.",
    });
  }

  try {
    // Validate that ordersId is an array
    if (!Array.isArray(ordersId) || ordersId.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order IDs should be a non-empty array.",
      });
    }

    // Validate that selectedRider is a valid rider ID (for example, check format)
    if (typeof selectedRider !== "string" || selectedRider.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Rider ID is invalid.",
      });
    }

    // Update multiple orders with the selected rider's ID
    const updatedOrders = await Order.updateMany(
      { _id: { $in: ordersId } }, // Find orders with IDs in the ordersId array
      { $set: { rider_id: selectedRider } }, // Update rider ID and status
      { multi: true } // Ensure multiple documents are updated
    );

    // Check if any orders were updated
    if (updatedOrders.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders were found with the provided IDs.",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: `Successfully updated orders.`,
    });
  } catch (error) {
    // Error handling
    console.error("Error updating orders:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating orders. Please try again.",
    });
  }
};

// const generateOrderPDF = (filteredOrders, res) => {
//   try {
//     const doc = new PDFDocument({ margin: 30, size: "A4" });
//     const pdfPath = "orders.pdf";
//     const stream = fs.createWriteStream(pdfPath);
//     doc.pipe(stream);

//     const pageHeight = doc.page.height; // Page ki height
//     const boxHeight = 240; // Reduced box height to fit 3 blocks per page
//     let yPosition = 20; // Starting position

//     const logoPath = path.resolve("uploads", "PDFlogo.jpg");

//     filteredOrders.forEach((order, index) => {
//       const currentDate = new Date().toLocaleDateString();
//       const currentTime = new Date().toLocaleTimeString();

//       // Agar 3 blocks show ho rahe hain, new page add kar lo
//       if (yPosition + boxHeight > pageHeight - 50) {
//         doc.addPage();
//         yPosition = 20; // Reset yPosition for the new page
//       }

//       // Outer Border/Outline for the order block
//       doc
//         .rect(40, yPosition, 520, boxHeight)
//         .lineWidth(1.5)
//         .strokeColor("#000000")
//         .stroke();

//       // Add Logo inside the outline
//       doc.image(logoPath, 80, yPosition + 10, { width: 155, height: 55 });

//       // **Shipper Information Section**
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(12)
//         .text("Shipper: Universal Traders", 305, yPosition + 10);
//       doc
//         .font("Helvetica")
//         .fontSize(10)
//         .text("B-6 Basement Amma Tower, Saddar", 305, yPosition + 30);
//       doc.text("03363121855", 305, yPosition + 45);
//       doc.text("delivery@gmail.com", 305, yPosition + 60);

//       // Border for the Customer Information Section
//       doc
//         .rect(45, yPosition + 80, 240, 120) // Customer Info Box
//         .lineWidth(1)
//         .stroke();

//       // Customer Information Title
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(12)
//         .text("Customer Information", 55, yPosition + 90);

//       // Customer Details
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(10)
//         .text(`Customer Name :`, 55, yPosition + 110);
//       doc.font("Helvetica").text(`${order.cust_name}`, 140, yPosition + 110);

//       doc.font("Helvetica-Bold").text(`City :`, 55, yPosition + 130);
//       doc.font("Helvetica").text(`${order.cust_city}`, 83, yPosition + 130);

//       doc.font("Helvetica-Bold").text(`Contact Number :`, 55, yPosition + 150);
//       doc.font("Helvetica").text(`${order.cust_number}`, 141, yPosition + 150);

//       doc.font("Helvetica-Bold").text("Address :", 55, yPosition + 170);
//       // Zyada space for address
//       doc
//         .font("Helvetica")
//         .text(` ${order.cust_address}`, 102, yPosition + 170, { width: 140 });

//       // Border for the Order Information Section
//       doc
//         .rect(295, yPosition + 80, 255, 120) // Order Info Box
//         .lineWidth(1)
//         .stroke();

//       // Order Information Title
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(12)
//         .text("Order Information", 305, yPosition + 90);

//       // Order Details
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(10)
//         .text(`Tracking # :`, 305, yPosition + 110);
//       doc.font("Helvetica").text(`${order.tracking_id}`, 362, yPosition + 110);

//       doc.font("Helvetica-Bold").text(`Rider Name : `, 305, yPosition + 130);
//       doc
//         .font("Helvetica")
//         .text(` ${order.rider_id.name}`, 366, yPosition + 130);

//       doc.font("Helvetica-Bold").text(`Total Amount : `, 305, yPosition + 150);
//       doc
//         .font("Helvetica")
//         .text(` ${order.amount + order.delivery_charges}`, 375, yPosition + 150);

//       // Border for the Footer (Date/Time)
//       doc
//         .rect(40, yPosition + 210, 520, 28) // Footer border
//         .lineWidth(1)
//         .stroke();

//       // Date and Time Information in the footer
//       doc.font("Helvetica-Bold").text(`Date:`, 50, yPosition + 219);
//       doc.font("Helvetica").text(`${currentDate}`, 90, yPosition + 219);

//       doc.font("Helvetica-Bold").text(`Time:`, 450, yPosition + 219);
//       doc.font("Helvetica").text(`${currentTime}`, 490, yPosition + 219);

//       // Adjust yPosition for the next entry
//       yPosition += boxHeight + 20; // Adjust yPosition to fit next block
//     });

//     doc.end();
//     stream.on("finish", () => {
//       res.sendFile(path.resolve(pdfPath));
//     });
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     res.status(500).json({ success: false, message: "PDF generation failed." });
//   }
// };

const generateOrderPDF = (filteredOrders, res) => {
  try {
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const pdfPath = "orders.pdf";
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    const pageHeight = doc.page.height;
    const boxHeight = 240; // Adjust to fit blocks per page
    let yPosition = 20;

    const logoPath = path.resolve("uploads", "PDFlogo.jpg");

    filteredOrders.forEach((order, index) => {
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();

      // Check if new page is needed
      if (yPosition + boxHeight > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      // Outer Border for the order block
      doc
        .rect(40, yPosition, 520, boxHeight)
        .lineWidth(1.5)
        .strokeColor("#000000")
        .stroke();

      // Add Logo
      const logoX = 120;
      const logoY = yPosition + 14;
      doc.image(logoPath, logoX, logoY, { width: 155, height: 55 });

      // Shipper Information on the right side of the logo
      const shipperStartX = logoX + 165; // Adjusting X position to the right of the logo
      const shipperStartY = logoY; // Aligning vertically with the logo

      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("Shipper : Universal-Traders", shipperStartX, shipperStartY);

      // Shipper Name and Contact
      doc
        .font("Helvetica")
        .fontSize(10)
        .text("B-6 basment Amma Tower Sadder !", shipperStartX, shipperStartY + 20);

      doc
        .font("Helvetica")
        .text("Ph: 03363121885 ", shipperStartX, shipperStartY + 40);


      // **Table-Like Layout for Customer and Order Information**
      const tableStartX = 50;
      const tableStartY = shipperStartY + 80; // Below the shipper info

      // Table Headers for Customer Info and Order Info
      doc
        .font("Helvetica-Bold")
        .text("Customer Information", tableStartX, tableStartY)
        .text("Order Information", tableStartX + 260, tableStartY);

      // Horizontal line to separate headers from content
      doc
        .moveTo(tableStartX, tableStartY + 15)
        .lineTo(540, tableStartY + 15)
        .stroke();

      // First Row (Customer Name and Tracking ID)
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Customer Name:", tableStartX, tableStartY + 25);
      doc
        .font("Helvetica")
        .text(`${order.cust_name}`, tableStartX + 100, tableStartY + 25);

      doc
        .font("Helvetica-Bold")
        .text("Tracking #:", tableStartX + 260, tableStartY + 25);
      doc
        .font("Helvetica")
        .text(`${order.tracking_id}`, tableStartX + 350, tableStartY + 25);

      // Second Row (City and Rider Name)
      doc.font("Helvetica-Bold").text("City:", tableStartX, tableStartY + 45);
      doc
        .font("Helvetica")
        .text(`${order.cust_city}`, tableStartX + 100, tableStartY + 45);

      doc
        .font("Helvetica-Bold")
        .text("Rider Name:", tableStartX + 260, tableStartY + 45);
      doc
        .font("Helvetica")
        .text(`${order.rider_id.name}`, tableStartX + 350, tableStartY + 45);

      // Third Row (Contact Number and Total Amount)
      doc
        .font("Helvetica-Bold")
        .text("Contact Number:", tableStartX, tableStartY + 65);
      doc
        .font("Helvetica")
        .text(`${order.cust_number}`, tableStartX + 100, tableStartY + 65);

      doc
        .font("Helvetica-Bold")
        .text("Total Amount:", tableStartX + 260, tableStartY + 65);
      doc
        .font("Helvetica")
        .text(
          `${order.amount + order.delivery_charges}`,
          tableStartX + 350,
          tableStartY + 65
        );

      // Fourth Row (Address)
      doc
        .font("Helvetica-Bold")
        .text("Address:", tableStartX, tableStartY + 85);
      doc
        .font("Helvetica")
        .text(`${order.cust_address}`, tableStartX + 100, tableStartY + 85, {
          width: 140,
        });

      // Footer with Date and Time
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(`Date: ${currentDate}`, tableStartX, yPosition + boxHeight - 20)
        .text(
          `Time: ${currentTime}`,
          tableStartX + 400,
          yPosition + boxHeight - 20
        );

      // Adjust yPosition for the next block
      yPosition += boxHeight + 20;
    });

    doc.end();
    stream.on("finish", () => {
      res.sendFile(path.resolve(pdfPath));
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ success: false, message: "PDF generation failed." });
  }
};

// Example backend endpoint for generating PDF
const generatePDFEndpoint = async (req, res) => {
  try {
    // Assume you have filteredOrders from some query
    const filteredOrders = req.body.filteredOrders; // This will come from the request

    if (!filteredOrders || filteredOrders.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No orders found to generate PDF.",
      });
    }

    // Generate the PDF with filteredOrders
    generateOrderPDF(filteredOrders, res);
  } catch (error) {
    console.error("Error in PDF generation endpoint:", error);
    return res.status(500).json({
      success: false,
      message: "Error while handling the PDF generation.",
    });
  }
};

const ordersComplete = async (req, res) => {
  const { filteredOrders } = req.body; // Orders ka array jo front-end se aa raha hai

  if (!Array.isArray(filteredOrders) || filteredOrders.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No orders provided to complete.",
    });
  }

  let deliveredOrders = []; // In orders ka status complete karna hai
  let notDeliveredOrders = []; // In orders ka status abhi tak delivered nahi

  try {
    let ridersToUpdate = {}; // Rider IDs ka object to track balance changes

    // Loop through each order in filteredOrders
    for (let order of filteredOrders) {
      if (order.status === "delivered") {
        // Jab "delivered" se "complete" ho raha hai, to rider ka balance update karenge
        if (order.rider_id) {
          if (!ridersToUpdate[order.rider_id._id]) {
            ridersToUpdate[order.rider_id._id] = 0;
          }
          ridersToUpdate[order.rider_id._id] += order.amount; // Rider ke balance me se amount minus karenge
        }

        // Order ka status "complete" karenge
        await Order.findByIdAndUpdate(order._id, { status: "complete" });
        deliveredOrders.push(order); // Is order ko deliveredOrders list mein add karenge
      } else {
        notDeliveredOrders.push(order); // Agar delivered nahi hai to isko notDeliveredOrders mein add karenge
      }
    }

    // Ab riders ke balance update karenge
    for (let riderId in ridersToUpdate) {
      const rider = await riderModel.findById(riderId);
      if (rider) {
        rider.remaining_balance -= ridersToUpdate[riderId]; // Rider ke balance se amount minus karenge
        await rider.save(); // Rider ka updated balance save karenge
      }
    }

    // Final response: successfully complete hue orders aur un orders ki list jo abhi tak deliver nahi hue
    res.status(200).json({
      success: true,
      message: "Orders processed.",
      completedOrders: deliveredOrders, // Orders jo complete hue
      notDeliveredOrders: notDeliveredOrders, // Orders jo abhi tak deliver nahi hue
    });
  } catch (error) {
    // Error handling
    console.error("Error completing orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete orders.",
      error,
    });
  }
};

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrder,
  multipleUpdate,
  multipleDelete,
  multipleRiderUpdate,
  generatePDFEndpoint,
  ordersComplete,
};
