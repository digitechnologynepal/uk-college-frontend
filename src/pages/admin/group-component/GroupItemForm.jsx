import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createGroupItemApi, updateGroupItemApi } from "../../../apis/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const GroupItemForm = ({ item, onClose, setMainData, mainId }) => {
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (item && item.image) {
      const imageUrl = item.image.startsWith("http")
        ? item.image
        : `${process.env.REACT_APP_API_URL}${item.image}`;
      setPreviewImage(imageUrl);
    } else {
      setPreviewImage(null);
    }
  }, [item]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    image: Yup.mixed()
      .test("required", "Image is required", (value) => {
        // On create, image is required
        if (!item?._id) {
          return value instanceof File;
        }
        // On update, image is optional
        return true;
      })
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }),
  });

  return (
    <Formik
      initialValues={{
        name: item?.name || "",
        image: null,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        if (!mainId) {
          toast.error("Group ID not found");
          setSubmitting(false);
          return;
        }
        try {
          const formData = new FormData();
          formData.append("name", values.name);
          if (values.image) {
            formData.append("image", values.image);
          }

          let res;
          if (item?._id) {
            res = await updateGroupItemApi(mainId, item._id, formData);
          } else {
            res = await createGroupItemApi(mainId, formData);
          }

          if (res.data.success) {
            setMainData(res.data.result);
            toast.success("Item saved successfully");
            onClose();
          } else {
            toast.error("Failed to save item");
          }
        } catch (err) {
          toast.error("Something went wrong");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ setFieldValue, isSubmitting, values }) => (
        <Form className="flex flex-col gap-4 p-4">
          <Field
            name="name"
            type="text"
            placeholder="Item name"
            className="border p-2 rounded"
          />
          <ErrorMessage
            name="name"
            component="div"
            className="text-red-600 text-sm"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.currentTarget.files[0];
              if (file) {
                setFieldValue("image", file);
                setPreviewImage(URL.createObjectURL(file));
              } else {
                setFieldValue("image", null);
                setPreviewImage(item?.image || "");
              }
            }}
            className="border p-2 rounded"
          />
          <ErrorMessage
            name="image"
            component="div"
            className="text-red-600 text-sm"
          />

          {previewImage && (
            <img
              src={previewImage}
              className="h-32 w-32 object-cover mt-2"
              alt="Preview"
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
