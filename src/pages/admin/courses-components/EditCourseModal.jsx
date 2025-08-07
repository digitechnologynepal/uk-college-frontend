import { Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { updateCourseApi } from "../../../apis/api";
import { Modal } from "../../../components/Modal";
import ContentEditor from "../../../components/content_editor/ContentEditor";
import { CircleX } from "lucide-react";

export const EditCourseModal = ({
  open,
  onClose,
  setUpdated,
  selectedCourse,
}) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const courseImageInputRef = useRef(null); // Added ref to clear file input

  const levelOptions = ["Class 11", "Class 12"];
  const getModulesFromLevels = (levels) => {
    const map = {
      "Class 11": "Module 1",
      "Class 12": "Module 2",
    };

    const orderedModules = ["Module 1", "Module 2"];

    const modulesFromLevels = levels.map((lvl) => map[lvl]).filter(Boolean);
    modulesFromLevels.sort(
      (a, b) => orderedModules.indexOf(a) - orderedModules.indexOf(b)
    );

    return modulesFromLevels;
  };

  useEffect(() => {
    if (selectedCourse) {
      setDescription(selectedCourse.description || "");
      setPreviewImage(
        selectedCourse.image
          ? `${process.env.REACT_APP_API_URL}/uploads/${selectedCourse.image}`
          : null
      );
      setImage(null);
      if (courseImageInputRef.current) {
        courseImageInputRef.current.value = null;
      }
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (!open) {
      setDescription("");
      setImage(null);
      setPreviewImage(null);
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

  const handleUpdateCourse = async (values, { resetForm }) => {
    if (!description.trim()) {
      return toast.error("Description is required");
    }

    const modules = getModulesFromLevels(values.level);
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", description);
    values.level.forEach((lvl) => formData.append("level", lvl));

    const moduleData = modules.map((mod) => ({
      name: mod,
      durationWeeks: Number(values.durationWeeks[mod]),
      durationHours: values.durationHours[mod].trim(),
      description: values.durationDescriptions?.[mod] || "",
    }));

    formData.append("modules", JSON.stringify(moduleData));

    if (image instanceof File) {
      formData.append("image", image);
    }

    try {
      const res = await updateCourseApi(selectedCourse._id, formData);
      if (res?.data?.success) {
        toast.success("Course updated successfully!");
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
    } catch (error) {
      Swal.fire("Error", `Failed to update course: ${error.message}`, "error");
    }
  };

  return (
    <Modal modalTitle="Edit Course" open={open} onClose={onClose}>
      <section className="w-full max-w-5xl p-6 mx-auto">
        <Formik
          enableReinitialize
          initialValues={{
            title: selectedCourse?.title || "",
            level: selectedCourse?.level || [],
            durationWeeks:
              selectedCourse?.modules?.reduce((acc, mod) => {
                acc[mod.name] = mod.durationWeeks;
                return acc;
              }, {}) || {},
            durationHours:
              selectedCourse?.modules?.reduce((acc, mod) => {
                acc[mod.name] = mod.durationHours;
                return acc;
              }, {}) || {},
            durationDescriptions:
              selectedCourse?.modules?.reduce((acc, mod) => {
                acc[mod.name] = mod.description || "";
                return acc;
              }, {}) || {},
          }}
          validationSchema={courseSchema}
          onSubmit={handleUpdateCourse}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => {
            const modules = getModulesFromLevels(values.level);

            return (
              <Form className="grid grid-cols-2 gap-6">
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
                          value={lvl}
                          checked={values.level.includes(lvl)}
                          onChange={() => {
                            const levelOrder = ["Class 11", "Class 12"];
                            if (values.level.includes(lvl)) {
                              const newLevels = values.level.filter(
                                (l) => l !== lvl
                              );
                              setFieldValue("level", newLevels);
                            } else {
                              const newLevels = [...values.level, lvl].sort(
                                (a, b) =>
                                  levelOrder.indexOf(a) - levelOrder.indexOf(b)
                              );
                              setFieldValue("level", newLevels);
                            }
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

                {/* Module Duration Inputs */}
                {modules.map((mod) => (
                  <div
                    key={mod}
                    className="col-span-2 border rounded p-4 bg-gray-50"
                  >
                    <h4 className="font-semibold text-md mb-2">
                      {mod} Duration
                    </h4>

                    {/* Weeks */}
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

                    {/* Hours */}
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
                        name={`durationDescriptions.${mod}`}
                        className="border rounded w-full p-2"
                        placeholder="Enter module description"
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
                    ref={courseImageInputRef} // Added ref here
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
                  {isSubmitting ? "Updating..." : "Update Course"}
                </button>
              </Form>
            );
          }}
        </Formik>
      </section>
    </Modal>
  );
};
