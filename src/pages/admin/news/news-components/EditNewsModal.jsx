import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ContentEditor from "../../../../components/content_editor/ContentEditor";
import { updateNewsApi } from "../../../../apis/api";

export const EditNewsModal = ({ open, onClose, setUpdated, selectedNews }) => {
  const [previewImage, setPreviewImage] = useState(null);

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
    // image is optional here, no required validation
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
            newsImage: null, // for new upload
          }}
          validationSchema={NewsSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            if (values.newsImage) {
              formData.append("newsImage", values.newsImage);
            }

            try {
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
          {({ setFieldValue, values, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">News Image</label>
                <input
                  name="newsImage"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    setFieldValue("newsImage", file);
                    if (file) setPreviewImage(URL.createObjectURL(file));
                    else setPreviewImage(null);
                  }}
                  className="w-full border rounded p-2"
                />
                <ErrorMessage
                  name="newsImage"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
                {previewImage && (
                  <>
                    <p className="mt-2">Preview:</p>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="mt-2 w-20"
                    />
                  </>
                )}
                {!previewImage && selectedNews?.image && (
                  <>
                    <p className="mt-2">Current Image:</p>
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${selectedNews.image}`}
                      alt="Current"
                      className="mt-2 w-20"
                    />
                  </>
                )}
              </div>
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
