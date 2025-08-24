import { useEffect, useState } from "react";
import { getMottoApi } from "../../../apis/api";
import { Group } from "./SoftEd";
import { TeamMembers } from "../aboutus/TeamMembers";
import { TbTargetArrow } from "react-icons/tb";
import { ArrowUp, FileText, X } from "lucide-react";
import { MottoSection } from "./MottoSection";

const SkeletonAboutSection = () => (
  <section className="py-24 max-w-6xl mx-auto w-full animate-pulse">
    {/* Title */}
    <div className="mb-10">
      <div className="h-12 w-1/3 rounded bg-gray-100 shadow-inner mx-auto" />
    </div>

    {/* Image + Text Grid */}
    <div className="flex flex-col lg:flex-row items-start gap-8">
      {/* Left - heading + description placeholder */}
      <div className="lg:w-2/3 p-8 mr-10 rounded-xl bg-gray-100 flex flex-col space-y-4">
        <div className="h-6 w-2/3 rounded bg-gray-200" />
        <div className="space-y-3 mt-4">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-4 w-4/6 rounded bg-gray-200" />
          <div className="h-4 w-3/6 rounded bg-gray-200" />
        </div>
      </div>

      {/* Right - stacked image placeholders */}
      <div className="flex flex-col gap-4 lg:w-1/3 w-full">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-lg shadow-md bg-[#e7efff] w-full h-[180px] sm:h-[220px]"
          />
        ))}
      </div>
    </div>
  </section>
);

const SkeletonMottoSection = () => (
  <section className="w-full pb-24">
    {/* Title placeholder */}
    <div className="h-12 w-5/6 bg-gray-200 rounded mx-auto mb-5" />
    <div className="h-12 w-3/6 bg-gray-200 rounded mx-auto mb-10" />

    {/* Cards grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Mission card skeleton */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-200" />
        <div className="h-6 w-1/2 bg-gray-200 rounded mx-auto mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
        </div>
      </div>

      {/* Vision card skeleton */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-200" />
        <div className="h-6 w-1/2 bg-gray-200 rounded mx-auto mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  </section>
);

export const About = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [team, setTeam] = useState([]);
  const [mottoData, setMottoData] = useState(null);
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchMottoData = async () => {
      try {
        const response = await getMottoApi();
        if (response.data.success) {
          setMottoData(response.data.result);
        } else {
          console.error("Failed to fetch motto data.");
        }
      } catch (error) {
        console.error("Error fetching motto data:", error);
      }
    };

    fetchMottoData();
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/aboutus/get`)
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setData(json.result);
        } else {
          throw new Error("Failed to fetch data");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/team`)
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setTeam(json.result);
        } else {
          throw new Error("Failed to fetch team members");
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/institutionprofile/get`)
      .then((response) => response.json())
      .then((json) => {
        if (json.success && json.result?.certificate) {
          setCertificateUrl(
            `${process.env.REACT_APP_API_URL}/uploads/${json.result.certificate}`
          );
        }
      })
      .catch((err) => console.error("Error fetching certificate:", err));
  }, []);

  if (loading) return <SkeletonAboutSection />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="w-full flex flex-col items-center">
      {/* Main Content */}
      <div className="pt-32 pb-20 px-6 md:px-[6vw] xl:px-[8vw]">
        <div className="flex flex-col max-w-6xl mx-auto">
          <section className="pb-24">
            <div>
              <p className="relative text-center text-3xl sm:text-4xl font-bold lg:font-extrabold text-[#262a2b] mb-0 md:mb-3 lg:mb-5">
                {data?.title}
              </p>
            </div>

            {/* Image + Text Grid */}
            <div className="flex flex-col lg:flex-row items-start">
              {/* Left - Description */}
              <div className="py-8 lg:p-8 mr-0 lg:mr-10 rounded-xl lg:w-2/3 flex items-center">
                <div
                  className="text-base sm:text-lg lg:text-xl text-[#262a2b] leading-relaxed text-justify"
                  dangerouslySetInnerHTML={{ __html: data?.description || "" }}
                />
              </div>

              {/* Right - Images stacked vertically */}
              <div className="flex flex-col gap-2 lg:w-1/3 w-full">
                {data?.image?.map((img, idx) => (
                  <img
                    key={idx}
                    src={`${process.env.REACT_APP_API_URL}/uploads/${img}`}
                    alt={`About Image ${idx + 1}`}
                    className="rounded-lg shadow-md object-cover w-full h-[180px] sm:h-[220px]"
                  />
                ))}
              </div>
            </div>
          </section>

          <MottoSection mottoData={mottoData} />
          <Group />
          <TeamMembers teamMembers={team} />
        </div>
      </div>

      {certificateUrl && (
        <div
          className="fixed bottom-6 right-4 z-50 flex flex-col items-end group"
          aria-label="Certificate of Authorization Tooltip and Button"
        >
          {/* Tooltip + Close button for mobile/tablet */}
          {(tooltipVisible || !isMobile) && (
            <div
              className={`
          relative mb-3 w-max max-w-xs text-right
          ${
            isMobile
              ? "opacity-90 translate-y-0 transition-all duration-300"
              : "lg:opacity-0 lg:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          }
        `}
              style={{ pointerEvents: "none" }}
            >
              <span className="bg-[#02153b] text-white text-sm px-3 py-1 rounded-md shadow-lg whitespace-nowrap inline-block">
                View Sample Certificate <br />
                of Authorization
              </span>
              {/* Tooltip Arrow */}
              <span
                className="absolute right-8 -bottom-1 w-0 h-0
          border-l-[6px] border-r-[6px] border-t-[6px]
          border-l-transparent border-r-transparent border-t-[#02153b]"
              ></span>

              {/* Close button - only on mobile/tablet */}
              {isMobile && (
                <button
                  aria-label="Close tooltip"
                  onClick={() => setTooltipVisible(false)}
                  className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-[#204081] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border border-white"
                  style={{ pointerEvents: "auto" }}
                  type="button"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          )}

          {/* Show arrow-up button when tooltip hidden on mobile/tablet */}
          {!tooltipVisible && isMobile && (
            <button
              aria-label="Show tooltip"
              onClick={() => setTooltipVisible(true)}
              className="bg-[#204081] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg border border-white"
              type="button"
              style={{ pointerEvents: "auto" }}
            >
              <ArrowUp size={18} />
            </button>
          )}

          {/* Certificate Button */}
          <button
            aria-label="Certificate of Authorization"
            className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#2d5ab4] hover:bg-[#3d69c3] text-white drop-shadow-xl transition-colors"
            onClick={() => window.open(certificateUrl, "_blank")}
          >
            <FileText size={32} />
          </button>
        </div>
      )}
    </section>
  );
};

export default About;
