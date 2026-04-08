// src/pages/Profile.tsx
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Edit2, LogOut, Settings as SettingsIcon, Trophy, Award, Star } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    address: "",
    faculty: "",
    semester: "",
    year: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        contactNumber: user.contactNumber || "",
        address: user.address || "",
        faculty: user.faculty || "",
        semester: user.semester || "",
        year: user.year || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!form.firstName || !form.lastName) {
      toast.error("First and Last name are required");
      return;
    }

    try {
      const res = await api.put("/user/profile", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        contactNumber: user.contactNumber || "",
        address: user.address || "",
        faculty: user.faculty || "",
        semester: user.semester || "",
        year: user.year || "",
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  const isAdmin = user.role === "admin";
  const faculties = ["Computing", "Engineering", "Business"];
  const semesters = ["Semester 1", "Semester 2"];
  const years = ["1", "2", "3", "4"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="text-white py-6" style={{ background: "linear-gradient(90deg, #006591 0%, #cc5500 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-white text-[#006591] flex items-center justify-center text-xl font-bold shadow-md">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h1>
              <p className="text-sm opacity-80">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => navigate("/settings")} 
              className="flex items-center gap-2 bg-white text-[#006591] px-4 py-2 rounded-lg shadow-md hover:bg-gray-200"
            >
              <SettingsIcon size={16} /> Settings
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm shadow-md"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* GAMIFICATION CARDS - ONLY FOR STUDENTS */}
      {!isAdmin && (
        <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card icon={<Trophy className="text-amber-500" size={28} />} title="Total Points" value={user.points || 0} desc="Earned through answers & upvotes" />
          <Card icon={<Star className="text-blue-600" size={28} />} title="Current Rank" value={user.rank || "Bronze"} desc="Keep contributing to level up!" />
          <Card icon={<Award className="text-purple-600" size={28} />} title="Badges Earned" value={user.badges?.length || 0} desc={user.badges?.join(", ") || "No badges yet"} />
        </div>
      )}

      {/* PERSONAL INFORMATION */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-[#006591] text-white px-5 py-2.5 rounded-xl hover:bg-[#005580] transition"
              >
                <Edit2 size={18} /> Edit Profile
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              <Info label="Full Name" value={`${user.firstName} ${user.lastName}`} />
              <Info label="Email" value={user.email} />
              <Info label="Faculty" value={user.faculty || "Not set"} />
              <Info label="Semester" value={user.semester || "Not set"} />
              <Info label="Year" value={user.year || "Not set"} />
              <Info label="Contact Number" value={user.contactNumber || "Not set"} />
              <div className="md:col-span-2">
                <Info label="Address" value={user.address || "Not set"} />
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <Input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" />
              <Input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" />

              <select name="faculty" value={form.faculty} onChange={handleChange} className="p-3 rounded-xl border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006591]">
                <option value="">Select Faculty</option>
                {faculties.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>

              <select name="semester" value={form.semester} onChange={handleChange} className="p-3 rounded-xl border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006591]">
                <option value="">Select Semester</option>
                {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              <select name="year" value={form.year} onChange={handleChange} className="p-3 rounded-xl border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006591]">
                <option value="">Select Year</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>

              <Input name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Contact Number" />
              <Input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="md:col-span-2" />
            </div>
          )}

          {isEditing && (
            <div className="flex gap-4 mt-8">
              <button onClick={handleUpdate} className="bg-[#cc5500] hover:bg-[#b34700] text-white px-8 py-3 rounded-xl font-medium transition">
                Save Changes
              </button>
              <button onClick={handleCancel} className="bg-white border border-gray-300 hover:bg-gray-50 px-8 py-3 rounded-xl font-medium transition">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-widest">{label}</p>
    <p className="text-lg font-semibold text-gray-800 mt-1 break-words">{value}</p>
  </div>
);

const Input = (props: any) => (
  <input {...props} className="p-3 rounded-xl border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006591] w-full" />
);

const Card = ({ icon, title, value, desc }: any) => (
  <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center">
    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">{icon}</div>
    <p className="text-sm text-gray-500 font-medium">{title}</p>
    <p className="text-4xl font-bold text-gray-800 mt-1">{value}</p>
    {desc && <p className="text-xs text-gray-400 mt-2">{desc}</p>}
  </div>
);

export default Profile;