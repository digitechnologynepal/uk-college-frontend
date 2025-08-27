import React, { useEffect, useState } from "react";
import { getCoursesApi } from "../../../../apis/api";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const PopularCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCoursesApi();
        if (response.data.success) {
          setCourses(response.data.result.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (id) => {
    navigate(`/course/courseDetail/${id}`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="w-full py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-[40px] md:text-[48px] font-extrabold text-[#262a2b] leading-tight">
            Top UK Courses with Proven Academic Value
          </h2>
        </motion.div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center text-lg font-bold">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, i) => (
              <motion.div
                key={course._id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                variants={cardVariants}
                className="relative cursor-pointer rounded-lg overflow-hidden shadow-xl bg-white group"
                onClick={() => handleCourseClick(course._id)}
              >
                {/* Course Image */}
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${course.image}`}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Text & CTA */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h3 className="text-white text-lg md:text-xl font-semibold mb-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-white font-medium opacity-50 group-hover:opacity-80 transition-opacity duration-300">
                    <span>View Course</span>
                    <FaArrowRight />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
