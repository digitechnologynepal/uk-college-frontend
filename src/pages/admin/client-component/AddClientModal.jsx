import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { createClientApi } from "../../../apis/api"; 
import { ErrorHandler } from "../../../components/error/errorHandler";

export const AddClientModal = ({ open, onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    number: "",
    location: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      name: "",
      website: "",
      number: "",
      location: "",
    });
    setImageFile(null);

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setImageFile(file);
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!formData.name.trim()) {
      Swal.fire("Error", "Name is required", "error");
      return false;
    }
    if (!imageFile) {
      Swal.fire("Error", "Image is required", "error");
      return false;
    }

    // Website URL validation if provided
    if (formData.website && !/^https?:\/\/.+/.test(formData.website.trim())) {
      Swal.fire("Error", "Website must be a valid URL starting with http:// or https://", "error");
      return false;
    }

    // Phone number basic validation
    const phoneRegex = /^(\+)?[\d\s\-()]{7,20}$/;
    if (formData.number && !phoneRegex.test(formData.number.trim())) {
      Swal.fire("Error", "Invalid phone number format", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = new FormData();
    for (const key in formData) {
      const value = formData[key];
      if (typeof value === "string" && value.trim() !== "") {
        payload.append(key, value.trim());
      }
    }
    if (imageFile) payload.append("image", imageFile);

    try {
      setIsLoading(true);
      const res = await createClientApi(payload);
      if (res?.data?.success) {
        Swal.fire("Success", "Client added successfully", "success");
        onAdded();
        onClose();
      }
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} modalTitle="Add Client">
      <section className="w-full max-w-3xl p-6 mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="website">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="https://example.com"
            />
          </div>

          {/* Number */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="number">
              Phone Number
            </label>
            <input
              id="number"
              name="number"
              type="text"
              value={formData.number}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="+1234567890"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="image">
              Image *
            </label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-32 h-32 object-cover rounded mb-2"
              />
            )}
            <input
              ref={fileInputRef}
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Submit */}
          <div>
            <Button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Adding..." : "Add Client"}
            </Button>
          </div>
        </form>
      </section>
    </Modal>
  );
};
