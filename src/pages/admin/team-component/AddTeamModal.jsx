import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { createTeamMemberApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";

export const AddTeamMemberModal = ({ open, onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    number: "",
    facebook: "",
    threadLink: "",
    whatsapp: "",
    insta: "",
    linkedin: "",
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
      role: "",
      email: "",
      number: "",
      facebook: "",
      threadLink: "",
      whatsapp: "",
      insta: "",
      linkedin: "",
    });
    setImageFile(null);

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }

    // Clear file input manually
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
    if (!formData.role.trim()) {
      Swal.fire("Error", "Role is required", "error");
      return false;
    }
    if (!imageFile) {
      Swal.fire("Error", "Image is required", "error");
      return false;
    }

    const phoneRegex = /^(\+)?[\d\s\-()]{7,20}$/;

    if (formData.number && !phoneRegex.test(formData.number.trim())) {
      Swal.fire("Error", "Invalid phone number format", "error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email.trim())) {
      Swal.fire("Error", "Invalid email format", "error");
      return false;
    }

    if (formData.whatsapp && !phoneRegex.test(formData.whatsapp.trim())) {
      Swal.fire("Error", "Invalid WhatsApp number format", "error");
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
      const res = await createTeamMemberApi(payload);
      if (res?.data?.success) {
        Swal.fire("Success", "Team member added successfully", "success");
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
    <Modal open={open} onClose={onClose} modalTitle="Add Team Member">
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

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="role">
              Role *
            </label>
            <input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Contact & Socials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Email", name: "email", type: "email" },
              { label: "Phone Number", name: "number", type: "text" },
              { label: "Facebook", name: "facebook", type: "url" },
              { label: "Threads Link", name: "threadLink", type: "url" },
              { label: "WhatsApp", name: "whatsapp", type: "text" },
              { label: "Instagram", name: "insta", type: "url" },
              { label: "LinkedIn", name: "linkedin", type: "url" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor={name}
                >
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}
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
              {isLoading ? "Adding..." : "Add Team Member"}
            </Button>
          </div>
        </form>
      </section>
    </Modal>
  );
};
