import React, { useEffect, useState } from "react";
import { getWhyChooseUsApi } from "../../../../apis/api";
import { motion } from "framer-motion";

const SkeletonView = () => {
  return (
    <section className="pb-28">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 animate-pulse">
        {/* Section Skeleton Header */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="h-8 w-60 bg-gray-200 rounded mx-auto mb-4" />
          <div className="h-4 w-80 bg-gray-100 rounded mx-auto" />
        </div>

        {/* Skeleton Items */}
        <div className="space-y-16">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`flex flex-col md:flex-row items-center md:items-start gap-4 lg:gap-10 ${
                i % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image skeleton */}
              <div className="w-full md:w-5/12">
                <div className="w-full h-48 lg:h-72 bg-gray-200 rounded-lg" />
              </div>

              {/* Text skeleton */}
              <div className="w-full md:w-7/12 space-y-4">
                <div className="h-6 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-5/6 bg-gray-100 rounded" />
                <div className="h-4 w-4/6 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export const ChooseUs = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWhyChooseUsApi();
        if (response.data.success) {
          setData(response.data.result);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    <SkeletonView />;
  }
  if (error)
    return <p className="text-center text-red-600 py-20">Error: {error}</p>;

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <h2 className="relative text-3xl sm:text-4xl font-extrabold text-[#262a2b] mb-5">
            Why Choose Us?
          </h2>
          <p className="font-medium mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {data?.mainTitle}
          </p>
        </motion.div>

        {/* Items List */}
        <div className="space-y-12 lg:space-y-14">
          {data?.items.map(({ _id, title, description, imageUrl }, i) => (
            <React.Fragment key={_id}>
              <motion.div
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                loading="lazy"
                className={`flex flex-col md:flex-row items-center md:items-start gap-4 lg:gap-10 ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : ""
                } `}
              >
                {/* Image */}
                <div className="w-full md:w-5/12">
                  <div className="w-full h-48 lg:h-72 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                      alt={title}
                      className="w-full h-full object-cover"
                      draggable={false}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="w-full md:w-7/12 md:p-5">
                  <h3 className="text-2xl md:text-2xl lg:text-3xl font-semibold text-[#262a2b] mb-3 relative inline-block">
                    {title}
                    <span className="block h-1 w-16 bg-[#d91b1a] rounded mt-2"></span>
                  </h3>
                  <p className="text-xl text-gray-700 leading-relaxed text-justify">
                    {description}
                  </p>
                </div>
              </motion.div>

              {/* Divider line visible only on mobile, except after last item */}
              {i !== data.items.length - 1 && (
                <div className="block md:hidden border-b border-gray-300 my-8" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
