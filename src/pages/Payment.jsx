import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import paymentImg from "../assets/Payment.avif";

const Payment = () => {

  const handlePayment = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const orderRes = await fetch("https://noteskart-backend.onrender.com/create-order", {
      method: "POST",
    });

    const order = await orderRes.json();

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "NotesKart",
      description: "Unlock All Notes",
      order_id: order.id,
      handler: async function (response) {

        const verifyRes = await fetch("https://noteskart-backend.onrender.com/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          await updateDoc(doc(db, "users", user.uid), {
            isPaid: true,
          });

          alert("Payment Successful 🚀");
          window.location.href = "/dashboard";
        } else {
          alert("Payment Verification Failed");
        }
      },
      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md text-center">

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Unlock All Notes @ ₹100
        </h1>

        {/* IMAGE */}
        <img
          src={paymentImg}
          alt="Secure Payment"
          className="w-full h-auto rounded-lg mb-5 object-contain"
        />

        {/* FEATURES */}
        <ul className="mb-6 text-sm md:text-base space-y-2">
          <li>✔ All Semesters Notes</li>
          <li>✔ All Subjects</li>
          <li>✔ One Time Payment</li>
          <li>✔ Lifetime Access</li>
        </ul>

        {/* PAY BUTTON */}
        <button
          onClick={handlePayment}
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          Pay ₹100
        </button>

      </div>

    </div>
  );
};

export default Payment;
