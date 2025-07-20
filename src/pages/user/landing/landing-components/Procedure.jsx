import React, { useEffect, useState } from "react";
import { getAllProceduresApi } from "../../../../apis/api";
import { ErrorHandler } from "../../../../components/error/errorHandler";
import { motion } from "framer-motion";

const SkeletonProcedure = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Heading + Subheading Skeleton */}
      <div className="text-center">
        <div className="h-10 w-2/3 bg-gray-200 rounded mx-auto mb-4"></div>
        <div className="h-6 w-1/2 bg-gray-200 rounded mx-auto"></div>
      </div>

      {/* Static vertical line */}
      <div className="relative pl-10">
        <div className="absolute left-2 top-0 bottom-0 w-1 border-l-2 border-dashed border-gray-200" />

        {/* Procedure card skeletons */}
        <div className="space-y-8">
          {[...Array(11)].map((_, idx) => (
            <div key={idx} className="relative">
              {/* Dot */}
              <span className="absolute -left-[10px] top-3 w-5 h-5 rounded-full bg-gray-200 border-4 border-white shadow-md" />

              {/* Card skeleton */}
              <div className="h-72 bg-white border border-gray-100 rounded-lg p-6 shadow">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="h-8 w-12 bg-gray-100 rounded-md" />
                  <div className="h-6 w-40 bg-gray-100 rounded-md" />
                </div>
                <div className="space-y-2 mt-3">
                  <div className="h-4 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-5/6 bg-gray-100 rounded" />
                  <div className="h-4 w-4/6 bg-gray-100 rounded" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-5/6 bg-gray-100 rounded" />
                  <div className="h-4 w-4/6 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Procedure = () => {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProcedures = async () => {
    try {
      const res = await getAllProceduresApi();
      if (res.data.success) setProcedures(res.data.result);
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section className="max-w-4xl mx-auto px-4 pb-24 relative">
      <h2 className="mb-4 text-center text-[28px] sm:text-[32px] md:text-[40px] font-extrabold text-[#262a2b]">
        Standard Operating Procedure
      </h2>
      <p className="text-base sm:text-lg lg:text-xl text-[#262a2b] mb-14 leading-relaxed text-center">
        From initial inquiry to final certification, here’s how we partner with
        academic institutions.
      </p>

      {loading ? (
        <SkeletonProcedure />
      ) : procedures.length === 0 ? (
        <p className="text-gray-500 text-xl font-semibold text-center mt-10">
          No procedures found.
        </p>
      ) : (
        <div className="relative pl-10">
          {/* Static vertical line */}
          <div className="absolute left-2 top-0 bottom-0 w-1 border-l-2 border-dashed border-[#204081]" />

          <div className="space-y-8">
            {procedures.map((proc, idx) => (
              <motion.div
                key={proc._id}
                className="relative group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={itemVariants}
              >
                {/* Dot */}
                <span className="absolute -left-[10px] top-3 w-5 h-5 rounded-full bg-[#d91b1a] border-4 border-gray-50 shadow-md shadow-red-600/50" />

                {/* Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                  <h3 className="text-2xl font-bold text-[#204081] flex items-center">
                    <span className="text-[#204081] font-semibold text-3xl min-w-[3rem]">
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                    {proc.title}
                  </h3>

                  {proc.description ? (
                    <div
                      className="text-lg max-w-none mt-2 text-[#262a2b]"
                      dangerouslySetInnerHTML={{ __html: proc.description }}
                    />
                  ) : (
                    <p className="text-gray-500 text-xl font-semibold text-center mt-10 col-span-full">
                      No description provided.
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
