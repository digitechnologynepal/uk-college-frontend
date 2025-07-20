import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { updateClientApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";

const phoneRegex = /^(\+)?[\d\s\-()]{7,20}$/;

const clientSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  website: Yup.string()
    .url("Invalid URL")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  number: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .matches(phoneRegex, "Invalid phone number format"),
  location: Yup.string().nullable(),
});

export const EditClientModal = ({ open, onClose, client, onUpdated }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (client) {
      setPreviewImage(
        client.image
          ? `${process.env.REACT_APP_API_URL}/uploads/${client.image}`
          : null
      );
      setImageFile(null);
    }
  }, [client]);

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
      const res = await updateClientApi(client._id, formData);
      if (res?.data?.success) {
        Swal.fire("Success", "Client updated successfully", "success");
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
    <Modal open={open} onClose={onClose} modalTitle="Edit Client">
      <section className="w-full max-w-3xl p-6 mx-auto">
        <Formik
          enableReinitialize
          initialValues={{
            name: client?.name || "",
            website: client?.website || "",
            number: client?.number || "",
            location: client?.location || "",
          }}
          validationSchema={clientSchema}
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

              {/* Website */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="website"
                >
                  Website
                </label>
                <Field
                  id="website"
                  name="website"
                  type="url"
                  className="w-full border p-2 rounded"
                  placeholder="https://example.com"
                />
                {errors.website && touched.website && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.website}
                  </div>
                )}
              </div>

              {/* Number */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="number"
                >
                  Phone Number
                </label>
                <Field
                  id="number"
                  name="number"
                  type="text"
                  className="w-full border p-2 rounded"
                  placeholder="+1234567890"
                />
                {errors.number && touched.number && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.number}
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="location"
                >
                  Location
                </label>
                <Field
                  id="location"
                  name="location"
                  type="text"
                  className="w-full border p-2 rounded"
                />
                {errors.location && touched.location && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.location}
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
                  {isSubmitting || isLoading ? "Updating..." : "Update Client"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </Modal>
  );
};
