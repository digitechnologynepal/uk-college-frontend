import { useEffect, useState, useRef } from "react";
import { getAllGalleryContentsApi, getCategoriesApi } from "../../../apis/api";
import { ErrorHandler } from "../../../components/error/errorHandler";
import { Dot, Maximize, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const SkeletonGallery = () => (
  <div>
    <div className="flex items-center gap-3 mb-5">
      <div className="bg-gray-200 rounded-lg w-48 h-10" />
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

export const GalleryView = () => {
  const [galleryList, setGalleryList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [loading, setLoading] = useState(true);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const canHover = useCanHover();

  // Fetch gallery contents
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

  // Fetch gallery categories
  const fetchCategories = async () => {
    try {
      const res = await getCategoriesApi("gallery");
      if (res?.data?.success) {
        const fetched = (res.data.data || []).filter((c) => !c.isDeleted);
        setCategories(fetched);
      }
    } catch (err) {
      console.error("Error fetching gallery categories:", err);
    }
  };

  useEffect(() => {
    fetchGallery();
    fetchCategories();
  }, []);

  // Dropdown close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation in modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowLeft" && selectedIndex > 0)
        setSelectedIndex((prev) => prev - 1);
      else if (
        e.key === "ArrowRight" &&
        selectedIndex < filteredGallery.length - 1
      )
        setSelectedIndex((prev) => prev + 1);
      else if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, galleryList]);

  // Detect desktop
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    const resizeHandler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  // Filter logic
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };
  const clearAll = () => setSelectedCategories([]);

  const filteredGallery =
    selectedCategories.length === 0
      ? galleryList
      : galleryList.filter((item) =>
          selectedCategories.includes(item.categoryTitle)
        );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGallery = filteredGallery.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredGallery.length / itemsPerPage);
  const selectedContent =
    selectedIndex !== null ? filteredGallery[selectedIndex] : null;

  return (
    <main>
      <div className="pt-32 pb-20 px-4 md:px-[6vw] xl:px-[8vw]">
        {loading ? (
          <SkeletonGallery />
        ) : galleryList.length === 0 ? (
          // No content at all
          <div className="flex flex-col items-center justify-center w-full p-6">
            <Lottie
              animationData={animationData}
              loop
              autoplay
              className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
            />
            <p className="mt-4 text-xl text-gray-500 font-medium text-center">
              No content available at the moment.
              <br />
              New content is on the way — don't miss it!
            </p>
          </div>
        ) : (
          // Content exists
          <div className="flex flex-col">
            {/* Heading */}
            <p className="text-left text-2xl lg:text-4xl font-bold mb-5 text-[#262a2b] flex items-center gap-3">
              Gallery
              <span className="inline-flex px-3 py-1 items-center justify-center text-lg font-bold bg-[#e7efff] text-[#204081] shadow-sm rounded-full">
                {filteredGallery.length}
              </span>
            </p>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-4 py-2 border rounded-lg bg-white flex items-center gap-2 text-[#204081] hover:bg-gray-100"
                >
                  Filters <ChevronDown size={16} />
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 p-3 flex flex-col gap-2">
                    {categories.map((cat) => (
                      <label
                        key={cat.title}
                        className="flex items-center gap-2 text-[#204081]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.title)}
                          onChange={() => toggleCategory(cat.title)}
                          className="w-4 h-4 accent-[#204081]"
                        />
                        {cat.title}
                      </label>
                    ))}
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="mt-2 px-2 py-1 text-sm text-white bg-[#204081] rounded hover:bg-[#3c65b4]"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="flex items-center gap-1 bg-[#e7efff] text-[#204081] px-3 py-1 rounded-full text-sm"
                  >
                    {cat}
                    <button onClick={() => toggleCategory(cat)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Show Lottie if filter returns empty */}
            {filteredGallery.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full">
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                  className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
                />
                <p className="text-xl text-gray-500 font-medium text-center">
                  No content matches your filter selection.
                </p>
              </div>
            ) : (
              <>
                {/* Gallery Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-1 lg:gap-3 sm:gap-1">
                  {currentGallery.map((item, index) => {
                    const globalIndex = indexOfFirstItem + index;
                    return (
                      <div
                        key={item._id}
                        onClick={() => setSelectedIndex(globalIndex)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-300
                          ${
                            canHover && isDesktop ? "group hover:shadow-xl" : ""
                          }`}
                      >
                        {/* Image / Video */}
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

                        {/* Hover overlay */}
                        {canHover && isDesktop && (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
                              <Maximize className="text-white" />
                              <span className="text-white ml-2 font-semibold text-md">
                                Click to expand
                              </span>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="flex items-center text-xs text-white ">
                                <p className="font-bold">
                                  {item.fileType === "video"
                                    ? "Video"
                                    : "Image"}
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
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
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
              </>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
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
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 z-20"
              >
                <X />
              </button>

              {selectedIndex > 0 && (
                <button
                  onClick={() => setSelectedIndex((prev) => prev - 1)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
                >
                  ◀
                </button>
              )}

              {selectedIndex < filteredGallery.length - 1 && (
                <button
                  onClick={() => setSelectedIndex((prev) => prev + 1)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
                >
                  ▶
                </button>
              )}

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
                <h2 className="text-sm lg:text-2xl md:text-lg font-semibold text-white">
                  {selectedContent.name}
                </h2>

                {selectedContent.tags && selectedContent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedContent.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-white py-1 rounded font-bold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
