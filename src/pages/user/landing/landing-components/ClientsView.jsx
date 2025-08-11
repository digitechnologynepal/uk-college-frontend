import React, { useEffect, useState } from "react";
import { getAllClientsApi } from "../../../../apis/api";
import { FaGlobe, FaPhoneAlt, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { motion, useInView } from "framer-motion";

const SkeletonCard = () => (
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

const ClientCard = ({ client, index }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { triggerOnce: true, threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      key={client._id}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: "spring",
        damping: 20,
        delay: index * 0.05,
      }}
      className="group bg-white rounded-xl overflow-hidden shadow-lg flex flex-col justify-between h-full cursor-pointer"
      onClick={() => client.website && window.open(client.website, "_blank")}
      title={client.website ? `${client.name} - Visit Website` : client.name}
    >
      {/* Image Section */}
      <div className="m-5 relative overflow-hidden flex items-center justify-center">
        <img
          src={`${process.env.REACT_APP_API_URL}/uploads/${client.image}`}
          alt={client.name}
          loading="lazy"
          className="h-20 object-contain lg:h-52 bg-white"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </div>

      {/* Info Section */}
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

export const ClientsView = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function fetchClients() {
    setIsLoading(true);
    try {
      const response = await getAllClientsApi();
      if (response?.data?.success) {
        setClients(response.data.result);
        setFilteredClients(response.data.result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredClients(
      clients.filter((client) => client.name.toLowerCase().includes(term))
    );
  }, [searchTerm, clients]);

  return (
    <section className="py-28 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 mt-[1.78rem] sm:h-10 md:h-12 w-64 sm:w-80 md:w-96 mx-auto bg-gray-200 rounded mb-4" />
            <div className="h-5 w-72 sm:w-80 md:w-96 mx-auto bg-gray-200 rounded" />
          </div>
        ) : (
          <>
            <p className="text-2xl lg:text-4xl mt-2 font-bold text-[#262a2b]">
              Our Clients
            </p>
            <p className="text-gray-500 text-base mt-2">
              Trusted partners we proudly work with
            </p>
          </>
        )}
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-4 lg:mx-auto md:mx-auto my-7 relative">
        {isLoading ? (
          <div className="animate-pulse h-12 w-full rounded-full bg-gray-200" />
        ) : (
          <>
            <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 font-semibold rounded-full border border-gray-200 focus:ring-1 focus:ring-[#204081] focus:outline-none shadow-sm transition-all duration-300"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-7 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filteredClients.length > 0 ? (
          filteredClients.map((client, index) => (
            <ClientCard client={client} index={index} key={client._id} />
          ))
        ) : (
          <p className="text-gray-500 text-xl font-semibold text-center mt-10 col-span-full">
            No clients found.
          </p>
        )}
      </div>
    </section>
  );
};
