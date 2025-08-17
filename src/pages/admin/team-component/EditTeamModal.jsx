import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { updateTeamMemberApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";

const phoneRegex = /^(\+)?[\d\s\-()]{7,20}$/;

const teamMemberSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  role: Yup.string().required("Role is required"),
  email: Yup.string()
    .email("Invalid email")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  number: Yup.string()
    .required("Number is required")
    .transform((value) => (value === "" ? null : value))
    .matches(phoneRegex, "Invalid phone number format"),
  facebook: Yup.string()
    .url("Invalid URL")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  threadLink: Yup.string()
    .url("Invalid URL")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  whatsapp: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .matches(phoneRegex, "Invalid WhatsApp number format"),
  insta: Yup.string()
    .url("Invalid URL")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  linkedin: Yup.string()
    .url("Invalid URL")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

export const EditTeamMemberModal = ({ open, onClose, member, onUpdated }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setPreviewImage(
        member.image
          ? `${process.env.REACT_APP_API_URL}/uploads/${member.image}`
          : null
      );
      setImageFile(null);
    }
  }, [member]);

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
      const res = await updateTeamMemberApi(member._id, formData);
      if (res?.data?.success) {
        Swal.fire("Success", "Team member updated successfully", "success");
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
    <Modal open={open} onClose={onClose} modalTitle="Edit Team Member">
      <section className="w-full max-w-3xl p-6 mx-auto">
        <Formik
          enableReinitialize
          initialValues={{
            name: member?.name || "",
            role: member?.role || "",
            email: member?.email || "",
            number: member?.number || "",
            facebook: member?.facebook || "",
            threadLink: member?.threadLink || "",
            whatsapp: member?.whatsapp || "",
            insta: member?.insta || "",
            linkedin: member?.linkedin || "",
          }}
          validationSchema={teamMemberSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
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
                  Role *
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

              {/* Contact & Socials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Email", name: "email", type: "email" },
                  { label: "Phone Number *", name: "number", type: "text" },
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
                    {errors[name] && touched[name] && (
                      <div className="text-red-600 text-sm mt-1">
                        {errors[name]}
                      </div>
                    )}
                  </div>
                ))}
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
                    : "Update Team Member"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </Modal>
  );
};
