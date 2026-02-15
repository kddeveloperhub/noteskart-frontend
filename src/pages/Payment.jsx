import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const Payment = () => {
  const handlePayment = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const orderRes = await fetch("https://noteskart-backend.onrender.com/create-order", {
      method: "POST",
    });

    const order = await orderRes.json();

    const options = {
      key: "rzp_live_SFFl0VBXMPD0SQ",
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
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={handlePayment}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Pay ₹100
      </button>
    </div>
  );
};

export default Payment;
