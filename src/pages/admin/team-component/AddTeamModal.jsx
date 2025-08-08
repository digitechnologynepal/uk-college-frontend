import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { createTeamMemberApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const AddTeamMemberModal = ({ open, onClose, onAdded }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [formKey, setFormKey] = useState(0);

useEffect(() => {
  if (!open) {
    setFormKey((k) => k + 1);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
}, [open]);


  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  useEffect(() => {
    if (open) {
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open]);

  // Validation schema with Yup
  const TeamMemberSchema = Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    role: Yup.string().trim().required("Role is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email format")
      .nullable()
      .notRequired(),
    number: Yup.string()
      .trim()
      .matches(/^(\+)?[\d\s\-()]{7,20}$/, "Invalid phone number format")
      .nullable()
      .notRequired(),
    facebook: Yup.string().url("Invalid URL").nullable().notRequired(),
    threadLink: Yup.string().url("Invalid URL").nullable().notRequired(),
    whatsapp: Yup.string()
      .trim()
      .matches(/^(\+)?[\d\s\-()]{7,20}$/, "Invalid WhatsApp number format")
      .nullable()
      .notRequired(),
    insta: Yup.string().url("Invalid URL").nullable().notRequired(),
    linkedin: Yup.string().url("Invalid URL").nullable().notRequired(),
    image: Yup.mixed()
      .required("Image is required")
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
    <Modal open={open} onClose={onClose} modalTitle="Add Team Member">
      <section className="w-full max-w-3xl p-6 mx-auto">
        <Formik
          key={formKey}
          initialValues={{
            name: "",
            role: "",
            email: "",
            number: "",
            facebook: "",
            threadLink: "",
            whatsapp: "",
            insta: "",
            linkedin: "",
            image: null,
          }}
          validationSchema={TeamMemberSchema}
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
              const res = await createTeamMemberApi(payload);
              if (res?.data?.success) {
                Swal.fire(
                  "Success",
                  "Team member added successfully",
                  "success"
                );
                onAdded();
                resetForm();
                setPreviewImage(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
                onClose();
              }
            } catch (err) {
              ErrorHandler(err);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, isSubmitting, values }) => (
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
                  Role/Position *
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
                    <Field
                      id={name}
                      name={name}
                      type={type}
                      className="w-full border p-2 rounded"
                    />
                    <ErrorMessage
                      name={name}
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                ))}
              </div>

              {/* Image Upload */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="image"
                >
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
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    setFieldValue("image", file);
                    if (previewImage) URL.revokeObjectURL(previewImage);
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file));
                    } else {
                      setPreviewImage(null);
                    }
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
                  {isSubmitting ? "Adding..." : "Add Team Member"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </Modal>
  );
};
