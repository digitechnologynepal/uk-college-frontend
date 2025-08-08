import { useEffect, useRef, useState } from "react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { createClientApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { CircleX } from "lucide-react";

export const AddClientModal = ({ open, onClose, onAdded }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [formKey, setFormKey] = useState(0);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setPreviewImage(null);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      setFormKey((prev) => prev + 1);
    }
  }, [open]);

  const clientSchema = Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    website: Yup.string()
      .trim()
      .url("Must be a valid URL starting with http:// or https://")
      .matches(
        /^$|^https?:\/\//,
        "Website must start with http:// or https://"
      ),
    number: Yup.string()
      .trim()
      .matches(/^$|^(\+)?[\d\s\-()]{7,20}$/, "Invalid phone number format"),
    location: Yup.string().trim(),
    image: Yup.mixed().required("Image is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name.trim());
    if (values.website) formData.append("website", values.website.trim());
    if (values.number) formData.append("number", values.number.trim());
    if (values.location) formData.append("location", values.location.trim());
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await createClientApi(formData);
      if (res?.data?.success) {
        toast.success("Client added successfully");
        onAdded();
        resetForm();
        setPreviewImage(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        onClose();
      }
    } catch (err) {
      ErrorHandler(err);
    }
  };

  return (
    <Modal open={open} onClose={onClose} modalTitle="Add Client">
      <section className="w-full max-w-3xl p-6 mx-auto">
        <Formik
          key={formKey}
          initialValues={{
            name: "",
            website: "",
            number: "",
            location: "",
            image: null,
          }}
          validationSchema={clientSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Field
                  name="name"
                  type="text"
                  className="w-full border p-2 rounded"
                />
                {errors.name && touched.name && (
                  <div className="text-red-600 text-sm">{errors.name}</div>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Website
                </label>
                <Field
                  name="website"
                  type="text"
                  placeholder="https://example.com"
                  className="w-full border p-2 rounded"
                />
                {errors.website && touched.website && (
                  <div className="text-red-600 text-sm">{errors.website}</div>
                )}
              </div>

              {/* Number */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <Field
                  name="number"
                  type="text"
                  placeholder="+1234567890"
                  className="w-full border p-2 rounded"
                />
                {errors.number && touched.number && (
                  <div className="text-red-600 text-sm">{errors.number}</div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <Field
                  name="location"
                  type="text"
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image *
                </label>
                {previewImage && (
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded shadow"
                    />
                    <CircleX
                      className="text-red-600 cursor-pointer"
                      size={28}
                      onClick={() => {
                        setPreviewImage(null);
                        setImageFile(null);
                        setFieldValue("image", null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = null;
                      }}
                    />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="border p-2 rounded w-full"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file);
                    setFieldValue("image", file || null);
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file));
                    } else {
                      setPreviewImage(null);
                    }
                  }}
                />
                {errors.image && touched.image && (
                  <div className="text-red-600 text-sm">{errors.image}</div>
                )}
              </div>

              {/* Submit */}
              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? "Adding..." : "Add Client"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </Modal>
  );
};
