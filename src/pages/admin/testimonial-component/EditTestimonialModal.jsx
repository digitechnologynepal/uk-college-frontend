import { useEffect, useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { updateTestimonialApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";

export const EditTestimonialModal = ({
  open,
  onClose,
  testimonial,
  onUpdated,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const formikRef = useRef(null);
  const MAX_CHARS = 400;

  useEffect(() => {
    if (testimonial) {
      setPreviewImage(
        testimonial.image
          ? `${process.env.REACT_APP_API_URL}/uploads/${testimonial.image}`
          : null
      );
      setImageFile(null);
      setCharCount(testimonial.description?.length || 0);
    }
  }, [testimonial]);

  useEffect(() => {
    if (open && testimonial) {
      setCharCount(testimonial.description?.length || 0);
    }
    if (!open) {
      setPreviewImage(null);
      setImageFile(null);
      formikRef.current?.resetForm();
    }
  }, [open, testimonial]);

  const TestimonialSchema = Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    role: Yup.string().trim(),
    description: Yup.string()
      .trim()
      .required("Description is required")
      .max(MAX_CHARS, `Description cannot exceed ${MAX_CHARS} characters`),
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key] ?? "");
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setIsLoading(true);
      const res = await updateTestimonialApi(testimonial._id, formData);
      if (res?.data?.success) {
        Swal.fire("Success", "Testimonial updated successfully", "success");
        onUpdated();
        resetForm();
        onClose();
      }
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} modalTitle="Edit Testimonial">
      <section className="w-full max-w-3xl p-6 mx-auto">
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={{
            name: testimonial?.name || "",
            role: testimonial?.role || "",
            description: testimonial?.description || "",
          }}
          validationSchema={TestimonialSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, isSubmitting }) => (
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
                {errors.name && touched.name && (
                  <div className="text-red-600 text-sm mt-1">{errors.name}</div>
                )}
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
                {errors.role && touched.role && (
                  <div className="text-red-600 text-sm mt-1">{errors.role}</div>
                )}
              </div>

              {/* Description */}
              <div className="relative">
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
                    value = value.replace(/\r?\n/g, "\n");

                    // Limit characters to MAX_CHARS
                    if (value.length > MAX_CHARS) {
                      value = value.slice(0, MAX_CHARS);
                    }

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
                {errors.description && touched.description && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.description}
                  </div>
                )}
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
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="btn-primary"
                >
                  {isSubmitting || isLoading
                    ? "Updating..."
                    : "Update Testimonial"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </Modal>
  );
};
