import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createGalleryContentApi, getCategoriesApi } from "../../../apis/api";
import { Modal } from "../../../components/Modal";
import { Trash, X } from "lucide-react";

const isVideoFile = (file) => file?.type?.startsWith("video/");

export const AddGalleryModal = ({ open, onClose, onUploaded }) => {
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Fetch categories when modal opens
  useEffect(() => {
    if (!open) return;

    const fetchCategories = async () => {
      try {
        const res = await getCategoriesApi("gallery");
        if (res?.data?.success) {
          const fetchedCategories = (res.data.data || [])
            .filter((c) => !c.isDeleted)
            .sort((a, b) => {
              if (a.title?.toLowerCase() === "others") return -1;
              if (b.title?.toLowerCase() === "others") return 1;
              return 0;
            });
          setCategories(fetchedCategories);
        }
      } catch (err) {
        console.error("Error fetching gallery categories:", err);
      }
    };

    fetchCategories();
  }, [open]);

  // Cleanup previews
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  if (!open) return null;

  const GallerySchema = Yup.object().shape({
    name: Yup.string().required("Album name is required"),
    files: Yup.array().min(1, "At least one file is required"),
    categoryTitle: Yup.string(),
    date: Yup.string().nullable(),
    tags: Yup.array()
      .of(Yup.string().required())
      .min(2, "At least 2 tags required"),
  });

  return (
    <Modal open={open} onClose={onClose} modalTitle="Add Album">
      <Formik
        enableReinitialize
        initialValues={{
          name: "",
          files: [],
          categoryTitle:
            categories.find((c) => c.title?.toLowerCase() === "others")
              ?.title || "Others",
          date: "",
          tags: [],
        }}
        validationSchema={GallerySchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            if (!selectedFiles.length) {
              Swal.fire("Error", "Please select at least one file", "error");
              setSubmitting(false);
              return;
            }

            const firstIsVideo = isVideoFile(selectedFiles[0]);
            for (let i = 0; i < selectedFiles.length; i++) {
              if (isVideoFile(selectedFiles[i]) !== firstIsVideo) {
                Swal.fire(
                  "Error",
                  "All files in an album must be either images or videos",
                  "error"
                );
                setSubmitting(false);
                return;
              }
            }

            const formData = new FormData();
            selectedFiles.forEach((file) => {
              const uniqueName = `${Date.now()}-${file.name}`;
              const uniqueFile = new File([file], uniqueName, {
                type: file.type,
              });
              formData.append("files", uniqueFile);
            });
            formData.append("name", values.name);
            formData.append("categoryTitle", values.categoryTitle);
            formData.append("date", values.date || "");
            values.tags.forEach((tag) => formData.append("tags[]", tag));

            const res = await createGalleryContentApi(formData);
            if (res?.data?.success) {
              Swal.fire("Success!", "Album created successfully.", "success");
              resetForm();
              setSelectedFiles([]);
              setPreviews([]);
              onUploaded();
              onClose();
            }
          } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Failed to add album.", "error");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          const handleFileChange = (e) => {
            const files = Array.from(e.target.files);
            const updatedFiles = [...selectedFiles, ...files];
            setSelectedFiles(updatedFiles);
            setFieldValue("files", updatedFiles);

            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
          };

          const removeFile = (idx) => {
            const updatedFiles = selectedFiles.filter((_, i) => i !== idx);
            const updatedPreviews = previews.filter((_, i) => i !== idx);
            setSelectedFiles(updatedFiles);
            setPreviews(updatedPreviews);
            setFieldValue("files", updatedFiles);
          };

          return (
            <Form className="space-y-4 p-6">
              {/* Album Name */}
              <div>
                <label className="block text-sm font-medium">
                  Album Name *
                </label>
                <Field
                  name="name"
                  type="text"
                  className="w-full border rounded p-2"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium">Category *</label>
                <Field
                  as="select"
                  name="categoryTitle"
                  className="w-full border rounded p-2"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.title}>
                      {cat.title}
                    </option>
                  ))}
                </Field>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium">Date</label>
                <Field
                  name="date"
                  type="date"
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium">Tags *</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {values.tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-100 px-2 py-1 rounded flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue(
                            "tags",
                            values.tags.filter((_, i) => i !== idx)
                          )
                        }
                        className="text-[#204081] font-bold"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add a tag and press Enter"
                  className="mt-1 w-full border rounded p-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const newTag = e.target.value.trim();
                      if (newTag && !values.tags.includes(newTag)) {
                        setFieldValue("tags", [...values.tags, newTag]);
                      }
                      e.target.value = "";
                    }
                  }}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium">
                  Album Files *
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full border rounded p-2"
                />
                <ErrorMessage
                  name="files"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Previews */}
              {previews.length > 0 && (
                <div className="flex gap-4 mt-2 flex-wrap">
                  {previews.map((url, idx) => (
                    <div key={idx} className="w-32 h-32 relative">
                      {isVideoFile(selectedFiles[idx]) ? (
                        <video
                          src={url}
                          className="w-full h-full object-cover rounded"
                          muted
                          playsInline
                          controls
                        />
                      ) : (
                        <img
                          src={url}
                          alt="Preview"
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                        onClick={() => removeFile(idx)}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit */}
              <div className="flex space-x-2 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? "Uploading..." : "Create Album"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};
