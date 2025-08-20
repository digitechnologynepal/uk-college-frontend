import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { createTestimonialApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const AddTestimonialModal = ({ open, onClose, onAdded }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [formKey, setFormKey] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const MAX_CHARS = 600;

  useEffect(() => {
    if (!open) {
      setFormKey((k) => k + 1);
      setPreviewImage(null);
      setCharCount(0); // reset character count when modal closes
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const TestimonialSchema = Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    role: Yup.string().trim(),
    description: Yup.string()
      .trim()
      .required("Description is required")
      .max(MAX_CHARS, `Description cannot exceed ${MAX_CHARS} characters`),
    image: Yup.mixed()
      .notRequired()
      .test(
        "fileType",
        "Unsupported file format",
        (value) =>
          !value ||
          (value &&
            ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
              value.type
            ))
      ),
  });

  return (
    <Modal open={open} onClose={onClose} modalTitle="Add Testimonial">
      <section className="w-full max-w-3xl p-6 mx-auto">
        <Formik
          key={formKey}
          initialValues={{
            name: "",
            role: "",
            description: "",
            image: null,
          }}
          validationSchema={TestimonialSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const payload = new FormData();
            Object.entries(values).forEach(([key, value]) => {
              if (key === "image") {
                if (value) payload.append(key, value);
              } else if (value && value.trim() !== "") {
                payload.append(key, value.trim());
              }
            });

            try {
              setSubmitting(true);
              const res = await createTestimonialApi(payload);
              if (res?.data?.success) {
                Swal.fire(
                  "Success",
                  "Testimonial added successfully",
                  "success"
                );
                onAdded();
                resetForm();
                setPreviewImage(null);
                setCharCount(0);
                if (fileInputRef.current) fileInputRef.current.value = "";
                onClose();
              }
            } catch (err) {
              ErrorHandler(err);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              {/* Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="name"
                >
                  Name *
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Role */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="role"
                >
                  Role
                </label>
                <Field
                  id="role"
                  name="role"
                  type="text"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="description"
                >
                  Description *
                </label>
                <Field
                  id="description"
                  name="description"
                  as="textarea"
                  rows={4}
                  className="w-full border p-2 rounded"
                  onChange={(e) => {
                    let value = e.target.value;

                    // Limit characters
                    if (value.length > MAX_CHARS) value = value.slice(0, MAX_CHARS);

                    setFieldValue("description", value);
                    setCharCount(value.length);
                  }}
                />
                <p
                  className={`text-sm ${
                    charCount === MAX_CHARS ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {charCount}/{MAX_CHARS} characters
                </p>
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="image"
                >
                  Image
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
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    setFieldValue("image", file);
                    if (previewImage) URL.revokeObjectURL(previewImage);
                    setPreviewImage(file ? URL.createObjectURL(file) : null);
                  }}
                  className="border p-2 rounded w-full"
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Submit */}
              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? "Adding..." : "Add Testimonial"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </Modal>
  );
};
