import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role") || "student";
  const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
    address: "",
    faculty: "",
    semester: "",
    year: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!/^it\d{8}@my\.sliit\.lk$/.test(form.email)) {
      setError("SLIIT email must be itxxxxxxxx@my.sliit.lk");
      return;
    }

    if (!/^0\d{9}$/.test(form.contactNumber)) {
      setError("Contact number must be 10 digits starting with 0");
      return;
    }

    try {
      await api.post("/auth/register", { ...form, role });
      toast.success("OTP sent to your email");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b3c5d] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-10">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-[#0b3c5d] mb-2">
          Register as {roleTitle}
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Create your UniFlow account
        </p>

        <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-6">

          {/* Input Field Component Style */}
          {[
            { name: "firstName", label: "First Name", icon: FaUser },
            { name: "lastName", label: "Last Name", icon: FaUser },
          ].map(({ name, label, icon: Icon }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {label}
              </label>
              <div className="relative">
                <Icon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  name={name}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder={`Enter ${label.toLowerCase()}`}
                  required
                />
              </div>
            </div>
          ))}

          {/* Email */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              SLIIT Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="itxxxxxxxx@my.sliit.lk"
                required
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contact Number
            </label>
            <div className="relative">
              <FaPhone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="07xxxxxxxx"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Address
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Enter address"
              />
            </div>
          </div>

          {/* Selects */}
          {[
            { name: "faculty", label: "Faculty", options: ["Computing", "Business", "Engineering"] },
            { name: "semester", label: "Semester", options: ["Semester 1", "Semester 2"] },
            { name: "year", label: "Year", options: ["1", "2", "3", "4"] },
          ].map(({ name, label, options }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {label}
              </label>
              <select
                name={name}
                value={(form as any)[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="">Select {label}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Password */}
          {["password", "confirmPassword"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {field === "password" ? "Password" : "Confirm Password"}
              </label>
              <div className="relative">
                <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name={field}
                  value={(form as any)[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder={field === "password" ? "Enter password" : "Confirm password"}
                  required
                />
              </div>
            </div>
          ))}

          {/* Button */}
          <button
            type="submit"
            className="md:col-span-2 bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition shadow-md"
          >
            Create Account
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mt-4 font-medium">
            {error}
          </p>
        )}

        {/* Login link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#0b3c5d] font-semibold hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;