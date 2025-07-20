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
    // Filter out invalid or empty values
    return levels?.map((lvl) => map[lvl]).filter(Boolean) || [];
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
    durationWeeks: Yup.object().test(
      "weeks-required",
      "Duration (weeks) is required for selected modules",
      function (value) {
        const { level } = this.parent;
        const modules = getModulesFromLevels(level);
        return modules.every((mod) => value?.[mod]);
      }
    ),
    durationHours: Yup.object().test(
      "hours-required",
      "Duration (hours) must be a valid number or range for each module",
      function (value) {
        const { level } = this.parent;
        const modules = getModulesFromLevels(level);
        const validFormat = /^\d+(\s*-\s*\d+)?$/;
        return modules.every(
          (mod) => value?.[mod] && validFormat.test(value[mod])
        );
      }
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
                            if (values.level.includes(lvl)) {
                              // Remove level
                              setFieldValue(
                                "level",
                                values.level.filter((l) => l !== lvl)
                              );
                            } else {
                              // Add level
                              setFieldValue("level", [...values.level, lvl]);
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

// import { Field, Form, Formik } from "formik";
// import { useEffect, useRef, useState } from "react";
// import * as Yup from "yup";
// import Swal from "sweetalert2";
// import toast from "react-hot-toast";
// import { Modal } from "../../../components/Modal";
// import ContentEditor from "../../../components/content_editor/ContentEditor";
// import { getAllCourseTypesApi, addCourseApi } from "../../../apis/api";
// import { CircleX } from "lucide-react";

// export const AddCourseModal = ({ open, onClose, setUpdated }) => {
//   const [courseTypes, setCourseTypes] = useState([]);
//   const [description, setDescription] = useState("");
//   const [image, setImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const courseImageInputRef = useRef(null);

//   const levelOptions = ["Beginner", "Intermediate", "Advanced"];
//   const tagOptions = ["Featured", "Hot", "New", "Special"];

//   useEffect(() => {
//     if (open) {
//       fetchTypes();
//     }
//   }, [open]);

//   const fetchTypes = async () => {
//     try {
//       const res = await getAllCourseTypesApi();
//       if (res?.data?.success) {
//         setCourseTypes(res.data.result);
//       }
//     } catch (err) {
//       console.error("Error fetching course types", err);
//     }
//   };

//   const courseSchema = Yup.object().shape({
//     title: Yup.string().required("Title is required"),
//     mainType: Yup.string().required("Main course type is required"),
//     subType: Yup.string().when("mainType", (mainType, schema) => {
//       const hasSubTypes =
//         courseTypes.find((ct) => ct.main === mainType)?.sub.length > 0;
//       return hasSubTypes
//         ? schema.required("Sub course type is required")
//         : schema.notRequired();
//     }),
//     duration: Yup.string()
//       .matches(
//         /^([0-9]+(-[0-9]+)? ?(hours?|months?))$/i,
//         "Duration must be like '6 months', '40 hours', or '9-18 months'"
//       )
//       .required("Duration is required"),
//     price: Yup.number()
//       .typeError("Price must be a number")
//       .required("Price is required"),
//     level: Yup.string().required("Level is required"),
//     studentEnrolled: Yup.number()
//       .typeError("Students enrolled must be a number")
//       .required("Student enrolled is required"),
//     courseTag: Yup.string().notRequired(),
//   });

//   const handleSubmit = async (values, { resetForm }) => {
//     if (!description.trim()) {
//       return toast.error("Description is required");
//     }
//     if (!image) {
//       return toast.error("Course image is required");
//     }

//     const formData = new FormData();
//     formData.append("title", values.title);
//     formData.append("description", description);
//     formData.append("courseType", values.mainType);
//     if (values.subType) formData.append("courseSubType", values.subType);
//     formData.append("duration", values.duration);
//     formData.append("price", values.price);
//     formData.append("level", values.level);
//     formData.append("studentEnrolled", values.studentEnrolled);
//     if (values.courseTag) formData.append("courseTag", values.courseTag);
//     formData.append("image", image);

//     try {
//       const res = await addCourseApi(formData);
//       if (res?.data?.success) {
//         toast.success("Course added successfully!");
//         setUpdated((prev) => !prev);
//         resetForm();
//         setDescription("");
//         setImage(null);
//         setPreviewImage(null);
//         if (courseImageInputRef.current) {
//           courseImageInputRef.current.value = null;
//         }
//         onClose();
//       }
//     } catch (err) {
//       Swal.fire("Error", `Failed to create course: ${err.message}`, "error");
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose} modalTitle="Add Course">
//       <section className="w-full max-w-5xl p-6 mx-auto">
//         <Formik
//           initialValues={{
//             title: "",
//             mainType: "",
//             subType: "",
//             duration: "",
//             price: "",
//             level: "",
//             studentEnrolled: "",
//             courseTag: "",
//           }}
//           validationSchema={courseSchema}
//           onSubmit={handleSubmit}
//         >
//           {({
//             isSubmitting,
//             values,
//             errors,
//             touched,
//             handleChange,
//             setFieldValue,
//           }) => {
//             const subTypes =
//               courseTypes.find((ct) => ct.main === values.mainType)?.sub || [];

//             return (
//               <Form className="grid grid-cols-2 gap-6">
//                 {/* Title */}
//                 <div>
//                   <label className="font-medium text-lg">Course Title</label>
//                   <Field
//                     type="text"
//                     name="title"
//                     className="border rounded w-full p-3"
//                   />
//                   {errors.title && touched.title && (
//                     <div className="text-red-600 text-sm mt-1">
//                       {errors.title}
//                     </div>
//                   )}
//                 </div>

//                 {/* Duration */}
//                 <div>
//                   <label className="font-medium text-lg">
//                     Duration (in hours/months)
//                   </label>
//                   <Field
//                     type="text"
//                     name="duration"
//                     className="border rounded w-full p-3"
//                   />
//                   {errors.duration && touched.duration && (
//                     <div className="text-red-600 text-sm mt-1">
//                       {errors.duration}
//                     </div>
//                   )}
//                 </div>

//                 {/* Price */}
//                 <div>
//                   <label className="font-medium text-lg">Price (in Rs)</label>
//                   <Field
//                     type="number"
//                     name="price"
//                     className="border rounded w-full p-3"
//                   />
//                   {errors.price && touched.price && (
//                     <div className="text-red-600 text-sm mt-1">
//                       {errors.price}
//                     </div>
//                   )}
//                 </div>

//                 {/* Student Enrolled */}
//                 <div>
//                   <label className="font-medium text-lg">
//                     Students Enrolled
//                   </label>
//                   <Field
//                     type="number"
//                     name="studentEnrolled"
//                     className="border rounded w-full p-3"
//                   />
//                   {errors.studentEnrolled && touched.studentEnrolled && (
//                     <div className="text-red-600 text-sm mt-1">
//                       {errors.studentEnrolled}
//                     </div>
//                   )}
//                 </div>

//                 {/* Main Type */}
//                 <div>
//                   <label className="font-medium text-lg">Main Type</label>
//                   <Field
//                     as="select"
//                     name="mainType"
//                     className="w-full border rounded p-3"
//                     onChange={(e) => {
//                       handleChange(e);
//                       setFieldValue("subType", "");
//                     }}
//                   >
//                     <option value="">Select Main Type</option>
//                     {courseTypes.map((type) => (
//                       <option key={type._id} value={type.main}>
//                         {type.main}
//                       </option>
//                     ))}
//                   </Field>
//                   {errors.mainType && touched.mainType && (
//                     <div className="text-red-600 text-sm mt-1">
//                       {errors.mainType}
//                     </div>
//                   )}
//                 </div>

//                 {/* Sub Type */}
//                 <div>
//                   <label className="font-medium text-lg">Sub Type</label>
//                   <Field
//                     as="select"
//                     name="subType"
//                     disabled={subTypes.length === 0}
//                     className="w-full border rounded p-3"
//                   >
//                     <option value="">Select Sub Type</option>
//                     {subTypes.map((sub) => (
//                       <option key={sub.name} value={sub.name}>
//                         {sub.name}
//                       </option>
//                     ))}
//                   </Field>
//                   {errors.subType && (
//                     <div className="text-red-600 text-sm mt-1">
//                       {errors.subType}
//                     </div>
//                   )}
//                 </div>

//                 {/* Course Tag */}
//                 <div>
//                   <label className="font-medium text-lg">Course Tag</label>
//                   <Field
//                     as="select"
//                     name="courseTag"
//                     className="w-full border rounded p-3"
//                   >
//                     <option value="">Select Tag</option>
//                     {tagOptions.map((tag) => (
//                       <option key={tag} value={tag}>
//                         {tag}
//                       </option>
//                     ))}
//                   </Field>
//                 </div>

//                 {/* Level */}
//                 <div>
//                   <label className="font-medium text-lg">Level</label>
//                   <Field
//                     as="select"
//                     name="level"
//                     className="w-full border rounded p-3"
//                   >
//                     <option value="">Select Level</option>
//                     {levelOptions.map((lvl) => (
//                       <option key={lvl} value={lvl}>
//                         {lvl}
//                       </option>
//                     ))}
//                   </Field>
//                   {errors.level && touched.level && (
//                     <div className="text-red-600 text-sm mt-1">
//                       {errors.level}
//                     </div>
//                   )}
//                 </div>

//                 {/* Description */}
//                 <div className="col-span-2">
//                   <label className="font-medium text-lg">Description</label>
//                   <ContentEditor
//                     model={description}
//                     handleModelChange={setDescription}
//                   />
//                 </div>

//                 {/* Image Upload */}
//                 <div className="col-span-2">
//                   <label className="font-medium text-lg">Course Image</label>
//                   {previewImage && (
//                     <div className="flex items-center gap-4 mb-2">
//                       <img
//                         src={previewImage}
//                         alt="Preview"
//                         className="w-24 h-24 object-cover rounded shadow"
//                       />
//                       <CircleX
//                         className="text-red-600 cursor-pointer"
//                         size={28}
//                         onClick={() => {
//                           setImage(null);
//                           setPreviewImage(null);
//                           if (courseImageInputRef.current) {
//                             courseImageInputRef.current.value = null;
//                           }
//                         }}
//                       />
//                     </div>
//                   )}
//                   <input
//                     type="file"
//                     accept="image/*"
//                     ref={courseImageInputRef}
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       setImage(file);
//                       if (file) {
//                         setPreviewImage(URL.createObjectURL(file));
//                       }
//                     }}
//                     className="border rounded w-full p-3"
//                   />
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md w-full col-span-2"
//                 >
//                   {isSubmitting ? "Submitting..." : "Submit"}
//                 </button>
//               </Form>
//             );
//           }}
//         </Formik>
//       </section>
//     </Modal>
//   );
// };
