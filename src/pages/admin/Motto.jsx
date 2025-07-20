import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { addMottoApi, getMottoApi } from "../../apis/api";
import Title from "../../components/admin-components/Title";
import { Button } from "../../components/Button";
import { ErrorHandler } from "../../components/error/errorHandler";

export const Motto = () => {
  const [updated, setUpdated] = useState(false);
  const [previewImages, setPreviewImages] = useState({
    mission: "",
    vision: "",
  });

  const mottoSchema = Yup.object().shape({
    motoTitle: Yup.string().required("Motto title is required"),
    missionText: Yup.string().required("Mission text is required"),
    visionText: Yup.string().required("Vision text is required"),

    // missionIcon: Yup.mixed().test(
    //   "missionIconRequired",
    //   "Mission icon is required",
    //   function (value) {
    //     const { previewImages } = this.options.context;
    //     return value || previewImages?.mission;
    //   }
    // ),

    // visionIcon: Yup.mixed().test(
    //   "visionIconRequired",
    //   "Vision icon is required",
    //   function (value) {
    //     const { previewImages } = this.options.context;
    //     return value || previewImages?.vision;
    //   }
    // ),
  });

  const [initialValues, setInitialValues] = useState({
    motoTitle: "",
    missionText: "",
    visionText: "",
    missionIcon: null,
    visionIcon: null,
  });

  useEffect(() => {
    getMottoApi()
      .then((res) => {
        if (res.data.success) {
          const { motoTitle, mission, vision } = res.data.result || {};
          setInitialValues({
            motoTitle: motoTitle || "",
            missionText: mission?.text || "",
            visionText: vision?.text || "",
            missionIcon: null,
            visionIcon: null,
          });
          setPreviewImages({
            mission: mission?.icon || "",
            vision: vision?.icon || "",
          });
        }
      })
      .catch(ErrorHandler);
  }, [updated]);
  const handleSubmit = (values) => {
    const errors = {};

    if (!values.missionIcon && !previewImages.mission) {
      errors.missionIcon = "Mission icon is required";
    }

    if (!values.visionIcon && !previewImages.vision) {
      errors.visionIcon = "Vision icon is required";
    }

    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields.");
      return; // Prevent submission
    }

    const formData = new FormData();
    formData.append("motoTitle", values.motoTitle);
    formData.append("missionText", values.missionText);
    formData.append("visionText", values.visionText);
    if (values.missionIcon) formData.append("missionIcon", values.missionIcon);
    if (values.visionIcon) formData.append("visionIcon", values.visionIcon);

    addMottoApi(formData)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message || "Motto content updated.");
          setUpdated((prev) => !prev);
        }
      })
      .catch(ErrorHandler);
  };

  const handleImageUpload = (e, fieldName, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue(fieldName, file);
      const fileURL = URL.createObjectURL(file);
      setPreviewImages((prev) => ({ ...prev, [fieldName]: fileURL }));
    }
  };

  return (
    <main className="p-4">
      <Title title="Change Motto Settings" />
      <p>By changing these settings, it will affect everywhere.</p>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={mottoSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        context={{ previewImages }}
      >
        {(props) => (
          <Form className="flex flex-col gap-6 py-8">
            {/* Motto Title */}
            <div>
              <label htmlFor="motoTitle" className="block font-medium">
                Motto Title
              </label>
              <Field
                type="text"
                name="motoTitle"
                id="motoTitle"
                placeholder="Enter motto title"
                className="border rounded w-full p-3 mt-1"
              />
              {props.errors.motoTitle && (
                <p className="text-red-500 text-sm">{props.errors.motoTitle}</p>
              )}
            </div>

            {/* Mission */}
            <div className="bg-neutral-100 p-4 rounded">
              <label className="block font-medium mb-2">Mission</label>
              <Field
                as="textarea"
                name="missionText"
                placeholder="Write your mission..."
                rows="4"
                className="w-full border rounded p-3"
              />
              {props.errors.missionText && (
                <p className="text-red-500 text-sm">
                  {props.errors.missionText}
                </p>
              )}
              <input
                type="file"
                name="missionIcon"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(e, "missionIcon", props.setFieldValue)
                }
                className="mt-3 w-full p-2 border rounded"
              />
              {previewImages.mission && (
                <img
                  src={
                    previewImages.mission.startsWith("blob:")
                      ? previewImages.mission
                      : `${process.env.REACT_APP_API_URL}/uploads/${previewImages.mission}`
                  }
                  alt="Mission Icon Preview"
                  className="h-24 w-24 object-cover mt-2"
                />
              )}
              {props.errors.missionIcon && (
                <p className="text-red-500 text-sm">
                  {props.errors.missionIcon}
                </p>
              )}
            </div>

            {/* Vision */}
            <div className="bg-neutral-100 p-4 rounded">
              <label className="block font-medium mb-2">Vision</label>
              <Field
                as="textarea"
                name="visionText"
                placeholder="Write your vision..."
                rows="4"
                className="w-full border rounded p-3"
              />
              {props.errors.visionText && (
                <p className="text-red-500 text-sm">
                  {props.errors.visionText}
                </p>
              )}
              <input
                type="file"
                name="visionIcon"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(e, "visionIcon", props.setFieldValue)
                }
                className="mt-3 w-full p-2 border rounded"
              />
              {previewImages.vision && (
                <img
                  src={
                    previewImages.vision.startsWith("blob:")
                      ? previewImages.vision
                      : `${process.env.REACT_APP_API_URL}/uploads/${previewImages.vision}`
                  }
                  alt="Vision Icon Preview"
                  className="h-24 w-24 object-cover mt-2"
                />
              )}
              {props.errors.visionIcon && (
                <p className="text-red-500 text-sm">
                  {props.errors.visionIcon}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="btn-primary w-max">
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default Motto;
