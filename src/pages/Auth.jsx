import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // 🔐 LOGIN
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 🆕 SIGNUP
        const userCredential =
          await createUserWithEmailAndPassword(auth, email, password);

        // 🔥 Create user document in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          isPaid: false,
          createdAt: new Date(),
        });
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        <input
          className="w-full p-3 mb-4 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-4 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? "Please wait..."
            : isLogin
            ? "Login"
            : "Sign Up"}
        </button>

        <p className="text-center mt-4 text-sm">
          {isLogin ? "New user?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 ml-2"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
