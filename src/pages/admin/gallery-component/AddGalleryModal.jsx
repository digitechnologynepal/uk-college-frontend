import { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "../../../components/Button";
import { createGalleryContentApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";
import { Modal } from "../../../components/Modal";
const isVideoFile = (file) => file?.type?.startsWith("video/");

export const AddGalleryModal = ({ open, onClose, onUploaded }) => {
  const [items, setItems] = useState([
    { name: "", date: "", file: null, preview: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "file") {
      updated[index].preview = value ? URL.createObjectURL(value) : "";
    }

    setItems(updated);
  };

  const validate = () => {
    const newErrors = {};
    let valid = true;

    if (items.length === 0) {
      Swal.fire("Error", "Add at least one item", "error");
      return false;
    }

    const firstIsVideo = isVideoFile(items[0].file);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.name.trim()) {
        newErrors[`name_${i}`] = "Name is required";
        valid = false;
      }

      if (!item.file) {
        newErrors[`file_${i}`] = "File is required";
        valid = false;
      } else if (isVideoFile(item.file) !== firstIsVideo) {
        newErrors[`file_${i}`] =
          "All files must be either all images or all videos";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    items.forEach((item) => {
      formData.append("name", item.name);
      formData.append("date", item.date || "");
      formData.append("file", item.file);
    });

    try {
      setIsLoading(true);
      const res = await createGalleryContentApi(formData);
      if (res?.data?.success) {
        Swal.fire("Success", "Content uploaded successfully", "success");
        setItems([{ name: "", date: "", file: null, preview: "" }]);
        setErrors({});
        onUploaded();
        onClose();
      }
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} modalTitle="Add Gallery Content">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {items.map((item, index) => (
          <div key={index} className="border p-4 rounded space-y-4 relative">
            <div>
              <label className="block font-medium mb-1">Content Name *</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
                className={`w-full border p-2 rounded ${
                  errors[`name_${index}`] ? "border-red-500" : ""
                }`}
              />
              {errors[`name_${index}`] && (
                <p className="text-red-500 text-sm">
                  {errors[`name_${index}`]}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Date (optional)</label>
              <input
                type="date"
                value={item.date}
                onChange={(e) =>
                  handleInputChange(index, "date", e.target.value)
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Upload File (Image or Video) *
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) =>
                  handleInputChange(index, "file", e.target.files[0] || null)
                }
                className={`w-full border p-2 rounded ${
                  errors[`file_${index}`] ? "border-red-500" : ""
                }`}
              />
              {errors[`file_${index}`] && (
                <p className="text-red-500 text-sm">
                  {errors[`file_${index}`]}
                </p>
              )}
            </div>

            {item.preview &&
              item.file &&
              (item.file.type.startsWith("video/") ? (
                <div className="relative w-32 h-32 mb-2">
                  <video
                    src={item.preview}
                    className="w-full h-full object-cover rounded"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white bg-black bg-opacity-50 rounded-full p-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <img
                  src={item.preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover mb-2 rounded"
                />
              ))}
          </div>
        ))}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="btn-primary mt-2"
          >
            {isLoading ? "Uploading..." : "Add Gallery Content"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
