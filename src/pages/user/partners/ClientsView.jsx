import React, { useEffect, useState, useRef } from "react";
import { getAllClientsApi } from "../../../apis/api";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ClientCard, SkeletonCard } from "../partners/ClientCard";
import { X } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../assets/animations/no-data.json";

const SkeletonClients = () => (
  <div className="w-full">
    {/* Heading */}
    <div className="animate-pulse">
      <div className="h-8 sm:h-10 md:h-12 w-64 sm:w-80 md:w-96 mx-auto bg-gray-200 rounded mb-4 mt-[1.78rem]" />
      <div className="h-5 w-72 sm:w-80 md:w-96 mx-auto bg-gray-200 rounded" />
    </div>

    {/* Search */}
    <div className="max-w-xl mx-auto my-7">
      <div className="animate-pulse h-12 w-full rounded-full bg-gray-200" />
    </div>

    {/* Cards */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-7 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export const ClientsView = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true); // default true
  const [selectedClient, setSelectedClient] = useState(null);

  const fbContainerRef = useRef(null);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    try {
      const parsedUrl = new URL(url);
      let videoId = "";
      if (parsedUrl.hostname === "youtu.be") {
        videoId = parsedUrl.pathname.slice(1);
      } else if (parsedUrl.hostname.includes("youtube.com")) {
        videoId = parsedUrl.searchParams.get("v");
      }
      if (!videoId) return "";
      const start = parsedUrl.searchParams.get("t");
      const startSeconds = start
        ? parseInt(start.replace("s", ""), 10) || 0
        : 0;
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
    <section className="py-28 px-6 md:px-[6vw] xl:px-[8vw]">
      {isLoading ? (
        <SkeletonClients />
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full">
          <Lottie
            animationData={animationData}
            loop
            autoplay
            className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
          />
          <p className="text-gray-500 text-xl font-semibold text-center mt-6">
            No data found.
            <br /> Please check back soon!
          </p>
        </div>
      ) : (
        <>
          {/* Heading */}
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-2xl lg:text-4xl mt-3 font-bold text-[#262a2b]">
              Trusted partners we proudly work with
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-4 lg:mx-auto md:mx-auto my-7 relative">
            <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 font-semibold rounded-full border border-gray-200 focus:ring-1 focus:ring-[#204081] focus:outline-none shadow-sm transition-all duration-300"
            />
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-7 max-w-7xl">
            {filteredClients.length > 0 ? (
              filteredClients.map((client, index) => (
                <ClientCard
                  client={client}
                  index={index}
                  key={client._id}
                  onClick={(client) => {
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
              <div className="flex flex-col items-center justify-center w-full col-span-full">
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                  className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
                />
                <p className="text-gray-500 text-xl font-semibold text-center mt-6">
                  No partners match your search.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal */}
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
              <button
                onClick={() => setSelectedClient(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition shadow-md"
              >
                <X size={24} />
              </button>

              <div className="px-8 py-3 bg-[#02153b] text-white flex flex-col gap-1 rounded-t-2xl">
                <h2 className="text-base md:text-lg lg:text-xl font-semibold lg:font-bold">
                  A Proud Partnership with {selectedClient.name}
                </h2>
                {selectedClient.website && (
                  <a
                    href={selectedClient.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-normal lg:font-semibold text-white underline underline-offset-2"
                  >
                    Visit Website
                  </a>
                )}
              </div>

              <div className="px-8 lg:px-10 py-6 max-h-[80vh] overflow-y-auto">
                <div className="w-full">
                  {mediaItems.length === 3 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-6">
                        {selectedClient.clientImage && (
                          <div className="w-full flex justify-center">
                            <img
                              src={selectedClient.clientImage}
                              alt={selectedClient.name}
                              className="w-full max-h-[400px] object-cover rounded-lg shadow-md "
                            />
                          </div>
                        )}
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
                          </div>
                        )}
                      </div>
                      <div className="w-full">
                        <div
                          ref={fbContainerRef}
                          className="w-full aspect-video"
                        >
                          <div
                            className="fb-video w-full rounded-lg"
                            data-href={selectedClient.fbVideoUrl}
                            data-show-text="false"
                          />
                        </div>
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
                      {selectedClient.clientImage && (
                        <div className="w-full flex justify-center">
                          <img
                            src={selectedClient.clientImage}
                            alt={selectedClient.name}
                            className="w-full max-h-[500px] object-contain rounded-lg shadow-md "
                          />
                        </div>
                      )}
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
                        </div>
                      )}
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
                            />
                          </div>
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
