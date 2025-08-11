import { useEffect, useState } from "react";
import { getAllGalleryContentsApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";
import { Dot, Maximize, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../../../assets/animations/no-data.json";

// Hook to detect hover capability
function useCanHover() {
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    const hoverMQ = window.matchMedia("(hover: hover)");
    setCanHover(hoverMQ.matches);
    const listener = (e) => setCanHover(e.matches);
    hoverMQ.addEventListener("change", listener);
    return () => hoverMQ.removeEventListener("change", listener);
  }, []);
  return canHover;
}

const SkeletonGallery = () => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-gray-200 rounded-md w-48 h-10" />
        <div className="bg-gray-200 rounded-full w-12 h-12" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-1 lg:gap-3 sm:gap-1 animate-pulse">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="relative rounded-lg overflow-hidden bg-gray-200 h-40 lg:h-64 sm:h-40"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gray-200 opacity-30" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const GalleryView = () => {
  const [galleryList, setGalleryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGallery = galleryList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(galleryList.length / itemsPerPage);

  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selectedContent =
    selectedIndex !== null ? galleryList[selectedIndex] : null;
  const canHover = useCanHover();

  const fetchGallery = async () => {
    try {
      const res = await getAllGalleryContentsApi();
      if (res?.data?.success) {
        setGalleryList(res.data.result || []);
      }
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowLeft" && selectedIndex > 0) {
        setSelectedIndex((prev) => prev - 1);
      } else if (
        e.key === "ArrowRight" &&
        selectedIndex < galleryList.length - 1
      ) {
        setSelectedIndex((prev) => prev + 1);
      } else if (e.key === "Escape") {
        setSelectedIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, galleryList.length]);

  // Helper to detect desktop size (>= 1024px)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    const resizeHandler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <main>
      <div className="pt-32 pb-20 px-4 md:px-[6vw] xl:px-[8vw]">
        {loading ? (
          <SkeletonGallery />
        ) : galleryList.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full p-6">
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
            />

            <p className="mt-4 text-xl text-gray-500 font-medium">
              No content available at the moment.
              <br />
              New content is on the way — don't miss it!
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-left text-2xl lg:text-4xl font-bold mb-5 text-[#262a2b] flex items-center gap-3">
              Gallery
              <span className="inline-flex px-3 py-1 items-center justify-center text-lg font-bold bg-[#e7efff] text-[#204081] shadow-sm rounded-full">
                {galleryList.length}
              </span>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-1 lg:gap-3 sm:gap-1">
              {currentGallery.map((item, index) => {
                const globalIndex = indexOfFirstItem + index;
                return (
                  <div
                    key={item._id}
                    onClick={() => setSelectedIndex(globalIndex)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-300
                  ${canHover && isDesktop ? "group hover:shadow-xl" : ""}
                `}
                  >
                    {/* Image */}
                    {item.fileType === "video" ? (
                      <div>
                        <video
                          src={`${process.env.REACT_APP_API_URL}/uploads/${item.file}`}
                          className={`w-full h-40 lg:h-64 sm:h-40 object-cover transition-transform duration-300 ${
                            canHover && isDesktop
                              ? "lg:group-hover:scale-105"
                              : ""
                          }`}
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg
                            className="w-12 h-12 text-white bg-black bg-opacity-50 rounded-full p-2"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${item.file}`}
                        alt={item.name}
                        className={`w-full h-40 lg:h-64 sm:h-40 object-cover transition-transform duration-300 ${
                          canHover && isDesktop
                            ? "lg:group-hover:scale-105"
                            : ""
                        }`}
                      />
                    )}

                    {/* Hover Overlay & Text - only if device can hover and desktop */}
                    {canHover && isDesktop && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
                          <Maximize className="text-white" />
                          <span className="text-white ml-2 font-semibold text-md ">
                            Click to expand
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center text-xs text-white ">
                            <p className="font-bold">
                              {item.fileType === "video" ? "Video" : "Image"}
                            </p>
                            <Dot />
                            <p>
                              {item.date
                                ? new Date(item.date).toLocaleDateString(
                                    undefined,
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )
                                : "No date provided"}
                            </p>
                          </div>

                          <h3 className="text-white text-md md:text-xl font-semibold mb-1">
                            {item.name}
                          </h3>
                        </div>
                      </>
                    )}

                    {/* Static white info bar on mobile/tablet or no hover devices */}
                    {/* {(!canHover || !isDesktop) && (
                  <div className="absolute bottom-0 left-0 right-0 z-10 bg-white px-4 py-2">
                    <h3 className="text-gray-900 text-sm font-semibold truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {item.date
                        ? new Date(item.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "No date provided"}
                    </p>
                  </div>
                )} */}
                  </div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-full font-semibold ${
                        currentPage === pageNum
                          ? "bg-[#204081] text-white"
                          : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full mx-4 bg-white overflow-hidden rounded-lg"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 z-20"
              >
                <X />
              </button>

              {/* Left Button */}
              {selectedIndex > 0 && (
                <button
                  onClick={() => setSelectedIndex((prev) => prev - 1)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
                >
                  ◀
                </button>
              )}

              {/* Right Button */}
              {selectedIndex < galleryList.length - 1 && (
                <button
                  onClick={() => setSelectedIndex((prev) => prev + 1)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
                >
                  ▶
                </button>
              )}

              {/* Image */}
              {selectedContent.fileType === "video" ? (
                <video
                  src={`${process.env.REACT_APP_API_URL}/uploads/${selectedContent.file}`}
                  className="w-full max-h-[80vh] object-contain bg-black"
                  controls
                />
              ) : (
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${selectedContent.file}`}
                  alt={selectedContent.name}
                  className="w-full max-h-[80vh] object-contain bg-black"
                />
              )}

              {/* Info */}
              <div className="px-10 py-3 bg-gray-950">
                {selectedContent.date && (
                  <p className="text-white text-sm mb-1">
                    {new Date(selectedContent.date).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                )}
                <h2 className="text-sm lg:text-xl md:text-lg font-semibold text-white">
                  {selectedContent.name}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
