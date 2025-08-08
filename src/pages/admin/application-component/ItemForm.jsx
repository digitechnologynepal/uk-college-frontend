import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { manageWhyChooseUsApi, updateItemApi } from "../../../apis/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  imageUrl: Yup.mixed()
    .test("required", "Image is required", function (value) {
      // For new item, image must be provided
      if (!this.parent.existingImage && !value) return false;
      return true;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return true; // skip if no file (will fail required above if needed)
      return value && value.type && value.type.startsWith("image/");
    }),
});

const ItemForm = ({ item, onClose, setMainData }) => {
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (item) {
      setPreviewImage(
        item.imageUrl?.startsWith("http") || item.imageUrl?.startsWith("data:")
          ? item.imageUrl
          : `${process.env.REACT_APP_API_URL}${item.imageUrl}`
      );
    } else {
      setPreviewImage("");
    }
  }, [item]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: item?.title || "",
        description: item?.description || "",
        imageUrl: null,
        existingImage: !!item?.imageUrl, // to track if existing image present for validation
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        if (values.imageUrl) {
          formData.append("imageUrl", values.imageUrl);
        }

        try {
          let res;
          if (item?._id) {
            res = await updateItemApi(item._id, formData);
          } else {
            res = await manageWhyChooseUsApi(formData);
          }

          if (res.data.success) {
            setMainData(res.data.result);
            toast.success(
              item ? "Item updated successfully" : "Item added successfully"
            );
            onClose();
          }
        } catch (err) {
          toast.error("Something went wrong");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ setFieldValue, isSubmitting, values, errors, touched }) => (
        <Form className="flex flex-col gap-4 p-4">
          <Field
            name="title"
            type="text"
            placeholder="Title"
            className="border p-2 rounded"
          />
          <ErrorMessage
            name="title"
            component="div"
            className="text-red-600 text-sm"
          />

          <Field
            name="description"
            as="textarea"
            placeholder="Description"
            className="border p-2 rounded"
          />
          <ErrorMessage
            name="description"
            component="div"
            className="text-red-600 text-sm"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.currentTarget.files[0];
              if (file) {
                if (!file.type.startsWith("image/")) {
                  toast.error("Please upload a valid image file");
                  setFieldValue("imageUrl", null);
                  return;
                }
                setFieldValue("imageUrl", file);
                const reader = new FileReader();
                reader.onloadend = () => setPreviewImage(reader.result);
                reader.readAsDataURL(file);
              } else {
                setFieldValue("imageUrl", null);
                if (item) {
                  setPreviewImage(
                    item.imageUrl?.startsWith("http") ||
                      item.imageUrl?.startsWith("data:")
                      ? item.imageUrl
                      : `${process.env.REACT_APP_API_URL}${item.imageUrl}`
                  );
                } else {
                  setPreviewImage("");
                }
              }
            }}
            className="border p-2 rounded"
          />
          <ErrorMessage
            name="imageUrl"
            component="div"
            className="text-red-600 text-sm"
          />

          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="h-32 w-32 object-cover mt-2 rounded shadow"
            />
          )}

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            Save
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ItemForm;
