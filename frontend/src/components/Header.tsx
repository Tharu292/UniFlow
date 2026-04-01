import { Link } from 'react-router-dom';
import { Bell, User, Search } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Header() {
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

        {/* RIGHT: Search + Icons */}
        <div className="flex items-center gap-4">

          {/* Search Bar */}
          <div className="flex items-center bg-gray-50 border border-gray-300 rounded-full px-4 py-2 focus-within:border-[#006591] transition">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search here"
              className="ml-2 outline-none bg-transparent text-sm w-48"
            />
          </div>


          <Bell className="cursor-pointer text-gray-700 hover:text-[#006591] transition" />


          <User className="cursor-pointer text-gray-700 hover:text-[#006591] transition" />
        </div>

      </div>
    </header>
  );
}