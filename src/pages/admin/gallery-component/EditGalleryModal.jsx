import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateGalleryContentApi, getCategoriesApi } from "../../../apis/api";
import { Modal } from "../../../components/Modal";
import { X } from "lucide-react";

const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];

export const EditGalleryModal = ({ item, open, onClose, onUpdated }) => {
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);

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

  if (!open) return null;

  const GallerySchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    date: Yup.string(),
    categoryTitle: Yup.string().required("Category is required"),
    file: Yup.mixed().nullable(),
    tags: Yup.array()
      .of(Yup.string().required())
      .min(2, "At least 2 tags are required"),
  });

  const getExtension = (filename) =>
    filename ? filename.toLowerCase().substring(filename.lastIndexOf(".")) : "";

  const isVideoFile = (file) => file?.type?.startsWith("video/");

  return (
    <Modal open={open} onClose={onClose} modalTitle="Edit Gallery Content">
      <Formik
        enableReinitialize
        initialValues={{
          name: item?.name || "",
          date: item?.date ? item.date.slice(0, 10) : "",
          categoryTitle:
            item?.categoryTitle ||
            categories.find((c) => c.title?.toLowerCase() === "others")?.title ||
            "Others",
          file: null,
          tags: Array.isArray(item?.tags) ? item.tags : [],
        }}
        validationSchema={GallerySchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("date", values.date);
            formData.append("categoryTitle", values.categoryTitle);
            if (values.file) formData.append("file", values.file);
            values.tags.forEach((tag) => formData.append("tags[]", tag));

            const res = await updateGalleryContentApi(item._id, formData);
            if (res?.data?.success) {
              Swal.fire("Success!", "Gallery content updated successfully.", "success");
              onUpdated();
              onClose();
            }
          } catch (err) {
            Swal.fire("Error!", "Failed to update gallery content.", "error");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ setFieldValue, isSubmitting, values }) => (
          <Form className="space-y-4 p-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium">Name *</label>
              <Field name="name" type="text" className="w-full border p-2 rounded" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium">Date (optional)</label>
              <Field name="date" type="date" className="w-full border p-2 rounded" />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium">Category</label>
              <Field as="select" name="categoryTitle" className="w-full border rounded p-2">
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.title}>
                    {cat.title}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="categoryTitle"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {values.tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-100 px-2 py-1 rounded flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newTags = values.tags.filter((_, i) => i !== idx);
                        setFieldValue("tags", newTags);
                      }}
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
              <ErrorMessage
                name="tags"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium">Replace File (optional)</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  const file = e.currentTarget.files[0];
                  setFieldValue("file", file);
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Preview */}
            {(preview || item.file) && (
              <div className="flex gap-4">
                {item.file && (
                  <div className="text-sm text-gray-700">
                    <p className="mb-1">Current:</p>
                    {videoExtensions.includes(getExtension(item.file)) ? (
                      <video
                        src={`${process.env.REACT_APP_API_URL}/uploads/${item.file}`}
                        className="w-32 h-32 object-cover rounded"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${item.file}`}
                        className="w-32 h-32 object-cover rounded"
                        alt="Current"
                      />
                    )}
                  </div>
                )}
                {preview && (
                  <div className="text-sm text-gray-700">
                    <p className="mb-1">New Preview:</p>
                    {isVideoFile(preview) ? (
                      <video
                        src={preview}
                        className="w-32 h-32 object-cover rounded"
                        muted
                        playsInline
                      />
                    ) : (
                      <img src={preview} className="w-32 h-32 object-cover rounded" alt="Preview" />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-start space-x-3 mt-4">
              <button type="submit" disabled={isSubmitting} className="w-max btn-primary">
                {isSubmitting ? "Saving..." : "Save Changes"}
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
        )}
      </Formik>
    </Modal>
  );
};
