import { Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Modal } from "../../../components/Modal";
import ContentEditor from "../../../components/content_editor/ContentEditor";
import { addCourseApi } from "../../../apis/api";
import { CircleX } from "lucide-react";

export const AddCourseModal = ({ open, onClose, setUpdated }) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const courseImageInputRef = useRef(null);

  const levelOptions = ["Class 11", "Class 12"];

  const getModulesFromLevels = (levels) => {
    const map = {
      "Class 11": "Module 1",
      "Class 12": "Module 2",
    };

    const orderedModules = ["Module 1", "Module 2"];

    // Map levels to modules
    const modulesFromLevels = levels.map((lvl) => map[lvl]).filter(Boolean);

    // Sort modules by predefined order
    modulesFromLevels.sort(
      (a, b) => orderedModules.indexOf(a) - orderedModules.indexOf(b)
    );

    return modulesFromLevels;
  };

  const [formKey, setFormKey] = useState(0);
  useEffect(() => {
    if (!open) {
      setDescription("");
      setImage(null);
      setPreviewImage(null);
      setFormKey((prev) => prev + 1);
      if (courseImageInputRef.current) {
        courseImageInputRef.current.value = null;
      }
    }
  }, [open]);

  const courseSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    level: Yup.array()
      .min(1, "At least one level must be selected")
      .of(Yup.string().oneOf(levelOptions)),
    durationWeeks: Yup.lazy((obj) =>
      Yup.object(
        Object.keys(obj || {}).reduce((acc, key) => {
          acc[key] = Yup.number()
            .typeError("Must be a number")
            .required("Weeks required")
            .min(1, "At least 1 week");
          return acc;
        }, {})
      )
    ),

    durationHours: Yup.lazy((obj) =>
      Yup.object(
        Object.keys(obj || {}).reduce((acc, key) => {
          acc[key] = Yup.string()
            .required("Hours required")
            .test(
              "valid-format",
              "Must be a number or range like 3 or 3-4",
              (value) => {
                if (!value) return false;
                const trimmed = value.trim();
                const single = /^\d+$/;
                const range = /^\d+\s*-\s*\d+$/;
                return single.test(trimmed) || range.test(trimmed);
              }
            )
            .test("min-one", "At least 1 hour", (value) => {
              if (!value) return false;
              const parts = value.split("-").map((v) => Number(v.trim()));
              return parts.every((num) => num >= 1);
            });
          return acc;
        }, {})
      )
    ),
  });

  const handleSubmit = async (values, { resetForm }) => {
    if (!description.trim()) {
      return toast.error("Description is required");
    }
    if (!image) {
      return toast.error("Course image is required");
    }

    const modules = getModulesFromLevels(values.level);

    // Build full module objects including description
    const moduleData = modules.map((mod) => ({
      name: mod,
      durationWeeks: Number(values.durationWeeks[mod]),
      durationHours: values.durationHours[mod].trim(),
      description: values.moduleDescriptions?.[mod]?.trim() || "",
    }));

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", description);
    values.level.forEach((lvl) => formData.append("level", lvl));
    formData.append("modules", JSON.stringify(moduleData));
    formData.append("image", image);

    try {
      const res = await addCourseApi(formData);
      if (res?.data?.success) {
        toast.success("Course added successfully!");
        setUpdated((prev) => !prev);
        resetForm();
        setDescription("");
        setImage(null);
        setPreviewImage(null);
        if (courseImageInputRef.current) {
          courseImageInputRef.current.value = null;
        }
        onClose();
      }
    } catch (err) {
      Swal.fire("Error", `Failed to create course: ${err.message}`, "error");
    }
  };

  return (
    <Modal open={open} onClose={onClose} modalTitle="Add Course">
      <section className="w-full max-w-5xl p-6 mx-auto">
        <Formik
          key={formKey}
          initialValues={{
            title: "",
            durationWeeks: {},
            durationHours: {},
            moduleDescriptions: {},
            level: [],
          }}
          validationSchema={courseSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, errors, touched, setFieldValue }) => {
            const modules = getModulesFromLevels(values.level);

            return (
              <Form className="flex flex-col gap-4">
                {/* Title */}
                <div>
                  <label className="font-medium text-lg">Course Title</label>
                  <Field
                    type="text"
                    name="title"
                    className="border rounded w-full p-3"
                  />
                  {errors.title && touched.title && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.title}
                    </div>
                  )}
                </div>

                {/* Level Multi-Select */}
                <div className="col-span-2">
                  <label className="font-medium text-lg mb-2 block">
                    Level
                  </label>
                  <div className="flex flex-col space-y-2">
                    {levelOptions.map((lvl) => (
                      <label key={lvl} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="level"
                          value={lvl}
                          checked={values.level.includes(lvl)}
                          onChange={() => {
                            const levelOrder = ["Class 11", "Class 12"];
                            let newLevels;
                            if (values.level.includes(lvl)) {
                              newLevels = values.level.filter((l) => l !== lvl);
                            } else {
                              newLevels = [...values.level, lvl];
                            }
                            newLevels.sort(
                              (a, b) =>
                                levelOrder.indexOf(a) - levelOrder.indexOf(b)
                            );
                            setFieldValue("level", newLevels);
                          }}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2">{lvl}</span>
                      </label>
                    ))}
                  </div>
                  {errors.level && touched.level && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.level}
                    </div>
                  )}
                </div>

                {/* Modules Preview */}
                <div className="col-span-2">
                  <label className="font-medium text-lg">
                    Modules (Auto-filled)
                  </label>
                  {modules.length > 0 ? (
                    <ul className="list-disc pl-6 mt-1">
                      {modules.map((mod, i) => (
                        <li key={i}>{mod}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic text-gray-600 mt-1">
                      Select level(s) to see modules
                    </p>
                  )}
                </div>

                {/* Additional Info Per Module */}
                {modules.map((mod) => (
                  <div
                    key={mod}
                    className="col-span-2 border rounded p-4 bg-gray-50"
                  >
                    <h4 className="font-semibold text-md mb-2">
                      {mod} Details
                    </h4>

                    {/* Duration Weeks */}
                    <div className="mb-2">
                      <label className="block font-medium text-sm">Weeks</label>
                      <Field
                        type="number"
                        name={`durationWeeks.${mod}`}
                        className="border rounded w-full p-2"
                        placeholder="e.g., 6"
                      />
                      {errors.durationWeeks?.[mod] &&
                        touched.durationWeeks?.[mod] && (
                          <div className="text-red-600 text-sm mt-1">
                            {errors.durationWeeks[mod]}
                          </div>
                        )}
                    </div>

                    {/* Duration Hours */}
                    <div className="mb-2">
                      <label className="block font-medium text-sm">Hours</label>
                      <Field
                        type="text"
                        name={`durationHours.${mod}`}
                        className="border rounded w-full p-2"
                        placeholder="e.g., 3, 3-4, 3 - 4"
                      />
                      {errors.durationHours?.[mod] &&
                        touched.durationHours?.[mod] && (
                          <div className="text-red-600 text-sm mt-1">
                            {errors.durationHours[mod]}
                          </div>
                        )}
                    </div>

                    {/* Module Description */}
                    <div>
                      <label className="block font-medium text-sm">
                        Description
                      </label>
                      <Field
                        as="textarea"
                        name={`moduleDescriptions.${mod}`}
                        className="border rounded w-full p-2"
                        placeholder="Optional module description..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                {/* Description */}
                <div className="col-span-2">
                  <label className="font-medium text-lg">Description</label>
                  <ContentEditor
                    model={description}
                    handleModelChange={setDescription}
                  />
                </div>

                {/* Image Upload */}
                <div className="col-span-2">
                  <label className="font-medium text-lg">Course Image</label>
                  {previewImage && (
                    <div className="flex items-center gap-4 mb-2">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded shadow"
                      />
                      <CircleX
                        className="text-red-600 cursor-pointer"
                        size={28}
                        onClick={() => {
                          setImage(null);
                          setPreviewImage(null);
                          if (courseImageInputRef.current) {
                            courseImageInputRef.current.value = null;
                          }
                        }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={courseImageInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setImage(file);
                      if (file) {
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                    className="border rounded w-full p-3"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md w-full col-span-2"
                >
                  {isSubmitting ? "Submitting..." : "Add Course"}
                </button>
              </Form>
            );
          }}
        </Formik>
      </section>
    </Modal>
  );
};
