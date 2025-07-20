import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAllCourseTypesApi,
  getCourseByCourseTypeApi,
} from "../../../apis/api";

export const CourseTypeView = () => {
  const { mainType, subType } = useParams();
  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseError, setCourseError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, coursesRes] = await Promise.all([
          getAllCourseTypesApi(),
          getCourseByCourseTypeApi(mainType, subType || ""),
        ]);

        if (typesRes.data.success) {
          setCourseTypes(typesRes.data.result);
        }

        if (coursesRes.data.success) {
          setCourses(coursesRes.data.result);
        } else {
          setCourseError("No courses found.");
        }
      } catch (err) {
        setCourseError("Error loading courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mainType, subType]);

  if (loading)
    return (
      <p className="p-6 text-center text-[#262a2b]">Loading course types...</p>
    );

  const mainCourseType = courseTypes.find((ct) => ct.main === mainType);
  if (!mainCourseType) {
    return (
      <p className="p-6 text-center text-[#262a2b]">Course type not found.</p>
    );
  }

  const subtypeObj = subType
    ? mainCourseType.sub.find((s) => s.name === subType)
    : null;

  const pageTitle = subType ? `${mainType}: ${subType}` : mainType;
  const description =
    (subType ? subtypeObj?.description : mainCourseType.description) || "";

  return (
    <>
      {/* Hero Section */}
      <div className="bg-[#204081] w-full py-20"></div>

      {/* Content */}
      <div className="pt-10 px-4 md:px-[6vw] xl:px-[8vw]">
        <p className="mb-5 text-left text-4xl font-bold">{pageTitle}</p>

        <div
          className="font-medium bg-white p-10 mb-8 text-[#262a2b] rounded-lg"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {/* Courses */}
        <h3 className="text-2xl font-semibold mb-4">Courses</h3>
        {courseError ? (
          <p className="text-red-600">{courseError}</p>
        ) : courses.length === 0 ? (
          <p>No courses found for this type.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="border p-4 bg-white shadow rounded"
              >
                <h4 className="text-lg font-bold mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 mb-1">
                  Duration: {course.duration}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Level: {course.level}
                </p>
                <p className="text-sm font-semibold">Rs. {course.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
