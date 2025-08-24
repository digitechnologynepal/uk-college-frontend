import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaGlobe, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-100 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
    <div className="bg-gray-200 h-60 sm:h-64 md:h-56 lg:h-52 xl:h-48" />
    <div className="flex flex-col flex-grow px-5 py-4 text-center">
      <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
      <div className="flex justify-center gap-3 mt-auto">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
      </div>
    </div>
  </div>
);

// Individual client card
export const ClientCard = ({ client, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { triggerOnce: true, threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      key={client._id}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 15,
        mass: 0.8,
      }}
      className="group bg-white rounded-xl overflow-hidden shadow-lg flex flex-col justify-between h-full cursor-pointer"
      onClick={() => onClick(client)}
      title={client.name}
    >
      <div className="m-5 relative overflow-hidden flex items-center justify-center">
        <img
          src={`${process.env.REACT_APP_API_URL}/uploads/${client.image}`}
          alt={client.name}
          loading="lazy"
          className="h-20 object-contain lg:h-52 bg-white"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </div>

      <div className="flex flex-col justify-between flex-grow px-5 pb-4 text-center">
        <h3 className="text-base font-semibold text-[#262a2b] my-2">
          {client.name}
        </h3>

        <div className="rounded-md bg-[#e7efff] p-2 flex flex-wrap justify-center items-center gap-2 text-gray-600">
          {client.website && (
            <a
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              title={client.website}
              className="p-2 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 flex items-center justify-center text-lg opacity-80 hover:opacity-100 hover:scale-110"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGlobe />
            </a>
          )}
          {client.number && (
            <a
              href={`tel:${client.number}`}
              title={client.number}
              className="p-2 rounded-full hover:bg-emerald-100 hover:text-emerald-600 transition-all duration-300 flex items-center justify-center text-lg opacity-80 hover:opacity-100 hover:scale-110"
              onClick={(e) => e.stopPropagation()}
            >
              <FaPhoneAlt />
            </a>
          )}
          {client.location && (
            <span
              title={client.location}
              className="p-2 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-all duration-300 flex items-center justify-center text-lg opacity-80 hover:opacity-100 hover:scale-110"
            >
              <FaMapMarkerAlt />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
