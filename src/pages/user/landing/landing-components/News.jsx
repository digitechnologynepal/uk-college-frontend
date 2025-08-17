import { useEffect, useState, useRef } from "react";
import { getAllNewsApi, getCategoriesApi } from "../../../../apis/api";
import moment from "moment";
import { Link } from "react-router-dom";
import ContentView from "react-froala-wysiwyg/FroalaEditorView";
import Lottie from "lottie-react";
import animationData from "../../../../assets/animations/no-data.json";
import { ArrowRight, X, ChevronDown } from "lucide-react";

const SkeletonNews = () => (
  <div>
    <p className="text-left text-4xl font-bold mb-5 text-[#262a2b] flex items-center gap-3 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-32" />
      <div className="inline-flex px-3 py-1 bg-gray-200 rounded-full w-8 h-8" />
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-1 lg:gap-3 sm:gap-1">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl overflow-hidden shadow-lg bg-white animate-pulse"
        >
          <div className="w-full h-[200px] bg-gray-200" />
          <div className="p-6 flex flex-col gap-3">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="mt-4 h-8 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await getAllNewsApi();
        if (response?.data?.success) {
          setNews(response?.data?.result || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const res = await getCategoriesApi("newsEvents");
        if (res?.data?.success) {
          const fetched = (res.data.data || []).filter((c) => !c.isDeleted);
          setCategories(fetched);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }

    fetchCategories();
    fetchNews();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearAll = () => setSelectedCategories([]);

  const filteredNews =
    selectedCategories.length === 0
      ? news
      : news.filter((item) => selectedCategories.includes(item.categoryTitle));

  return (
    <section className="w-full flex flex-col">
      <div className="pt-32 pb-20 px-4 md:px-[6vw] xl:px-[8vw]">
        {loading ? (
          <SkeletonNews />
        ) : news.length > 0 ? (
          <>
            {/* Heading */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-3">
              <p className="text-left text-4xl font-bold text-[#262a2b] flex items-center gap-3">
                News and Events
                <span className="inline-flex px-3 py-1 items-center justify-center text-lg font-bold bg-[#e7efff] text-[#204081] shadow-sm rounded-full">
                  {filteredNews.length}
                </span>
              </p>
            </div>

            {/* Filters row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-4 py-2 border rounded-md bg-white flex items-center gap-5 text-[#204081] hover:bg-gray-100"
                >
                  Filters <ChevronDown size={16} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-20 lg:left-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50 p-3 flex flex-col gap-2">
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

              {/* Selected Pills */}
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

            {/* News Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-1 lg:gap-3 sm:gap-1">
              {filteredNews.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl overflow-hidden shadow-lg bg-white group transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative">
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${item?.image}`}
                      alt={item.title}
                      className="w-full h-[200px] object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white text-[#204081] px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                      {moment(item.createdAt).format("MMM DD")}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col gap-3">
                    <h3 className="text-lg font-bold text-[#204081] transition duration-200">
                      {item.title}
                    </h3>
                    <div className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      <ContentView
                        model={
                          item.description.length > 120
                            ? item.description.slice(0, 120) + "..."
                            : item.description
                        }
                      />
                    </div>

                    <div className="mt-4">
                      <Link
                        to={`/news-description/${item._id}`}
                        className="inline-flex items-center gap-2 text-sm text-white bg-[#204081] hover:bg-[#3c65b4] transition px-4 py-2 rounded-md"
                      >
                        Read More <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full p-6">
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
            />
            <p className="mt-4 text-xl text-gray-500 font-medium">
              No news or events available at the moment.
              <br />
              New content is on the way — don't miss it!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
