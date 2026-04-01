export default function Footer() {
  return (
    <footer className="bg-[#006591] text-gray-200 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 text-center md:text-left">

        {/* Brand */}
        <div>
          <h2 className="text-white text-xl font-semibold">UniFlow</h2>
          <p className="mt-3 text-sm">
            Focused Learning Space to manage your student life.
          </p>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-white font-medium">Features</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Assignment Tracker</li>
            <li>Study Resources</li>
            <li>Discussion Forum</li>
            <li>Leaderboard</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-medium">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Dashboard</li>
            <li>Resources</li>
            <li>Forum</li>
            <li>Profile</li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-white font-medium">Contact</h3>
          {/*<p className="mt-3 text-sm">support@uniflow.com</p>*/}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-sm mt-10 border-t border-gray-400/30 pt-5">
        <p>© {new Date().getFullYear()} UniFlow. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-2 text-xs">
          <span className="cursor-pointer hover:text-white">Privacy Policy</span>
          <span className="cursor-pointer hover:text-white">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}