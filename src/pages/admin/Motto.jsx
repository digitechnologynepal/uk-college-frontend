import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { addMottoApi, getMottoApi } from "../../apis/api";
import Title from "../../components/admin-components/Title";
import { Button } from "../../components/Button";
import { ErrorHandler } from "../../components/error/errorHandler";
import Swal from "sweetalert2";

export const Motto = () => {
  const [updated, setUpdated] = useState(false);

  const mottoSchema = Yup.object().shape({
    motoTitle: Yup.string().required("Motto title is required"),
    missionText: Yup.string().required("Mission text is required"),
    visionText: Yup.string().required("Vision text is required"),
  });

  const [initialValues, setInitialValues] = useState({
    motoTitle: "",
    missionText: "",
    visionText: "",
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
          });
        }
      })
      .catch(ErrorHandler);
  }, [updated]);

  const handleSubmit = (values) => {
    if (!values.motoTitle || !values.missionText || !values.visionText) {
      toast.error("Please fill in all required fields.");
      return;
    }

    addMottoApi(values)
      .then((res) => {
        if (res.data.success) {
          Swal.fire(res.data.message || "Motto content updated successfully.");
          setUpdated((prev) => !prev); // Refresh data
        }
      })
      .catch(ErrorHandler);
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
            <div>
              <label className="block font-medium mb-2">Mission</label>
              <Field
                as="textarea"
                name="missionText"
                placeholder="Write your mission..."
                rows="4"
                className="w-full border rounded p-3"
              />
              {props.errors.missionText && (
                <p className="text-red-500 text-sm">{props.errors.missionText}</p>
              )}
            </div>

            {/* Vision */}
            <div>
              <label className="block font-medium mb-2">Vision</label>
              <Field
                as="textarea"
                name="visionText"
                placeholder="Write your vision..."
                rows="4"
                className="w-full border rounded p-3"
              />
              {props.errors.visionText && (
                <p className="text-red-500 text-sm">{props.errors.visionText}</p>
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
