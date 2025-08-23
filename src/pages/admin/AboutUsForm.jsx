import { Field, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { addAboutUsApi, getAboutUsApi } from "../../apis/api";
import Title from "../../components/admin-components/Title";
import { Button } from "../../components/Button";
import { ErrorHandler } from "../../components/error/errorHandler";
import ContentEditor from "../../components/content_editor/ContentEditor";
import { Trash } from "lucide-react";

const AboutUsForm = () => {
  const [responseImages, setResponseImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [updated, setUpdated] = useState(false);

  const aboutUsSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string()
      .transform((v) => (typeof v === "string" ? v.trim() : v))
      .required("Description is required"),
  });

  useEffect(() => {
    getAboutUsApi()
      .then((res) => {
        if (res.data.success) {
          const result = res.data.result || {};
          setResponseImages(result?.image || []);
          setInitialValues({
            title: result?.title || "",
            description: result?.description || "",
          });
          setNewImages([]);
          setPreviewImages([]);
        }
      })
      .catch((err) => {
        ErrorHandler(err);
      });
  }, [updated]);

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
  });

  const totalImageCount = useMemo(
    () => responseImages.length + newImages.length,
    [responseImages, newImages]
  );

  const canUploadMoreImages = totalImageCount < 3;

  const handleRemoveExistingImage = (index) => {
    setResponseImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddNewImages = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const remaining = 3 - (responseImages.length + newImages.length);
    if (remaining <= 0) {
      Swal.fire("Limit reached", "You can upload up to 3 images in total.", "info");
      return;
    }

    if (files.length > remaining) {
      Swal.fire(
        "Too many images",
        `You can only add ${remaining} more image(s).`,
        "warning"
      );
    }

    const accepted = files.slice(0, remaining);
    setNewImages((prev) => [...prev, ...accepted]);
    const newPreviews = accepted.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!values.description || !values.description.trim()) {
        Swal.fire("Error", "Description is required.", "error");
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      
      formData.append("existingImages", JSON.stringify(responseImages));

      newImages.forEach((file) => formData.append("images", file));

      const res = await addAboutUsApi(formData);
      if (res.data.success) {
        Swal.fire("Success!", res.data.message || "Content saved.", "success");
        setUpdated((prev) => !prev); // refresh data
      }
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-4">
      <div className="flex flex-col gap-2">
        <Title title="Change About Us Settings" />
        <p>By changing these settings, it will affect everywhere.</p>
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={aboutUsSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Form className="flex flex-col gap-4 py-8">
            <div className="grid gap-4">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="block font-medium">
                  About Title
                </label>
                <Field
                  type="text"
                  name="title"
                  id="title"
                  placeholder="About Title"
                  className="appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {props.errors.title && props.touched.title && (
                  <p className="text-red-500 text-sm">{props.errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="block font-medium">Description</label>
                <ContentEditor
                  model={props.values.description}
                  handleModelChange={(val) => props.setFieldValue("description", val)}
                />
                {props.errors.description && props.touched.description && (
                  <p className="text-red-500 text-sm">{props.errors.description}</p>
                )}
              </div>

              {/* Existing Images */}
              {responseImages.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p>Existing Images</p>
                  <div className="flex gap-4 flex-wrap">
                    {responseImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`${process.env.REACT_APP_API_URL}/uploads/${image}`}
                          alt={`Current ${index + 1}`}
                          className="h-32 w-56 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute top-1 right-1 icon-primary bg-red-600 hover:bg-red-700"
                          title="Remove image"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              <div className="flex flex-col gap-2">
                <label htmlFor="images" className="block font-medium">
                  Upload New Images (up to 3 total)
                </label>
                <input
                  type="file"
                  name="images"
                  id="images"
                  multiple
                  accept="image/*"
                  className="appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => handleAddNewImages(e.target.files)}
                  disabled={!canUploadMoreImages}
                />
                <p className="text-sm text-gray-600">
                  {3 - totalImageCount} slot(s) remaining.
                </p>
              </div>

              {/* Preview of newly added images */}
              {previewImages.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p>Preview Images</p>
                  <div className="flex gap-4 flex-wrap">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-32 w-56 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-1 right-1 icon-primary bg-red-600 hover:bg-red-700"
                          title="Remove image"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button className="w-max btn-primary" type="submit" disabled={props.isSubmitting}>
                {props.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default AboutUsForm;
