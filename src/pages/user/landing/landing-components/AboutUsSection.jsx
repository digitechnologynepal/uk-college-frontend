import { useEffect, useState } from "react";
import { getAboutUsApi } from "../../../../apis/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const SkeletonAboutUsSection = () => (
  <section className="relative w-full overflow-hidden py-32 bg-white">
    <div className="max-w-6xl mx-auto px-4 relative z-10 animate-pulse">
      {/* Title Placeholder */}
      <div className="h-12 max-w-xl mx-auto rounded bg-gray-200 mb-20" />

      {/* Image Cards Placeholders */}
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`rounded-xl shadow-lg bg-gray-200 h-[20rem] ${
              i === 1 ? "md:translate-y-10" : ""
            }`}
          />
        ))}
      </div>

      {/* Button Placeholder */}
      <div className="mt-20 flex justify-center">
        <div className="h-12 w-48 rounded-md bg-gray-300" />
      </div>
    </div>
  </section>
);

export const AboutUsSection = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAboutUsApi()
      .then((res) => {
        if (res.data.success) {
          setData(res.data.result);
        } else {
          throw new Error("Failed to fetch About Us data");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleReadMore = () => navigate("/aboutus");

  if (loading || !data) {
    return <SkeletonAboutUsSection />;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg">{error}</p>;
  }

  return (
    <section className="relative w-full overflow-hidden py-20">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="relative text-4xl font-extrabold text-[#262a2b]">
            {data.title}
          </h2>
        </motion.div>

        {/* Image Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 items-start"
        >
          <div className="relative group overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 bg-white">
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${data.image[0]}`}
              alt="About 1"
              className="w-full h-[20rem] object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative group overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 bg-white md:translate-y-10">
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${data.image[1]}`}
              alt="About 2"
              className="w-full h-[20rem] object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative group overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 bg-white">
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${data.image[2]}`}
              alt="About 3"
              className="w-full h-[20rem] object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>

        <div className="mt-20 text-center">
          <button
            onClick={handleReadMore}
            className="inline-flex items-center gap-2 text-white bg-[#204081] hover:bg-[#4671c8] px-6 py-3 rounded-md shadow-lg transition"
          >
            Read Full Story <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};
