import React, { useState } from "react";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ContentEditor from "../../../../components/content_editor/ContentEditor";
import { createNewsApi } from "../../../../apis/api";

export const AddNewsModal = ({ open, onClose, setUpdated }) => {
  const [previewImage, setPreviewImage] = useState(null);

  if (!open) return null;

  const NewsSchema = Yup.object().shape({
    newsImage: Yup.mixed().required("News Image is required"),
    title: Yup.string().required("News Title is required"),
    description: Yup.string()
      .required("News Description is required")
      .test(
        "not-empty-html",
        "News Description is required",
        (value) => value && value.replace(/<(.|\n)*?>/g, "").trim().length > 0
      ),
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg lg:w-[60%] md:w-[80%] w-[95%]">
        <h2 className="text-xl font-bold mb-4">Add News</h2>
        <Formik
          initialValues={{
            newsImage: null,
            title: "",
            description: "",
          }}
          validationSchema={NewsSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("newsImage", values.newsImage);

            try {
              const response = await createNewsApi(formData);
              if (response.data.success) {
                Swal.fire("Success!", "News added successfully.", "success");
                setUpdated((prev) => !prev);
                resetForm();
                setPreviewImage(null);
                onClose();
              }
            } catch (error) {
              Swal.fire("Error!", "Failed to add news.", "error");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, isSubmitting, values }) => (
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
                    <img src={previewImage} alt="Preview" className="mt-2 w-20" />
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
                <label className="block text-sm font-medium">News Description</label>
                <Field name="description">
                  {({ field, form }) => (
                    <ContentEditor
                      model={field.value}
                      handleModelChange={(val) => form.setFieldValue("description", val)}
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
                  {isSubmitting ? "Adding..." : "Add News"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
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
