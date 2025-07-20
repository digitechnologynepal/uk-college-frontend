import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { updateCourseApi } from "../../../apis/api";
import { Modal } from "../../../components/Modal";
import ContentEditor from "../../../components/content_editor/ContentEditor";
import { CircleX } from "lucide-react";

export const EditCourseModal = ({ open, onClose, setUpdated, selectedCourse }) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const levelOptions = ["Class 11", "Class 12"];

  const getModulesFromLevels = (levels) => {
    const map = {
      "Class 11": "Module 1",
      "Class 12": "Module 2",
    };
    return levels?.map((lvl) => map[lvl]).filter(Boolean) || [];
  };

  useEffect(() => {
    if (selectedCourse) {
      setDescription(selectedCourse.description || "");
      setPreviewImage(
        selectedCourse.image
          ? `${process.env.REACT_APP_API_URL}/uploads/${selectedCourse.image}`
          : null
      );
    }
  }, [selectedCourse]);

  useEffect(() => {
  if (!open) {
    setDescription("");
    setImage(null);
    setPreviewImage(null);
  }
}, [open]);


  const courseSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    level: Yup.array()
      .min(1, "At least one level must be selected")
      .of(Yup.string().oneOf(levelOptions))
      .required("Level is required"),
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
      "hours-format",
      "Duration (hours) must be a valid number or range for each module",
      function (value) {
        const { level } = this.parent;
        const modules = getModulesFromLevels(level);
        const validFormat = /^\d+(\s*-\s*\d+)?$/;
        return modules.every((mod) => value?.[mod] && validFormat.test(value[mod]));
      }
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
                  <Field type="text" name="title" className="border rounded w-full p-3" />
                  {errors.title && touched.title && (
                    <div className="text-red-600 text-sm mt-1">{errors.title}</div>
                  )}
                </div>

                {/* Level Multi-Select */}
                <div className="col-span-2">
                  <label className="font-medium text-lg mb-2 block">Level</label>
                  <div className="flex flex-col space-y-2">
                    {levelOptions.map((lvl) => (
                      <label key={lvl} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value={lvl}
                          checked={values.level.includes(lvl)}
                          onChange={() => {
                            if (values.level.includes(lvl)) {
                              setFieldValue("level", values.level.filter((l) => l !== lvl));
                            } else {
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
                    <div className="text-red-600 text-sm mt-1">{errors.level}</div>
                  )}
                </div>

                {/* Module Duration Inputs */}
                {modules.map((mod) => (
                  <div key={mod} className="col-span-2 border rounded p-4 bg-gray-50">
                    <h4 className="font-semibold text-md mb-2">{mod} Duration</h4>

                    {/* Weeks */}
                    <div className="mb-2">
                      <label className="block font-medium text-sm">Weeks</label>
                      <Field
                        type="number"
                        name={`durationWeeks.${mod}`}
                        className="border rounded w-full p-2"
                        placeholder="e.g., 6"
                      />
                      {errors.durationWeeks?.[mod] && touched.durationWeeks?.[mod] && (
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
                      {errors.durationHours?.[mod] && touched.durationHours?.[mod] && (
                        <div className="text-red-600 text-sm mt-1">
                          {errors.durationHours[mod]}
                        </div>
                      )}
                    </div>

                    {/* Module Description */}
                    <div>
                      <label className="block font-medium text-sm">Description</label>
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
                  <ContentEditor model={description} handleModelChange={setDescription} />
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
                        }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
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





// import { Field, Form, Formik } from "formik";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import Swal from "sweetalert2";
// import * as Yup from "yup";
// import { getAllCourseTypesApi, updateCourseApi } from "../../../apis/api";
// import { Modal } from "../../../components/Modal";
// import ContentEditor from "../../../components/content_editor/ContentEditor";

// export const EditCourseModal = ({
//   open,
//   onClose,
//   setUpdated,
//   selectedCourse,
// }) => {
//   const [description, setDescription] = useState("");
//   const [image, setImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [courseTypes, setCourseTypes] = useState([]);

//   const levelOptions = ["Beginner", "Intermediate", "Advanced"];

//   useEffect(() => {
//     if (selectedCourse) {
//       setDescription(selectedCourse.description || "");
//       setImage(selectedCourse.image || null);
//       if (selectedCourse.image) {
//         setPreviewImage(
//           `${process.env.REACT_APP_API_URL}/uploads/${selectedCourse.image}`
//         );
//       } else {
//         setPreviewImage(null);
//       }
//     }
//   }, [selectedCourse]);

//   useEffect(() => {
//     const fetchTypes = async () => {
//       try {
//         const res = await getAllCourseTypesApi();
//         if (!res?.data?.success) {
//           console.error("Fetch failed:", res?.data?.message || "Unknown error");
//           return;
//         }
//         console.log("Fetched course types:", res.data.result);
//         setCourseTypes(res.data.result);
//       } catch (err) {
//         console.error("Failed to fetch course types:", err);
//       }
//     };
//     fetchTypes();
//   }, []);

//   // Validation schema
//   const courseSchema = Yup.object().shape({
//     title: Yup.string().required("Title is required"),
//     mainType: Yup.string().required("Main course type is required"),
//     subType: Yup.string().when("mainType", (mainType, schema) => {
//       const hasSubTypes =
//         courseTypes.find((ct) => ct.main === mainType)?.sub.length > 0;
//       if (hasSubTypes) {
//         return schema.required("Sub course type is required");
//       }
//       return schema.notRequired();
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
//   });

//   const handleUpdateCourse = async (values, { resetForm }) => {
//     const selectedType = courseTypes.find((ct) => ct._id === values.mainType);
//     const requiresSubType = selectedType?.sub?.length > 0;
//     if (requiresSubType && !values.subType) {
//       return toast.error("Sub course type is required");
//     }
//     if (description.trim() === "") {
//       return toast.error("Description is required");
//     }

//     const formData = new FormData();
//     formData.append("title", values.title);
//     formData.append("description", description);
//     formData.append("courseType", values.mainType);
//     formData.append("courseSubType", values.subType || "");
//     formData.append("duration", values.duration);
//     formData.append("price", values.price);
//     formData.append("level", values.level);
//     formData.append("studentEnrolled", values.studentEnrolled);

//     if (image instanceof File) {
//       formData.append("image", image);
//     }

//     try {
//       const res = await updateCourseApi(selectedCourse._id, formData);
//       if (res?.data?.success) {
//         toast.success("Course updated successfully!");
//         setUpdated((prev) => !prev);
//         resetForm();
//         onClose();
//       }
//     } catch (error) {
//       Swal.fire("Error", `Failed to update course: ${error.message}`, "error");
//     }
//   };

//   return (
//     <Modal modalTitle={"Edit Course"} open={open} onClose={onClose}>
//       <section className="w-full max-w-5xl p-6 mx-auto">
//         <Formik
//           enableReinitialize
//           initialValues={{
//             title: selectedCourse?.title || "",
//             mainType: selectedCourse?.courseType || "",
//             subType: selectedCourse?.courseSubType || "",
//             duration: selectedCourse?.duration || "",
//             price: selectedCourse?.price || "",
//             level: selectedCourse?.level || "",
//             studentEnrolled: selectedCourse?.studentEnrolled || "",
//           }}
//           validationSchema={courseSchema}
//           onSubmit={handleUpdateCourse}
//         >
//           {({
//             isSubmitting,
//             values,
//             handleChange,
//             setFieldValue,
//             errors,
//             touched,
//           }) => {
//             const subTypes =
//               courseTypes.find((ct) => ct.main === values.mainType)?.sub || [];

//             return (
//               <Form className="grid grid-cols-2 gap-6">
//                 {/* Title */}
//                 <div>
//                   <label className="font-medium text-lg" htmlFor="title">
//                     Title
//                   </label>
//                   <Field
//                     className="border rounded w-full p-3"
//                     name="title"
//                     type="text"
//                     placeholder="Enter course title"
//                   />
//                   {errors.title && touched.title && (
//                     <div className="text-red-600 text-sm mt-1">
//                       {errors.title}
//                     </div>
//                   )}
//                 </div>

//                 {/* Main Type */}
//                 <div>
//                   <label className="font-medium text-lg" htmlFor="mainType">
//                     Main Type
//                   </label>
//                   <Field
//                     as="select"
//                     name="mainType"
//                     className="w-full border rounded p-2"
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
//                   <label className="font-medium text-lg" htmlFor="subType">
//                     Sub Type
//                   </label>
//                   <Field
//                     as="select"
//                     name="subType"
//                     className="w-full border rounded p-2"
//                     disabled={subTypes.length === 0}
//                   >
//                     <option value="">Select Sub Type</option>
//                     {subTypes.map((sub) => (
//                       <option key={sub.name} value={sub.name}>
//                         {sub.name}
//                       </option>
//                     ))}
//                   </Field>
//                   {(errors.subType && touched.subType) ||
//                   (errors.subType && !touched.subType) ? (
//                     <div className="text-red-600 text-sm mt-1">
//                       {errors.subType}
//                     </div>
//                   ) : null}
//                 </div>

//                 {/* Duration */}
//                 <div>
//                   <label className="font-medium text-lg" htmlFor="duration">
//                     Duration (hours/months)
//                   </label>
//                   <Field
//                     className="border rounded w-full p-3"
//                     name="duration"
//                     type="text"
//                     placeholder="Enter course duration"
//                   />
//                   {errors.duration && touched.duration && (
//                     <div className="text-red-600 text-sm mt-1">
//                       {errors.duration}
//                     </div>
//                   )}
//                 </div>

//                 {/* Price */}
//                 <div>
//                   <label className="font-medium text-lg" htmlFor="price">
//                     Price
//                   </label>
//                   <Field
//                     className="border rounded w-full p-3"
//                     name="price"
//                     type="number"
//                     placeholder="Enter course price"
//                   />
//                   {errors.price && touched.price && (
//                     <div className="text-red-600 text-sm mt-1">
//                       {errors.price}
//                     </div>
//                   )}
//                 </div>

//                 {/* Level */}
//                 <div>
//                   <label className="font-medium text-lg" htmlFor="level">
//                     Level
//                   </label>
//                   <Field
//                     as="select"
//                     name="level"
//                     className="border rounded w-full p-3"
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

//                 {/* Students Enrolled */}
//                 <div>
//                   <label
//                     className="font-medium text-lg"
//                     htmlFor="studentEnrolled"
//                   >
//                     Students Enrolled
//                   </label>
//                   <Field
//                     className="border rounded w-full p-3"
//                     name="studentEnrolled"
//                     type="number"
//                     placeholder="Enter student count"
//                   />
//                   {errors.studentEnrolled && touched.studentEnrolled && (
//                     <div className="text-red-600 text-sm mt-1">
//                       {errors.studentEnrolled}
//                     </div>
//                   )}
//                 </div>

//                 {/* Course Description */}
//                 <div className="col-span-2">
//                   <label className="font-medium text-lg">
//                     Course Description
//                   </label>
//                   <ContentEditor
//                     model={description}
//                     handleModelChange={setDescription}
//                   />
//                 </div>

//                 {/* Course Image */}
//                 <div className="col-span-2">
//                   <label className="font-medium text-lg" htmlFor="image">
//                     Course Image
//                   </label>
//                   {previewImage && (
//                     <img
//                       src={previewImage}
//                       alt="Preview"
//                       className="w-32 h-32 object-cover mb-2 rounded"
//                     />
//                   )}
//                   <input
//                     type="file"
//                     accept="image/*"
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

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md w-full col-span-2"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Updating..." : "Update Course"}
//                 </button>
//               </Form>
//             );
//           }}
//         </Formik>
//       </section>
//     </Modal>
//   );
// };
