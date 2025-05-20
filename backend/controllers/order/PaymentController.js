const axios = require("axios");
const { generateChecksum } = require("../../utils/helpers");
const OrderModel = require("../../models/order/OrderModel");
const User = require("../../models/users/UserModel");
const cheerio = require("cheerio");

const MERCHANT_ID = "YOUR_MERCHANT_ID"; // Replace with your eSewa merchant ID
const SECRET_KEY = "YOUR_SECRET_KEY"; // Replace with your eSewa secret key
const successRedirectUrl = "https://example.com/esewaSuccessRedirect";
const failureRedirectUrl = "https://example.com/esewaFailureRedirect";

// Function to initiate a payment
const initiatePayment = async (req, res) => {
  try {
    // Ensure that req.user and req.user.id are defined
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID not found" });
    }

    const userId = req.user.id;

    // Find the corresponding order in your database
    const order = await OrderModel.findOne({ user: userId, status: "unpaid" });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Prepare your payment request data using order details
    const paymentData = {
      amt: order.amount, // Use the order amount
      pid: order._id, // Use the order ID as the processId
      su: successRedirectUrl, // Redirect URL after successful payment
      fu: failureRedirectUrl, // Redirect URL after a failed payment
      scd: MERCHANT_ID, // Your eSewa merchant ID
      taxAmt: order.taxPrice || 0, // Use the taxPrice from the order (optional)
      serviceCharge: order.serviceCharge || 0, // Use the serviceCharge from the order (optional)
      deliveryCharge: order.deliveryCharge || 0, // Use the deliveryCharge from the order (optional)
      tAmt: order.amount + (order.taxPrice || 0) + (order.serviceCharge || 0) + (order.deliveryCharge || 0), // Calculate the total payment amount
    };

    // Generate a checksum for the payment data
    const checksum = generateChecksum(paymentData, SECRET_KEY);

    // Include the checksum in the payment data
    paymentData.sc = checksum;

    // Make a POST request to eSewa's payment endpoint
    const response = await axios.post("https://uat.esewa.com.np/epay/main", paymentData);

    // You will receive a response from eSewa with payment details
    // Redirect the user to the eSewa payment page or provide a link

    // res.redirect(response.data.url); // Use the appropriate field from the response
    // res.status(200).json({ url: response.data.url });
    if (response.data && response.data.url) {
      // Redirect the user to the eSewa payment page using the URL from the response
      return res.redirect(response.data.url);
    } else {
      console.error("Invalid response from eSewa:", response.data);
      const $ = cheerio.load(response.data);
      const error = $("p strong").text().trim();

      // Return the extracted error message in the JSON response
      return res.status(500).json({ error });
      // Handle the case where the response does not contain the expected URL
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ error: "Payment initiation failed" });
  }
  //   res.send("Payment initiated");
};

const handlePaymentConfirmation = async (req, res) => {
  try {
    const { oid, amt, refId } = req.body;

    // Find the corresponding order in your database
    const order = await OrderModel.findById(oid); // Use findById instead of findOne

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order status and store payment details
    order.paymentInfo = {
      id: refId,
      status: "paid", // Assuming you mark the order as paid upon successful payment
    };

    // Update the order's expiresAt field if needed (e.g., extend the expiration date)
    const expirationDate = new Date(order.expiresAt);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    order.expiresAt = expirationDate;

    // Save the updated order
    await order.save();

    // Find the associated user using the user field from the order
    const user = await User.findById(order.user); // Use findById instead of findOne

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's paid and paymentExpiresAt fields
    user.paid = true;
    user.paymentExpiresAt = expirationDate;

    // Save the updated user
    await user.save();

    // Log the payment details for debugging (remove in production)
    console.log("Payment confirmed - Order ID:", oid);
    console.log("Payment Amount:", amt);
    console.log("Payment Reference ID:", refId);

    // Respond to eSewa with a success message
    res.status(200).send("Payment confirmed");
  } catch (error) {
    console.error("Error handling payment confirmation:", error);
    res.status(500).json({ error: "Payment confirmation failed" });
  }
};

// Function to handle payment confirmation
/* const handlePaymentConfirmation = async (req, res) => {
  try {
    const { oid, amt, refId } = req.body;

    // Find the corresponding order in your database
    const order = await Order.findOne({ _id: oid });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order status and store payment details
    order.paymentInfo = {
      id: refId,
      status: "paid", // Assuming you mark the order as paid upon successful payment
    };

    // Update the order's expiresAt field if needed (e.g., extend the expiration date)
    const expirationDate = new Date(order.expiresAt);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    order.expiresAt = expirationDate;

    // Save the updated order
    await order.save();

    // Find the associated user using the user field from the order
    const user = await User.findOne({ _id: order.user });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's paid and paymentExpiresAt fields
    user.paid = true;
    user.paymentExpiresAt = expirationDate;

    // Save the updated user
    await user.save();

    // Log the payment details for debugging (remove in production)
    console.log("Payment confirmed - Order ID:", oid);
    console.log("Payment Amount:", amt);
    console.log("Payment Reference ID:", refId);

    // Respond to eSewa with a success message
    res.status(200).send("Payment confirmed");
  } catch (error) {
    console.error("Error handling payment confirmation:", error);
    res.status(500).json({ error: "Payment confirmation failed" });
  }
};
 */
// Function to handle payment confirmation

module.exports = {
  initiatePayment,
  handlePaymentConfirmation,
};
