import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourseByIdApi } from "../../../../apis/api";

const SkeletonCourseDetail = () => (
  <section className="text-[#262a2b] pt-[5%] max-w-7xl mx-auto px-6 py-20 animate-pulse">
    {/* Hero Section Skeleton */}
    <div className="relative h-[440px] bg-gray-200 rounded-md mb-16" />

    {/* Main Content Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-16">
      {/* Left Column */}
      <div className="space-y-20">
        {/* Course Overview */}
        <div>
          <div className="h-10 bg-gray-200 rounded w-48 mb-6" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="h-6 bg-gray-200 rounded w-5/6" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
          </div>
        </div>

        {/* Course Modules */}
        <div>
          <div className="h-10 bg-gray-200 rounded w-48 mb-10" />
          <div className="space-y-10 border-l-2 border-dashed border-gray-200 pl-6">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-gray-400 border-4 border-white shadow-md" />
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg">
                  <div className="h-7 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="flex gap-4 mb-3">
                    <div className="h-5 bg-gray-200 rounded w-20" />
                    <div className="h-5 bg-gray-200 rounded w-20" />
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <aside className="h-fit lg:sticky lg:top-32">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-40" />

          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 border border-gray-200 rounded-md p-4"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </aside>
    </div>
  </section>
);

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseByIdApi(id);
        if (res.data.success) {
          setCourse(res.data.result);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading)
    return (
      <p className="p-8 text-center text-gray-500 font-medium text-lg">
        <SkeletonCourseDetail />
      </p>
    );
  if (!course)
    return (
      <p className="p-8 text-center text-red-600 font-semibold text-lg">
        Course not found.
      </p>
    );

  const toggleModule = (idx) => {
    setExpandedModules((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <>
      {/* Main Content */}
      <main className="text-[#262a2b] bg-white pt-[22%] md:pt-[15%] lg:pt-[5%] flex items-center justify-center">
        <div className="mx-[5vw] px-6 pb-20 pt-[8%] lg:pt-[3%] md:pt-[5%] grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-10">
          {/* Left Column (Content + Hero) */}
          <div className="space-y-10">
            {/* Title + Accent */}
            <div className="mb-4 flex-col items-center max-w-5xl">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#262a2b] relative inline-block">
                {course.title}
                <span className="block h-1 w-16 bg-[#d91b1a] rounded mt-2"></span>
              </h3>
            </div>

            {/* Course Image */}
            <div className="overflow-hidden rounded-2xl shadow-md max-w-5xl">
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${course.image}`}
                alt={course.title}
                className="w-full object-cover object-center"
                style={{ maxHeight: "500px" }}
              />
            </div>

            {/* Course Description */}
            <section className="max-w-5xl">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#204081] mb-6 flex items-center gap-2">
                Course Overview
              </h2>
              <div
                className="text-[#262a2b] text-justify text-md lg:text-xl leading-relaxed"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </section>

            {/* Modules Timeline */}
            {Array.isArray(course.modules) && course.modules.length > 0 && (
              <section className="max-w-3xl">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#204081] mb-10 flex items-center gap-2">
                  Course Modules
                </h2>
                <div className="relative border-l-2 border-dashed border-[#204081] pl-6 space-y-10">
                  {course.modules.map((mod, idx) => (
                    <div key={idx} className="relative group">
                      <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#204081] border-4 border-gray-50 group-hover:scale-110 transition-transform shadow-md" />
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg transition">
                        <h3 className="text-xl font-bold text-[#204081]">
                          {mod.name}
                        </h3>
                        <div className="text-md lg:text-xl text-[#262a2b] mt-1 flex gap-4 flex-wrap">
                          <p>
                            <strong>Weeks:</strong> {mod.durationWeeks}
                          </p>
                          <p>
                            <strong>Hours:</strong> {mod.durationHours}
                          </p>
                        </div>
                        {mod.description && (
                          <p className="text-md lg:text-xl text-[#262a2b] mt-2 text-justify">
                            {mod.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column (Sticky Summary) */}
          <aside className="h-fit lg:sticky lg:top-32">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-2 max-w-full">
              <p className="text-xl font-bold text-[#204081] flex items-center">
                Quick Summary
              </p>

              {/* Modules Overview */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-[#262a2b]">
                  Modules Overview
                </h4>
                {course.modules?.map((mod, i) => (
                  <div
                    key={i}
                    className="bg-[#f1f6ff] border border-gray-200 rounded-md py-5 px-6 transition"
                  >
                    <p className="font-bold text-lg text-[#204081]">
                      {mod.name}
                    </p>
                    <p className="text-base font-medium text-[#262a2b] mt-1">
                      Learning Weeks: {mod.durationWeeks} weeks
                      <div className="mb-2" />
                      Learning Hours: {mod.durationHours} hours of study
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default CourseDetail;
