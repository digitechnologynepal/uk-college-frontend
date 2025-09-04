import { useEffect, useState } from "react";
import { getMottoApi } from "../../../apis/api";
import { Group } from "./SoftEd";
import { TeamMembers } from "../aboutus/TeamMembers";
import { FileBadge, FileBadge2 } from "lucide-react";
import { MottoSection } from "./MottoSection";
import { SlidingTooltip } from "./SlidingTooltip";

const SkeletonAboutSection = () => (
  <section className="py-24 max-w-6xl mx-auto w-full animate-pulse">
    {/* Title */}
    <div className="mb-10">
      <div className="h-12 w-1/3 rounded bg-gray-100 mx-auto" />
    </div>

    {/* Image + Text Grid */}
    <div className="flex flex-col lg:flex-row items-start gap-8">
      {/* Left - heading + description placeholder */}
      <div className="lg:w-2/3 p-8 mr-10 rounded-lg bg-gray-100 flex flex-col space-y-4">
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
            className="rounded-lg bg-gray-200 w-full h-[180px] sm:h-[220px]"
          />
        ))}
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
  const [institutionCertificateUrl, setInstitutionCertificateUrl] =
    useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const [tooltip2Visible, setTooltip2Visible] = useState(true);
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

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/institutionprofile/get`)
      .then((response) => response.json())
      .then((json) => {
        if (json.success && json.result?.institutionCertificate) {
          setInstitutionCertificateUrl(
            `${process.env.REACT_APP_API_URL}/uploads/${json.result.institutionCertificate}`
          );
        }
      })
      .catch((err) =>
        console.error("Error fetching institution certificate:", err)
      );
  }, []);

  if (loading || !data) return <SkeletonAboutSection />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="w-full flex flex-col items-center">
      {/* Main Content */}
      <div className="pt-32 pb-20 px-6 md:px-[6vw] xl:px-[8vw]">
        <div className="flex flex-col max-w-6xl mx-auto">
          <section className="pb-10 lg:pb-20">
            <div>
              <p className="relative text-center text-3xl sm:text-4xl font-bold lg:font-extrabold text-[#262a2b] mb-3 lg:mb-5">
                {data?.title}
              </p>
            </div>

            {/* Image + Text Grid */}
            <div className="flex flex-col lg:flex-row lg:items-center">
              {/* Left - Description */}
              <div className="py-0 lg:py-8 mr-0 lg:mr-10 rounded-lg lg:w-2/3">
                <div
                  className="text-base lg:text-lg text-[#262a2b] leading-relaxed text-justify"
                  dangerouslySetInnerHTML={{ __html: data?.description || "" }}
                />
              </div>

              {/* Right - Images stacked vertically */}
              <div className="flex flex-col gap-2 lg:w-1/3 w-full mt-5 lg:mt-0">
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

      {/* Certificate Buttons - Compact Group */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end">
        {/* Student Certificate */}
        {certificateUrl && (
          <div className="relative flex items-center mb-3">
            <button
              aria-label="View Student Certificate"
              className="flex items-center justify-center w-14 h-14 rounded-full bg-[#2d5ab4] hover:bg-[#3d69c3] text-white shadow-md transition-colors"
              onClick={() => window.open(certificateUrl, "_blank")}
            >
              <FileBadge2 size={30} />
            </button>

            <SlidingTooltip text="View Student Certificate" />
          </div>
        )}

        {institutionCertificateUrl && (
          <div className="relative flex items-center">
            <button
              aria-label="View Institution Certificate"
              className="flex items-center justify-center w-14 h-14 rounded-full bg-[#2d5ab4] hover:bg-[#3d69c3] text-white shadow-md transition-colors"
              onClick={() => window.open(institutionCertificateUrl, "_blank")}
            >
              <FileBadge size={30} />
            </button>

            <SlidingTooltip text="View NCC Certificate" />
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
