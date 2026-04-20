import { useState } from "react";
import api from "../api";
import { toast } from "react-hot-toast";

const PostQuestion = ({ refresh }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({
    title: "",
    description: ""
  });

  const validate = () => {
    let valid = true;
    const newErrors = { title: "", description: "" };

    //Title validation
    if (!title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    } else if (title.length < 5) {
      newErrors.title = "Minimum 5 characters required";
      valid = false;
    } else if (title.length > 150) {
      newErrors.title = "Maximum 150 characters allowed";
      valid = false;
    }
    
     else if (!/[a-zA-Z]/.test(title)) {
       newErrors.title = "Title must contain at least one letter";
       valid = false;
    }

    //Description validation
    if (!description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    } else if (description.length < 30) {
      newErrors.description = "Minimum 30 characters required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

 const submit = async () => {
  if (!validate()) return;

  const titleTrim = title.trim();
  const descTrim = description.trim();

  // Block if ONLY numbers (no letters at all)
  if (/^\d+$/.test(titleTrim) || /^\d+$/.test(descTrim)) {
    toast.error("Title and description cannot contain only numbers. Please include some letters.");
    return;
  }

  try {
    await api.post("/questions", { title, description });
    toast.success("Question posted successfully!");
    setTitle("");
    setDescription("");
    setErrors({ title: "", description: "" });
    refresh();
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to post question");
  }
};
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 mb-6 border">
      
      {/* Heading */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Ask a Question
      </h2>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Title
        </label>

        <input
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition 
          ${errors.title ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-400"}`}
          placeholder="Enter a clear and concise title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex justify-between mt-1">
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
          <p className="text-xs text-gray-400 ml-auto">
            {title.length}/150
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Description
        </label>

        <textarea
          rows={5}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition 
          ${errors.description ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-400"}`}
          placeholder="Explain your problem in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-between mt-1">
          {errors.description && (
            <p className="text-red-500 text-sm">
              {errors.description}
            </p>
          )}
          <p className="text-xs text-gray-400 ml-auto">
            {description.length} characters
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={submit}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition shadow-sm"
      >
        Post Question
      </button>
    </div>
  );
};

export default PostQuestion;