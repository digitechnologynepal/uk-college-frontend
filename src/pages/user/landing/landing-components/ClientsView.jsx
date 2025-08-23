import React, { useEffect, useState, useRef } from "react";
import { getAllClientsApi } from "../../../../apis/api";
import { FaGlobe, FaPhoneAlt, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X } from "lucide-react";

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

const ClientCard = ({ client, index, onClick }) => {
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
        stiffness: 80, // lower = softer spring
        damping: 15, // lower = more bounce
        mass: 0.8, // smaller = lighter, faster bounce
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

export const ClientsView = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const fbContainerRef = useRef(null);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";

    try {
      const parsedUrl = new URL(url);
      let videoId = "";

      // Handle different YouTube URL formats
      if (parsedUrl.hostname === "youtu.be") {
        videoId = parsedUrl.pathname.slice(1); // after slash
      } else if (parsedUrl.hostname.includes("youtube.com")) {
        videoId = parsedUrl.searchParams.get("v");
      }

      if (!videoId) return "";

      // Handle start time (t=470s)
      const start = parsedUrl.searchParams.get("t");
      let startSeconds = 0;
      if (start) {
        if (start.endsWith("s")) {
          startSeconds = parseInt(start.replace("s", ""), 10);
        } else {
          startSeconds = parseInt(start, 10);
        }
      }

      return `https://www.youtube.com/embed/${videoId}${
        startSeconds ? `?start=${startSeconds}` : ""
      }`;
    } catch (error) {
      console.error("Invalid YouTube URL:", url, error);
      return "";
    }
  };

  // Which media items exist
  const mediaItems = [
    selectedClient?.clientImage && "image",
    selectedClient?.ytVideoUrl && "youtube",
    selectedClient?.fbVideoUrl && "facebook",
  ].filter(Boolean);

  const isSingleMedia = mediaItems.length === 1;

  // Load Facebook SDK once
  useEffect(() => {
    if (!window.FB) {
      const script = document.createElement("script");
      script.src =
        "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => window.FB && window.FB.XFBML.parse();
    }
  }, []);

  // Parse FB videos whenever modal opens
  useEffect(() => {
    if (selectedClient && window.FB && fbContainerRef.current) {
      window.FB.XFBML.parse(fbContainerRef.current);
    }
  }, [selectedClient]);

  const fetchClients = async () => {
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
  };

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
          <p className="text-2xl lg:text-4xl mt-3 font-bold text-[#262a2b]">
            Trusted partners we proudly work with
          </p>
        )}
      </div>

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
            <ClientCard
              client={client}
              index={index}
              key={client._id}
              onClick={(client) => {
                // If client has media, open modal
                if (
                  client.clientImage ||
                  client.ytVideoUrl ||
                  client.fbVideoUrl
                ) {
                  setSelectedClient(client);
                } else if (client.website) {
                  window.open(client.website, "_blank");
                }
              }}
            />
          ))
        ) : (
          <p className="text-gray-500 text-xl font-semibold text-center mt-10 col-span-full">
            No clients found.
          </p>
        )}
      </div>

      <AnimatePresence>
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedClient(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedClient(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition shadow-md"
              >
                <X size={24} />
              </button>

              {/* Header */}
              <div className="px-8 py-3 bg-[#02153b] text-white flex flex-col gap-1 rounded-t-2xl">
                <h2 className="text-xl font-semibold lg:font-bold">
                  A Proud Partnership with {selectedClient.name}
                </h2>
                {selectedClient.website && (
                  <a
                    href={selectedClient.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-white underline underline-offset-2"
                  >
                    Visit Website
                  </a>
                )}
              </div>

              {/* Content */}
              <div className="px-8 lg:px-10 py-6 max-h-[80vh] overflow-y-auto">
                <div className="w-full">
                  {mediaItems.length === 3 ? (
                    // layout when all three exist
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left column: Image + YouTube stacked */}
                      <div className="flex flex-col gap-6">
                        {/* Client Image */}
                        {selectedClient.clientImage && (
                          <div className="w-full flex justify-center">
                            <img
                              src={selectedClient.clientImage}
                              alt={selectedClient.name}
                              className="w-full max-h-[400px] object-cover rounded-lg shadow-lg"
                            />
                          </div>
                        )}

                        {/* YouTube Video */}
                        {selectedClient.ytVideoUrl && (
                          <div className="w-full">
                            <div className="relative w-full aspect-video">
                              <iframe
                                src={getYouTubeEmbedUrl(
                                  selectedClient.ytVideoUrl
                                )}
                                title="YouTube Video"
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-600 text-center">
                              If the YouTube video doesn’t appear,{" "}
                              <a
                                href={selectedClient.ytVideoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-600 hover:text-blue-800"
                              >
                                open it in a new tab
                              </a>
                              .
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right column: Facebook video */}
                      <div className="w-full">
                        <div
                          ref={fbContainerRef}
                          className="w-full aspect-video"
                        >
                          <div
                            className="fb-video w-full rounded-lg"
                            data-href={selectedClient.fbVideoUrl}
                            data-show-text="false"
                            style={{ border: "none", overflow: "hidden" }}
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-600 text-center">
                          If the Facebook video doesn’t appear,{" "}
                          <a
                            href={selectedClient.fbVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600 hover:text-blue-800"
                          >
                            open it in a new tab
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`grid gap-5 justify-center ${
                        mediaItems.length === 1
                          ? "grid-cols-1 justify-items-center"
                          : "grid-cols-1 md:grid-cols-2"
                      }`}
                    >
                      {/* Client Image */}
                      {selectedClient.clientImage && (
                        <div className="w-full flex justify-center">
                          <img
                            src={selectedClient.clientImage}
                            alt={selectedClient.name}
                            className="w-full max-h-[500px] object-contain rounded-lg shadow-lg"
                          />
                        </div>
                      )}

                      {/* YouTube Video */}
                      {selectedClient.ytVideoUrl && (
                        <div className="w-full max-w-xl">
                          <div className="relative w-full aspect-video">
                            <iframe
                              src={getYouTubeEmbedUrl(
                                selectedClient.ytVideoUrl
                              )}
                              title="YouTube Video"
                              className="absolute top-0 left-0 w-full h-full rounded-lg"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-600 text-center">
                            If the YouTube video doesn’t appear,{" "}
                            <a
                              href={selectedClient.ytVideoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-blue-600 hover:text-blue-800"
                            >
                              open it in a new tab
                            </a>
                            .
                          </p>
                        </div>
                      )}

                      {/* Facebook Video */}
                      {selectedClient.fbVideoUrl && (
                        <div className="w-full max-w-xl">
                          <div
                            ref={fbContainerRef}
                            className="w-full aspect-video"
                          >
                            <div
                              className="fb-video w-full rounded-lg"
                              data-href={selectedClient.fbVideoUrl}
                              data-show-text="false"
                              style={{ border: "none", overflow: "hidden" }}
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-600 text-center">
                            If the Facebook video doesn’t appear,{" "}
                            <a
                              href={selectedClient.fbVideoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-blue-600 hover:text-blue-800"
                            >
                              open it in a new tab
                            </a>
                            .
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
