import { useState } from "react";
import Swal from "sweetalert2";
import { updateGalleryContentApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";
import { Modal } from "../../../components/Modal";
import toast from "react-hot-toast";

const isVideoFile = (file) => file?.type?.startsWith("video/");

const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
const imageExtensions = [".jpg", ".jpeg", ".png"];

export const EditGalleryModal = ({ item, open, onClose, onUpdated }) => {
  const [name, setName] = useState(item.name);
  const [date, setDate] = useState(item.date ? item.date.slice(0, 10) : "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const getExtension = (filename) =>
    filename ? filename.toLowerCase().substring(filename.lastIndexOf(".")) : "";

  const originalExt = getExtension(item.file);

  const isOriginalVideo = videoExtensions.includes(originalExt);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";

    if (!file && !item.file) {
      newErrors.file = "File is required";
    }

    if (file) {
      const newIsVideo = isVideoFile(file);
      if (newIsVideo !== isOriginalVideo) {
        newErrors.file = "Cannot replace image with video or vice versa";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("date", date);
    if (file) formData.append("file", file);

    try {
      setIsSaving(true);
      const res = await updateGalleryContentApi(item._id, formData);
      if (res?.data?.success) {
        Swal.fire("Success!", "Content updated successfully.", "success");
        onUpdated();
        onClose();
      }
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreview = () => {
    if (!item.file && !preview) return null;

    const originalSrc = `${process.env.REACT_APP_API_URL}/uploads/${item.file}`;
    const newSrc = preview;
    const isOriginalVideo = videoExtensions.includes(getExtension(item.file));
    const isNewVideo = preview ? isVideoFile(file) : false;

    return (
      <div className="flex gap-4">
        {/* Original File */}
        {item.file && (
          <div className="text-sm text-gray-700">
            <p className="mb-1">Original:</p>
            {isOriginalVideo ? (
              <video
                src={originalSrc}
                className="w-32 h-32 object-cover rounded"
                muted
                playsInline
              />
            ) : (
              <img
                src={originalSrc}
                className="w-32 h-32 object-cover rounded"
                alt="Original"
              />
            )}
          </div>
        )}

        {/* New Preview File */}
        {newSrc && (
          <div className="text-sm text-gray-700">
            <p className="mb-1">New Preview:</p>
            {isNewVideo ? (
              <video
                src={newSrc}
                className="w-32 h-32 object-cover rounded"
                muted
                playsInline
              />
            ) : (
              <img
                src={newSrc}
                className="w-32 h-32 object-cover rounded"
                alt="Preview"
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal open={open} onClose={onClose} modalTitle="Edit Gallery Content">
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <label className="block">
          Name *
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={"w-full border p-2 rounded"}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </label>

        <label className="block">
          Date (optional)
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </label>

        <label className="block">
          Replace File (optional)
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className={"w-full border p-2 rounded"}
          />
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file}</p>
          )}
        </label>

        {(preview || item.file) && renderPreview()}

        <div className="flex justify-start space-x-3 mt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="w-max btn-primary"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-sm hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};
