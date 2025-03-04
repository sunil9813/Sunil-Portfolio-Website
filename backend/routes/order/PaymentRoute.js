// const express = require("express");
// const axios = require("axios");
// const router = express.Router();
// const UserModel = require("../../models/users/UserModel");
// const { protect } = require("../../middleware/authMiddleware");

// // Payment initiation route
// router.get("/initiate-payment", protect, (req, res) => {
//   // Calculate the payment amount based on your logic
//   const paymentAmount = 100; // Example amount

//   // Generate a unique payment ID
//   const paymentId = "generate_unique_payment_id_here";

//   // Construct the eSewa payment URL
//   const esewaUrl = `https://uat.esewa.com.np/epay/main?amt=${paymentAmount}&pid=${paymentId}&scd=YOUR_MERCHANT_CODE&su=http://localhost:3000/payment/success&fu=http://localhost:3000/payment/failure`;

//   // Redirect the user to the eSewa payment page
//   res.redirect(esewaUrl);
// });

// // Payment success and failure routes
// router.get("/success", async (req, res) => {
//   // Handle payment success here and update user's payment status and payment information
//   // For testing purposes, let's assume we update the user's payment status and store payment information in the database
//   // You should replace this with your actual logic

//   if (!req.isAuthenticated()) {
//     return res.redirect("/login");
//   }

//   const userId = req.user._id; // Assuming you store the user's ID in the session
//   const paymentAmount = 100; // Example amount
//   const paymentInfo = {
//     amount: paymentAmount,
//     timestamp: new Date(),
//     // Add more payment-related information as needed
//   };

//   UserModel.findByIdAndUpdate(userId, { paid: true, $push: { payments: paymentInfo } }, (err, user) => {
//     if (err) {
//       console.error(err);
//       return res.redirect("/payment/failure"); // Redirect to failure page on error
//     }
//     // Redirect to a thank you page or image upload page
//     res.render("payment-success");
//   });
// });

// router.get("/failure", (req, res) => {
//   // Handle payment failure here and show an error page
//   res.render("payment-failure");
// });

// module.exports = router;

/* =============================================== */

// const axios = require("axios");
// const crypto = require("crypto");

const express = require("express");
const { initiatePayment, handlePaymentConfirmation } = require("../../controllers/order/PaymentController");
const { protect } = require("../../middleware/authMiddleware");
const app = express();

app.post("/initiate-payment", protect, initiatePayment);
app.post("/payment-confirmation", protect, handlePaymentConfirmation);

module.exports = app;

// // Your eSewa API credentials (replace with your actual credentials)
// const MERCHANT_ID = "EPAYTEST";
// const SECRET_KEY = "asadadasd";
// const successRedirectUrl = "https://example.com/esewaSuccessRedirect";
// const failureRedirectUrl = "https://example.com/esewaFailureRedirect";

// function generateChecksum(data, secretKey) {
//   // Convert the payment data to a JSON string
//   const jsonData = JSON.stringify(data);

//   // Create a HMAC-SHA256 hash with the secret key
//   const hash = crypto.createHmac("sha256", secretKey).update(jsonData).digest("hex");

//   return hash;
// }

// app.post("/initiate-payment", async (req, res) => {
//   try {
//     // Prepare your payment request data
//     const paymentData = {
//       amt: req.body.amount, // The payment amount
//       pid: req.body.processId, // Unique ID for the order
//       su: successRedirectUrl, // Redirect URL after successful payment
//       fu: failureRedirectUrl, // Redirect URL after a failed payment
//       scd: MERCHANT_ID, // Your eSewa merchant ID
//       taxAmt: req.body.taxAmount || 0, // Tax amount (optional)
//       serviceCharge: req.body.serviceCharge || 0, // Service charge (optional)
//       deliveryCharge: req.body.deliveryCharge || 0, // Delivery charge (optional)
//       tAmt: req.body.totalAmount, // Total payment amount
//     };

//     // Generate a checksum for the payment data
//     const checksum = generateChecksum(paymentData, SECRET_KEY);

//     // Include the checksum in the payment data
//     paymentData.sc = checksum;

//     // Make a POST request to eSewa's payment endpoint
//     const response = await axios.post("https://uat.esewa.com.np/epay/main", paymentData);

//     // You will receive a response from eSewa with payment details
//     // Redirect the user to the eSewa payment page or provide a link
//     res.redirect(response.data.url); // Use the appropriate field from the response
//   } catch (error) {
//     console.error("Error initiating payment:", error);
//     res.status(500).json({ error: "Payment initiation failed" });
//   }
// });

// // Implement your payment confirmation endpoint to receive eSewa callbacks/webhooks
// app.post("/payment-confirmation", (req, res) => {
//   try {
//     // Extract payment details from the request body
//     const {
//       oid, // Product ID (pid) used on payment request
//       amt, // Total payment amount (tAmt)
//       refId, // A unique payment reference code generated by eSewa
//     } = req.body;

//     // TODO: Implement your logic to update the order status and store payment details in your database

//     // For example, you can use a database library like Mongoose if using MongoDB
//     // Assuming you have an Order model:
//     /*
//     const Order = require('./models/order'); // Import your Order model

//     // Update the order status based on your logic
//     // For example, marking the order as paid
//     const updatedOrder = await Order.findOneAndUpdate(
//       { _id: oid },
//       { $set: { status: 'paid', paymentRefId: refId } },
//       { new: true }
//     );
//     */

//     // Log the payment details for debugging (remove in production)
//     console.log("Payment confirmed - Order ID:", oid);
//     console.log("Payment Amount:", amt);
//     console.log("Payment Reference ID:", refId);

//     // Respond to eSewa with a success message
//     res.status(200).send("Payment confirmed");
//   } catch (error) {
//     console.error("Error handling payment confirmation:", error);
//     res.status(500).json({ error: "Payment confirmation failed" });
//   }
// });
