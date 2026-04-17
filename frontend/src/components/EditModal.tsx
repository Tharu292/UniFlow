// src/components/EditModal.tsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  initialDescription?: string;
  initialContent?: string;
  onSave: (data: { title?: string; description?: string; content?: string }) => Promise<void>;
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setContent(initialContent);
    }
  }, [isOpen, initialTitle, initialDescription, initialContent]);

  const validPattern = /^[a-zA-Z0-9\s?.!,\-'"()]+$/;

  const handleSave = async () => {
    try {
      if (type === "question") {
        const titleTrim = title.trim();
        const descTrim = description.trim();

        if (!titleTrim || !descTrim) {
          return toast.error("Title and description cannot be empty");
        }

        if (/^\d+$/.test(titleTrim) || /^\d+$/.test(descTrim)) {
          return toast.error("Cannot contain only numbers");
        }

        if (!validPattern.test(titleTrim) || !validPattern.test(descTrim)) {
          return toast.error("Invalid characters used");
        }

        setLoading(true);
        await onSave({ title: titleTrim, description: descTrim });

        toast.success("Question updated!");
        onClose();
      } else {
        const contentTrim = content.trim();

        if (!contentTrim || contentTrim.length < 10) {
          return toast.error("Answer must be at least 10 characters");
        }

        if (/^\d+$/.test(contentTrim)) {
          return toast.error("Cannot contain only numbers");
        }

        if (!validPattern.test(contentTrim)) {
          return toast.error("Invalid characters used");
        }

        setLoading(true);
        await onSave({ content: contentTrim });

        toast.success("Answer updated!");
        onClose();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
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
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-4 border rounded-xl mb-4"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Description"
              className="w-full p-4 border rounded-xl"
            />
          </>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="Edit your answer..."
            className="w-full p-4 border rounded-xl"
          />
        )}

        <div className="flex gap-4 mt-6">
          <button onClick={onClose} className="flex-1 border py-3 rounded-xl">
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-[#006591] text-white py-3 rounded-xl"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}