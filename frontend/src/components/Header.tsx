import { Link, useNavigate } from "react-router-dom";
import { Bell, User, Search } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Header() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="UniFlow Logo" className="w-25 h-16 object-contain" />
        </Link>

        {/* CENTER: Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-black font-medium">
          <Link to="/" className="hover:text-[#006591] transition">Dashboard</Link>
          <Link to="/resources" className="hover:text-[#006591] transition">Resources</Link>
          <Link to="/forum" className="hover:text-[#006591] transition">Forum</Link>
          <Link to="/leaderboard" className="hover:text-[#006591] transition">Leaderboard</Link>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="flex items-center bg-gray-50 border border-gray-300 rounded-full px-4 py-2 focus-within:border-[#006591]">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search here"
              className="ml-2 outline-none bg-transparent text-sm w-48"
            />
          </div>

          {/* 🔥 CONDITIONAL UI */}
          {user ? (
            <>
              {/* Bell */}
              <Bell className="cursor-pointer text-gray-700 hover:text-[#006591]" />

              {/* Profile */}
              <div className="relative">
                <User
                  className="cursor-pointer text-gray-700 hover:text-[#006591]"
                  onClick={() => setOpen(!open)}
                />

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl p-3 z-50">

                    <p className="text-sm font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {user.email}
                    </p>

                    <hr className="my-2" />

                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left text-sm hover:text-[#006591]"
                    >
                      Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-sm text-red-500 mt-2"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-[#006591] font-medium"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-sm bg-[#006591] text-white px-4 py-1 rounded-full"
              >
                Sign Up
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}