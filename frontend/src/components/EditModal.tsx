// src/components/EditModal.tsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  initialDescription?: string;
  initialContent?: string;
  onSave: (data: any) => Promise<void>;
  type: "question" | "answer";
}

export default function EditModal({
  isOpen,
  onClose,
  initialTitle = "",
  initialDescription = "",
  initialContent = "",
  onSave,
  type,
}: EditModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setContent(initialContent);
    }
  }, [isOpen, initialTitle, initialDescription, initialContent]);

  // ✅ Fixed regex (no range error)
  const validPattern = /^[a-zA-Z0-9\s?.!,\-'"()]+$/;

  const handleSave = async () => {
    if (type === "question") {
      const titleTrim = title.trim();
      const descTrim = description.trim();

      if (!titleTrim || !descTrim) {
        toast.error("Title and description cannot be empty");
        return;
      }

      if (/^\d+$/.test(titleTrim) || /^\d+$/.test(descTrim)) {
        toast.error("Cannot contain only numbers. Please include letters.");
        return;
      }

      if (!validPattern.test(titleTrim) || !validPattern.test(descTrim)) {
        toast.error("Only letters, numbers, spaces and common punctuation allowed");
        return;
      }

      setLoading(true);
      try {
        await onSave({ title: titleTrim, description: descTrim });
        toast.success("Question updated successfully!");
        onClose();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to update");
      } finally {
        setLoading(false);
      }
    } else {
      const contentTrim = content.trim();

      if (!contentTrim || contentTrim.length < 20) {
        toast.error("Answer must be at least 20 characters");
        return;
      }

      if (/^\d+$/.test(contentTrim)) {
        toast.error("Cannot contain only numbers");
        return;
      }

      if (!validPattern.test(contentTrim)) {
        toast.error("Only letters, numbers, spaces and common punctuation allowed");
        return;
      }

      setLoading(true);
      try {
        await onSave({ content: contentTrim });
        toast.success("Answer updated successfully!");
        onClose();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to update");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4">
        <h2 className="text-2xl font-semibold mb-6">
          Edit {type === "question" ? "Question" : "Answer"}
        </h2>

        {type === "question" ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006591]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006591]"
              />
            </div>
          </>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006591]"
          />
        )}

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3 bg-[#006591] text-white rounded-xl hover:bg-[#005580] disabled:opacity-70 font-medium"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}