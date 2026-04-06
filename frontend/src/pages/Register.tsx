import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api";
import { toast } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role") || "student";

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

    // Password validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // SLIIT email validation
    const sliitEmailRegex = /^it\d{8}@my\.sliit\.lk$/;
    if (!sliitEmailRegex.test(form.email)) {
      setError("SLIIT email must be itxxxxxxxx@my.sliit.lk");
      return;
    }

    // Contact validation
    if (!/^0\d{9}$/.test(form.contactNumber)) {
      setError("Contact number must be 10 digits starting with 0");
      return;
    }

    try {
      await api.post("/auth/register", { ...form, role });

      // SUCCESS
      toast.success("OTP sent to your email ");

      // navigate to verify page
      navigate("/verify-otp", { state: { email: form.email } });

    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      toast.error("Registration failed ");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-10">

        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Register as {role.charAt(0).toUpperCase() + role.slice(1)}
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Create your UniFlow account
        </p>

        <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-5">

          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="input-style" required />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="input-style" required />

          <input name="email" placeholder="SLIIT Email (ITxxxxxxxx@my.sliit.lk)" value={form.email} onChange={handleChange} className="input-style md:col-span-2" required />

          <input name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} className="input-style" required />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="input-style" />

          <select name="faculty" value={form.faculty} onChange={handleChange} className="input-style">
            <option value="">Select Faculty</option>
            <option value="Computing">Faculty of Computing</option>
            <option value="Business">Faculty of Business</option>
            <option value="Engineering">Faculty of Engineering</option>
          </select>

          <select name="semester" value={form.semester} onChange={handleChange} className="input-style">
            <option value="">Select Semester</option>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
          </select>

          <select name="year" value={form.year} onChange={handleChange} className="input-style">
            <option value="">Select Year</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>

          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="input-style" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="input-style" required />

          <button
            type="submit"
            className="md:col-span-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md"
          >
            Create Account
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-4 font-medium">
            {error}
          </p>
        )}

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;