import { CheckCircle2 } from "lucide-react";
import React from "react";

export default function Benefits() {
  const benefits = [
    "Accreditation as a UK Recognized Education Center.",
    "Joint branding and promotional support.",
    "Access to teaching resources and academic support.",
    "Eligibility to deliver Diploma of Computing and Diploma of Business at Levels 4/5/6.",
    "Revenue-sharing opportunities and increased enrollment potential.",
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto w-full">
        <div className="p-8 md:p-12 lg:p-16 bg-[#204081] rounded-lg hover:shadow-xl duration-300 transition">
          <div className="flex md:flex-row flex-col gap-5 lg:gap-10">
            <h1 className="font-bold text-2xl md:text-4xl lg:text-5xl text-white leading-tight">
              Benefits of Becoming A Partner Center
            </h1>
            <div className="space-y-6">
              {benefits.map((item, idx) => (
                <div key={idx} className="flex text-white gap-3 items-center">
                  <div>
                    <CheckCircle2 size={20} />
                  </div>

                  <p className="text-sm md:text-base">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
