import { useEffect, useState } from "react";
import { getAllGroupsApi } from "../../../../apis/api";
import { ErrorHandler } from "../../../../components/error/errorHandler";

const SkeletonGroup = () => {
  const items = Array(10).fill(0);

  return (
    <section className="pb-24 relative">
      <div className="flex flex-col items-center">
        <div className="w-[30%] h-24 bg-gray-200 animate-pulse mb-4 rounded-lg" />
        <div className="w-[90%] max-w-5xl h-6 bg-gray-200 animate-pulse rounded mb-4" />
        <div className="w-[90%] max-w-5xl h-6 bg-gray-200 animate-pulse rounded mb-4" />
        <div className="w-[90%] max-w-5xl h-6 bg-gray-200 animate-pulse rounded mb-4" />
        <div className="w-48 h-8 bg-gray-200 animate-pulse rounded mb-6" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-3 flex flex-col items-center animate-fadeIn animate-pulse"
            >
              <div className="w-full h-28 bg-gray-200 rounded mb-2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Group = () => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await getAllGroupsApi();
        if (res?.data?.success && res.data.result.length > 0) {
          setGroup(res.data.result[0]);
        }
      } catch (err) {
        ErrorHandler(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) return <SkeletonGroup />;
  if (!group || group.items.length === 0) return null;

   const handleRedirect = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
   <section className="pb-24 relative">
      {/* Static parent image and intro */}
      <div className="flex flex-col">
        <div className="flex justify-center">
          <img
            src={`${process.env.REACT_APP_API_URL}${group.mainImage}`}
            alt={group.mainTitle}
            className={`w-[80%] lg:w-[30%] md:w-[60%] object-cover mb-6 ${
              group.mainWebsite ? "cursor-pointer" : ""
            }`}
            onClick={() => handleRedirect(group.mainWebsite)}
          />
        </div>
        <p className="text-[16px] max-w-6xl mx-auto sm:text-lg md:text-xl leading-relaxed text-justify text-[#262a2b] mb-10">
          {group.mainDescription}
        </p>
        <p className="text-center text-3xl font-bold text-[#262a2b]">
          {group.mainTitle}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {group.items.map((item, i) => (
            <div
              key={i}
              className={`bg-white rounded-lg shadow-lg p-3 flex flex-col items-center hover:shadow-lg transition ${
                item.website ? "cursor-pointer hover:shadow-red-500/60" : ""
              }`}
              onClick={() => handleRedirect(item.website)}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}${item.image}`}
                title={item.website}
                alt={item.name}
                className="w-full h-28 object-contain mb-2"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

