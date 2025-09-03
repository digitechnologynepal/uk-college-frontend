import React, { useEffect, useState } from "react";
import { Maximize, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "../../../assets/animations/no-data.json";

const AlbumView = ({ galleryItems }) => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null); // for album modal
  const [selectedIndex, setSelectedIndex] = useState(null); // for item modal

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const canHover = window.matchMedia("(hover: hover)").matches;

  // Group items by album
  useEffect(() => {
    const grouped = galleryItems
      .filter((item) => item.albumTitle)
      .reduce((acc, item) => {
        if (!acc[item.albumTitle]) acc[item.albumTitle] = [];
        acc[item.albumTitle].push(item);
        return acc;
      }, {});

    // Filter out albums with only 1 item
    const filteredAlbums = Object.entries(grouped)
      .filter(([title, files]) => files.length > 1)
      .map(([title, files]) => ({ title, files }));

    setAlbums(filteredAlbums);
  }, [galleryItems]);

  // Update desktop detection on resize
  useEffect(() => {
    const resizeHandler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setSelectedIndex(null); // reset item selection
  };

  const handleItemClick = (index) => {
    setSelectedIndex(index);
  };

  const currentItem =
    selectedAlbum && selectedIndex !== null
      ? selectedAlbum.files[selectedIndex]
      : null;

  // Keyboard navigation in item modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedAlbum || selectedIndex === null) return;
      if (e.key === "ArrowLeft" && selectedIndex > 0)
        setSelectedIndex((prev) => prev - 1);
      else if (
        e.key === "ArrowRight" &&
        selectedIndex < selectedAlbum.files.length - 1
      )
        setSelectedIndex((prev) => prev + 1);
      else if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAlbum, selectedIndex]);

  return (
    <>
      {/* Albums Grid or Lottie when empty */}
      {albums.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full mt-10">
          <Lottie
            animationData={animationData}
            loop
            autoplay
            className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
          />
          <p className="text-sm lg:text-xl text-gray-500 font-medium text-center">
            No albums available.
            <br />
            New content is on the way — don't miss it!
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-1 lg:gap-3 sm:gap-1">
          {albums.map((album) => (
            <div
              key={album.title}
              className={`relative cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-300 ${
                canHover && isDesktop ? "group hover:shadow-xl" : ""
              }`}
              onClick={() => handleAlbumClick(album)}
            >
              {/* Cover Image/Video */}
              {album.files[0].fileType === "video" ? (
                <div className="relative">
                  <video
                    src={`${process.env.REACT_APP_API_URL}/uploads/${album.files[0].file}`}
                    className={`w-full h-40 lg:h-64 sm:h-40 object-cover transition-transform duration-300 ${
                      canHover && isDesktop ? "lg:group-hover:scale-105" : ""
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
                  src={`${process.env.REACT_APP_API_URL}/uploads/${album.files[0].file}`}
                  alt={album.title}
                  className={`w-full h-40 lg:h-64 sm:h-40 object-cover transition-transform duration-300 ${
                    canHover && isDesktop ? "lg:group-hover:scale-105" : ""
                  }`}
                />
              )}

              {/* Album title & count */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm px-2 py-1 flex justify-between items-center">
                <span>{album.title}</span>
                <span>{album.files.length} items</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Album Content Modal */}
      <AnimatePresence>
        {selectedAlbum && selectedIndex === null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
            onClick={() => setSelectedAlbum(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full mx-4 bg-[#030303] max-h-[80%] min-h-[60%] overflow-y-auto rounded-lg p-4"
            >
              <button
                onClick={() => setSelectedAlbum(null)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 z-20"
              >
                <X />
              </button>

              <h2 className="text-xl font-semibold mb-4 text-white">
                {selectedAlbum.title}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {selectedAlbum.files.map((item, idx) => (
                  <div
                    key={item._id}
                    className="w-50 h-full relative cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl"
                    onClick={() => handleItemClick(idx)}
                  >
                    {item.fileType === "video" ? (
                      <div>
                        <video
                          src={`${process.env.REACT_APP_API_URL}/uploads/${item.file}`}
                          className="h-max object-cover"
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
                        className="h-max object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Item Modal */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#030303] bg-opacity-80 z-50 flex items-center justify-center"
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

              {selectedIndex < selectedAlbum.files.length - 1 && (
                <button
                  onClick={() => setSelectedIndex((prev) => prev + 1)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
                >
                  ▶
                </button>
              )}

              {currentItem.fileType === "video" ? (
                <video
                  src={`${process.env.REACT_APP_API_URL}/uploads/${currentItem.file}`}
                  className="w-full max-h-[80vh] object-contain bg-black"
                  controls
                />
              ) : (
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${currentItem.file}`}
                  alt={currentItem.name}
                  className="w-full max-h-[80vh] object-contain bg-black"
                />
              )}

              <div className="px-10 py-3 bg-gray-950">
                <h2 className="text-sm lg:text-2xl md:text-lg font-semibold text-white mb-2">
                  {selectedAlbum.title}
                </h2>

                {currentItem.date && (
                  <p className="text-white text-sm mb-1">
                    {new Date(currentItem.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}

                {currentItem.tags && currentItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentItem.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-white rounded text-[10px] -my-1 lg:text-xs"
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
    </>
  );
};

export default AlbumView;
