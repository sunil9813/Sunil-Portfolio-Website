const express = require("express");
const { protect, admin } = require("../../middleware/authMiddleware");
const {
  newOrder,
  loggedInUserOrders,
  getAllOrderByAdmin,
  deleteOrderByAdmin,
  getSingleOrder,
} = require("../../controllers/order/OrderControllers");
const validation = require("../../middleware/Validation");
const { orderSchemaValidation } = require("../../utils/validations");
const router = express.Router();

router.post("/new", validation(orderSchemaValidation), protect, newOrder);
router.get("/me", protect, loggedInUserOrders);
router.get("/admin/orders", protect, admin, getAllOrderByAdmin);
router.get("/admin/:id", protect, admin, getSingleOrder);
router.delete("/admin", protect, admin, deleteOrderByAdmin);

module.exports = router;

// const express = require("express");
// const axios = require("axios");
// const router = express.Router();
// const UserModel = require("../../models/users/UserModel");

// // Payment initiation route
// router.get("/initiate-payment", (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.redirect("/login");
//   }

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
// router.get("/success", (req, res) => {
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
/* 
const express = require("express");
const axios = require("axios");
const app = express();

const eSewaEndpoint = "https://uat.esewa.com.np/epay/main";
const merchantCode = "YourMerchantCode"; // Replace with your merchant code

// Route to initiate a payment
app.post("/initiate-payment", async (req, res) => {
  try {
    // Define payment parameters
    const paymentData = {
      amt: 100, // Set the payment amount here
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: 100,
      pid: "YourProductID", // Replace with a unique product ID
      scd: merchantCode,
      su: "http://yourdomain.com/payment-success", // Replace with your success URL
      fu: "http://yourdomain.com/payment-failure", // Replace with your failure URL
    };

    // Make a POST request to eSewa
    const response = await axios.post(eSewaEndpoint, paymentData);

    // Redirect the user to eSewa for payment
    res.redirect(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Payment initiation failed");
  }
});
 */
