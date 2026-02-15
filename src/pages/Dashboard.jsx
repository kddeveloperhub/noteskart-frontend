import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/auth");
        return;
      }

      setUser(currentUser);

      // 🔥 Fetch payment status
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setIsPaid(docSnap.data().isPaid);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user?.email}
        </h1>

        {!isPaid ? (
          <>
            <p className="text-red-500 mb-4">
              🔒 Notes Locked
            </p>
            <button
              onClick={() => navigate("/payment")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Unlock Now
            </button>
          </>
        ) : (
          <>
            <p className="text-green-600 mb-4">
              ✅ Notes Unlocked and go to home page for downloading the notes!
            </p>
            <div className="bg-gray-100 p-4 rounded">
              All semesters notes available here.
            </div>
          </>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded mt-6"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
