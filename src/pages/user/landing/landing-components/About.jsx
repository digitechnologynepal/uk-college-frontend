import { useEffect, useState } from "react";
import { getMottoApi } from "../../../../apis/api";
import { Group } from "./SoftEd";
import { TeamMembers } from "../TeamMembers";
import { TbTargetArrow } from "react-icons/tb";
import { FileText } from "lucide-react";

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
  const certificate = data?.certificate
    ? `${process.env.REACT_APP_API_URL}/uploads/${data.certificate}`
    : null;

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

  if (loading) return <SkeletonAboutSection />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="w-full flex flex-col items-center">
      {/* Main Content */}
      <div className="pt-32 pb-20 px-4 md:px-[6vw] xl:px-[8vw]">
        <div className="flex flex-col max-w-6xl mx-auto">
          <section className="pb-24">
            <div>
              <p className="mb-0 lg:mb-10 text-center text-[28px] sm:text-[32px] md:text-[40px] font-extrabold text-[#262a2b]">
                {data?.title}
              </p>
            </div>

            {/* Image + Text Grid */}
            <div className="flex flex-col lg:flex-row items-start">
              {/* Left - Description with background */}
              <div className="p-8 mr-0 lg:mr-10 rounded-xl lg:w-2/3 flex items-center">
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

          {/* Motto Section */}
          {!mottoData ? (
            <SkeletonMottoSection />
          ) : (
            <section className="w-full pb-24">
              <div className="max-w-6xl text-center">
                <p className="mb-10 text-center text-[28px] sm:text-[32px] md:text-[40px] font-extrabold text-[#262a2b]">
                  {mottoData.motoTitle}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Mission */}
                  <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                    <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-[#204081]/10">
                      <TbTargetArrow size={40} className="text-[#204081]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#204081] mb-3">
                      Our Mission
                    </h3>
                    {mottoData?.mission?.text && (
                      <p className="px-5 text-gray-700 leading-relaxed text-justify text-lg">
                        {mottoData.mission.text}
                      </p>
                    )}
                  </div>

                  {/* Vision */}
                  <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                    <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-[#d91b1a]/10">
                      <TbTargetArrow size={40} className="text-[#d91b1a]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#d91b1a] mb-3">
                      Our Vision
                    </h3>
                    {mottoData?.vision?.text && (
                      <p className="px-5 text-gray-700 leading-relaxed text-justify text-lg">
                        {mottoData.vision.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <Group />
          <TeamMembers teamMembers={team} />
        </div>
      </div>
      <button
        aria-label="Cerficate of Authorization"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-20 h-20 rounded-full bg-[#2d5ab4] hover:bg-[#3d69c3] text-white drop-shadow-xl transition-colors"
      >
        <FileText size={35} />
      </button>
    </section>
  );
};

export default About;
