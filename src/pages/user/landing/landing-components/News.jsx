import { useEffect, useState } from "react";
import { getAllNewsApi } from "../../../../apis/api";
import moment from "moment";
import { Link } from "react-router-dom";
import ContentView from "react-froala-wysiwyg/FroalaEditorView";
import Lottie from "lottie-react";
import animationData from "../../../../assets/animations/no-data.json";
import { ArrowRight } from "lucide-react";

const SkeletonNews = () => (
  <div>
    {/* Heading skeleton */}
    <p className="text-left text-4xl font-bold mb-5 text-[#262a2b] flex items-center gap-3 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-32" />
      <div className="inline-flex px-3 py-1 bg-gray-200 rounded-full w-8 h-8" />
    </p>

    {/* Cards skeleton */}
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-1 lg:gap-3 sm:gap-1">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl overflow-hidden shadow-lg bg-white animate-pulse"
          aria-hidden="true"
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

  async function fetchNews() {
    try {
      const response = await getAllNewsApi();
      if (response?.data?.success) {
        setNews(response?.data?.result.slice(0, 3));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <section className="w-full flex flex-col">
      <div className="pt-32 pb-20 px-4 md:px-[6vw] xl:px-[8vw]">
        {loading ? (
          <SkeletonNews />
        ) : news.length > 0 ? (
          <>
            <p className="text-left text-4xl font-bold mb-5 text-[#262a2b] flex items-center gap-3">
              News
              <span className="inline-flex px-3 py-1 items-center justify-center text-lg font-bold bg-[#e7efff] text-[#204081] shadow-sm rounded-full">
                {news.length}
              </span>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-1 lg:gap-3 sm:gap-1">
              {news.map((item) => (
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
              No news available at the moment.
              <br />
              New content is on the way — don't miss it!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
