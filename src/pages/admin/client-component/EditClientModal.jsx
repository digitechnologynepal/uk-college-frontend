import { useEffect, useRef, useState } from "react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { updateClientApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { CircleX } from "lucide-react";

export const EditClientModal = ({ open, onClose, client, onUpdated }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewClientImage, setPreviewClientImage] = useState(null);
  const fileInputRef = useRef(null);
  const [formKey, setFormKey] = useState(0);

  // Reset form and previews when modal closes
  useEffect(() => {
    if (!open) {
      if (previewImage && imageFile) URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
      setImageFile(null);
      setPreviewClientImage(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      setFormKey((prev) => prev + 1);
    }
  }, [open]);

  // Initialize previews every time modal opens
  useEffect(() => {
    if (open && client) {
      setPreviewImage(
        client.image
          ? `${process.env.REACT_APP_API_URL}/uploads/${client.image}`
          : null
      );
      setPreviewClientImage(client.clientImage || null);
    }
  }, [open, client]);

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
    image: Yup.mixed().when("existingImage", {
      is: (val) => !val,
      then: (schema) =>
        schema
          .required("Main image is required")
          .test(
            "fileType",
            "Only JPEG/PNG files are allowed",
            (value) =>
              value &&
              ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          )
          .test(
            "fileSize",
            "File is too large (max 5MB)",
            (value) => value && value.size <= 5 * 1024 * 1024
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    clientImageURL: Yup.string()
      .trim()
      .notRequired()
      .url("Must be a valid URL starting with http:// or https://")
      .matches(/^$|^https?:\/\//, "URL must start with http:// or https://"),
    fbVideoUrl: Yup.string()
      .trim()
      .url("Must be a valid Facebook video URL")
      .matches(/^$|^https?:\/\//)
      .notRequired(),
    ytVideoUrl: Yup.string()
      .trim()
      .url("Must be a valid YouTube URL")
      .matches(/^$|^https?:\/\//)
      .notRequired(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name.trim());
    if (values.website) formData.append("website", values.website.trim());
    if (values.number) formData.append("number", values.number.trim());
    if (values.location) formData.append("location", values.location.trim());
    if (imageFile) formData.append("image", imageFile);
    formData.append("clientImage", values.clientImageURL || "");
    formData.append("fbVideoUrl", values.fbVideoUrl?.trim() || "");
    formData.append("ytVideoUrl", values.ytVideoUrl?.trim() || "");

    try {
      const res = await updateClientApi(client._id, formData);
      if (res?.data?.success) {
        Swal.fire("Success!", "Client updated successfully.", "success");
        onUpdated();
        resetForm();
        if (previewImage && imageFile) URL.revokeObjectURL(previewImage);
        setPreviewImage(
          client.image
            ? `${process.env.REACT_APP_API_URL}/uploads/${client.image}`
            : null
        );
        setImageFile(null);
        setPreviewClientImage(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        onClose();
      }
    } catch (err) {
      ErrorHandler(err);
    }
  };

  return (
    <Modal open={open} onClose={onClose} modalTitle="Edit Client">
      <section className="w-full max-w-3xl p-6 mx-auto">
        <Formik
          key={formKey}
          enableReinitialize
          initialValues={{
            name: client?.name || "",
            website: client?.website || "",
            number: client?.number || "",
            location: client?.location || "",
            existingImage: !!client?.image,
            image: null,
            clientImageURL: client?.clientImage || "",
            fbVideoUrl: client?.fbVideoUrl || "",
            ytVideoUrl: client?.ytVideoUrl || "",
          }}
          validationSchema={clientSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values, isSubmitting }) => (
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

              {/* Phone Number */}
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

              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Main Image *
                </label>
                {previewImage && (
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded shadow"
                    />
                    {!client?.image && (
                      <CircleX
                        className="text-red-600 cursor-pointer"
                        size={28}
                        onClick={() => {
                          if (previewImage) URL.revokeObjectURL(previewImage);
                          setPreviewImage(null);
                          setImageFile(null);
                          setFieldValue("image", null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = null;
                        }}
                      />
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="border p-2 rounded w-full"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (previewImage && imageFile)
                      URL.revokeObjectURL(previewImage);
                    setImageFile(file);
                    setFieldValue("image", file || null);
                    setPreviewImage(
                      file ? URL.createObjectURL(file) : previewImage
                    );
                  }}
                />
                {errors.image && touched.image && (
                  <div className="text-red-600 text-sm">{errors.image}</div>
                )}
              </div>

              {/* Client Image URL */}
              <div>
                <label className="block text-sm font-medium">
                  Client Image URL
                </label>
                <p className="text-xs text-[#2d5dbc] mb-1">
                  Guide: Go to the facebook image and <b>"Copy image address"</b>
                </p>
                <Field
                  name="clientImageURL"
                  type="text"
                  className="w-full border p-2 rounded"
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) => {
                    setFieldValue("clientImageURL", e.target.value);
                    setPreviewClientImage(e.target.value || null);
                  }}
                />
                {errors.clientImageURL && touched.clientImageURL && (
                  <div className="text-red-600 text-sm">
                    {errors.clientImageURL}
                  </div>
                )}
                {previewClientImage && (
                  <div className="flex items-center gap-4 mt-2">
                    <img
                      src={previewClientImage}
                      alt="Client Preview"
                      className="w-24 h-24 object-cover rounded shadow"
                    />
                    <CircleX
                      className="text-red-600 cursor-pointer"
                      size={28}
                      onClick={() => {
                        setPreviewClientImage(null);
                        setFieldValue("clientImageURL", "");
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Facebook Video URL */}
              <div>
                <label className="block text-sm font-medium">
                  Facebook Video URL
                </label>
                <p className="text-xs text-[#2d5dbc] mb-1">
                  Guide: <b>Open</b> the facebook video and <b>"Copy address"</b>
                  <br />
                  The URL should look something like
                  "https://www.facebook.com/ukcolleges/videos/videoId"
                </p>
                <Field
                  name="fbVideoUrl"
                  type="text"
                  className="w-full border p-2 rounded"
                  placeholder="https://www.facebook.com/..."
                />
              </div>

              {/* YouTube Video URL */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  YouTube Video URL
                </label>
                <Field
                  name="ytVideoUrl"
                  type="text"
                  className="w-full border p-2 rounded"
                  placeholder="https://www.youtube.com/..."
                />
              </div>

              {/* Submit */}
              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? "Updating..." : "Update Client"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </Modal>
  );
};
