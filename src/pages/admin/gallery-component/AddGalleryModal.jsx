import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createGalleryContentApi, getCategoriesApi } from "../../../apis/api";
import { Modal } from "../../../components/Modal";
import { X } from "lucide-react";

const isVideoFile = (file) => file?.type?.startsWith("video/");

export const AddGalleryModal = ({ open, onClose, onUploaded }) => {
  const [categories, setCategories] = useState([]);
  const [previews, setPreviews] = useState([]);

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

  useEffect(() => {
    return () => {
      // cleanup previews
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPreviews([]);
    };
  }, [previews]);

  if (!open) return null;

  const GallerySchema = Yup.object().shape({
    items: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Content name is required"),
          file: Yup.mixed().required("File is required"),
          categoryTitle: Yup.string(),
          date: Yup.string().nullable(),
          tags: Yup.array()
            .of(Yup.string().required())
            .min(2, "At least 2 tags are required"),
        })
      )
      .min(1, "Add at least one item"),
  });

  return (
    <Modal open={open} onClose={onClose} modalTitle="Add Gallery Content">
      <Formik
        enableReinitialize
        initialValues={{
          items: [
            {
              name: "",
              file: null,
              categoryTitle:
                categories.find((c) => c.title?.toLowerCase() === "others")
                  ?.title || "Others",
              date: "",
              tags: [],
            },
          ],
        }}
        validationSchema={GallerySchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            // check all files are same type
            const firstIsVideo = isVideoFile(values.items[0].file);
            for (let i = 0; i < values.items.length; i++) {
              if (isVideoFile(values.items[i].file) !== firstIsVideo) {
                Swal.fire(
                  "Error",
                  "All files must be either images or videos",
                  "error"
                );
                setSubmitting(false);
                return;
              }
            }

            const formData = new FormData();
            values.items.forEach((item) => {
              formData.append("name", item.name);
              formData.append("file", item.file);
              formData.append("date", item.date || "");
              const selectedCategory =
                item.categoryTitle ||
                categories.find((c) => c.title?.toLowerCase() === "others")
                  ?.title ||
                "Others";
              formData.append("categoryTitle", selectedCategory);
              item.tags.forEach((tag) => formData.append("tags[]", tag));
            });

            const res = await createGalleryContentApi(formData);
            if (res?.data?.success) {
              Swal.fire("Success!", "Content added successfully.", "success");
              resetForm();
              setPreviews([]);
              onUploaded();
              onClose();
            }
          } catch (err) {
            Swal.fire("Error!", "Failed to add content.", "error");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-4 p-6">
            {values.items.map((item, index) => (
              <div key={index} className="space-y-2">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <Field
                    as="select"
                    name={`items.${index}.categoryTitle`}
                    className="w-full border rounded p-2"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.title}>
                        {cat.title}
                      </option>
                    ))}
                  </Field>
                  <p className="text-xs text-[#2d5dbc]">
                    Note: If no category is selected it will automatically be
                    assigned with "Others"
                  </p>
                  <ErrorMessage
                    name={`items.${index}.categoryTitle`}
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium">
                    Content Name
                  </label>
                  <Field
                    name={`items.${index}.name`}
                    type="text"
                    className="w-full border rounded p-2"
                  />
                  <ErrorMessage
                    name={`items.${index}.name`}
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium">
                    Date (optional)
                  </label>
                  <Field
                    name={`items.${index}.date`}
                    type="date"
                    className="w-full border rounded p-2"
                  />
                  <ErrorMessage
                    name={`items.${index}.date`}
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {values.items[index].tags.map((tag, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-100 px-2 py-1 rounded flex items-center space-x-1"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newTags = values.items[index].tags.filter(
                              (_, i) => i !== idx
                            );
                            setFieldValue(`items.${index}.tags`, newTags);
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
                        if (
                          newTag &&
                          !values.items[index].tags.includes(newTag)
                        ) {
                          setFieldValue(`items.${index}.tags`, [
                            ...values.items[index].tags,
                            newTag,
                          ]);
                        }
                        e.target.value = "";
                      }
                    }}
                  />
                  <ErrorMessage
                    name={`items.${index}.tags`}
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* File */}
                <div>
                  <label className="block text-sm font-medium">File</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      setFieldValue(`items.${index}.file`, file);

                      // update preview
                      setPreviews((prev) => {
                        const newPrev = [...prev];
                        newPrev[index] = file
                          ? URL.createObjectURL(file)
                          : null;
                        return newPrev;
                      });
                    }}
                    className="w-full border rounded p-2"
                  />
                  <ErrorMessage
                    name={`items.${index}.file`}
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                {/* Preview */}
                {(previews[index] || item.file) && (
                  <div className="flex gap-4 mt-2">
                    {item.file && !previews[index] && (
                      <div className="text-sm text-gray-700">
                        <p className="mb-1">Current:</p>
                        {isVideoFile(item.file) ? (
                          <video
                            src={URL.createObjectURL(item.file)}
                            className="w-32 h-32 object-cover rounded"
                            muted
                            playsInline
                            controls
                          />
                        ) : (
                          <img
                            src={URL.createObjectURL(item.file)}
                            className="w-32 h-32 object-cover rounded"
                            alt="Current"
                          />
                        )}
                      </div>
                    )}

                    {previews[index] && (
                      <div className="text-sm text-gray-700">
                        <p className="mb-1">New Preview:</p>
                        {isVideoFile(item.file) ? (
                          <video
                            src={previews[index]}
                            className="w-32 h-32 object-cover rounded"
                            muted
                            playsInline
                            controls
                          />
                        ) : (
                          <img
                            src={previews[index]}
                            className="w-32 h-32 object-cover rounded"
                            alt="Preview"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Submit */}
            <div className="flex space-x-2 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? "Uploading..." : "Add Content"}
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
