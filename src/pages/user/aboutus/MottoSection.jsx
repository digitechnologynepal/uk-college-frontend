import React from "react";
import { TbTargetArrow } from "react-icons/tb";

const MottoSectionSkeleton = () => (
  <section className="w-full pb-24">
    {/* Title placeholder */}
    <div className="h-12 w-5/6 bg-gray-200 rounded mx-auto mb-5" />
    <div className="h-12 w-3/6 bg-gray-200 rounded mx-auto mb-10" />

    {/* Cards grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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

export const MottoSection = ({ mottoData }) => {
  if (!mottoData) return <MottoSectionSkeleton />;

  return (
    <section className="w-full pb-24">
      <div className="max-w-6xl mx-auto text-center">
        <p className="relative text-3xl sm:text-4xl font-bold lg:font-extrabold text-[#262a2b] mb-0 md:mb-3 lg:mb-5">
          {mottoData.motoTitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-center mb-5 space-x-3 lg:block lg:mx-auto">
              <div className="w-10 h-10 lg:w-16 lg:h-16 flex items-center justify-center rounded-full bg-[#204081]/10 lg:mx-auto">
                <TbTargetArrow className="text-[#204081] w-2/3 h-2/3" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-[#204081] mb-0 lg:mt-4 lg:mb-3">
                Our Mission
              </h3>
            </div>
            {mottoData?.mission?.text && (
              <p className="px-0 lg:px-5 text-gray-700 leading-relaxed text-justify text-md lg:text-lg">
                {mottoData.mission.text}
              </p>
            )}
          </div>

          {/* Vision */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-center mb-5 space-x-3 lg:block lg:mx-auto">
              <div className="w-10 h-10 lg:w-16 lg:h-16 flex items-center justify-center rounded-full bg-[#d91b1a]/10 lg:mx-auto">
                <TbTargetArrow className="text-[#d91b1a] w-2/3 h-2/3" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-[#d91b1a] mb-0 lg:mt-4 lg:mb-3">
                Our Vision
              </h3>
            </div>
            {mottoData?.vision?.text && (
              <p className="px-0 lg:px-5 text-gray-700 leading-relaxed text-justify text-md lg:text-lg">
                {mottoData.vision.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
