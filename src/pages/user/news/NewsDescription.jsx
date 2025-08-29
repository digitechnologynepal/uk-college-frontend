import moment from "moment";
import { useEffect, useState } from "react";
import ContentView from "react-froala-wysiwyg/FroalaEditorView";
import { useParams } from "react-router-dom";
import { getSingleNewsApi, getNewsBySlugApi } from "../../../apis/api";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { CalendarDays, LinkIcon } from "lucide-react";
import {
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

const SkeletonNewsDescription = () => (
  <div className="pb-28 pt-32 px-4 sm:px-6 bg-[#f9fafb] max-w-7xl mx-auto grid md:grid-cols-3 gap-10 animate-pulse">
    {/* Left: Main Article Skeleton */}
    <div className="md:col-span-2 space-y-6">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-10 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/4" />
      </div>

      {/* Hero Image Skeleton */}
      <div className="overflow-hidden rounded-lg shadow-md bg-gray-200 w-full h-[400px]" />

      {/* Description Skeleton */}
      <div className="space-y-4 mt-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>

    {/* Right: More News Skeleton */}
    <aside className="space-y-6">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-4 rounded-lg border bg-white p-2">
          <div className="w-24 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
          <div className="flex-1 flex flex-col justify-between gap-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mt-1" />
          </div>
        </div>
      ))}
    </aside>
  </div>
);

export const NewsDescription = () => {
  const { slug } = useParams();
  const [singleNews, setSingleNews] = useState({});
  const [otherNews, setOtherNews] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  async function fetchSingleNews() {
    try {
      const response = await getNewsBySlugApi(slug);
      if (response?.data?.success) {
        setSingleNews(response?.data?.result?.foundNews);
        setOtherNews(response?.data?.result?.remainingNews);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setInitialLoading(false);
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Link copied to clipboard!",
          showConfirmButton: false,
          timer: 1000,
          toast: true,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Failed to copy link. Please try manually.",
          showConfirmButton: true,
          toast: true,
          timer: 1000,
        });
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSingleNews();
  }, [slug]);

  if (initialLoading) {
    return <SkeletonNewsDescription />;
  }

  return (
    <div className="text-[#262a2b] pb-28 pt-32 px-4 sm:px-6">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        {/* Left: Main Article */}
        <div className="md:col-span-2 space-y-6">
          {/* Title and Date */}
          <div className="space-y-2">
            {singleNews.categoryTitle && (
              <div className="flex items-center gap-2 mb-5">
                <span className="h-10 w-1 bg-[#d91b1a]" />
                <p className="text-xl text-[#d91b1a] capitalize">
                  {singleNews.categoryTitle}
                </p>
              </div>
            )}
            <h1 className="text-xl lg:text-3xl font-bold text-[#262a2b]">
              {singleNews.title}
            </h1>

            <div className="flex items-center justify-between w-full">
              {/* Date Blob */}
              <div className="bg-[#ffe3e6] text-[#d91b1a] px-4 py-1 rounded-full font-semibold shadow-sm text-sm flex items-center gap-2 whitespace-nowrap">
                <CalendarDays size={18} />
                <span>
                  {moment(singleNews.createdAt).format("MMMM D, YYYY")}
                </span>
              </div>

              {/* Share Buttons */}
              {/* <div className="flex gap-2 items-center">
                <LinkedinShareButton
                  url={window.location.href}
                  title={singleNews.title}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0077b5] text-white hover:bg-[#088fd7] cursor-pointer">
                    <FaLinkedinIn size={16} />
                  </div>
                </LinkedinShareButton>

                <FacebookShareButton
                  url={window.location.href}
                  quote={singleNews.title}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:bg-[#378dff] cursor-pointer">
                    <FaFacebookF size={16} />
                  </div>
                </FacebookShareButton>

                <WhatsappShareButton
                  url={window.location.href}
                  title={singleNews.title}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#25d366] text-white hover:bg-[#2be870] cursor-pointer">
                    <FaWhatsapp size={16} />
                  </div>
                </WhatsappShareButton>

                <button
                  onClick={handleCopyLink}
                  aria-label="Copy link"
                  title="Copy link"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-[#262a2b] hover:bg-gray-200 cursor-pointer"
                >
                  <LinkIcon size={18} />
                </button>
              </div> */}
            </div>
          </div>

          {/* Image */}
          <div className="overflow-hidden rounded-lg shadow-md">
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${singleNews.image}`}
              alt={singleNews.title}
              className="w-full h-[400px] object-cover object-center"
            />
          </div>

          {/* Description */}
          <div className="text-justify prose max-w-none prose-p:text-gray-800 prose-headings:text-[#204081] prose-a:text-[#204081] prose-img:rounded-lg prose-img:shadow">
            <ContentView model={singleNews.description} />
            {singleNews.tags && singleNews.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-6">
                {singleNews.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[#204081] -my-1 rounded font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: More News */}
        {otherNews.length > 0 && (
          <aside className="space-y-6">
            <h2 className="text-lg font-semibold text-[#262a2b] border-b pb-2">
              More News
            </h2>
            <div className="grid gap-3">
              {otherNews.map((item) => (
                <Link
                  to={`/news-description/${item.slug}`}
                  key={item.slug}
                  className="flex gap-4 rounded-lg drop-shadow-sm hover:shadow-md border transition bg-white overflow-hidden"
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`}
                    alt={item.title}
                    className="w-24 h-full object-cover"
                  />
                  <div className="py-3 pr-4 flex flex-col justify-between gap-1">
                    <h3 className="text-sm font-bold text-[#204081] line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      <CalendarDays size={15} />{" "}
                      {moment(item.createdAt).format("MMM D, YYYY")}
                    </p>
                    <span className="text-xs font-medium text-[#204081] hover:underline mt-1">
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
