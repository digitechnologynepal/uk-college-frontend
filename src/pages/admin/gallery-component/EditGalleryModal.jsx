import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  updateAlbumApi,
  getCategoriesApi,
  deleteGalleryContentApi,
} from "../../../apis/api";
import { Modal } from "../../../components/Modal";
import { Trash, X } from "lucide-react";

const isVideoFile = (file) =>
  file?.type?.startsWith("video/") || file?.fileType === "video";

export const EditGalleryModal = ({
  open,
  onClose,
  onUpdated,
  albumItems = [],
}) => {
  const [categories, setCategories] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]); // files already in the album
  const [selectedFiles, setSelectedFiles] = useState([]); // newly uploaded files
  const [previews, setPreviews] = useState([]);

  // Fetch categories + set album files
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

    setExistingFiles(albumItems);
    setSelectedFiles([]);
    setPreviews([]);
  }, [open, albumItems]);

  // Cleanup previews
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  if (!open) return null;

  const GallerySchema = Yup.object().shape({
    name: Yup.string().required("Album name is required"),
    categoryTitle: Yup.string().required("Category is required"),
    tags: Yup.array()
      .of(Yup.string().required())
      .min(2, "At least 2 tags are required"),
  });

  // Remove an existing file from album
  const removeExistingFile = async (_id) => {
    const confirmed = await Swal.fire({
      title: "Delete this file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });
    if (!confirmed.isConfirmed) return;

    try {
      await deleteGalleryContentApi(_id);
      setExistingFiles(existingFiles.filter((f) => f._id !== _id));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete file", "error");
    }
  };

  return (
    <Modal open={open} onClose={onClose} modalTitle="Edit Album">
      <Formik
        enableReinitialize
        initialValues={{
          name: albumItems[0]?.albumTitle || "",
          categoryTitle:
            albumItems[0]?.categoryTitle ||
            categories.find((c) => c.title?.toLowerCase() === "others")
              ?.title ||
            "Others",
          tags: albumItems[0]?.tags || [],
        }}
        validationSchema={GallerySchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const albumTitle = albumItems[0]?.albumTitle;
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("categoryTitle", values.categoryTitle);
            values.tags.forEach((tag) => formData.append("tags[]", tag));
            selectedFiles.forEach((file) => {
              const uniqueName = `${Date.now()}-${file.name}`;
              const uniqueFile = new File([file], uniqueName, {
                type: file.type,
              });
              formData.append("files", uniqueFile);
            });

            await updateAlbumApi(albumTitle, formData);

            Swal.fire("Success!", "Album updated successfully.", "success");
            onUpdated();
            onClose();
          } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Failed to update album.", "error");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          const handleFileChange = (e) => {
            const files = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...files]);
            setFieldValue("files", [...selectedFiles, ...files]);
            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
          };

          const removeNewFile = (idx) => {
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

              {/* Existing Files */}
              {existingFiles.length > 0 && (
                <div className="flex gap-4 mt-2 flex-wrap">
                  {existingFiles.map((file) => (
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

              {/* New Uploads */}
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
                        onClick={() => removeNewFile(idx)}
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Input */}
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Album"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};
