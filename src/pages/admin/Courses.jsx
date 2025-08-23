import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import { deleteCourseApi, getCoursesApi } from "../../apis/api";
import Title from "../../components/admin-components/Title";
import { ErrorHandler } from "../../components/error/errorHandler";
import CourseTable from "./courses-components/CourseTable";
import { AddCourseModal } from "./courses-components/AddCourseModal";

export const Courses = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchCourses();
  }, [updated]);

  const fetchCourses = async () => {
    try {
      const res = await getCoursesApi();
      if (res?.data?.success) {
        setCourseData(res.data.result);
      }
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003366",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const res = await deleteCourseApi(id);
        if (res?.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Course deleted successfully",
            timer: 1500,
          });
          setUpdated((prev) => !prev);
          // fetchCourses();
        }
      } catch (err) {
        ErrorHandler(err);
      }
    }
  };

  return (
    <>
      <main className="p-4">
        <div className="flex justify-between mb-10">
          <Title title="All Courses" />
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            Add Course
          </button>
        </div>

        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <CourseTable data={courseData} onDelete={handleDeleteCourse} />
          )}
        </div>
      </main>

      <AddCourseModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        setUpdated={setUpdated}
      />
    </>
  );
};
