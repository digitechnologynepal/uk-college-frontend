import { useEffect, useState } from "react";
import ContentView from "react-froala-wysiwyg/FroalaEditorView";
import { Link } from "react-router-dom";
import { getAllNewsApi } from "../../../../apis/api";
import moment from "moment";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const SkeletonRecentNews = () => (
  <section
    className="pb-32 px-4 max-w-6xl mx-auto animate-pulse"
    aria-label="Loading recent news"
  >
    {/* Header skeleton */}
    <div className="text-center mb-12">
      <div className="mx-auto h-10 w-48 bg-gray-200 rounded mb-4" />
      <div className="mx-auto h-6 w-96 bg-gray-200 rounded" />
    </div>

    {/* Grid skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {[...Array(3)].map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl overflow-hidden shadow-lg bg-white"
          aria-hidden="true"
        >
          {/* Image skeleton */}
          <div className="relative w-full h-[220px] bg-gray-200" />

          {/* Content skeleton */}
          <div className="p-6 flex flex-col gap-3">
            <div className="h-6 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="mt-4 h-9 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const RecentNewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getAllNewsApi();
        if (response?.data?.success) {
          setNews(response.data.result.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <SkeletonRecentNews />;
  if (news.length === 0) return null;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="pb-20 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-bold lg:font-extrabold text-[#262a2b]">
          Recent News
        </h2>
        <p className="font-medium mt-4 text-md lg:text-xl text-gray-600 max-w-3xl mx-auto">
          Stay updated with our latest announcements and insights.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {news.map((item) => (
          <motion.div
            key={item._id}
            variants={cardVariants}
            className="rounded-xl overflow-hidden shadow-lg bg-white group "
          >
            {/* Image */}
            <div className="relative w-full h-[220px] overflow-hidden">
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white text-[#204081] px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                {moment(item.createdAt).format("MMM DD")}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-3">
              <h3 className="text-lg font-bold text-[#204081]">{item.title}</h3>
              <div className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[55px]">
                <ContentView
                  model={
                    item.description.length > 120
                      ? item.description.slice(0, 120) + "..."
                      : item.description
                  }
                />
              </div>

              <div>
                <Link
                  to={`/news-description/${item._id}`}
                  className="inline-flex items-center gap-2 text-sm text-white bg-[#204081] hover:bg-[#3c65b4] transition px-4 py-2 rounded-md"
                >
                  Read More <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
