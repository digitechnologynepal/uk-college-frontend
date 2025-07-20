import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { addAboutUsApi, getAboutUsApi } from "../../apis/api";
import Title from "../../components/admin-components/Title";
import { Button } from "../../components/Button";
import { ErrorHandler } from "../../components/error/errorHandler";
import ContentEditor from "../../components/content_editor/ContentEditor";

const AboutUsForm = () => {
  const [images, setImages] = useState([]); // Store selected file objects for new images
  const [previewImages, setPreviewImages] = useState([]); // Store preview URLs for new images
  const [responseImages, setResponseImages] = useState([]); // Store existing images from the backend
  const [updated, setUpdated] = useState(false);

  // Validation schema using Yup
  const aboutUsSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    motto: Yup.string(),
    vision: Yup.string(),
    mission: Yup.string(),
  });

  // Function to handle form submission
  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    formData.append("description", description);
    // Append up to 3 images
    images.forEach((file) => {
      formData.append("images", file);
    });

    // Append the list of images to keep (existing images that are not removed)
    formData.append("existingImages", JSON.stringify(responseImages));

    addAboutUsApi(formData)
      .then((res) => {
        if (res.data.success) {
          toast.success(
            res.data.message || "About Us content updated successfully."
          );
          setUpdated((prev) => !prev); // Trigger re-fetch
        }
      })
      .catch((err) => {
        ErrorHandler(err);
      });
  };

  // Fetch existing content on component load
  useEffect(() => {
    getAboutUsApi()
      .then((res) => {
        if (res.data.success) {
          setResponseImages(res.data.result?.image || []);
          setInitialValues({
            title: res.data.result?.title || "",
            motto: res.data.result?.motto || "",
            vision: res.data.result?.vision || "",
            mission: res.data.result?.mission || "",
          });
          setDescription(res.data.result?.description || "");
        }
      })
      .catch((err) => {
        ErrorHandler(err);
      });
  }, [updated]);

  // Initial values for Formik
  const [initialValues, setInitialValues] = useState({
    title: "",
    motto: "",
    vision: "",
    mission: "",
  });
  const [description, setDescription] = useState("");

  // Function to remove an image from the existing images array
  const handleRemoveImage = (index) => {
    const updatedImages = responseImages.filter((_, i) => i !== index);
    setResponseImages(updatedImages);
  };

  // Check if the user can upload more images
  const canUploadMoreImages = responseImages.length + images.length < 3;

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
            {/* About Title */}
            <div className="grid gap-4">
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
                  model={description}
                  handleModelChange={setDescription}
                />
              </div>

              {/* Existing Images */}
              {responseImages.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p>Existing Images</p>
                  <div className="flex gap-4">
                    {responseImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`${process.env.REACT_APP_API_URL}/uploads/${image}`}
                          alt={`Current ${index + 1}`}
                          className="h-32 w-56 object-cover rounded"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              <div className="flex flex-col gap-2">
                <label htmlFor="images" className="block font-medium">
                  Upload New Images (up to 3)
                </label>
                <input
                  type="file"
                  name="images"
                  id="images"
                  multiple
                  accept="image/*"
                  className="appearance-none border rounded w-full p-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (!canUploadMoreImages) {
                      toast.error(
                        "You can only upload up to 3 images in total."
                      );
                      return;
                    }
                    if (files.length > 3 - responseImages.length) {
                      toast.error(
                        `You can only upload ${
                          3 - responseImages.length
                        } more image(s).`
                      );
                      return;
                    }
                    setImages(files);
                    setPreviewImages(
                      files.map((file) => URL.createObjectURL(file))
                    );
                  }}
                  disabled={!canUploadMoreImages} // Disable input if the limit is reached
                />
              </div>

              {/* Preview Uploaded Images */}
              {previewImages.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p>Preview Images</p>
                  <div className="flex gap-4">
                    {previewImages.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-56 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button className="w-max btn-primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default AboutUsForm;
