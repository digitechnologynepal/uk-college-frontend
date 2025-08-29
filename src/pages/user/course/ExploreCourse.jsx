import { useEffect, useState } from "react";
import { getCoursesApi } from "../../../apis/api";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../../../assets/animations/no-data.json";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-md  border border-gray-200 animate-pulse">
    <div className="h-[220px] w-full bg-gray-200 rounded-t-2xl" />
    <div className="p-6 space-y-3">
      <div className="h-5 w-3/4 bg-gray-200 rounded" />
      <div className="h-10 w-1/2 bg-gray-200 rounded-lg mt-4" />
    </div>
  </div>
);

const SkeletonHeading = () => (
  <div className="mb-10 max-w-6xl space-y-3 animate-pulse">
    <div className="h-12 w-2/3 bg-gray-200 rounded" />
    <div className="h-4 w-1/2 bg-gray-200 rounded" />
  </div>
);

const ExploreCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCoursesApi();
        if (response.data.success) {
          setCourses(response.data.result);
        } else {
          setError("Failed to fetch courses.");
        }
      } catch (err) {
        console.error("Error fetching courses", err);
        setError("Error loading courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="w-full pt-32 pb-20 px-4 md:px-[6vw] xl:px-[8vw]">
      {loading ? (
        <>
          <SkeletonHeading />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl">
            {Array.from({ length: 2 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        </>
      ) : (
        <>
          {courses.length > 0 ? (
            <div>
              <div className="mb-8 lg:mb-10 max-w-6xl">
                <p className="text-left text-2xl lg:text-4xl font-bold mb-3 text-[#262a2b]">
                  Explore Our Courses
                </p>
                <p className="text-gray-600 text-base max-w-xl">
                  Gain practical skills and knowledge through expertly crafted
                  courses.
                </p>
              </div>
              <div className="grid gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl">
                {courses.map((course) => (
                  <div
                    key={course.slug}
                    className="bg-white rounded-2xl shadow-md  border border-gray-200 transition duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${course.image}`}
                        alt={course.title}
                        className="w-full h-[220px] object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col gap-3 flex-grow">
                      <h2 className="text-xl font-bold text-[#204081] leading-snug">
                        {course.title}
                      </h2>
                      {/* Button */}
                      <div className="mt-auto">
                        <button
                          onClick={() =>
                            navigate(`/course/courseDetail/${course.slug}`)
                          }
                          className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#204081] hover:bg-[#3c65b4] transition px-4 py-2 rounded-lg"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <Lottie
                animationData={animationData}
                loop
                autoplay
                className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
              />
              <p className="text-gray-500 text-xl font-semibold text-center mt-10 col-span-full">
                No courses available yet.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ExploreCourse;
