import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createGroupItemApi, updateGroupItemApi } from "../../../apis/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

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
    image: Yup.mixed().when("existingImage", {
      is: (val) => !val, // if no existing image then required
      then: (schema) => schema.required("Image is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    website: Yup.string()
      .trim()
      .url("Must be a valid URL starting with http:// or https://")
      .matches(
        /^$|^https?:\/\//,
        "Website must start with http:// or https://"
      ),
  });

  return (
    <Formik
      initialValues={{
        website: item?.website || "",
        existingImage: !!item?.image,
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
          formData.append("website", values.website?.trim() || "");
          if (values.image instanceof File) {
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
            Swal.fire("Success", "Group member has been added.", "success");
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
            name="website"
            type="text"
            placeholder="Website url"
            className="border p-2 rounded"
          />
          <ErrorMessage
            name="website"
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
                setPreviewImage(
                  item?.image
                    ? item.image.startsWith("http")
                      ? item.image
                      : `${process.env.REACT_APP_API_URL}${item.image}`
                    : null
                );
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
              className="h-32 w-full object-contain mt-2"
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
