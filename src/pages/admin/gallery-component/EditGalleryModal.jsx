import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  updateGalleryContentApi,
  updateAlbumApi,
  getCategoriesApi,
  deleteGalleryContentApi,
} from "../../../apis/api";
import { Modal } from "../../../components/Modal";
import { Trash, X } from "lucide-react";

// Utility
const isVideoFile = (file) =>
  file?.type?.startsWith("video/") || file?.fileType === "video";

export const EditGalleryModal = ({
  open,
  onClose,
  onUpdated,
  item = null,
  albumItems = null,
}) => {
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // newly uploaded files
  const [previews, setPreviews] = useState([]); // previews for newly uploaded files
  const [existingItems, setExistingItems] = useState([]); // existing album items or single item

  // Fetch categories + setup existing items
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
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
    setExistingItems(albumItems?.length ? albumItems : item ? [item] : []);
    setSelectedFiles([]);
    setPreviews([]);
  }, [open, albumItems, item]);

  // Cleanup previews
  useEffect(
    () => () => previews.forEach((url) => URL.revokeObjectURL(url)),
    [previews]
  );

  if (!open) return null;

  const GallerySchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    categoryTitle: Yup.string().required("Category is required"),
    tags: Yup.array()
      .of(Yup.string().required())
      .min(2, "At least 2 tags are required"),
  });

  const handleFileChange = (e, setFieldValue) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    setFieldValue("files", [...selectedFiles, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewFile = (idx, setFieldValue) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== idx);
    const updatedPreviews = previews.filter((_, i) => i !== idx);
    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);
    setFieldValue("files", updatedFiles);
  };

  const removeExistingFile = async (_id) => {
    const confirmed = await Swal.fire({
      title: "Delete file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });
    if (!confirmed.isConfirmed) return;

    try {
      await deleteGalleryContentApi(_id);
      setExistingItems(existingItems.filter((item) => item._id !== _id));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete file", "error");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      modalTitle={albumItems ? "Edit Album" : "Edit Item"}
    >
      <Formik
        enableReinitialize
        initialValues={{
          name: existingItems[0]?.albumTitle || existingItems[0]?.name || "",
          categoryTitle:
            existingItems[0]?.categoryTitle ||
            categories.find((c) => c.title?.toLowerCase() === "others")
              ?.title ||
            "Others",
          tags: existingItems[0]?.tags || [],
        }}
        validationSchema={GallerySchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            if (albumItems?.length) {
              const originalAlbumTitle = albumItems[0].albumTitle;

              const formData = new FormData();
              formData.append("name", values.name);
              formData.append("categoryTitle", values.categoryTitle);
              values.tags.forEach((tag) => formData.append("tags[]", tag));
              selectedFiles.forEach((file) => formData.append("files", file));

              await updateAlbumApi(originalAlbumTitle, formData);
            } else if (item?._id) {
              // Single item update
              const formData = new FormData();
              formData.append("name", values.name);
              formData.append("categoryTitle", values.categoryTitle);
              values.tags.forEach((tag) => formData.append("tags[]", tag));

              if (selectedFiles[0]) formData.append("files", selectedFiles[0]);

              await updateGalleryContentApi(item._id, formData);
            }

            Swal.fire("Success!", "Updated successfully.", "success");
            onUpdated();
            onClose();
          } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Failed to update.", "error");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-4 p-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium">
                {albumItems ? "Album Name *" : "Name *"}
              </label>
              <Field
                name="name"
                type="text"
                className="w-full border p-2 rounded"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
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

            {/* Existing files */}
            {existingItems.length > 0 && (
              <div className="flex gap-4 mt-2 flex-wrap">
                {existingItems.map((file) => (
                  <div key={file._id} className="w-32 h-32 relative">
                    {isVideoFile(file) ? (
                      <video
                        src={`${process.env.REACT_APP_API_URL}/uploads/${file.file}`}
                        className="w-full h-full object-cover rounded"
                        muted
                        playsInline
                        controls
                      />
                    ) : (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${file.file}`}
                        className="w-full h-full object-cover rounded"
                        alt="Preview"
                      />
                    )}
                    <button
                      type="button"
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                      onClick={() => removeExistingFile(file._id)}
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New uploads */}
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
                      onClick={() => removeNewFile(idx, setFieldValue)}
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload input */}
            <div>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => handleFileChange(e, setFieldValue)}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
