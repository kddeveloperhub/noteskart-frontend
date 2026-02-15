import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white px-4 md:px-8 py-4 shadow-md">
      <div className="flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="text-xl md:text-2xl font-bold">
          NotesKart
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/">Home</Link>

          {user && (
            <>
              <Link to="/dashboard">My Notes</Link>
              <Link to="/payment">Unlock</Link>

              <div className="bg-blue-500 px-3 py-1 rounded text-xs">
                {user.email}
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-4 py-1 rounded font-semibold"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-blue-700 rounded-lg p-4 flex flex-col gap-4 animate-fadeIn">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {user && (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                My Notes
              </Link>

              <Link to="/payment" onClick={() => setMenuOpen(false)}>
                Unlock
              </Link>

              <div className="bg-blue-500 px-3 py-2 rounded text-xs break-words">
                {user.email}
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <Link
              to="/auth"
              onClick={() => setMenuOpen(false)}
              className="bg-white text-blue-600 px-4 py-2 rounded font-semibold text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
