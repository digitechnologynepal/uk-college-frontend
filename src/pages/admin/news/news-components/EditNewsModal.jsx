import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ContentEditor from "../../../../components/content_editor/ContentEditor";
import { updateNewsApi, getCategoriesApi } from "../../../../apis/api";
import { X } from "lucide-react";

export const EditNewsModal = ({ open, onClose, setUpdated, selectedNews }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!open) return;

    const fetchCategories = async () => {
      try {
        const res = await getCategoriesApi("newsEvents");
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
        console.error("Error fetching news categories:", err);
      }
    };

    fetchCategories();
  }, [open]);

  if (!open) return null;

  const NewsSchema = Yup.object().shape({
    title: Yup.string().required("News Title is required"),
    description: Yup.string()
      .required("News Description is required")
      .test(
        "not-empty-html",
        "News Description is required",
        (value) => value && value.replace(/<(.|\n)*?>/g, "").trim().length > 0
      ),
    categoryTitle: Yup.string().required("Category is required"),
    tags: Yup.array()
      .of(Yup.string().required())
      .min(2, "At least 2 tags are required"),
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg lg:w-[60%] md:w-[80%] w-[95%] h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Edit News</h2>

        <Formik
          enableReinitialize
          initialValues={{
            title: selectedNews?.title || "",
            description: selectedNews?.description || "",
            categoryTitle:
              selectedNews?.categoryTitle ||
              categories.find((c) => c.title?.toLowerCase() === "others")
                ?.title ||
              "Others",
            newsImage: null,
            tags: selectedNews?.tags || [],
          }}
          validationSchema={NewsSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const selectedCategory =
                values.categoryTitle ||
                categories.find((c) => c.title?.toLowerCase() === "others")
                  ?.title ||
                "Others";

              const formData = new FormData();
              formData.append("title", values.title);
              formData.append("description", values.description);
              formData.append("categoryTitle", selectedCategory);
              if (values.newsImage) {
                formData.append("newsImage", values.newsImage);
              }
              values.tags.forEach((tag) => formData.append("tags[]", tag));

              const response = await updateNewsApi(formData, selectedNews._id);
              if (response.data.success) {
                Swal.fire("Success!", "News updated successfully.", "success");
                setUpdated((prev) => !prev);
                onClose();
              }
            } catch (error) {
              Swal.fire("Error!", "Failed to update news.", "error");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form className="space-y-4">
              {/* Category + Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Category</label>
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
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    News Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("newsImage", file);
                      setPreviewImage(file ? URL.createObjectURL(file) : null);
                    }}
                    className="w-full border rounded p-2"
                  />
                  {previewImage ? (
                    <>
                      <p className="mt-2">Preview:</p>
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mt-2 w-20"
                      />
                    </>
                  ) : (
                    selectedNews?.image && (
                      <>
                        <p className="mt-2">Current Image:</p>
                        <img
                          src={`${process.env.REACT_APP_API_URL}/uploads/${selectedNews.image}`}
                          alt="Current"
                          className="mt-2 w-20"
                        />
                      </>
                    )
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium">News Title</label>
                <Field
                  name="title"
                  type="text"
                  className="w-full border rounded p-2"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium">
                  News Description
                </label>
                <Field name="description">
                  {({ field, form }) => (
                    <ContentEditor
                      model={field.value}
                      handleModelChange={(val) =>
                        form.setFieldValue("description", val)
                      }
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

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
                        onClick={() => {
                          const newTags = values.tags.filter(
                            (_, i) => i !== idx
                          );
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

              {/* Actions */}
              <div className="flex justify-start space-x-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? "Updating..." : "Update News"}
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
      </div>
    </div>
  );
};
