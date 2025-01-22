import crypto from "crypto";
import razorpayInstance from "../../../utils/razorPayInstance";
import ApiError from "../../../utils/apiError";

const initiatePayment = async (amount: number) => {
  try {
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"), // Corrected "reciept" to "receipt"
    };

    // Use Promises instead of callback for Razorpay's create order
    const order = await new Promise((resolve, reject) => {
      razorpayInstance.orders.create(options, (error, order) => {
        if (error) {
          reject(new ApiError(500, "Something went wrong"));
        } else {
          resolve(order);
        }
      });
    });

    return { message: "Payment initiated", data: order };
  } catch (err) {
    console.error("Error initiating payment:", err);
    throw err; // Re-throw the error for the caller to handle
  }
};

export default initiatePayment;
